-- Keep all premium Study Studio audio/video in a private bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-media', 'study-media', false, 524288000,
  array[
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/webm', 'audio/ogg',
    'image/png', 'image/jpeg', 'image/webp'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "study_media_admin_write_private" on storage.objects;
create policy "study_media_admin_write_private" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'study-media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bucket_id = 'study-media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

update public.topic_media set public_url = null where storage_bucket = 'study-media';
