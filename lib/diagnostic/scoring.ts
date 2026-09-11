import type { DiagnosticDomain } from './assembler';

export type ReadinessBand = 'exam_ready' | 'near_ready' | 'developing' | 'early_stage';

export interface ScoringItem {
  id: string;
  domain: DiagnosticDomain;
  ecoTask: string;
  key: string;
  keys?: string[];
  difficultyB: number;
  discriminationA?: number | null;
}

export interface ScoringResponse {
  itemId: string;
  selectedOption: string;
  selectedOptions?: string[];
}

export interface ScoringResult {
  strategy: 'cold_start_classical' | 'irt_2pl';
  strategyVersion: string;
  theta: number;
  standardError: number;
  weightedScore: number;
  domainScores: Record<DiagnosticDomain, { correct: number; total: number; proportion: number; weighted: number }>;
  ecoTaskGaps: Array<{ ecoTask: string; mastery: number; itemCount: number }>;
  readinessBand: ReadinessBand;
  passProbability: number;
  correctByItem: Record<string, boolean>;
}

export interface ScoringStrategy {
  score(responses: ScoringResponse[], items: ScoringItem[]): ScoringResult;
}

// PMP Examination Content Outline effective July 2026: People 33%, Process 41%,
// Business Environment 26%.
const WEIGHTS: Record<DiagnosticDomain, number> = { people: 0.33, process: 0.41, business_environment: 0.26 };

export function readinessBandFor(weightedScore: number): ReadinessBand {
  if (weightedScore >= 0.8) return 'exam_ready';
  if (weightedScore >= 0.7) return 'near_ready';
  if (weightedScore >= 0.5) return 'developing';
  return 'early_stage';
}

function round(value: number, digits = 6) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export class ColdStartScoringStrategy implements ScoringStrategy {
  score(responses: ScoringResponse[], items: ScoringItem[]): ScoringResult {
    if (!items.length) throw new Error('Cannot score a diagnostic without items.');
    const responseMap = new Map(responses.map((response) => [response.itemId, response.selectedOptions?.length ? response.selectedOptions : [response.selectedOption].filter(Boolean)]));
    const correctByItem: Record<string, boolean> = {};
    const domainScores = {
      people: { correct: 0, total: 0, proportion: 0, weighted: 0 },
      process: { correct: 0, total: 0, proportion: 0, weighted: 0 },
      business_environment: { correct: 0, total: 0, proportion: 0, weighted: 0 },
    };
    const tasks = new Map<string, { correct: number; total: number }>();

    for (const item of items) {
      const selected = [...(responseMap.get(item.id) || [])].sort();
      const keys = [...(item.keys?.length ? item.keys : [item.key])].sort();
      const correct = selected.length === keys.length && selected.every((value, index) => value === keys[index]);
      correctByItem[item.id] = correct;
      const domain = domainScores[item.domain];
      domain.total += 1;
      if (correct) domain.correct += 1;
      const task = tasks.get(item.ecoTask) || { correct: 0, total: 0 };
      task.total += 1;
      if (correct) task.correct += 1;
      tasks.set(item.ecoTask, task);
    }

    let weightedScore = 0;
    let variance = 0;
    for (const domainName of Object.keys(domainScores) as DiagnosticDomain[]) {
      const domain = domainScores[domainName];
      if (!domain.total) throw new Error(`Cannot score: domain ${domainName} has no items.`);
      domain.proportion = domain.correct / domain.total;
      domain.weighted = domain.proportion * WEIGHTS[domainName];
      weightedScore += domain.weighted;
      variance += (WEIGHTS[domainName] ** 2 * domain.proportion * (1 - domain.proportion)) / domain.total;
    }

    const bounded = Math.min(0.99, Math.max(0.01, weightedScore));
    const theta = Math.log(bounded / (1 - bounded));
    const standardError = Math.sqrt(variance);
    const passProbability = 1 / (1 + Math.exp(-8 * (weightedScore - 0.75)));
    const ecoTaskGaps = [...tasks.entries()].map(([ecoTask, task]) => ({ ecoTask, mastery: task.correct / task.total, itemCount: task.total }))
      .sort((a, b) => a.mastery - b.mastery || b.itemCount - a.itemCount || a.ecoTask.localeCompare(b.ecoTask));

    for (const domain of Object.values(domainScores)) {
      domain.proportion = round(domain.proportion);
      domain.weighted = round(domain.weighted);
    }
    return {
      strategy: 'cold_start_classical', strategyVersion: 'cold-start-v2-eco2026',
      theta: round(theta), standardError: round(standardError), weightedScore: round(weightedScore),
      domainScores, ecoTaskGaps: ecoTaskGaps.map((gap) => ({ ...gap, mastery: round(gap.mastery) })),
      readinessBand: readinessBandFor(weightedScore), passProbability: round(passProbability), correctByItem,
    };
  }
}
