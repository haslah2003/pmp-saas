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
assert.equal(result.weightedScore, 0.760615);
assert.equal(result.readinessBand, 'near_ready');
assert.deepEqual(result.domainScores.people, { correct: 8, total: 10, proportion: 0.8, weighted: 0.336 });
assert.deepEqual(result.domainScores.process, { correct: 10, total: 13, proportion: 0.769231, weighted: 0.384615 });
assert.deepEqual(result.domainScores.business_environment, { correct: 1, total: 2, proportion: 0.5, weighted: 0.04 });
assert.equal(result.ecoTaskGaps[0].mastery <= result.ecoTaskGaps.at(-1)!.mastery, true);
assert.equal(readinessBandFor(0.8), 'exam_ready');
assert.equal(readinessBandFor(0.7), 'near_ready');
assert.equal(readinessBandFor(0.5), 'developing');
assert.equal(readinessBandFor(0.499999), 'early_stage');
assert.throws(() => new ColdStartScoringStrategy().score([], items.filter((item) => item.domain === 'people')), /has no items/);
console.log('Cold-start scoring matches the hand-computed weighted reference case and band boundaries.');
