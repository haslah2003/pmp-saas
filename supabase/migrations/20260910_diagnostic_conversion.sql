-- Learner identity, consent, and conversion analytics for the free diagnostic.
alter table public.diagnostic_sessions
  add column if not exists learner_name text,
  add column if not exists learner_email text,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists acquisition_source text;

create table if not exists public.diagnostic_conversion_events (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid,
  session_id uuid references public.diagnostic_sessions(id) on delete set null,
  event_name text not null check (event_name in ('invitation_view','invitation_dismiss','cta_click','diagnostic_view','diagnostic_start','diagnostic_submit','report_view')),
  source text,
  path text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_conversion_event_idx
  on public.diagnostic_conversion_events(event_name, created_at desc);

alter table public.diagnostic_conversion_events enable row level security;
