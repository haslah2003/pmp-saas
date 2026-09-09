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
  for (let copy = 0; copy < 30; copy += 1) {
    id += 1;
    bank.push({ id: `item-${id}`, trackId: 'pmbok8', domain, approach, difficultyB: b[band],
      cognitiveLevel: copy % 8 === 0 ? 'recall' : copy % 2 ? 'application' : 'analysis', exposureCount: copy });
  }
}

for (let simulation = 0; simulation < 1000; simulation += 1) {
  const length = simulation % 2 ? 25 : 60;
  const request = { trackId: 'pmbok8', length: length as 25 | 60, candidateId: `candidate-${simulation % 37}`, formSeed: `seed-${simulation}` };
  const first = assembleDiagnosticForm(bank, request);
  const second = assembleDiagnosticForm(bank, request);
  assert.deepEqual(first.map((item) => item.id), second.map((item) => item.id));
  assert.equal(new Set(first.map((item) => item.id)).size, length);
  const observed = inspectAssembly(first);
  const expected = blueprintFor(length as 25 | 60);
  assert.deepEqual(observed.domains, expected.domains);
  assert.deepEqual(observed.approaches, expected.approaches);
  assert.deepEqual(observed.difficulties, expected.difficulties);
  assert.ok(observed.recall <= expected.maxRecall);
}

const recentlySeen = new Date().toISOString();
assert.throws(() => assembleDiagnosticForm(bank.slice(0, 25).map((item) => ({ ...item, lastSeenAt: recentlySeen })), {
  trackId: 'pmbok8', length: 25, candidateId: 'blocked', formSeed: 'blocked',
}), UnsatisfiableBlueprintError);

console.log('1,000 diagnostic assemblies satisfied all quotas, determinism, uniqueness, and recall limits.');
