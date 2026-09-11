-- Expand the short diagnostic to a balanced 32-item PMBOK 8 / ECO 2026 bank.
-- Items remain in REVIEW until two independent PMP-qualified SME ratings are recorded.

update public.diagnostic_tracks
set blueprint_version = 'official-2026-v1',
    domain_weights = '{"people":0.33,"process":0.41,"business_environment":0.26}'::jsonb,
    approach_weights = '{"predictive":0.40,"agile":0.30,"hybrid":0.30}'::jsonb
where id = 'pmbok8';

alter table public.diagnostic_forms
  drop constraint if exists diagnostic_forms_form_length_check;
alter table public.diagnostic_forms
  add constraint diagnostic_forms_form_length_check check (form_length in (32, 60));

with item(stem, options, key, domain, approach, eco_task, cognitive_level, difficulty_b,
          rationale_correct, rationale_distractors) as (
  values
  (
    'A functional manager tells the project manager that a specialist will be unavailable during a critical design review. The resource plan assumed full participation, but the review can be moved without affecting the contractual milestone. Other qualified specialists understand only parts of the design. What should the project manager do first?',
    '[{"id":"A","text":"Assess the competency gap and review feasible coverage or schedule options with the team."},{"id":"B","text":"Ask the sponsor to require the specialist to attend the review as originally planned."},{"id":"C","text":"Replace the specialist immediately with the most available team member."},{"id":"D","text":"Continue the review without the specialist and document any resulting defects."}]'::jsonb,
    'A', 'people', 'predictive', 'People-9', 'recall', -0.80,
    'The project manager first establishes the capability gap and evaluates proportionate options before escalating or changing assignments.',
    '{"B":"Escalation is premature before the impact and workable alternatives are understood.","C":"Availability alone does not establish that a replacement has the required competence.","D":"Accepting a known review gap transfers avoidable risk into later work."}'::jsonb
  ),
  (
    'Two experienced engineers disagree about the cause of repeated integration failures. Each has supporting data, and their teams have begun defending separate solutions. The next release depends on resolving the issue without damaging cooperation. The project manager has arranged a joint working session. What is the best way to conduct that session?',
    '[{"id":"A","text":"Ask each engineer to present a solution, then let the larger team vote."},{"id":"B","text":"Establish shared facts and decision criteria, then evaluate the competing hypotheses together."},{"id":"C","text":"Separate the engineers and ask the sponsor to select one proposed solution."},{"id":"D","text":"Focus the session on restoring harmony and postpone technical analysis until later."}]'::jsonb,
    'B', 'people', 'predictive', 'People-10', 'application', 0.00,
    'Shared evidence and agreed decision criteria turn positional conflict into collaborative problem solving while preserving ownership.',
    '{"A":"A popularity vote does not test technical evidence or resolve the underlying disagreement.","C":"Sponsor selection bypasses the team expertise needed to diagnose the failure.","D":"Relationship repair without technical analysis leaves the delivery problem unresolved."}'::jsonb
  ),
  (
    'A new team member has strong technical credentials but repeatedly misses handoffs because the organization uses an unfamiliar approval process. Colleagues have started bypassing the person, which improves speed temporarily but reduces knowledge sharing. The milestone remains recoverable. What is the best action for the project manager to improve performance?',
    '[{"id":"A","text":"Move the team member to independent tasks that require fewer coordination points."},{"id":"B","text":"Issue a formal performance warning because the missed handoffs are documented."},{"id":"C","text":"Coach the team member on the workflow and pair them with an experienced colleague."},{"id":"D","text":"Ask colleagues to continue bypassing the person until the milestone is complete."}]'::jsonb,
    'C', 'people', 'predictive', 'People-11', 'application', 0.10,
    'Targeted coaching and pairing address the process-learning gap while restoring collaboration and building sustainable capability.',
    '{"A":"Isolation avoids rather than corrects the coordination problem and limits integration.","B":"Discipline is disproportionate when the evidence indicates a learnable process gap.","D":"Continuing the workaround entrenches exclusion and leaves capability undeveloped."}'::jsonb
  ),
  (
    'A project team wants to use an artificial-intelligence assistant to summarize customer interviews and propose backlog themes. The tool could accelerate discovery, but it may process confidential personal data and its outputs can contain unsupported conclusions. No organizational guidance yet covers this use. What is the best action for the project manager to facilitate?',
    '[{"id":"A","text":"Permit unrestricted use because a human will eventually review each backlog item."},{"id":"B","text":"Prohibit all artificial-intelligence tools until the organization publishes a formal policy."},{"id":"C","text":"Upload anonymized interviews immediately and address governance concerns after the pilot."},{"id":"D","text":"Assess data, legal, ethical, and quality risks and define human oversight before a controlled pilot."}]'::jsonb,
    'D', 'business_environment', 'agile', 'Business-4', 'application', 0.20,
    'A governed assessment and explicit human oversight enable responsible experimentation while protecting stakeholders and decision quality.',
    '{"A":"Later review does not prevent improper data processing or uncontrolled exposure.","B":"A blanket prohibition discards potential value without evaluating a controlled option.","C":"Anonymization alone does not resolve legal, ethical, security, or output-quality risks."}'::jsonb
  ),
  (
    'A hybrid infrastructure program can use a lower-cost material that meets minimum specifications, but lifecycle analysis indicates higher emissions and maintenance expense. A more sustainable alternative costs more initially and could delay procurement. The organization has published sustainability commitments, although the business case did not quantify them. What is the best action for the project manager?',
    '[{"id":"A","text":"Quantify lifecycle value and sustainability impacts, then present the trade-off through governance."},{"id":"B","text":"Select the lower-cost material because only approved financial benefits belong in the business case."},{"id":"C","text":"Select the sustainable material immediately because published commitments override project constraints."},{"id":"D","text":"Ask procurement to choose privately so the project can preserve its delivery schedule."}]'::jsonb,
    'A', 'business_environment', 'hybrid', 'Business-5', 'analysis', 0.90,
    'Quantifying lifecycle and sustainability effects creates an evidence-based governance decision aligned with organizational strategy and value.',
    '{"B":"Ignoring lifecycle and stated strategic commitments understates value and risk.","C":"Commitments matter, but an unapproved unilateral choice bypasses integrated impact analysis.","D":"Procurement contributes expertise but does not solely own the strategic value decision."}'::jsonb
  ),
  (
    'During scope planning, a stakeholder requests a feature that appears outside the approved product scope. The request may address a valid regulatory need, but the supporting regulation has not been reviewed by the project team. The stakeholder asks for an immediate commitment to avoid delay. What should the project manager do next?',
    '[{"id":"A","text":"Reject the request because it is outside the currently approved scope baseline."},{"id":"B","text":"Add the feature to the work breakdown structure and estimate it during execution."},{"id":"C","text":"Clarify the regulatory requirement and assess its scope and compliance implications."},{"id":"D","text":"Ask the sponsor to approve the feature before the team investigates the requirement."}]'::jsonb,
    'C', 'process', 'predictive', 'Process-11', 'recall', -0.70,
    'The team must first establish the requirement and its implications before accepting, rejecting, or submitting a change.',
    '{"A":"Rejecting an unexamined regulatory need may create compliance exposure.","B":"Adding work before validation and approval bypasses scope control.","D":"The sponsor cannot make an informed decision without the requirement and impact analysis."}'::jsonb
  ),
  (
    'A contractor submits a deliverable on time, but inspection shows several minor deviations from the agreed acceptance criteria. The contractor argues that the deviations do not affect use and asks for immediate acceptance so invoicing can proceed. The project has a defined quality and procurement process. What should the project manager do next?',
    '[{"id":"A","text":"Accept the deliverable conditionally and ask the contractor to correct it after payment."},{"id":"B","text":"Document the nonconformance and follow the agreed review and remedy process."},{"id":"C","text":"Reject the entire contract because the acceptance criteria were not fully satisfied."},{"id":"D","text":"Ask end users to vote on whether the deviations are important enough to correct."}]'::jsonb,
    'B', 'process', 'predictive', 'Process-12', 'application', 0.00,
    'Documenting the variance and using the agreed remedy process protects quality, contractual fairness, and an auditable decision.',
    '{"A":"Conditional acceptance may weaken contractual leverage and bypass the agreed control process.","C":"Terminating the contract is disproportionate before contractual remedies are applied.","D":"User opinion can inform impact but does not replace contractual acceptance criteria."}'::jsonb
  ),
  (
    'A critical-path activity is forecast to finish ten days late after an equipment failure. The team identifies two recovery options: overtime with higher cost or resequencing with additional technical risk. Management asks for a recommendation before the next governance meeting. What is the best basis for the project manager recommendation?',
    '[{"id":"A","text":"Select overtime because protecting the approved completion date has the highest priority."},{"id":"B","text":"Select resequencing because it avoids increasing the approved project budget."},{"id":"C","text":"Wait until the activity finishes because forecasts may change before governance meets."},{"id":"D","text":"Compare total impacts, risks, constraints, and stakeholder priorities for both options."}]'::jsonb,
    'D', 'process', 'hybrid', 'Process-13', 'application', 0.10,
    'An integrated comparison enables a transparent trade-off across schedule, cost, technical risk, and stakeholder priorities.',
    '{"A":"Schedule protection alone ignores cost and feasibility impacts.","B":"Budget protection alone ignores technical and downstream exposure.","C":"Waiting converts a manageable forecast into a more constrained response."}'::jsonb
  ),
  (
    'An agile service project has delivered its technical release, but frontline managers report that employees are not adopting the new workflow. Training attendance was high, yet local procedures and performance measures still reward the old behavior. Benefits depend on sustained operational use. What should the project manager facilitate next?',
    '[{"id":"A","text":"Close the project because the approved technical scope has been delivered."},{"id":"B","text":"Schedule the same training again for every employee who attended previously."},{"id":"C","text":"Assess adoption barriers with operations and align procedures, measures, and reinforcement actions."},{"id":"D","text":"Transfer responsibility to the support desk because adoption is now an operational issue."}]'::jsonb,
    'C', 'business_environment', 'agile', 'Business-6', 'application', 0.20,
    'Benefits realization requires diagnosing the operating-system barriers and coordinating organizational change beyond technical delivery.',
    '{"A":"Scope completion does not establish that the intended organizational benefits are achievable.","B":"Repeating training does not address incentives and procedures that reinforce old behavior.","D":"Support can assist, but ownership of adoption and benefits must be coordinated with operations and governance."}'::jsonb
  ),
  (
    'A portfolio-funded project is midway through execution when market evidence shows that the original benefit forecast is unlikely to be achieved. Technical delivery remains on schedule and terminating now would incur contractual costs. The sponsor prefers to continue because substantial money has already been spent. What is the best action for the project manager?',
    '[{"id":"A","text":"Continue delivery because stopping would waste the investment already made."},{"id":"B","text":"Reassess the business case using current evidence and present options to governance."},{"id":"C","text":"Reduce quality activities to recover enough cost to protect the original benefits."},{"id":"D","text":"Ask the delivery team to identify additional features before informing governance."}]'::jsonb,
    'B', 'business_environment', 'agile', 'Business-7', 'application', 0.80,
    'Current value evidence—not sunk cost—should drive a refreshed business case and an informed governance decision.',
    '{"A":"Sunk expenditure is not evidence that continued investment will create value.","C":"Reducing quality creates new risk without restoring the benefit hypothesis.","D":"Adding features before governance review may increase investment in an invalid case."}'::jsonb
  ),
  (
    'An agile product team releases frequently, but analytics show that customers rarely use several recently delivered features. The backlog still contains requests from influential stakeholders, and velocity remains high. Leadership praises the output rate and asks the team to accelerate. What should the project manager encourage next?',
    '[{"id":"A","text":"Increase sprint capacity so more stakeholder requests can be delivered each quarter."},{"id":"B","text":"Keep the backlog unchanged because influential stakeholders define business value."},{"id":"C","text":"Pause releases until every existing feature reaches its forecast usage target."},{"id":"D","text":"Review outcome evidence with stakeholders and refine backlog priorities and experiments."}]'::jsonb,
    'D', 'business_environment', 'agile', 'Business-8', 'application', 0.90,
    'Outcome evidence should guide backlog refinement and experiments so delivery capacity is directed toward measurable customer value.',
    '{"A":"More output amplifies waste when the value assumptions remain untested.","B":"Influence does not substitute for validated outcomes and transparent prioritization.","C":"A blanket release pause prevents useful learning and is disproportionate."}'::jsonb
  ),
  (
    'A public-sector project will launch in two regions with different data-retention requirements. The approved design meets the stricter rule, but operations proposes a cheaper regional variation that may still comply. Legal interpretation is incomplete, and launch communications are scheduled. What should the project manager do next before approving the variation?',
    '[{"id":"A","text":"Confirm the applicable obligations and evaluate compliance, value, and operational impacts."},{"id":"B","text":"Approve the cheaper variation because the stricter design remains available as a fallback."},{"id":"C","text":"Use one design in both regions because standardization eliminates every compliance concern."},{"id":"D","text":"Delay all launch communications until regulators publish additional implementation guidance."}]'::jsonb,
    'A', 'business_environment', 'hybrid', 'Business-3', 'recall', 0.80,
    'The project must establish the applicable obligation and integrated impacts before approving a region-specific design decision.',
    '{"B":"Cost savings do not establish compliance or acceptable operational exposure.","C":"Standardization can reduce complexity but does not automatically resolve legal interpretation.","D":"A full communication delay is premature before the compliance analysis identifies the real constraint."}'::jsonb
  )
)
insert into public.diagnostic_items (
  track_id, stem, options, key, domain, approach, eco_task, cognitive_level,
  rationale_correct, rationale_distractors, readability_grade, difficulty_b,
  status, authored_by, version
)
select 'pmbok8', stem, options, key, domain, approach, eco_task, cognitive_level,
       rationale_correct, rationale_distractors, 10.00, difficulty_b,
       'review', 'PMPeco diagnostic v1 — pending independent SME review', 1
