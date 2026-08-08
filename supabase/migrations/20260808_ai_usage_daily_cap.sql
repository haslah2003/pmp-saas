-- Per-user daily AI usage counter, used by middleware to cap paid LLM/TTS calls
-- (Anthropic / ElevenLabs) and prevent runaway cost / abuse.
-- Writes happen only server-side via the service role, so no public RLS policies
-- are needed; RLS is enabled to deny anon/auth clients by default.

create table if not exists public.ai_usage (
  user_id    uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  count      integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

alter table public.ai_usage enable row level security;

-- Optional: keep the table small — purge rows older than 30 days.
-- (Run manually or via a scheduled job; not required for correctness.)
-- delete from public.ai_usage where usage_date < current_date - interval '30 days';
