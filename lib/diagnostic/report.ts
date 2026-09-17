import type { DiagnosticApproach, DiagnosticDomain } from './assembler';
import type { ReadinessBand } from './scoring';

export interface ReportResponse {
  itemId: string; selectedOption: string; selectedOptions?: string[]; correct: boolean; seconds: number;
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
const bandCopyAr: Record<ReadinessBand, { label: string; interpretation: string }> = {
  exam_ready: { label: 'جاهز للاختبار', interpretation: 'حافظ أداؤك على مستوى قوي عبر محاور التشخيص. واصل المراجعة الموجهة، وتحقق من ثبات هذا المستوى في نماذج إضافية محددة الوقت قبل حجز الاختبار.' },
  near_ready: { label: 'قريب من الجاهزية', interpretation: 'يقترب أداؤك العام من نطاق الجاهزية الاسترشادي، مع وجود فجوات محددة تتطلب دراسة مركزة ثم إعادة التشخيص في ظروف زمنية مماثلة.' },
  developing: { label: 'قيد التطوير', interpretation: 'بدأت نقاط قوة مهمة في الظهور، لكن لا تزال هناك فجوات جوهرية في المحاور المقاسة. نوصي بخطة إعداد منظمة قبل الاعتماد على محاكاة الاختبار.' },
  early_stage: { label: 'مرحلة تأسيسية', interpretation: 'يشير نمط إجاباتك إلى فجوات في الأساسيات. ابنِ الفهم الأساسي بصورة منهجية قبل الانتقال إلى التدريب المكثف على الاختبار.' },
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

export function buildIndividualReport(score: StoredScore, responses: ReportResponse[], items: ReportItem[], locale: 'en' | 'ar' = 'en') {
  const ar = locale === 'ar';
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const localizedDomainLabels: Record<DiagnosticDomain, string> = ar ? { people: 'الأفراد', process: 'العمليات', business_environment: 'بيئة الأعمال' } : domainLabels;
  const localizedApproachLabels: Record<DiagnosticApproach, string> = ar ? { predictive: 'التنبؤي', agile: 'الرشيق', hybrid: 'الهجين' } : approachLabels;
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const sortedTimes = responses.map((response) => response.seconds).sort((a, b) => a - b);
  const medianSeconds = sortedTimes.length ? sortedTimes[Math.floor(sortedTimes.length / 2)] : 0;
  const review = responses.map((response) => {
    const item = itemMap.get(response.itemId);
    return item ? {
      itemId: item.id, stem: item.stem, ecoTask: item.ecoTask, domain: item.domain,
      approach: item.approach, cognitiveLevel: item.cognitiveLevel, decisionType: decisionType(item.stem), correct: response.correct,
      selectedOption: response.selectedOption, selectedOptions: response.selectedOptions || [response.selectedOption].filter(Boolean), seconds: response.seconds,
      misconception: response.correct ? null : (response.selectedOptions || [response.selectedOption]).map((option) => item.rationaleDistractors[option]).filter(Boolean).join(' ') || t('Review the reasoning used for this scenario.', 'راجع أسلوب الاستدلال الذي استخدمته في هذا الموقف.'),
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
    localizedApproachLabels,
  );
  const cognitive = profile(
    ['recall', 'application', 'analysis'] as const,
    review.map((entry) => ({ key: entry.cognitiveLevel, correct: entry.correct })),
    ar ? { recall: 'التذكر', application: 'التطبيق', analysis: 'التحليل' } : { recall: 'Recall', application: 'Application', analysis: 'Analysis' },
  );
  const decisions = profile(
    ['first', 'next', 'best'] as const,
    review.filter((entry) => entry.decisionType !== 'other').map((entry) => ({ key: entry.decisionType as 'first' | 'next' | 'best', correct: entry.correct })),
    ar ? { first: 'الإجراء الأول', next: 'الإجراء التالي', best: 'الإجراء الأنسب' } : { first: 'First action', next: 'Next action', best: 'Best action' },
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
  const uncertaintyLabel = score.standardError <= 0.07 ? t('Higher confidence', 'ثقة أعلى') : score.standardError <= 0.11 ? t('Moderate confidence', 'ثقة متوسطة') : t('Limited confidence', 'ثقة محدودة');
  const priorityMatrix = weakestTasks.map((gap, index) => ({
    rank: index + 1, objective: gap.ecoTask, observedMastery: gap.mastery, evidence: evidenceFor(gap.itemCount),
    impact: gap.itemCount >= 2 ? t('High', 'مرتفع') : t('Confirm', 'يحتاج إلى تأكيد'),
    action: ar ? `أكمل تعلماً موجهاً وتدريباً موقفياً للهدف ${gap.ecoTask}، ثم أعد قياس مستوى الإتقان.` : `Complete targeted instruction and scenario practice for ${gap.ecoTask}, then reassess.`,
  }));
  const strengthCandidates = [
    ...approaches.map((entry) => ({ ...entry, category: t('Delivery approach', 'منهج التسليم') })),
    ...cognitive.map((entry) => ({ ...entry, category: t('Cognitive skill', 'المهارة المعرفية') })),
    ...decisions.map((entry) => ({ ...entry, category: t('Decision skill', 'مهارة اتخاذ القرار') })),
  ].filter((entry) => entry.proportion !== null && entry.total >= 4)
    .sort((a, b) => (b.proportion || 0) - (a.proportion || 0));
  const strengths = strengthCandidates.slice(0, 3).map((entry) => ({
    label: entry.label,
    category: entry.category,
    proportion: entry.proportion as number,
    evidence: entry.evidence,
    interpretation: ar ? `كان «${entry.label}» من أقوى القدرات التي ظهرت في هذه المحاولة.` : `${entry.label} was one of your strongest observed capabilities in this attempt.`,
  }));
  const report = {
    band: { ...(ar ? bandCopyAr : bandCopy)[score.readinessBand], code: score.readinessBand },
    weightedScore: score.weightedScore,
    scoreExplanation: t('Based on your performance across the tested PMP domains and decision-making scenarios.', 'يستند هذا التقدير إلى أدائك في محاور PMP والمواقف المتعلقة باتخاذ القرار التي شملها التشخيص.'),
    uncertainty: score.standardError,
    domains: (Object.entries(score.domainScores) as Array<[DiagnosticDomain, StoredScore['domainScores'][DiagnosticDomain]]>).map(([domain, value]) => ({ domain, label: localizedDomainLabels[domain], ...value })),
    preparationTarget: PREPARATION_TARGET,
    targetNote: t('PMPeco preparation guideline - not a PMI passing score.', 'مؤشر استرشادي للإعداد من PMPeco، وليس درجة نجاح صادرة عن PMI.'),
    progress: { attempt: 1, previousScore: null as number | null, delta: null as number | null, label: t('Baseline attempt', 'المحاولة المرجعية الأولى') },
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
    studySequence: weakDomains.map(([domain]) => ({ domain, label: localizedDomainLabels[domain], recommendation: ar ? `ابدأ بدروس «${localizedDomainLabels[domain]}» في PMPeco، ثم أكمل التدريب على المواقف وأعد قياس الإتقان.` : `Begin with PMPeco ${domainLabels[domain]} lessons, then complete scenario practice and re-check mastery.` })),
    timing: { medianSeconds, rushed: responses.filter((response) => response.seconds < 45).length, laboured: responses.filter((response) => response.seconds > 135).length, targetSeconds: 90 },
    metricDefinitions: {
      overallReadiness: t('A broad indication of readiness across the PMP capabilities sampled in this diagnostic.', 'مؤشر عام للجاهزية عبر قدرات PMP التي أخذ هذا التشخيص عينة منها.'),
      situationalJudgment: t('How consistently you selected sound actions in scenario-based questions.', 'مدى اتساق اختيارك للإجراءات السليمة في الأسئلة المبنية على مواقف.'),
      decisionEfficiency: t('Accuracy on responses completed within a sustainable working-time range.', 'دقة الإجابات التي أنجزتها ضمن نطاق زمني عملي ومستدام.'),
      measurementConfidence: t('How much evidence supports this report; it is not another readiness score.', 'مقدار الأدلة التي يستند إليها التقرير؛ وهذا ليس مقياس جاهزية إضافياً.'),
      deliveryApproach: t('Balance of observed performance across predictive, agile, and hybrid delivery contexts.', 'توازن الأداء الملحوظ عبر سياقات التسليم التنبؤية والرشيقة والهجينة.'),
      cognitiveDepth: t('Performance from factual recall through practical application and analysis.', 'الأداء من استدعاء المعرفة إلى التطبيق العملي والتحليل.'),
      decisionPriority: t('Accuracy when choosing what a project manager should do first, next, or best.', 'دقة تحديد ما ينبغي لمدير المشروع فعله أولاً أو تالياً أو بوصفه الإجراء الأنسب.'),
    },
    pacingNote: t('The 90-second reference is a preparation pacing guide derived from managing the official exam time across all questions; it is not a PMI performance threshold.', 'مرجع التسعين ثانية دليل استرشادي لإدارة وقت الإعداد، مشتق من توزيع وقت الاختبار الرسمي على الأسئلة؛ وليس حداً للأداء معتمداً من PMI.'),
    review,
    disclaimer: t('This is an independent preparation instrument, not affiliated with or endorsed by PMI, and it does not predict official examination results. PMI does not publish a numeric passing score.', 'هذه أداة إعداد مستقلة، ولا تتبع معهد إدارة المشاريع PMI ولا تحظى بتأييده، ولا تتنبأ بنتيجة الاختبار الرسمي. ولا ينشر PMI درجة نجاح رقمية.'),
    basis: t('This readiness estimate reflects your performance in this diagnostic and becomes more informative as you complete additional assessed practice.', 'يعكس تقدير الجاهزية أداءك في هذا التشخيص، وتزداد دلالته كلما أكملت تدريبات إضافية خاضعة للتقييم.'),
  };
  assertReportHasNoPlaceholders(report);
  return report;
}
