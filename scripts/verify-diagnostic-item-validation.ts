import assert from 'node:assert/strict';
import { assertDiagnosticItemPublishable, validateDiagnosticItem, type DiagnosticItemInput } from '../lib/diagnostic/item-validation';

const valid: DiagnosticItemInput = {
  trackId: 'pmbok8',
  stem: 'A project team is preparing a release when a newly identified stakeholder raises a concern about an outcome that was previously accepted. The concern could affect adoption, but its business impact is still unclear. The project manager wants to protect value while maintaining momentum. What should the project manager do first?',
  options: [
    { id: 'A', text: 'Review the concern with the stakeholder and assess its impact with the team.' },
    { id: 'B', text: 'Reject the concern because the earlier acceptance already established the project baseline.' },
    { id: 'C', text: 'Escalate the concern immediately and request a final decision from the sponsor.' },
    { id: 'D', text: 'Delay the release until every stakeholder confirms complete agreement with the outcome.' },
  ],
  key: 'A', domain: 'people', approach: 'hybrid', ecoTask: 'People-10', cognitiveLevel: 'analysis',
  rationaleCorrect: 'Collaborative impact assessment clarifies value and risk before deciding how to respond.',
  rationaleDistractors: { B: 'Prior acceptance does not eliminate new stakeholder risk.', C: 'Escalation is premature before assessment.', D: 'Universal agreement is unnecessary and may destroy value.' },
  readabilityGrade: 9.5,
};

assert.deepEqual(validateDiagnosticItem(valid), []);
assert.throws(() => assertDiagnosticItemPublishable({ ...valid, stem: 'What should happen next?' }), /40-120/);
assert.throws(() => assertDiagnosticItemPublishable({ ...valid, rationaleDistractors: {} }), /distractor/);
assert.throws(() => assertDiagnosticItemPublishable({ ...valid, approach: 'waterfall' }), /Invalid approach/);
assert.throws(() => assertDiagnosticItemPublishable({ ...valid, readabilityGrade: 13 }), /12 or below/);
console.log('Diagnostic publication validation rejection checks passed.');
