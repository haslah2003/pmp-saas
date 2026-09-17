export type DiagnosticDomain = 'people' | 'process' | 'business_environment';
export type DiagnosticApproach = 'predictive' | 'agile' | 'hybrid';
export type DifficultyBand = 'below' | 'average' | 'above';
export type DiagnosticFormLength = 32 | 60;

export interface AssemblyItem {
  id: string;
  trackId: string;
  domain: DiagnosticDomain;
  approach: DiagnosticApproach;
  difficultyB: number;
  cognitiveLevel: 'recall' | 'application' | 'analysis';
  ecoTaskCode?: string | null;
  exposureCount: number;
  lastSeenAt?: string | null;
}

export interface AssemblyRequest {
  trackId: string;
  length: DiagnosticFormLength;
  candidateId: string;
  formSeed: string;
  now?: Date;
}

export interface BlueprintQuotas {
  domains: Record<DiagnosticDomain, number>;
  approaches: Record<DiagnosticApproach, number>;
  difficulties: Record<DifficultyBand, number>;
  maxRecall: number;
  maxPerEcoTask: number;
}

export class UnsatisfiableBlueprintError extends Error {
  constructor(public readonly diagnostics: Record<string, unknown>) {
    super(`Diagnostic blueprint is unsatisfiable: ${JSON.stringify(diagnostics)}`);
    this.name = 'UnsatisfiableBlueprintError';
  }
}

export function blueprintFor(length: DiagnosticFormLength): BlueprintQuotas {
  return length === 32
    ? {
        domains: { people: 11, process: 13, business_environment: 8 },
        approaches: { predictive: 13, agile: 10, hybrid: 9 },
        difficulties: { below: 8, average: 16, above: 8 },
        maxRecall: 0,
        maxPerEcoTask: 2,
      }
    : {
        domains: { people: 20, process: 25, business_environment: 15 },
        approaches: { predictive: 24, agile: 18, hybrid: 18 },
        difficulties: { below: 15, average: 30, above: 15 },
        maxRecall: 0,
        maxPerEcoTask: 3,
      };
}

export function difficultyBand(value: number): DifficultyBand {
  if (value < -0.5) return 'below';
  if (value > 0.5) return 'above';
  return 'average';
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function withinExposureWindow(lastSeenAt: string | null | undefined, now: Date) {
  if (!lastSeenAt) return false;
  const seen = new Date(lastSeenAt);
  return Number.isFinite(seen.getTime()) && now.getTime() - seen.getTime() < 90 * 24 * 60 * 60 * 1000;
}

function emptyCounts<T extends string>(keys: readonly T[]): Record<T, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

const DOMAINS: DiagnosticDomain[] = ['people', 'process', 'business_environment'];
const APPROACHES: DiagnosticApproach[] = ['predictive', 'agile', 'hybrid'];
const DIFFICULTIES: DifficultyBand[] = ['below', 'average', 'above'];

export function inspectAssembly(items: AssemblyItem[]) {
  const domains = emptyCounts(DOMAINS);
  const approaches = emptyCounts(APPROACHES);
  const difficulties = emptyCounts(DIFFICULTIES);
  let recall = 0;
  for (const item of items) {
    domains[item.domain] += 1;
    approaches[item.approach] += 1;
    difficulties[difficultyBand(item.difficultyB)] += 1;
    if (item.cognitiveLevel === 'recall') recall += 1;
  }
  return { domains, approaches, difficulties, recall };
}

function availability(items: AssemblyItem[]) {
  const cells: Record<string, number> = {};
  for (const item of items) {
    const key = `${item.domain}/${item.approach}/${difficultyBand(item.difficultyB)}`;
    cells[key] = (cells[key] || 0) + 1;
  }
  return cells;
}

export function assembleDiagnosticForm(allItems: AssemblyItem[], request: AssemblyRequest): AssemblyItem[] {
  const quotas = blueprintFor(request.length);
  const now = request.now || new Date();
  const eligible = allItems.filter((item) => item.trackId === request.trackId);
  if (eligible.length < request.length) {
    throw new UnsatisfiableBlueprintError({ required: request.length, available: eligible.length, cells: availability(eligible) });
  }

  for (let attempt = 0; attempt < 128; attempt += 1) {
    const selected: AssemblyItem[] = [];
    const remainingDomains = { ...quotas.domains };
    const remainingApproaches = { ...quotas.approaches };
    const remainingDifficulties = { ...quotas.difficulties };
    let recall = 0;
    const ecoTaskCounts = new Map<string, number>();
    const pool = [...eligible].sort((a, b) =>
      Number(withinExposureWindow(a.lastSeenAt, now)) - Number(withinExposureWindow(b.lastSeenAt, now)) ||
      a.exposureCount - b.exposureCount ||
      hash(`${request.candidateId}:${request.formSeed}:${attempt}:${a.id}`) - hash(`${request.candidateId}:${request.formSeed}:${attempt}:${b.id}`)
    );

    while (selected.length < request.length) {
      const candidates = pool.filter((item) =>
        !selected.includes(item) &&
        remainingDomains[item.domain] > 0 &&
        remainingApproaches[item.approach] > 0 &&
        remainingDifficulties[difficultyBand(item.difficultyB)] > 0 &&
        (!item.ecoTaskCode || (ecoTaskCounts.get(item.ecoTaskCode) || 0) < quotas.maxPerEcoTask) &&
        (item.cognitiveLevel !== 'recall' || recall < quotas.maxRecall)
      );
      if (!candidates.length) break;

      const domainSupply = emptyCounts(DOMAINS);
      const approachSupply = emptyCounts(APPROACHES);
      const difficultySupply = emptyCounts(DIFFICULTIES);
      for (const candidate of candidates) {
        domainSupply[candidate.domain] += 1;
        approachSupply[candidate.approach] += 1;
        difficultySupply[difficultyBand(candidate.difficultyB)] += 1;
      }
      const scored = candidates.map((item) => {
        const band = difficultyBand(item.difficultyB);
        const scarcity = domainSupply[item.domain] / remainingDomains[item.domain]
          + approachSupply[item.approach] / remainingApproaches[item.approach]
          + difficultySupply[band] / remainingDifficulties[band];
        return { item, scarcity, recentlySeen: withinExposureWindow(item.lastSeenAt, now), tie: hash(`${request.formSeed}:${attempt}:${selected.length}:${item.id}`) };
      }).sort((a, b) => Number(a.recentlySeen) - Number(b.recentlySeen) || a.scarcity - b.scarcity || a.item.exposureCount - b.item.exposureCount || a.tie - b.tie);

      const choiceWindow = Math.min(4, scored.length);
      const choice = scored[hash(`${request.candidateId}:${request.formSeed}:${attempt}:${selected.length}`) % choiceWindow].item;
      selected.push(choice);
      remainingDomains[choice.domain] -= 1;
      remainingApproaches[choice.approach] -= 1;
      remainingDifficulties[difficultyBand(choice.difficultyB)] -= 1;
      if (choice.cognitiveLevel === 'recall') recall += 1;
      if (choice.ecoTaskCode) ecoTaskCounts.set(choice.ecoTaskCode, (ecoTaskCounts.get(choice.ecoTaskCode) || 0) + 1);
    }

    if (selected.length === request.length) return selected;
  }

  throw new UnsatisfiableBlueprintError({
    required: request.length,
    eligible: eligible.length,
    quotas,
    cells: availability(eligible),
    message: 'No allocation satisfied domain, approach, difficulty, ECO-task diversity, exposure, and recall constraints after 128 deterministic attempts.',
  });
}
