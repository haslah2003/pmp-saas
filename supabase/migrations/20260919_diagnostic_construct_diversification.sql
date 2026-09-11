-- Final content-mechanics remediation: diversify keyed constructs, separate
-- near-duplicate scenarios, restore PPL-6 coverage, and make the construct
-- distribution auditable rather than relying on answer-position balance.

alter table public.diagnostic_items
  add column if not exists answer_construct text not null default 'deliberative_analysis'
    check (answer_construct in (
      'deliberative_analysis','decisive_action','governed_escalation',
      'boundary_enforcement','artifact_diagnosis','policy_application'
    ));

-- PPL-6: the missing People task. The keyed response is a proportionate,
-- decisive service-recovery action rather than another request to assess.
update public.diagnostic_items set
  stem = 'A customer representative has rejected the same critical workflow twice because it does not meet the agreed response-time outcome. The acceptance criterion is explicit, the defect is reproducible, and the next rollout group starts tomorrow. The delivery lead proposes releasing and correcting it later. Which action should the project manager take?',
  options = '[{"id":"A","text":"Release to the next group and record the customer concern as an enhancement request."},{"id":"B","text":"Pause the affected rollout, invoke the agreed correction path, and communicate a recovery commitment to the customer."},{"id":"C","text":"Ask the customer to reconsider because the technical acceptance tests passed."},{"id":"D","text":"Refer the acceptance decision to the sponsor without using the agreed service-recovery authority."}]'::jsonb,
  key = 'B', answer_keys = array['B'], eco_task_code = 'PPL-6',
  cognitive_level = 'application', answer_construct = 'decisive_action',
  rationale_correct = 'The explicit failed outcome and delegated correction path justify immediate containment and recovery while expectations are reset transparently.',
  rationale_distractors = '{"A":"A known failure against an agreed critical outcome should not be transferred to more users.","C":"Technical test completion does not supersede the customer outcome criterion.","D":"Escalation bypasses authority already available for a proportionate recovery response."}'::jsonb
where eco_task = 'People-11';

-- PRC-3 duplicate 1: diagnose the missing evidence rather than choose a generic
-- collaborative next step.
update public.diagnostic_items set
  stem = 'A product increment meets its technical acceptance criteria and was delivered on schedule. Usage analytics show no change in the customer behavior named in the business case, yet the team reports the increment as fully valuable. Which missing evidence most directly prevents the project manager from validating that value was delivered?',
  options = '[{"id":"A","text":"A comparison of actual customer-outcome movement with the benefit measure defined for the increment."},{"id":"B","text":"A signed confirmation that the iteration ceremonies occurred on their planned dates."},{"id":"C","text":"A variance explanation showing that development effort remained within the team estimate."},{"id":"D","text":"A stakeholder register update recording who attended the increment demonstration."}]'::jsonb,
  key = 'A', answer_keys = array['A'], cognitive_level = 'analysis',
  answer_construct = 'artifact_diagnosis',
  rationale_correct = 'Value validation requires evidence against the intended benefit or customer outcome, not delivery activity or technical completion alone.',
  rationale_distractors = '{"B":"Ceremony completion is process evidence rather than benefit evidence.","C":"Effort variance does not establish customer or business value.","D":"Attendance records do not measure whether the expected outcome changed."}'::jsonb
where eco_task = 'Process-2';

-- PRC-3 duplicate 2: enforce a pre-agreed experiment boundary.
update public.diagnostic_items set
  stem = 'An agile team is running a reversible pricing experiment under an approved guardrail: stop the test if complaint volume exceeds 3 percent for two consecutive days. The threshold has reached 4 percent on both days, while early revenue is positive. The product owner wants one more week of data. What is the appropriate response?',
  options = '[{"id":"A","text":"Continue for one week because early revenue may outweigh the complaint signal."},{"id":"B","text":"Stop the experiment under the approved guardrail and preserve the evidence for the next product decision."},{"id":"C","text":"Broaden the experiment to improve the statistical power of the revenue result."},{"id":"D","text":"Wait for a sponsor decision even though the stop authority and threshold were approved."}]'::jsonb,
  key = 'B', answer_keys = array['B'], cognitive_level = 'application',
  answer_construct = 'boundary_enforcement',
  rationale_correct = 'The team should honor the explicit, pre-authorized stop condition; learning continues through the retained evidence and a later decision.',
  rationale_distractors = '{"A":"Positive revenue does not nullify the approved customer-harm boundary.","C":"Expansion increases exposure after the stop condition has been met.","D":"The agreed guardrail already supplies decision authority."}'::jsonb
