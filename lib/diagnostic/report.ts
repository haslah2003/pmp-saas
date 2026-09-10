import type { DiagnosticApproach, DiagnosticDomain } from './assembler';
import type { ReadinessBand } from './scoring';

export interface ReportResponse {
  itemId: string; selectedOption: string; correct: boolean; seconds: number;
}
export interface ReportItem {
  id: string; stem: string; domain: DiagnosticDomain; ecoTask: string;
  approach: DiagnosticApproach; cognitiveLevel: 'recall' | 'application' | 'analysis';
  rationaleDistractors: Record<string, string>;
}
export interface StoredScore {
  readinessBand: ReadinessBand;
  weightedScore: number;
  standardError: number;
  domainScores: Record<DiagnosticDomain, { correct: number; total: number; proportion: number; weighted: number }>;
  ecoTaskGaps: Array<{ ecoTask: string; mastery: number; itemCount: number }>;
}

const bandCopy: Record<ReadinessBand, { label: string; interpretation: string }> = {
  exam_ready: { label: 'Exam Ready', interpretation: 'Your performance was sustained across the diagnostic blueprint. Continue targeted review and validate this level on additional timed forms before scheduling.' },
  near_ready: { label: 'Near Ready', interpretation: 'Your overall performance is close to the provisional readiness range, with specific gaps that should be addressed through focused study and another timed diagnostic.' },
  developing: { label: 'Developing', interpretation: 'Important strengths are emerging, but substantial gaps remain across the assessed domains. Structured preparation is recommended before relying on exam simulation.' },
  early_stage: { label: 'Early Stage', interpretation: 'The response pattern indicates foundational gaps. Build core understanding systematically before moving to intensive exam practice.' },
};
const domainLabels: Record<DiagnosticDomain, string> = { people: 'People', process: 'Process', business_environment: 'Business Environment' };
const approachLabels: Record<DiagnosticApproach, string> = { predictive: 'Predictive', agile: 'Agile', hybrid: 'Hybrid' };

type EvidenceStrength = 'measured' | 'indicative' | 'not_assessed';
const PREPARATION_TARGET = 0.75;

function evidenceFor(itemCount: number): EvidenceStrength {
  if (itemCount >= 5) return 'measured';
  if (itemCount > 0) return 'indicative';
  return 'not_assessed';
}

function profile<T extends string>(keys: readonly T[], rows: Array<{ key: T; correct: boolean }>, labels: Record<T, string>) {
  return keys.map((key) => {
    const matching = rows.filter((row) => row.key === key);
    const correct = matching.filter((row) => row.correct).length;
    return { key, label: labels[key], correct, total: matching.length, proportion: matching.length ? correct / matching.length : null, evidence: evidenceFor(matching.length) };
  });
}

function decisionType(stem: string): 'first' | 'next' | 'best' | 'other' {
  const normalized = stem.toLowerCase();
  if (/\bfirst\b|أول|أولا|أولاً/.test(normalized)) return 'first';
  if (/\bnext\b|التالي|بعد ذلك/.test(normalized)) return 'next';
  if (/\bbest\b|الأفضل|أفضل|الأنسب|أنسب/.test(normalized)) return 'best';
  return 'other';
}

function spread(values: Array<number | null>) {
  const assessed = values.filter((value): value is number => value !== null);
  return assessed.length > 1 ? Math.max(...assessed) - Math.min(...assessed) : null;
}

const PLACEHOLDER_PATTERN = /\b(lorem|ipsum|todo|placeholder)\b/i;
export function assertReportHasNoPlaceholders(value: unknown) {
  const serialized = JSON.stringify(value);
  if (PLACEHOLDER_PATTERN.test(serialized)) throw new Error('Report contains unpublished placeholder content.');
}

