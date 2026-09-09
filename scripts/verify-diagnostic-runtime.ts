import assert from 'node:assert/strict';
import { candidateItemPayload, clampItemSeconds, deterministicOptionOrder, type StoredDiagnosticItem } from '../lib/diagnostic/runtime';

const item = {
  id: 'item-1', trackId: 'pmbok8', domain: 'people', approach: 'hybrid', difficultyB: 0,
  cognitiveLevel: 'analysis', exposureCount: 0, stem: 'A safe candidate-facing scenario',
  options: [{ id: 'A', text: 'One' }, { id: 'B', text: 'Two' }, { id: 'C', text: 'Three' }, { id: 'D', text: 'Four' }],
  key: 'C', rationaleCorrect: 'secret', rationaleDistractors: { A: 'secret' },
} as StoredDiagnosticItem & Record<string, unknown>;
const order = deterministicOptionOrder(item.id, 'seed-1');
assert.deepEqual(order, deterministicOptionOrder(item.id, 'seed-1'));
assert.equal(new Set(order).size, 4);
const payload = candidateItemPayload(item, order);
assert.equal('key' in payload, false);
assert.equal('rationaleCorrect' in payload, false);
assert.deepEqual(payload.positionOptions.map((option) => option.id), order);
assert.equal(clampItemSeconds(-5), 0);
assert.equal(clampItemSeconds(99999), 7200);

const persisted = JSON.stringify({ currentPosition: 3, flaggedItemIds: ['item-1'], responses: [{ item_id: 'item-1', selected_option: 'C', seconds_on_item: 42 }] });
const resumed = JSON.parse(persisted);
assert.equal(resumed.currentPosition, 3);
assert.equal(resumed.responses[0].selected_option, 'C');
assert.equal(resumed.responses[0].seconds_on_item, 42);
console.log('Diagnostic runtime redaction, ordering, autosave-state, and resume reconstruction checks passed.');
