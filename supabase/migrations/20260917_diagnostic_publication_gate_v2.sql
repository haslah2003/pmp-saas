-- Publication checks aware of multiple-response items and release roles.

alter table public.diagnostic_item_content_reviews
  add column if not exists review_role text not null default 'auditor'
    check (review_role in ('auditor','release_authority'));

create or replace function public.validate_diagnostic_item_publication()
returns trigger language plpgsql as $$
declare
  stem_words integer;
  rating_count integer;
  rating_spread numeric;
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
  select count(*), max(rating_b) - min(rating_b) into rating_count, rating_spread
    from public.diagnostic_item_difficulty_ratings where item_id = new.id;
  if rating_count < 2 then raise exception 'Two independent difficulty ratings are required'; end if;
  if rating_spread > 1 then raise exception 'Difficulty-rating disagreement requires adjudication'; end if;
  select count(distinct reviewer_id) into auditor_approval_count
    from public.diagnostic_item_content_reviews where item_id = new.id and decision = 'approved' and review_role = 'auditor';
  select count(distinct reviewer_id) into release_approval_count
    from public.diagnostic_item_content_reviews where item_id = new.id and decision = 'approved' and review_role = 'release_authority';
  if auditor_approval_count < 1 or release_approval_count < 1 then raise exception 'Auditor and release-authority approvals are required'; end if;
  return new;
end;
$$;

notify pgrst, 'reload schema';
