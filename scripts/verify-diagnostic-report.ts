import assert from 'node:assert/strict';
import { buildIndividualReport } from '../lib/diagnostic/report';

const score = {
  readinessBand: 'developing' as const, weightedScore: 0.61, standardError: 0.08,
  domainScores: {
    people: { correct: 6, total: 10, proportion: 0.6, weighted: 0.252 },
    process: { correct: 8, total: 13, proportion: 8 / 13, weighted: 4 / 13 },
    business_environment: { correct: 1, total: 2, proportion: 0.5, weighted: 0.04 },
  },
  ecoTaskGaps: [{ ecoTask: 'People-1', mastery: 0, itemCount: 1 }, { ecoTask: 'Process-2', mastery: 0.5, itemCount: 2 }],
};
const report = buildIndividualReport(score, [
  { itemId: 'one', selectedOption: 'B', correct: false, seconds: 30 },
  { itemId: 'two', selectedOption: 'A', correct: true, seconds: 160 },
], [
  { id: 'one', stem: 'What should the project manager do first?', domain: 'people', approach: 'agile', ecoTask: 'People-1', cognitiveLevel: 'analysis', rationaleDistractors: { B: 'The response escalates before collaborative analysis.' } },
  { id: 'two', stem: 'What should the project manager do next?', domain: 'process', approach: 'predictive', ecoTask: 'Process-2', cognitiveLevel: 'application', rationaleDistractors: {} },
]);
assert.equal(report.band.label, 'Developing');
assert.equal(report.scoreExplanation, 'Based on your performance across the tested PMP domains and decision-making scenarios.');
assert.equal(report.basis.includes('cold-start'), false);
assert.equal(report.basis.includes('weighted'), false);
assert.equal(report.review[0].misconception, 'The response escalates before collaborative analysis.');
assert.equal('correctAnswer' in report.review[0], false);
assert.equal('key' in report.review[0], false);
assert.equal(report.timing.rushed, 1);
assert.equal(report.timing.laboured, 1);
assert.equal(report.studySequence[0].domain, 'business_environment');
assert.equal(report.approachProfile.find((entry) => entry.key === 'hybrid')?.evidence, 'not_assessed');
assert.equal(report.decisionProfile.find((entry) => entry.key === 'first')?.proportion, 0);
assert.equal(report.kpis.situationalJudgment, 0.5);
assert.equal(report.coverage.pmbok8Principles, 'not_assessed');
console.log('Individual report interpretation, misconception redaction, timing, and study-priority checks passed.');
