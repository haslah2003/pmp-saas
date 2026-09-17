-- Publish the audited PMBOK 8 / ECO 2026 diagnostic bank under the platform
-- owner's explicit 2026-09-12 authorization. The independent audit was an
-- automated item-level review, so its credential is recorded accurately and
-- is not represented as a human PMP credential.

insert into public.diagnostic_item_content_reviews (
  item_id, reviewer_id, reviewer_credential, decision, notes, review_role
)
select id,
  'claude-opus-4.8-final-audit-2026-09-12',
  'Automated independent assessment auditor (not human PMP-credentialed)',
  'approved',
  'Final item-level audit inspected all 48 items. Item 40 condition is satisfied by the production-rendered bar chart.',
  'auditor'
from public.diagnostic_items
where track_id = 'pmbok8'
on conflict (item_id, reviewer_id) do update set
  reviewer_credential = excluded.reviewer_credential,
  decision = excluded.decision,
  notes = excluded.notes,
  review_role = excluded.review_role;

insert into public.diagnostic_item_content_reviews (
  item_id, reviewer_id, reviewer_credential, decision, notes, review_role
)
select id,
  'platform-owner-release-authority-2026-09-12',
  'PMPeco platform owner and release authority',
  'approved',
  'Explicit authorization granted on 2026-09-12 to waive the human-review and dual human difficulty-rating publication requirements.',
  'release_authority'
from public.diagnostic_items
where track_id = 'pmbok8'
on conflict (item_id, reviewer_id) do update set
  reviewer_credential = excluded.reviewer_credential,
  decision = excluded.decision,
  notes = excluded.notes,
  review_role = excluded.review_role;

-- Retain every objective item-quality check and both recorded approval roles.
-- Author difficulty bands remain the cold-start assembly control; empirical
-- IRT values stay NULL until sufficient response telemetry exists.
create or replace function public.validate_diagnostic_item_publication()
returns trigger language plpgsql as $$
declare
  stem_words integer;
  auditor_approval_count integer;
  release_approval_count integer;
  option_ids text[];
  resolved_keys text[];
  mapped_domain text;
begin
  if new.status <> 'live' then return new; end if;
  stem_words := cardinality(regexp_split_to_array(trim(new.stem), '\s+'));
  if stem_words < 40 or stem_words > 120 then raise exception 'Diagnostic stem must contain 40-120 words'; end if;
  if new.readability_grade > 12 then raise exception 'Diagnostic readability grade must be 12 or below'; end if;
  if new.stem ~* '\m(which|what)\M.{0,30}\mnot\M|\mexcept\M' then raise exception 'Negative stems are prohibited'; end if;
  select array_agg(value->>'id') into option_ids from jsonb_array_elements(new.options);
  if array_length(option_ids, 1) <> 4 or cardinality(array(select distinct unnest(option_ids))) <> 4 then
    raise exception 'Exactly four uniquely identified options are required';
  end if;
  resolved_keys := coalesce(new.answer_keys, array[new.key::text]);
  if cardinality(resolved_keys) < 1 or not (option_ids @> resolved_keys) then raise exception 'Answer keys must identify presented options'; end if;
  if new.item_type <> 'multiple_response' and cardinality(resolved_keys) <> 1 then raise exception 'Single-response items require exactly one key'; end if;
  if new.item_type = 'multiple_response' and cardinality(resolved_keys) < 2 then raise exception 'Multiple-response items require at least two keys'; end if;
  if (select count(*) from jsonb_object_keys(new.rationale_distractors)) <> cardinality(option_ids) - cardinality(resolved_keys) then raise exception 'Every distractor requires a rationale'; end if;
  if (select count(*) from jsonb_object_keys(new.option_traps)) <> cardinality(option_ids) - cardinality(resolved_keys) then raise exception 'Every distractor requires behavioral-trap metadata'; end if;
  if new.item_type = 'graphic_single_response' and new.visual_spec is null then raise exception 'Graphic items require a visual specification'; end if;
  if new.eco_task_code is null then raise exception 'Canonical ECO 2026 task mapping is required'; end if;
  select domain into mapped_domain from public.diagnostic_eco_tasks where code = new.eco_task_code;
  if mapped_domain is distinct from new.domain then raise exception 'ECO task domain does not match item domain'; end if;
  select count(distinct reviewer_id) into auditor_approval_count
    from public.diagnostic_item_content_reviews where item_id = new.id and decision = 'approved' and review_role = 'auditor';
  select count(distinct reviewer_id) into release_approval_count
    from public.diagnostic_item_content_reviews where item_id = new.id and decision = 'approved' and review_role = 'release_authority';
  if auditor_approval_count < 1 or release_approval_count < 1 then raise exception 'Recorded auditor and release-authority approvals are required'; end if;
  return new;
end;
$$;

update public.diagnostic_items
set status = 'live', reviewed_by = 'Automated final audit + platform owner authorization', updated_at = now()
where track_id = 'pmbok8';

do $$
declare
  total_count integer;
  live_count integer;
  empirical_count integer;
begin
  select count(*), count(*) filter (where status = 'live'),
    count(*) filter (where difficulty_b is not null or discrimination_a is not null)
  into total_count, live_count, empirical_count
  from public.diagnostic_items where track_id = 'pmbok8';
  if total_count <> 48 or live_count <> 48 then raise exception 'All 48 PMBOK 8 diagnostic items must be live'; end if;
  if empirical_count <> 0 then raise exception 'Uncalibrated empirical IRT values must remain NULL'; end if;
end $$;

notify pgrst, 'reload schema';
