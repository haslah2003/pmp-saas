-- Lifetime free-tier Practice Lab quota: 3 questions per ECO question type.
-- One row per (user, question_type); count is cumulative and never resets.

create table if not exists public.free_practice_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_type text not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_type)
);

alter table public.free_practice_usage enable row level security;

create policy "Users read own free practice usage"
  on public.free_practice_usage for select
  using (auth.uid() = user_id);

create policy "Users insert own free practice usage"
  on public.free_practice_usage for insert
  with check (auth.uid() = user_id);

create policy "Users update own free practice usage"
  on public.free_practice_usage for update
  using (auth.uid() = user_id);
