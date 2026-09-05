-- Manual release gate for Study Studio Media.
-- A framework remains hidden from every subscription until an admin explicitly
-- enables it after all English and Arabic topic slots have been populated.

create table if not exists public.study_media_availability (
  framework   text primary key check (framework in ('pmbok7', 'pmbok8', 'bridge')),
  enabled     boolean not null default false,
  enabled_at  timestamptz,
  enabled_by  uuid references auth.users(id) on delete set null,
  updated_at  timestamptz not null default now()
);

alter table public.study_media_availability enable row level security;

drop policy if exists "study_media_availability_read_authenticated" on public.study_media_availability;
create policy "study_media_availability_read_authenticated" on public.study_media_availability
  for select to authenticated using (true);

drop policy if exists "study_media_availability_admin_all" on public.study_media_availability;
create policy "study_media_availability_admin_all" on public.study_media_availability
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop trigger if exists study_media_availability_touch on public.study_media_availability;
create trigger study_media_availability_touch
  before update on public.study_media_availability
  for each row execute function public.touch_updated_at();

-- Preserve the completed, currently-live PMBOK 8 library. Incomplete pathways
-- remain unavailable until an admin releases them from Study Studio Media.
insert into public.study_media_availability (framework, enabled, enabled_at)
values
  ('pmbok8', true, now()),
  ('bridge', false, null),
  ('pmbok7', false, null)
on conflict (framework) do nothing;
