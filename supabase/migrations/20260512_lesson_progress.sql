-- ============================================================
-- 20260512_lesson_progress.sql
-- Table: lesson_progress
-- Purpose: persist per-user per-track per-lesson progress in the 7-step loop
-- ============================================================

-- Status of a lesson within a module
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lesson_status') then
    create type lesson_status as enum (
      'locked',
      'not_started',
      'in_progress',
      'needs_review',
      'completed'
    );
  end if;
end$$;

-- Step within the 7-step learning loop
do $$
begin
  if not exists (select 1 from pg_type where typname = 'learning_step') then
    create type learning_step as enum (
      'preview',
      'learn',
      'visualize',
      'apply',
      'practice',
      'explain',
      'review'
    );
  end if;
end$$;

-- Track id — must match TrackId in lib/pmp-path/types.ts
do $$
begin
  if not exists (select 1 from pg_type where typname = 'pmp_track_id') then
    create type pmp_track_id as enum (
      'pmbok7-eco2021',
      'pmbok8-eco2026',
      'bridge-7-to-8'
    );
  end if;
end$$;

create table if not exists lesson_progress (
  user_id          uuid           not null references auth.users(id) on delete cascade,
  track_id         pmp_track_id   not null,
  lesson_id        text           not null,
  status           lesson_status  not null default 'not_started',
  current_step     learning_step,
  completed_steps  learning_step[] not null default '{}',
  practice_score   numeric(5,2),  -- 0.00 to 100.00
  weak_point_tags  text[]         not null default '{}',
  updated_at       timestamptz    not null default now(),

  primary key (user_id, track_id, lesson_id)
);

create index if not exists lesson_progress_user_track_idx
  on lesson_progress (user_id, track_id);

create index if not exists lesson_progress_user_status_idx
  on lesson_progress (user_id, status);

-- Touch updated_at on update
create or replace function lesson_progress_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists lesson_progress_touch_updated_at_trg on lesson_progress;
create trigger lesson_progress_touch_updated_at_trg
  before update on lesson_progress
  for each row
  execute function lesson_progress_touch_updated_at();

-- Row-Level Security: a user can only see and mutate their own rows
alter table lesson_progress enable row level security;

drop policy if exists lesson_progress_select_own on lesson_progress;
create policy lesson_progress_select_own
  on lesson_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists lesson_progress_insert_own on lesson_progress;
create policy lesson_progress_insert_own
  on lesson_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists lesson_progress_update_own on lesson_progress;
create policy lesson_progress_update_own
  on lesson_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists lesson_progress_delete_own on lesson_progress;
create policy lesson_progress_delete_own
  on lesson_progress
  for delete
  using (auth.uid() = user_id);

comment on table lesson_progress is
  'Per-user, per-track, per-lesson progress through the 7-step PMP learning loop.';
comment on column lesson_progress.track_id is
  'Track identifier — matches TrackId in lib/pmp-path/types.ts.';
comment on column lesson_progress.lesson_id is
  'Global lesson id, e.g. "pmbok8-eco2026-F1-F1.L1". Stable across deployments.';
