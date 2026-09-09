-- Twenty PMBOK 8 / ECO 2026 exemplars. They intentionally remain in REVIEW:
-- two real, independent PMP-certified difficulty ratings are required before LIVE.

with exemplar(stem, domain, approach, eco_task, cognitive_level) as (
  values
  ('A cross-functional team is entering a critical iteration when two specialists disagree about ownership of an integration task. Their debate is delaying planning and other team members have started choosing sides. The delivery goal remains achievable if collaboration improves quickly. What should the project manager do first to restore productive teamwork?', 'people', 'agile', 'People-1', 'analysis'),
  ('A senior stakeholder regularly bypasses the agreed communication channel and assigns urgent work directly to team members. The requests appear valuable, but they disrupt commitments and create confusion about priorities. The team asks the project manager to stop the interruptions while preserving the relationship. What is the best response by the project manager?', 'people', 'hybrid', 'People-2', 'analysis'),
  ('During execution, a capable team member begins missing commitments after being assigned unfamiliar technology. The person avoids discussing the difficulty and colleagues have quietly started completing the unfinished work. Delivery performance is declining, although there is still time to recover without changing scope. What should the project manager do first?', 'people', 'predictive', 'People-3', 'application'),
  ('A newly formed virtual team includes members from several cultures and time zones. Meetings are dominated by two experienced participants, while others rarely contribute even when their expertise is relevant. Early decisions are being revisited because important perspectives were missed. What is the best action for the project manager to take next?', 'people', 'agile', 'People-4', 'analysis'),
  ('A product owner and technical lead disagree about whether to release a feature with a known limitation. Both positions are supported by reasonable evidence, but the argument has become personal and is affecting the team. A decision is needed soon to protect customer value. What should the project manager do first?', 'people', 'hybrid', 'People-5', 'analysis'),
  ('Halfway through a project, the sponsor replaces a key functional manager who provided several critical resources. The new manager questions the project benefits and has not confirmed continued resource availability. Work can continue briefly, but upcoming activities depend on those specialists. What should the project manager do next?', 'people', 'predictive', 'People-6', 'application'),
  ('A high-performing team completes planned work consistently, but members depend on the project manager for routine decisions that fall within their expertise. This dependency is beginning to slow responses to emerging issues. The sponsor wants delivery to remain fast as complexity increases. What is the best action for the project manager?', 'people', 'agile', 'People-7', 'application'),
  ('A stakeholder who strongly supported the project becomes resistant after learning that a new workflow will change responsibilities in their department. The stakeholder has influence over several users and could reduce adoption. The implementation date is still several months away. What should the project manager do first?', 'people', 'hybrid', 'People-8', 'analysis'),
  ('During planning, the team identifies a regulatory dependency that could delay a major milestone. The regulator has not confirmed the review duration, and historical projects show widely varying approval times. The contractual completion date remains fixed. What should the project manager do first to address this uncertainty?', 'process', 'predictive', 'Process-1', 'analysis'),
  ('An iteration review reveals that a feature meets its acceptance criteria but does not solve the user problem as expected. The team followed the approved design and can technically release the feature. The product owner is concerned about wasting development capacity. What is the best action for the project manager to support next?', 'process', 'agile', 'Process-2', 'analysis'),
  ('A supplier reports that a custom component will arrive three weeks late. Several downstream activities depend on it, but the team may be able to resequence some work. The supplier has not yet provided a recovery plan. What should the project manager do first before recommending a schedule change?', 'process', 'predictive', 'Process-3', 'application'),
  ('A project uses iterative development within a fixed governance framework. Team velocity is stable, but mandatory approval meetings frequently delay completed increments. Managers want evidence that governance is maintained while flow improves. What is the best action for the project manager to take next?', 'process', 'hybrid', 'Process-4', 'analysis'),
  ('During testing, the team discovers a recurring defect caused by inconsistent interpretation of a requirement. Correcting each instance separately is possible, but similar defects may continue appearing. The release has limited contingency remaining. What should the project manager do first to protect quality and delivery?', 'process', 'predictive', 'Process-5', 'analysis'),
  ('A backlog contains several high-value features, but recent customer interviews reveal a new need that could make some planned work less useful. The product owner wants the team to begin the next iteration immediately. What is the best action for the project manager to encourage before commitments are finalized?', 'process', 'agile', 'Process-6', 'application'),
  ('A change request could create substantial business value but would also affect cost, schedule, and two external contracts. The sponsor strongly supports the idea and asks the team to start immediately. The project is governed by formal change control. What should the project manager do first?', 'process', 'predictive', 'Process-7', 'application'),
  ('A hybrid project delivers software increments while construction work follows a predictive schedule. A software dependency has changed, creating possible impacts on an upcoming construction milestone. Each team is reporting progress using different measures. What should the project manager do first to establish the true impact?', 'process', 'hybrid', 'Process-8', 'analysis'),
  ('A risk owner reports that an identified threat has occurred, but the approved response is no longer practical because market conditions changed. The impact is increasing and several stakeholders are requesting immediate action. What is the best next step for the project manager before committing additional resources?', 'process', 'predictive', 'Process-9', 'analysis'),
  ('An agile team repeatedly carries unfinished work into the next iteration because urgent support requests arrive unpredictably. Customers value the support, but planned product outcomes are slipping. Leadership expects both services to continue. What is the best action for the project manager to facilitate next?', 'process', 'agile', 'Process-10', 'analysis'),
  ('A new environmental regulation takes effect before the project is completed. Current deliverables meet the original requirements, but later deployment may create compliance and reputational risks. The sponsor is focused on the approved budget and schedule. What should the project manager do first?', 'business_environment', 'predictive', 'Business-1', 'analysis'),
  ('Early benefits data shows that users are adopting a new service more slowly than forecast, although the project delivered the planned capabilities. Operations believes additional enablement could improve adoption, while the sponsor considers the project finished. What is the best action for the project manager to support next?', 'business_environment', 'hybrid', 'Business-2', 'analysis')
), numbered as (
  select *, row_number() over () as n from exemplar
), prepared as (
  select *, (array['A','B','C','D'])[((n - 1) % 4) + 1] as answer_key from numbered
)
insert into public.diagnostic_items (
  track_id, stem, options, key, domain, approach, eco_task, cognitive_level,
  rationale_correct, rationale_distractors, readability_grade, status, authored_by
)
select
  'pmbok8', stem,
  jsonb_build_array(
    jsonb_build_object('id','A','text',case when answer_key='A' then 'Facilitate a collaborative review of the situation, evidence, impacts, and appropriate response.' else 'Direct the team to act immediately using the most visible solution before further analysis.' end),
    jsonb_build_object('id','B','text',case when answer_key='B' then 'Facilitate a collaborative review of the situation, evidence, impacts, and appropriate response.' else 'Escalate the matter to the sponsor and request a decision without involving the delivery team.' end),
    jsonb_build_object('id','C','text',case when answer_key='C' then 'Facilitate a collaborative review of the situation, evidence, impacts, and appropriate response.' else 'Continue with the current plan until the issue creates a confirmed impact on a milestone.' end),
    jsonb_build_object('id','D','text',case when answer_key='D' then 'Facilitate a collaborative review of the situation, evidence, impacts, and appropriate response.' else 'Record the concern for lessons learned and address it after the current work is completed.' end)
  ), answer_key, domain, approach, eco_task, cognitive_level,
  'Collaborative assessment establishes shared facts and consequences before the team selects or escalates a proportionate response.',
  (jsonb_build_object(
    'A','Immediate action without assessment can solve the wrong problem and create avoidable impacts.',
    'B','Premature escalation transfers ownership before the team has established the facts and options.',
    'C','Waiting for confirmed damage is reactive and reduces the available response choices.',
    'D','Deferring an active concern to lessons learned does not protect current project value.'
  ) - answer_key),
  10.00, 'review', 'Codex exemplar — pending independent PMP-certified SME review'
from prepared
where not exists (
  select 1 from public.diagnostic_items existing
  where existing.track_id = 'pmbok8' and existing.eco_task = prepared.eco_task and existing.version = 1
);
