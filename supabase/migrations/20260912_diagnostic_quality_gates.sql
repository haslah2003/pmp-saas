-- ECO 2026 traceability and independent content-approval controls.

create table if not exists public.diagnostic_eco_tasks (
  code text primary key,
  domain text not null check (domain in ('people','process','business_environment')),
  task_number integer not null check (task_number > 0),
  task_statement text not null,
  source_version text not null default 'PMI PMP ECO July 2026',
  unique (domain, task_number)
);

insert into public.diagnostic_eco_tasks (code, domain, task_number, task_statement) values
  ('PPL-1','people',1,'Develop a common vision'),
  ('PPL-2','people',2,'Manage conflicts'),
  ('PPL-3','people',3,'Lead the project team'),
  ('PPL-4','people',4,'Engage stakeholders'),
  ('PPL-5','people',5,'Align stakeholder expectations'),
  ('PPL-6','people',6,'Manage stakeholder expectations'),
  ('PPL-7','people',7,'Help ensure knowledge transfer'),
  ('PPL-8','people',8,'Plan and manage communication'),
  ('PRC-1','process',1,'Develop an integrated project management plan and plan delivery'),
  ('PRC-2','process',2,'Develop and manage project scope'),
  ('PRC-3','process',3,'Help ensure value-based delivery'),
  ('PRC-4','process',4,'Plan and manage resources'),
  ('PRC-5','process',5,'Plan and manage procurement'),
  ('PRC-6','process',6,'Plan and manage finance'),
  ('PRC-7','process',7,'Plan and optimize quality of products/deliverables'),
  ('PRC-8','process',8,'Plan and manage schedule'),
  ('PRC-9','process',9,'Evaluate project status'),
  ('PRC-10','process',10,'Manage project closure'),
  ('BEN-1','business_environment',1,'Define and establish project governance'),
  ('BEN-2','business_environment',2,'Plan and manage project compliance'),
  ('BEN-3','business_environment',3,'Manage and control changes'),
  ('BEN-4','business_environment',4,'Remove impediments and manage issues'),
  ('BEN-5','business_environment',5,'Plan and manage risk'),
  ('BEN-6','business_environment',6,'Continuous improvement'),
  ('BEN-7','business_environment',7,'Support organizational change'),
  ('BEN-8','business_environment',8,'Evaluate external business environment changes')
on conflict (code) do update set
  domain = excluded.domain,
  task_number = excluded.task_number,
  task_statement = excluded.task_statement,
  source_version = excluded.source_version;

alter table public.diagnostic_items
  add column if not exists eco_task_code text references public.diagnostic_eco_tasks(code);

create table if not exists public.diagnostic_item_content_reviews (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.diagnostic_items(id) on delete cascade,
  reviewer_id text not null,
  reviewer_credential text not null,
  decision text not null check (decision in ('approved','revise','reject')),
  notes text,
  created_at timestamptz not null default now(),
  unique (item_id, reviewer_id)
);

alter table public.diagnostic_eco_tasks enable row level security;
alter table public.diagnostic_item_content_reviews enable row level security;

drop policy if exists "Public reads diagnostic ECO task map" on public.diagnostic_eco_tasks;
create policy "Public reads diagnostic ECO task map" on public.diagnostic_eco_tasks
  for select using (true);
drop policy if exists "Admins manage diagnostic ECO task map" on public.diagnostic_eco_tasks;
create policy "Admins manage diagnostic ECO task map" on public.diagnostic_eco_tasks
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
drop policy if exists "Admins manage diagnostic content reviews" on public.diagnostic_item_content_reviews;
create policy "Admins manage diagnostic content reviews" on public.diagnostic_item_content_reviews
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create index if not exists diagnostic_items_eco_task_code_idx
  on public.diagnostic_items(eco_task_code);

create or replace function public.validate_diagnostic_item_publication()
returns trigger language plpgsql as $$
declare
  stem_words integer;
  rating_count integer;
  rating_spread numeric;
  approval_count integer;
  option_ids text[];
  mapped_domain text;
begin
  if new.status <> 'live' then return new; end if;
  stem_words := cardinality(regexp_split_to_array(trim(new.stem), '\s+'));
  if stem_words < 40 or stem_words > 120 then raise exception 'Diagnostic stem must contain 40-120 words'; end if;
  if new.readability_grade > 12 then raise exception 'Diagnostic readability grade must be 12 or below'; end if;
  if new.stem ~* '\m(which|what)\M.{0,30}\mnot\M|\mexcept\M' then raise exception 'Negative stems are prohibited'; end if;
  -- Valid item mechanics include decisions, diagnoses, artifact identification,
  -- interpretation, and policy application; do not force one stem pattern.
  select array_agg(value->>'id') into option_ids from jsonb_array_elements(new.options);
  if array_length(option_ids, 1) <> 4 or cardinality(array(select distinct unnest(option_ids))) <> 4 then
    raise exception 'Exactly four uniquely identified options are required';
  end if;
  if not (option_ids @> array[new.key]) then raise exception 'Item key does not identify an option'; end if;
  if (select count(*) from jsonb_object_keys(new.rationale_distractors)) <> 3 then raise exception 'Three distractor rationales are required'; end if;
  if new.eco_task_code is null then raise exception 'Canonical ECO 2026 task mapping is required'; end if;
  select domain into mapped_domain from public.diagnostic_eco_tasks where code = new.eco_task_code;
  if mapped_domain is distinct from new.domain then raise exception 'ECO task domain does not match item domain'; end if;
  select count(*), max(rating_b) - min(rating_b) into rating_count, rating_spread
    from public.diagnostic_item_difficulty_ratings where item_id = new.id;
  if rating_count < 2 then raise exception 'Two independent difficulty ratings are required'; end if;
  if rating_spread > 1 then raise exception 'Difficulty-rating disagreement requires adjudication'; end if;
  select count(distinct reviewer_id) into approval_count
    from public.diagnostic_item_content_reviews where item_id = new.id and decision = 'approved';
  if approval_count < 2 then raise exception 'Two independent content approvals are required'; end if;
  return new;
end;
$$;

notify pgrst, 'reload schema';