from item
where not exists (
  select 1 from public.diagnostic_items d
  where d.track_id = 'pmbok8' and d.eco_task = item.eco_task and d.version = 1
);

-- Balanced provisional difficulty assignments for the original twenty exemplars.
-- These are content-design estimates only; empirical calibration follows pilot responses.
update public.diagnostic_items
set difficulty_b = case
  when eco_task in ('People-1','People-4','People-7','Process-2','Process-6','Business-1') then -0.80
  when eco_task in ('People-6','Process-8','Process-9','Process-10') then 0.80
  else 0.00
end
where track_id = 'pmbok8' and version = 1 and eco_task in (
  'People-1','People-2','People-3','People-4','People-5','People-6','People-7','People-8',
  'Process-1','Process-2','Process-3','Process-4','Process-5','Process-6','Process-7','Process-8','Process-9','Process-10',
  'Business-1','Business-2'
);

do $$
declare
  total_count integer;
  people_count integer;
  process_count integer;
  business_count integer;
  predictive_count integer;
  agile_count integer;
  hybrid_count integer;
  below_count integer;
  average_count integer;
  above_count integer;
  recall_count integer;
  application_count integer;
  analysis_count integer;
  key_a_count integer;
  key_b_count integer;
  key_c_count integer;
  key_d_count integer;
