import assert from 'node:assert/strict';
import { ColdStartScoringStrategy, readinessBandFor, type ScoringItem, type ScoringResponse } from '../lib/diagnostic/scoring';

const items: ScoringItem[] = [];
const responses: ScoringResponse[] = [];
function add(domain: ScoringItem['domain'], count: number, correctCount: number, task: string) {
  for (let index = 0; index < count; index += 1) {
    const id = `${domain}-${index}`;
    items.push({ id, domain, ecoTask: `${task}-${index % 2}`, key: 'A', difficultyB: 0 });
    responses.push({ itemId: id, selectedOption: index < correctCount ? 'A' : 'B' });
  }
}
add('people', 10, 8, 'People');
add('process', 13, 10, 'Process');
add('business_environment', 2, 1, 'Business');

const result = new ColdStartScoringStrategy().score(responses, items);
assert.equal(result.weightedScore, 0.709385);
assert.equal(result.readinessBand, 'near_ready');
assert.deepEqual(result.domainScores.people, { correct: 8, total: 10, proportion: 0.8, weighted: 0.264 });
assert.deepEqual(result.domainScores.process, { correct: 10, total: 13, proportion: 0.769231, weighted: 0.315385 });
assert.deepEqual(result.domainScores.business_environment, { correct: 1, total: 2, proportion: 0.5, weighted: 0.13 });
assert.equal(result.ecoTaskGaps[0].mastery <= result.ecoTaskGaps.at(-1)!.mastery, true);
assert.equal(readinessBandFor(0.8), 'exam_ready');
assert.equal(readinessBandFor(0.7), 'near_ready');
assert.equal(readinessBandFor(0.5), 'developing');
assert.equal(readinessBandFor(0.499999), 'early_stage');
const multiItems: ScoringItem[] = [
  { id: 'multi', domain: 'people', ecoTask: 'PPL-1', key: 'A', keys: ['A', 'C'], difficultyB: 0 },
  { id: 'process', domain: 'process', ecoTask: 'PRC-1', key: 'B', difficultyB: 0 },
  { id: 'business', domain: 'business_environment', ecoTask: 'BEN-1', key: 'D', difficultyB: 0 },
];
const exactSet = new ColdStartScoringStrategy().score([
  { itemId: 'multi', selectedOption: '', selectedOptions: ['C', 'A'] },
  { itemId: 'process', selectedOption: 'B' },
  { itemId: 'business', selectedOption: 'D' },
], multiItems);
assert.equal(exactSet.correctByItem.multi, true);
const partialSet = new ColdStartScoringStrategy().score([
  { itemId: 'multi', selectedOption: '', selectedOptions: ['A'] },
  { itemId: 'process', selectedOption: 'B' },
  { itemId: 'business', selectedOption: 'D' },
], multiItems);
assert.equal(partialSet.correctByItem.multi, false);
assert.throws(() => new ColdStartScoringStrategy().score([], items.filter((item) => item.domain === 'people')), /has no items/);
console.log('Cold-start scoring matches the hand-computed weighted reference case and band boundaries.');
