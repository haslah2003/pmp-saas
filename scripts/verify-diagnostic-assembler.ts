import assert from 'node:assert/strict';
import {
  assembleDiagnosticForm, blueprintFor, inspectAssembly, UnsatisfiableBlueprintError,
  type AssemblyItem, type DiagnosticApproach, type DiagnosticDomain, type DifficultyBand,
} from '../lib/diagnostic/assembler';

const domains: DiagnosticDomain[] = ['people', 'process', 'business_environment'];
const approaches: DiagnosticApproach[] = ['predictive', 'agile', 'hybrid'];
const bands: DifficultyBand[] = ['below', 'average', 'above'];
const b = { below: -1, average: 0, above: 1 };
const bank: AssemblyItem[] = [];
let id = 0;
for (const domain of domains) for (const approach of approaches) for (const band of bands) {
  for (let copy = 0; copy < 12; copy += 1) {
    id += 1;
    bank.push({ id: `item-${id}`, trackId: 'pmbok8', domain, approach, difficultyB: b[band],
      ecoTaskCode: `${domain}-${copy % 20}`,
      cognitiveLevel: copy % 8 === 0 ? 'recall' : copy % 2 ? 'application' : 'analysis', exposureCount: copy });
  }
}

for (let simulation = 0; simulation < 1000; simulation += 1) {
  const length = simulation % 2 ? 32 : 60;
  const request = { trackId: 'pmbok8', length: length as 32 | 60, candidateId: `candidate-${simulation % 37}`, formSeed: `seed-${simulation}` };
  const first = assembleDiagnosticForm(bank, request);
  const second = assembleDiagnosticForm(bank, request);
  assert.deepEqual(first.map((item) => item.id), second.map((item) => item.id));
  assert.equal(new Set(first.map((item) => item.id)).size, length);
  const observed = inspectAssembly(first);
  const expected = blueprintFor(length as 32 | 60);
  assert.deepEqual(observed.domains, expected.domains);
  assert.deepEqual(observed.approaches, expected.approaches);
  assert.deepEqual(observed.difficulties, expected.difficulties);
  assert.ok(observed.recall <= expected.maxRecall);
  const taskCounts = new Map<string, number>();
  first.forEach((item) => taskCounts.set(item.ecoTaskCode!, (taskCounts.get(item.ecoTaskCode!) || 0) + 1));
  assert.ok(Math.max(...taskCounts.values()) <= expected.maxPerEcoTask);
}

const exactFit = assembleDiagnosticForm(bank, {
  trackId: 'pmbok8', length: 32, candidateId: 'exact-fit', formSeed: 'exact-fit',
});
const recentlySeenIds = new Set(exactFit.slice(0, 24).map((item) => item.id));
const retake = assembleDiagnosticForm(bank.map((item) => ({
  ...item,
  lastSeenAt: recentlySeenIds.has(item.id) ? new Date().toISOString() : null,
})), { trackId: 'pmbok8', length: 32, candidateId: 'retake', formSeed: 'retake' });
assert.equal(retake.length, 32);
assert.ok(retake.filter((item) => recentlySeenIds.has(item.id)).length < 24);

assert.throws(() => assembleDiagnosticForm(bank.slice(0, 31), {
  trackId: 'pmbok8', length: 32, candidateId: 'blocked', formSeed: 'blocked',
}), UnsatisfiableBlueprintError);

console.log('1,000 diagnostic assemblies satisfied all quotas, determinism, uniqueness, recall limits, and ECO-task caps.');
