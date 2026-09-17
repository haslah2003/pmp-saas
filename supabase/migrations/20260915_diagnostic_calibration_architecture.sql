-- Separate author assembly bands from empirical psychometric parameters and
-- prepare response telemetry for richer item formats and behavioral traps.

alter table public.diagnostic_items
  add column if not exists author_difficulty_band text
    check (author_difficulty_band in ('foundational','intermediate','advanced')),
  add column if not exists item_type text not null default 'single_response'
    check (item_type in ('single_response','multiple_response','graphic_single_response')),
  add column if not exists answer_keys text[],
  add column if not exists visual_spec jsonb,
  add column if not exists option_traps jsonb not null default '{}'::jsonb;

update public.diagnostic_items set
  author_difficulty_band = case
    when difficulty_b < -0.5 then 'foundational'
    when difficulty_b > 0.5 then 'advanced'
    else 'intermediate'
  end,
  answer_keys = array[key::text]
where author_difficulty_band is null or answer_keys is null;

alter table public.diagnostic_items
  alter column author_difficulty_band set not null,
  alter column answer_keys set not null;

-- Author estimates are not empirical IRT parameters.
update public.diagnostic_items set difficulty_b = null, discrimination_a = null;

alter table public.diagnostic_responses
  add column if not exists selected_options text[],
  add column if not exists selected_traps jsonb not null default '[]'::jsonb;

update public.diagnostic_responses
set selected_options = case when selected_option is null then '{}'::text[] else array[selected_option::text] end
where selected_options is null;

create table if not exists public.diagnostic_item_calibration (
  item_id uuid primary key references public.diagnostic_items(id) on delete cascade,
  sample_size integer not null default 0 check (sample_size >= 0),
  p_value numeric(6,5) check (p_value between 0 and 1),
  point_biserial numeric(6,5) check (point_biserial between -1 and 1),
  difficulty_b numeric(7,4),
  discrimination_a numeric(7,4),
  review_status text not null default 'collecting'
    check (review_status in ('collecting','review_required','accepted')),
  last_calculated_at timestamptz
);

alter table public.diagnostic_item_calibration enable row level security;
drop policy if exists "Admins manage diagnostic calibration" on public.diagnostic_item_calibration;
create policy "Admins manage diagnostic calibration" on public.diagnostic_item_calibration
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

notify pgrst, 'reload schema';
