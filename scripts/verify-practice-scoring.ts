import assert from 'node:assert/strict';
import { publicPracticeQuestion, scorePracticeResponse } from '../lib/practice/scoring';

const base = {
  id: 'q1', framework: 'pmbok8', domain: 'people', subdomain: 'team', difficulty: 'paced',
  question_text: 'Scenario', option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
  correct_answer: 'B', explanation: 'Secret rationale', rita_tip: 'Secret tip', pmbok_reference: 'Secret ref',
};

assert.equal(scorePracticeResponse(base, 'B'), true);
assert.equal(scorePracticeResponse(base, 'A'), false);
assert.equal(scorePracticeResponse({ ...base, question_type: 'multiple_response', answer_data: { correct: ['A', 'C'] } }, ['C', 'A']), true);
assert.equal(scorePracticeResponse({ ...base, question_type: 'pull_down', answer_data: { blanks: [{ id: 'b1', correct: 'x' }] } }, { b1: 'x' }), true);
assert.equal(scorePracticeResponse({ ...base, question_type: 'matching', answer_data: { correct: { i1: 'c1', i2: 'c2' } } }, { i1: 'c1', i2: 'c2' }), true);
assert.equal(scorePracticeResponse({ ...base, question_type: 'ordering', answer_data: { correct_order: ['i2', 'i1'] } }, ['i2', 'i1']), true);

const publicRow = publicPracticeQuestion({ ...base, answer_data: { correct: ['A'], options: { A: 'A' } }, question_type: 'multiple_response' }, false);
assert.equal('correct_answer' in publicRow, false);
assert.equal('explanation' in publicRow, false);
assert.equal('rita_tip' in publicRow, false);
assert.equal('correct' in (publicRow.answer_data || {}), false);

console.log('Practice scoring and pre-answer redaction checks passed.');
