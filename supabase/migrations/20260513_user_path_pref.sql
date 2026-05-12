-- ============================================================
-- 20260513_user_path_pref.sql
-- Table: user_path_pref
-- Purpose: store each user's active track so the TrackTabs persists across sessions
-- Requires: 20260512_lesson_progress.sql (the pmp_track_id enum)
-- ============================================================

create table if not exists user_path_pref (
  user_id        uuid          primary key references auth.users(id) on delete cascade,
  active_track   pmp_track_id  not null default 'pmbok8-eco2026',
  updated_at     timestamptz   not null default now()
);

-- Touch updated_at on update
create or replace function user_path_pref_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists user_path_pref_touch_updated_at_trg on user_path_pref;
create trigger user_path_pref_touch_updated_at_trg
  before update on user_path_pref
  for each row
  execute function user_path_pref_touch_updated_at();

-- Row-Level Security: owner-only
alter table user_path_pref enable row level security;

drop policy if exists user_path_pref_select_own on user_path_pref;
create policy user_path_pref_select_own
  on user_path_pref
  for select
  using (auth.uid() = user_id);

drop policy if exists user_path_pref_insert_own on user_path_pref;
create policy user_path_pref_insert_own
  on user_path_pref
  for insert
  with check (auth.uid() = user_id);

drop policy if exists user_path_pref_update_own on user_path_pref;
create policy user_path_pref_update_own
  on user_path_pref
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists user_path_pref_delete_own on user_path_pref;
create policy user_path_pref_delete_own
  on user_path_pref
  for delete
  using (auth.uid() = user_id);

comment on table user_path_pref is
  'Per-user active-track preference for /dashboard/path. Defaults to pmbok8-eco2026.';
