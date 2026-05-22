import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { LearningStep, Locale, TrackId } from '@/lib/pmp-path/types';

export interface LessonDeepDiveContent {
  id: string;
  title: string | null;
  contentMarkdown: string;
  contentVersion: number;
  sourceVersion: string;
  promptVersion: string;
  qualityStatus: string;
  qualityScore: number | null;
}

interface LessonDeepDiveRow {
  id: string;
  title: string | null;
  content_markdown: string;
  content_version: number;
  source_version: string;
  prompt_version: string;
  quality_status: string;
  quality_score: number | null;
}

interface GetApprovedLessonDeepDiveInput {
  trackId: TrackId | string;
  framework: string | null;
  moduleId: string;
  lessonId: string;
  step: LearningStep;
  locale: Locale;
}

export async function getApprovedLessonDeepDive({
  trackId,
  framework,
  moduleId,
  lessonId,
  step,
  locale,
}: GetApprovedLessonDeepDiveInput): Promise<LessonDeepDiveContent | null> {
  if (!framework) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lesson_deep_dives')
    .select(`
      id,
      title,
      content_markdown,
      content_version,
      source_version,
      prompt_version,
      quality_status,
      quality_score
    `)
    .eq('track_id', trackId)
    .eq('framework', framework)
    .eq('module_id', moduleId)
    .eq('lesson_id', lessonId)
    .eq('step', step)
    .eq('language', locale)
    .eq('quality_status', 'approved')
    .eq('is_active', true)
    .maybeSingle<LessonDeepDiveRow>();

  if (error) {
    console.error('getApprovedLessonDeepDive error:', error.message);
    return null;
  }

  if (!data?.content_markdown) return null;

  return {
    id: data.id,
    title: data.title,
    contentMarkdown: data.content_markdown,
    contentVersion: data.content_version,
    sourceVersion: data.source_version,
    promptVersion: data.prompt_version,
    qualityStatus: data.quality_status,
    qualityScore: data.quality_score,
  };
}