where eco_task = 'Process-6';

-- BEN-7 duplicate 1: choose a concrete transition intervention.
update public.diagnostic_items set
  stem = 'A new operating process is technically ready and the mandatory transition date is fixed. A pilot group performs accurately after guided practice, while non-pilot teams continue using the old process because their supervisors have not scheduled practice time. Which intervention best addresses the demonstrated adoption constraint?',
  options = '[{"id":"A","text":"Require supervisors to schedule guided practice and verify proficiency before their teams transition."},{"id":"B","text":"Publish another general announcement describing the mandatory transition date."},{"id":"C","text":"Extend the technology project until voluntary adoption reaches the forecast level."},{"id":"D","text":"Replace the process because non-pilot teams have not adopted it spontaneously."}]'::jsonb,
  key = 'A', answer_keys = array['A'], cognitive_level = 'application',
  answer_construct = 'decisive_action',
  rationale_correct = 'The pilot isolates practice access as the adoption constraint, so owned practice and proficiency verification directly address it.',
  rationale_distractors = '{"B":"Awareness is not the observed constraint.","C":"An open-ended project extension does not create supervisor ownership or capability.","D":"The successful pilot shows that the process itself is viable."}'::jsonb
where eco_task = 'Business-2';

-- BEN-7 duplicate 2: identify the deficient transition artifact.
update public.diagnostic_items set
  stem = 'A hybrid program delivered its new workflow and training materials, but benefit realization remains below forecast. Operational teams complete training, then return to the old workflow. The transition file lists delivery dates and training completion but contains no operational owners, adoption measures, or reinforcement actions. Which artifact deficiency best explains the gap?',
  options = '[{"id":"A","text":"The risk register does not repeat the technical delivery milestones from the integrated plan."},{"id":"B","text":"The procurement plan does not identify a replacement training supplier for the completed courses."},{"id":"C","text":"The transition and benefits plan lacks accountable adoption owners, outcome measures, and reinforcement actions."},{"id":"D","text":"The issue log does not classify voluntary use of the former workflow as a technical defect."}]'::jsonb,
  key = 'C', answer_keys = array['C'], cognitive_level = 'analysis',
  answer_construct = 'artifact_diagnosis',
  rationale_correct = 'Operational ownership, observable adoption measures, and reinforcement connect delivered capability to realized organizational change.',
  rationale_distractors = '{"A":"Duplicating milestones does not establish adoption accountability.","B":"A replacement supplier is unrelated to the observed post-training behavior.","D":"Continued use is an adoption issue, not necessarily a software defect."}'::jsonb
where eco_task = 'Business-6';

-- BEN-8 duplicate 1: make the justified decision despite sunk cost.
update public.diagnostic_items set
  stem = 'A portfolio project remains technically feasible, but verified market evidence shows that its product will no longer achieve the minimum strategic benefit threshold. Continuation would consume scarce capacity needed by a higher-value initiative, and termination costs are lower than the remaining forecast spend. The sponsor cites prior investment as the reason to continue. What should the project manager recommend?',
  options = '[{"id":"A","text":"Continue because stopping would prevent recovery of the investment already spent."},{"id":"B","text":"Recommend termination through portfolio governance and document the current value, capacity, and exit evidence."},{"id":"C","text":"Reduce quality targets until the original benefit forecast becomes financially attainable."},{"id":"D","text":"Complete the product before disclosing the market evidence to portfolio decision makers."}]'::jsonb,
  key = 'B', answer_keys = array['B'], cognitive_level = 'analysis',
  answer_construct = 'decisive_action',
  rationale_correct = 'Current and prospective value should govern continuation; sunk expenditure is not a valid reason to consume more constrained capacity.',
  rationale_distractors = '{"A":"Past expenditure is irrecoverable and does not establish future value.","C":"Lowering quality does not restore the disproven strategic benefit.","D":"Withholding material evidence undermines portfolio governance."}'::jsonb
where eco_task = 'Business-7';

