-- Initial alternative-item support and behavioral-trap telemetry.

-- Resource-planning multiple response: exactly two selections are keyed.
update public.diagnostic_items set
  item_type = 'multiple_response',
  stem = 'A predictive project needs a scarce testing facility shared with higher-priority programs. The baseline assumes uninterrupted access, but the portfolio office confirms only partial availability. Several critical activities depend on the facility. Which two actions together create the strongest basis for a feasible resource plan? Select two.',
  options = '[{"id":"A","text":"Model facility demand against the available time windows and affected schedule dependencies."},{"id":"B","text":"Negotiate access and evaluate qualified alternatives using the integrated impact analysis."},{"id":"C","text":"Retain the baseline dates and classify the confirmed shortage as a monitoring issue."},{"id":"D","text":"Authorize a replacement facility before comparing cost, lead time, and technical suitability."}]'::jsonb,
  key = 'A', answer_keys = array['A','B'],
  rationale_correct = 'Demand analysis and negotiated access or alternatives jointly establish a feasible resource plan.',
  rationale_distractors = '{"C":"Recording the constraint without replanning leaves the baseline infeasible.","D":"A major acquisition requires comparative analysis and appropriate authority."}'::jsonb
where eco_task = 'Reserve-06';

-- Risk-response multiple response: exactly two selections are keyed.
update public.diagnostic_items set
  item_type = 'multiple_response',
  stem = 'A predictive project relies on a sole-source component from a region facing escalating trade restrictions. Delivery remains on schedule, while replacement qualification would take months and the next shipment is uncommitted. Which two actions best preserve decision options while the threat is still emerging? Select two.',
  options = '[{"id":"A","text":"Define exposure, triggers, and qualification lead-time scenarios in the risk analysis."},{"id":"B","text":"Develop response options with procurement and communicate decision thresholds through governance."},{"id":"C","text":"Delay action until a shipment misses its contractual date and becomes a confirmed issue."},{"id":"D","text":"Cancel the supplier now, before assessing replacement feasibility or transition exposure."}]'::jsonb,
  key = 'A', answer_keys = array['A','B'],
  rationale_correct = 'Early exposure analysis and governed response planning preserve options before the threat becomes an issue.',
  rationale_distractors = '{"C":"Waiting sacrifices scarce qualification lead time.","D":"Unassessed cancellation can create the disruption the response is intended to avoid."}'::jsonb
where eco_task = 'Reserve-15';

-- Graphic-based financial interpretation item.
update public.diagnostic_items set
  item_type = 'graphic_single_response',
  visual_spec = '{"kind":"bar_chart","title":"Forecast currency exposure by purchasing month","labels":["Current plan","Month 1","Month 2","Month 3"],"values":[72,79,91,108],"unit":"k"}'::jsonb,
  stem = 'The chart shows forecast currency exposure for a predictive project under progressively later purchasing dates. Available contingency is 85k, and the governance escalation threshold is 100k. The current purchasing plan remains inside the threshold, but delay changes the exposure profile. Which response best protects project value and governance compliance?',
  options = '[{"id":"A","text":"Model timing and hedging alternatives, update the forecast, and present the supported response at the applicable threshold."},{"id":"B","text":"Use the current contingency balance as evidence that purchasing dates need no further monitoring."},{"id":"C","text":"Move selected purchases to Month 1 without checking supply, cash-flow, or approval constraints."},{"id":"D","text":"Escalate the current exposure as a threshold breach even though the chart places it below 100k."}]'::jsonb,
  key = 'A', answer_keys = array['A'],
  rationale_correct = 'The trend requires evaluated response options and timely governance rather than ignoring or misclassifying exposure.',
  rationale_distractors = '{"B":"Current headroom does not remove the rising exposure.","C":"A date-only reaction can create supply and finance problems.","D":"The current value has not breached the stated escalation threshold."}'::jsonb
where eco_task = 'Reserve-08';

-- Assign a usable trap tag to every distractor. Specific high-value patterns are
-- classified, with a stable fallback so report telemetry is never blank.
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
  where not ((item.answer_keys || array[item.key::text]) @> array[option->>'id'])
), '{}'::jsonb);

notify pgrst, 'reload schema';
