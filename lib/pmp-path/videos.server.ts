import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { LearningStep, Locale } from '@/lib/pmp-path/types';
import type { LessonVideo } from '@/lib/pmp-path/videos';

const COURSE_VIDEO_BUCKET = 'course-videos';
const SIGNED_URL_TTL_SECONDS = 60 * 60;

interface GetLessonVideosInput {
  framework: string | null;
  moduleId: string;
  lessonId: string;
  step: LearningStep;
  locale: Locale;
}

interface CourseVideoRow {
  id: string;
  framework: string;
  module_id: string;
  lesson_id: string;
  step: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  duration_seconds: number | null;
  language: string;
  sort_order: number;
}

export function frameworkFromModuleId(moduleId: string): string | null {
  if (moduleId.startsWith('pmbok8-')) return 'pmbok8';
  if (moduleId.startsWith('pmbok7-')) return 'pmbok7';
  if (moduleId.startsWith('bridge-')) return 'bridge';

  return null;
}

async function createSignedStorageUrl(path: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(COURSE_VIDEO_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('course video signed URL error:', error.message);
    return null;
  }

  return data?.signedUrl ?? null;
}

export async function getLessonVideos({
  framework,
  moduleId,
  lessonId,
  step,
  locale,
}: GetLessonVideosInput): Promise<LessonVideo[]> {
  const supabase = await createClient();

  let query = supabase
    .from('course_videos')
    .select(`
      id,
      framework,
      module_id,
      lesson_id,
      step,
      title_en,
      title_ar,
      description_en,
      description_ar,
      storage_path,
      thumbnail_path,
      duration_seconds,
      language,
      sort_order
    `)
    .eq('is_active', true)
    .eq('module_id', moduleId)
    .eq('lesson_id', lessonId)
    .eq('step', step)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (framework) {
    query = query.eq('framework', framework);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getLessonVideos error:', error.message);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  const videos = await Promise.all(
    ((data ?? []) as unknown as CourseVideoRow[]).map(async (row) => {
      const videoUrl = await createSignedStorageUrl(row.storage_path);

      if (!videoUrl) {
        return null;
      }

      const thumbnailUrl = row.thumbnail_path
        ? await createSignedStorageUrl(row.thumbnail_path)
        : null;

      const title =
        locale === 'ar'
          ? row.title_ar || row.title_en
          : row.title_en || row.title_ar || 'Lesson video';

      const description =
        locale === 'ar'
          ? row.description_ar || row.description_en
          : row.description_en || row.description_ar;

      return {
        id: row.id,
        framework: row.framework,
        moduleId: row.module_id,
        lessonId: row.lesson_id,
        step: row.step,
        title,
        description,
        storagePath: row.storage_path,
        thumbnailPath: row.thumbnail_path,
        durationSeconds: row.duration_seconds,
        language: row.language,
        sortOrder: row.sort_order,
        videoUrl,
        thumbnailUrl,
      } satisfies LessonVideo;
    })
  );

  return videos.filter((video): video is LessonVideo => video !== null);
}
