-- Track-ready foundation for the PMP Readiness Diagnostic.
-- This migration is additive and does not alter the existing practice bank.

create table if not exists public.diagnostic_tracks (
  id text primary key,
  label text not null,
  blueprint_version text not null,
  domain_weights jsonb not null,
  approach_weights jsonb not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(domain_weights) = 'object'),
  check (jsonb_typeof(approach_weights) = 'object')
);

insert into public.diagnostic_tracks (id, label, blueprint_version, domain_weights, approach_weights, active)
values
  ('pmbok8', 'PMBOK 8 / ECO 2026', 'official-2026-v1', '{"people":0.33,"process":0.41,"business_environment":0.26}', '{"predictive":0.40,"agile":0.30,"hybrid":0.30}', true),
  ('pmbok7', 'PMBOK 7 / ECO 2021', 'reserved', '{}', '{}', false),
  ('bridge', 'PMBOK 7 to PMBOK 8 Bridge', 'reserved', '{}', '{}', false)
on conflict (id) do nothing;

create table if not exists public.diagnostic_items (
  id uuid primary key default gen_random_uuid(),
  track_id text not null references public.diagnostic_tracks(id),
  source_question_id uuid references public.questions(id) on delete set null,
  stem text not null,
  options jsonb not null,
  key char(1) not null check (key in ('A','B','C','D')),
  domain text not null check (domain in ('people','process','business_environment')),
  approach text not null check (approach in ('predictive','agile','hybrid')),
  eco_task text not null,
  cognitive_level text not null check (cognitive_level in ('recall','application','analysis')),
  rationale_correct text not null,
  rationale_distractors jsonb not null,
  readability_grade numeric(5,2) not null,
  difficulty_b numeric(5,2),
  discrimination_a numeric(5,2),
  status text not null default 'draft' check (status in ('draft','review','live','retired')),
  exposure_count integer not null default 0 check (exposure_count >= 0),
  p_value numeric(6,5) check (p_value between 0 and 1),
  point_biserial numeric(6,5) check (point_biserial between -1 and 1),
  authored_by text not null,
  reviewed_by text,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  check (jsonb_typeof(rationale_distractors) = 'object')
);

create table if not exists public.diagnostic_item_difficulty_ratings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.diagnostic_items(id) on delete cascade,
  reviewer_id text not null,
  reviewer_credential text not null,
  rating_b numeric(4,2) not null check (rating_b between -3 and 3),
  created_at timestamptz not null default now(),
  unique (item_id, reviewer_id)
);

create or replace function public.validate_diagnostic_item_publication()
returns trigger language plpgsql as $$
declare
  stem_words integer;
  rating_count integer;
  rating_spread numeric;
  option_ids text[];
begin
  if new.status <> 'live' then return new; end if;
  stem_words := cardinality(regexp_split_to_array(trim(new.stem), '\s+'));
  if stem_words < 40 or stem_words > 120 then raise exception 'Diagnostic stem must contain 40-120 words'; end if;
  if new.readability_grade > 12 then raise exception 'Diagnostic readability grade must be 12 or below'; end if;
  if new.stem ~* '\m(which|what)\M.{0,30}\mnot\M|\mexcept\M' then raise exception 'Negative stems are prohibited'; end if;
  if new.stem !~* '\m(next|first|best)\M' then raise exception 'Stem must ask for the next, first, or best response'; end if;
  select array_agg(value->>'id') into option_ids from jsonb_array_elements(new.options);
  if array_length(option_ids, 1) <> 4 or cardinality(array(select distinct unnest(option_ids))) <> 4 then
    raise exception 'Exactly four uniquely identified options are required';
  end if;
  if not (option_ids @> array[new.key]) then raise exception 'Item key does not identify an option'; end if;
  if jsonb_object_length(new.rationale_distractors) <> 3 then raise exception 'Three distractor rationales are required'; end if;
  select count(*), max(rating_b) - min(rating_b) into rating_count, rating_spread
    from public.diagnostic_item_difficulty_ratings where item_id = new.id;
  if rating_count < 2 then raise exception 'Two independent difficulty ratings are required'; end if;
  if rating_spread > 1 then raise exception 'Difficulty-rating disagreement requires adjudication'; end if;
  return new;
end;
$$;

drop trigger if exists diagnostic_item_publication_guard on public.diagnostic_items;
create trigger diagnostic_item_publication_guard before insert or update of status on public.diagnostic_items
for each row execute function public.validate_diagnostic_item_publication();

create index if not exists diagnostic_items_assembly_idx on public.diagnostic_items(track_id, status, domain, approach, cognitive_level);
create index if not exists diagnostic_items_exposure_idx on public.diagnostic_items(track_id, status, exposure_count);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.diagnostic_tracks enable row level security;
alter table public.diagnostic_items enable row level security;
alter table public.diagnostic_item_difficulty_ratings enable row level security;

create policy "Public reads active diagnostic tracks" on public.diagnostic_tracks for select using (active = true);
create policy "Public reads live diagnostic item shells" on public.diagnostic_items for select using (false);
create policy "Admins manage diagnostic tracks" on public.diagnostic_tracks for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins manage diagnostic items" on public.diagnostic_items for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins manage diagnostic ratings" on public.diagnostic_item_difficulty_ratings for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop trigger if exists diagnostic_items_touch on public.diagnostic_items;
create trigger diagnostic_items_touch before update on public.diagnostic_items
for each row execute function public.touch_updated_at();