-- BEN-8 duplicate 2: choose between two feasible value options.
update public.diagnostic_items set
  stem = 'Market evidence now favors a smaller service configuration that can reach customers in six weeks and is forecast to produce 80 percent of the original benefit at 45 percent of the remaining cost. The larger configuration is still feasible but would arrive after a competitor launch and consume constrained specialists. Governance permits scope adaptation when the business case changes. Which option should the project manager recommend?',
  options = '[{"id":"A","text":"Complete the larger configuration because it preserves the initially approved feature count."},{"id":"B","text":"Delay the decision until the competitor launch confirms the expected market effect."},{"id":"C","text":"Deliver both configurations sequentially without changing the approved capacity allocation."},{"id":"D","text":"Recommend the smaller configuration through change control using the updated value, timing, cost, and capacity evidence."}]'::jsonb,
  key = 'D', answer_keys = array['D'], cognitive_level = 'analysis',
  answer_construct = 'policy_application',
  rationale_correct = 'The authorized adaptation process should use current evidence to protect value rather than preserving output volume.',
  rationale_distractors = '{"A":"Feature count is not the governing value measure.","B":"Waiting discards a time-sensitive advantage despite sufficient decision evidence.","C":"The proposal exceeds the stated capacity and avoids the required trade-off."}'::jsonb
where eco_task = 'Business-8';

-- Existing items whose correct action is appropriately decisive, escalatory, or
-- enforcing are classified explicitly for distribution checks and reporting.
update public.diagnostic_items set answer_construct = 'governed_escalation' where eco_task in ('Reserve-14');
update public.diagnostic_items set answer_construct = 'boundary_enforcement' where eco_task in ('Reserve-07','Reserve-13');
update public.diagnostic_items set answer_construct = 'policy_application' where eco_task in ('Business-4','Business-5','Process-12');
update public.diagnostic_items set answer_construct = 'artifact_diagnosis' where eco_task in ('Reserve-08','Reserve-11');

-- This diagnostic intentionally measures applied situational judgement rather
-- than factual recall. Retire legacy recall labels instead of misclassifying
-- scenario items merely to satisfy a synthetic quota.
update public.diagnostic_items set cognitive_level = case
  when author_difficulty_band = 'advanced' then 'analysis'
  else 'application'
end
where track_id = 'pmbok8' and cognitive_level = 'recall';

-- Rebuild trap metadata after the item rewrites so keyed options are excluded
-- and each current distractor has one stable, reportable classification.
update public.diagnostic_items item set option_traps = coalesce((
  select jsonb_object_agg(option->>'id', jsonb_build_array(
    case
      when lower(option->>'text') ~ 'escalat|sponsor|steering' then 'premature_escalation'
      when lower(option->>'text') ~ 'wait|delay|defer|continue' then 'avoidance_or_delay'
      when lower(option->>'text') ~ 'baseline|contract|schedule' then 'rigid_plan_adherence'
      when lower(option->>'text') ~ 'cancel|terminate|replace|reject' then 'premature_decision'
      when lower(option->>'text') ~ 'without|before' then 'analysis_bypass'
      else 'misapplied_management_response'
    end))
  from jsonb_array_elements(item.options) option
  where not (item.answer_keys @> array[option->>'id'])
), '{}'::jsonb)
where track_id = 'pmbok8';

-- Fail the migration if the final review bank drifts from the approved design.
do $$
declare
  total_count integer;
  ppl6_count integer;
  non_deliberative_count integer;
  untagged_count integer;
begin
  select count(*) into total_count from public.diagnostic_items where track_id = 'pmbok8';
  select count(*) into ppl6_count from public.diagnostic_items where track_id = 'pmbok8' and eco_task_code = 'PPL-6';
  select count(*) into non_deliberative_count from public.diagnostic_items where track_id = 'pmbok8' and answer_construct <> 'deliberative_analysis';
  select count(*) into untagged_count from public.diagnostic_items
    where track_id = 'pmbok8'
      and (select count(*) from jsonb_object_keys(option_traps)) <> 4 - cardinality(answer_keys);
  if total_count <> 48 then raise exception 'Expected 48 PMBOK 8 diagnostic items, found %', total_count; end if;
  if ppl6_count < 1 then raise exception 'PPL-6 coverage is required'; end if;
  if non_deliberative_count < 12 then raise exception 'Answer-construct diversity is below the minimum'; end if;
  if untagged_count <> 0 then raise exception 'Every distractor must have behavioral-trap metadata'; end if;
end $$;

notify pgrst, 'reload schema';
