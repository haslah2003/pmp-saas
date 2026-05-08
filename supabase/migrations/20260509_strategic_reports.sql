create extension if not exists pgcrypto;

create table if not exists public.strategic_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid null references public.practice_sessions(id) on delete set null,
  framework text null,
  active_route text not null default 'pmbok7',
  cycle_number integer not null default 1,
  block_number integer not null,
  report_title text null,
  route_label text null,
  readiness_score integer null,
  overall_correct integer null,
  overall_total integer null,
  overall_pct integer null,
  report_payload jsonb not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists strategic_reports_user_created_idx
  on public.strategic_reports (user_id, created_at desc);

create index if not exists strategic_reports_session_idx
  on public.strategic_reports (session_id);

alter table public.strategic_reports enable row level security;

drop policy if exists "Users can view own strategic reports"
  on public.strategic_reports;

create policy "Users can view own strategic reports"
  on public.strategic_reports
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own strategic reports"
  on public.strategic_reports;

create policy "Users can insert own strategic reports"
  on public.strategic_reports
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own strategic reports"
  on public.strategic_reports;

create policy "Users can update own strategic reports"
  on public.strategic_reports
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