begin
  select count(*),
    count(*) filter (where domain = 'people'),
    count(*) filter (where domain = 'process'),
    count(*) filter (where domain = 'business_environment'),
    count(*) filter (where approach = 'predictive'),
    count(*) filter (where approach = 'agile'),
    count(*) filter (where approach = 'hybrid'),
    count(*) filter (where difficulty_b < -0.5),
    count(*) filter (where difficulty_b between -0.5 and 0.5),
    count(*) filter (where difficulty_b > 0.5),
    count(*) filter (where cognitive_level = 'recall'),
    count(*) filter (where cognitive_level = 'application'),
    count(*) filter (where cognitive_level = 'analysis'),
    count(*) filter (where key = 'A'),
    count(*) filter (where key = 'B'),
    count(*) filter (where key = 'C'),
    count(*) filter (where key = 'D')
  into total_count, people_count, process_count, business_count,
       predictive_count, agile_count, hybrid_count,
       below_count, average_count, above_count, recall_count,
       application_count, analysis_count,
       key_a_count, key_b_count, key_c_count, key_d_count
  from public.diagnostic_items
  where track_id = 'pmbok8' and version = 1 and status = 'review';

  if (total_count, people_count, process_count, business_count) <> (32, 11, 13, 8)
     or (predictive_count, agile_count, hybrid_count) <> (13, 10, 9)
     or (below_count, average_count, above_count) <> (8, 16, 8)
     or (recall_count, application_count, analysis_count) <> (3, 14, 15)
     or (key_a_count, key_b_count, key_c_count, key_d_count) <> (8, 8, 8, 8) then
    raise exception '32-item diagnostic bank does not satisfy its blueprint';
  end if;
end;
$$;

notify pgrst, 'reload schema';
