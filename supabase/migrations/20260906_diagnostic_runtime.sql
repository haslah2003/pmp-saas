-- Runtime persistence. All access is through service-role API routes; RLS denies direct clients.
create table if not exists public.diagnostic_forms (
  id uuid primary key default gen_random_uuid(),
  track_id text not null references public.diagnostic_tracks(id),
  form_length integer not null check (form_length in (25,60)),
  form_seed text not null,
  blueprint jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_form_items (
  form_id uuid not null references public.diagnostic_forms(id) on delete cascade,
  item_id uuid not null references public.diagnostic_items(id),
  position integer not null check (position > 0),
  option_order text[] not null check (cardinality(option_order) = 4),
  primary key (form_id, item_id),
  unique (form_id, position)
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  form_id uuid not null references public.diagnostic_forms(id),
  locale text not null default 'en' check (locale in ('en','ar')),
  status text not null default 'in_progress' check (status in ('in_progress','submitted','expired')),
  current_position integer not null default 1 check (current_position > 0),
  flagged_item_ids uuid[] not null default '{}',
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  submitted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '24 months')
);

create table if not exists public.diagnostic_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  form_id uuid not null references public.diagnostic_forms(id) on delete cascade,
  item_id uuid not null references public.diagnostic_items(id),
  selected_option char(1) check (selected_option in ('A','B','C','D')),
  presented_order text[] not null check (cardinality(presented_order) = 4),
  seconds_on_item integer not null default 0 check (seconds_on_item >= 0),
  answered_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (session_id, item_id)
);

create index if not exists diagnostic_sessions_resume_idx on public.diagnostic_sessions(candidate_id,status,last_activity_at desc);
create index if not exists diagnostic_responses_exposure_idx on public.diagnostic_responses(item_id,answered_at);
alter table public.diagnostic_forms enable row level security;
alter table public.diagnostic_form_items enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.diagnostic_responses enable row level security;
