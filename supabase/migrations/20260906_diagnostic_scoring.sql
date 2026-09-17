alter table public.diagnostic_responses add column if not exists correct boolean;

create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.diagnostic_sessions(id) on delete cascade,
  strategy text not null,
  strategy_version text not null,
  weighted_score numeric(8,6) not null check (weighted_score between 0 and 1),
  theta numeric(10,6) not null,
  standard_error numeric(10,6) not null check (standard_error >= 0),
  readiness_band text not null check (readiness_band in ('exam_ready','near_ready','developing','early_stage')),
  pass_probability_internal numeric(8,6) not null check (pass_probability_internal between 0 and 1),
  domain_scores jsonb not null,
  eco_task_gaps jsonb not null,
  disclaimer_version text not null default 'independent-instrument-v1',
  scored_at timestamptz not null default now()
);

alter table public.diagnostic_results enable row level security;
