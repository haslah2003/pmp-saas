-- Study Studio topic media
-- Maps each (framework, topic_id, language) audio/video lesson to an uploaded
-- file. Mirrors the existing course_videos + `course-videos` bucket pattern:
--   * video   -> private `course-videos` bucket, played via server-minted signed URL
--   * audio   -> public  `media` bucket, played via its public URL
-- Content is pre-produced (e.g. NotebookLM) and uploaded by an admin — no live AI.

create table if not exists public.topic_media (
  id                uuid primary key default gen_random_uuid(),
  framework         text not null check (framework in ('pmbok7', 'pmbok8', 'bridge')),
  topic_id          text not null,
  language          text not null check (language in ('en', 'ar')),
  media_type        text not null check (media_type in ('audio', 'video')),
  storage_bucket    text not null,
  storage_path      text not null,
  -- Set for public buckets (audio in `media`); NULL for private video, whose URL
  -- is minted on read as a short-lived signed URL.
  public_url        text,
  poster_url        text,
  title             text,
  duration_seconds  integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (framework, topic_id, language)
);

create index if not exists topic_media_lookup_idx
  on public.topic_media (framework, topic_id, language);

alter table public.topic_media enable row level security;

-- Any signed-in learner may read the mapping (playback is additionally gated to
-- premium in the /api/study-media route).
drop policy if exists "topic_media_read_authenticated" on public.topic_media;
create policy "topic_media_read_authenticated" on public.topic_media
  for select to authenticated using (true);

-- Only admins may create / update / delete mappings.
drop policy if exists "topic_media_admin_all" on public.topic_media;
create policy "topic_media_admin_all" on public.topic_media
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Keep updated_at fresh on edits.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists topic_media_touch on public.topic_media;
create trigger topic_media_touch
  before update on public.topic_media
  for each row execute function public.touch_updated_at();

-- Allow admins to upload/replace objects under study-media/ in the private
-- `course-videos` bucket (the public `media` bucket already permits admin
-- uploads via the Media Library). Wrapped so the migration never fails if it
-- lacks privilege on storage.objects — add it via Dashboard > Storage > Policies
-- in that case.
do $$
begin
  begin
    drop policy if exists "study_media_admin_write_course_videos" on storage.objects;
    create policy "study_media_admin_write_course_videos" on storage.objects
      for all to authenticated
      using (
        bucket_id = 'course-videos'
        and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      )
      with check (
        bucket_id = 'course-videos'
        and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
      );
  exception
    when insufficient_privilege then
      raise notice 'Skipped storage policy (insufficient privilege) — add admin write on course-videos via Dashboard > Storage > Policies';
  end;
end $$;