export function buildIndividualReport(score: StoredScore, responses: ReportResponse[], items: ReportItem[]) {
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const sortedTimes = responses.map((response) => response.seconds).sort((a, b) => a - b);
  const medianSeconds = sortedTimes.length ? sortedTimes[Math.floor(sortedTimes.length / 2)] : 0;
  const review = responses.map((response) => {
    const item = itemMap.get(response.itemId);
    return item ? {
      itemId: item.id, stem: item.stem, ecoTask: item.ecoTask, domain: item.domain,
      approach: item.approach, cognitiveLevel: item.cognitiveLevel, decisionType: decisionType(item.stem), correct: response.correct,
      selectedOption: response.selectedOption, seconds: response.seconds,
      misconception: response.correct ? null : item.rationaleDistractors[response.selectedOption] || 'Review the reasoning used for this scenario.',
    } : null;
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  const weakestTasks = score.ecoTaskGaps.slice(0, 3).map((gap) => ({
    ...gap,
    misconceptions: review.filter((entry) => !entry.correct && entry.ecoTask === gap.ecoTask).map((entry) => entry.misconception).filter(Boolean).slice(0, 2),
  }));
  const weakDomains = (Object.entries(score.domainScores) as Array<[DiagnosticDomain, StoredScore['domainScores'][DiagnosticDomain]]>)
    .sort((a, b) => a[1].proportion - b[1].proportion);
  const approaches = profile(
    ['predictive', 'agile', 'hybrid'] as const,
    review.map((entry) => ({ key: entry.approach, correct: entry.correct })),
    approachLabels,
  );
  const cognitive = profile(
    ['recall', 'application', 'analysis'] as const,
    review.map((entry) => ({ key: entry.cognitiveLevel, correct: entry.correct })),
    { recall: 'Recall', application: 'Application', analysis: 'Analysis' },
  );
  const decisions = profile(
    ['first', 'next', 'best'] as const,
    review.filter((entry) => entry.decisionType !== 'other').map((entry) => ({ key: entry.decisionType as 'first' | 'next' | 'best', correct: entry.correct })),
    { first: 'First action', next: 'Next action', best: 'Best action' },
  );
  const approachGap = spread(approaches.map((entry) => entry.proportion));
  const recall = cognitive.find((entry) => entry.key === 'recall')?.proportion ?? null;
  const applied = cognitive.filter((entry) => entry.key !== 'recall' && entry.proportion !== null);
  const appliedProportion = applied.length ? applied.reduce((sum, entry) => sum + (entry.proportion || 0) * entry.total, 0) / applied.reduce((sum, entry) => sum + entry.total, 0) : null;
  const knowledgeApplicationGap = recall === null || appliedProportion === null ? null : appliedProportion - recall;
  const rushedResponses = review.filter((entry) => entry.seconds < 45);
  const labouredResponses = review.filter((entry) => entry.seconds > 135);
  const accuracy = (entries: typeof review) => entries.length ? entries.filter((entry) => entry.correct).length / entries.length : null;
  const evidence = evidenceFor(review.length);
  const uncertaintyLabel = score.standardError <= 0.07 ? 'Higher confidence' : score.standardError <= 0.11 ? 'Moderate confidence' : 'Limited confidence';
  const priorityMatrix = weakestTasks.map((gap, index) => ({
    rank: index + 1, objective: gap.ecoTask, observedMastery: gap.mastery, evidence: evidenceFor(gap.itemCount),
    impact: gap.itemCount >= 2 ? 'High' : 'Confirm',
    action: `Complete targeted instruction and scenario practice for ${gap.ecoTask}, then reassess.`,
  }));
  const strengthCandidates = [
    ...approaches.map((entry) => ({ ...entry, category: 'Delivery approach' })),
    ...cognitive.map((entry) => ({ ...entry, category: 'Cognitive skill' })),
    ...decisions.map((entry) => ({ ...entry, category: 'Decision skill' })),
  ].filter((entry) => entry.proportion !== null && entry.total >= 4)
    .sort((a, b) => (b.proportion || 0) - (a.proportion || 0));
  const strengths = strengthCandidates.slice(0, 3).map((entry) => ({
    label: entry.label,
    category: entry.category,
    proportion: entry.proportion as number,
    evidence: entry.evidence,
    interpretation: `${entry.label} was one of your strongest observed capabilities in this attempt.`,
  }));
  const report = {
    band: { ...bandCopy[score.readinessBand], code: score.readinessBand },
    weightedScore: score.weightedScore,
    scoreExplanation: 'Based on your performance across the tested PMP domains and decision-making scenarios.',
    uncertainty: score.standardError,
    domains: (Object.entries(score.domainScores) as Array<[DiagnosticDomain, StoredScore['domainScores'][DiagnosticDomain]]>).map(([domain, value]) => ({ domain, label: domainLabels[domain], ...value })),
    preparationTarget: PREPARATION_TARGET,
    targetNote: 'PMPeco preparation guideline - not a PMI passing score.',
    progress: { attempt: 1, previousScore: null as number | null, delta: null as number | null, label: 'Baseline attempt' },
    strengths,
    weakestTasks,
    kpis: {
      overallReadiness: score.weightedScore,
      situationalJudgment: accuracy(review.filter((entry) => entry.cognitiveLevel !== 'recall')),
      approachAdaptabilityGap: approachGap,
      knowledgeApplicationGap,
      decisionEfficiency: accuracy(review.filter((entry) => entry.seconds >= 45 && entry.seconds <= 135)),
      evidence,
      uncertaintyLabel,
    },
    approachProfile: approaches,
    cognitiveProfile: cognitive,
    decisionProfile: decisions,
    timingQuality: {
      rushedAccuracy: accuracy(rushedResponses), labouredAccuracy: accuracy(labouredResponses),
      sustainableAccuracy: accuracy(review.filter((entry) => entry.seconds >= 45 && entry.seconds <= 135)),
    },
    priorityMatrix,
    coverage: {
      assessedItems: review.length,
      ecoTasks: new Set(review.map((entry) => entry.ecoTask)).size,
      domains: evidenceFor(Math.min(...Object.values(score.domainScores).map((domain) => domain.total))),
      approaches: evidenceFor(Math.min(...approaches.map((entry) => entry.total))),
      cognitiveDepth: evidenceFor(Math.min(...cognitive.map((entry) => entry.total))),
      pmbok8Principles: 'not_assessed' as const,
      pmbok8PerformanceDomains: 'not_assessed' as const,
    },
    studySequence: weakDomains.map(([domain]) => ({ domain, label: domainLabels[domain], recommendation: `Begin with PMPeco ${domainLabels[domain]} lessons, then complete scenario practice and re-check mastery.` })),
    timing: { medianSeconds, rushed: responses.filter((response) => response.seconds < 45).length, laboured: responses.filter((response) => response.seconds > 135).length, targetSeconds: 90 },
    metricDefinitions: {
      overallReadiness: 'A broad indication of readiness across the PMP capabilities sampled in this diagnostic.',
      situationalJudgment: 'How consistently you selected sound actions in scenario-based questions.',
      decisionEfficiency: 'Accuracy on responses completed within a sustainable working-time range.',
      measurementConfidence: 'How much evidence supports this report; it is not another readiness score.',
      deliveryApproach: 'Balance of observed performance across predictive, agile, and hybrid delivery contexts.',
      cognitiveDepth: 'Performance from factual recall through practical application and analysis.',
      decisionPriority: 'Accuracy when choosing what a project manager should do first, next, or best.',
    },
    pacingNote: 'The 90-second reference is a preparation pacing guide derived from managing the official exam time across all questions; it is not a PMI performance threshold.',
    review,
    disclaimer: 'This is an independent preparation instrument, not affiliated with or endorsed by PMI, and it does not predict official examination results. PMI does not publish a numeric passing score.',
    basis: 'This readiness estimate reflects your performance in this diagnostic and becomes more informative as you complete additional assessed practice.',
  };
  assertReportHasNoPlaceholders(report);
  return report;
}
