import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { LEARNING_STEPS, TRACK_IDS } from '@/lib/pmp-path/types';
import type { TrackId } from '@/lib/pmp-path/types';
import { getTrack } from '@/lib/pmp-path/tracks';
import { flattenModules } from '@/lib/pmp-path/tracks';

function isTrackId(value: unknown): value is TrackId {
  return typeof value === 'string' && (TRACK_IDS as readonly string[]).includes(value);
}

function lessonBelongsToTrack(trackId: TrackId, lessonId: string): boolean {
  const track = getTrack(trackId);
  return flattenModules(track).some((module) =>
    module.lessons.some((lesson) => lesson.id === lessonId)
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const trackId = body?.trackId;
  const lessonId = body?.lessonId;

  if (!isTrackId(trackId) || typeof lessonId !== 'string' || lessonId.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid path progress payload' }, { status: 400 });
  }

  if (!lessonBelongsToTrack(trackId, lessonId)) {
    return NextResponse.json({ error: 'Lesson does not belong to the selected track' }, { status: 400 });
  }

  const payload = {
    status: 'completed',
    current_step: 'review',
    completed_steps: [...LEARNING_STEPS],
    updated_at: new Date().toISOString(),
  };

  const existing = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('track_id', trackId)
    .eq('lesson_id', lessonId)
    .limit(1);

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  const writeResult = existing.data && existing.data.length > 0
    ? await supabase
        .from('lesson_progress')
        .update(payload)
        .eq('user_id', user.id)
        .eq('track_id', trackId)
        .eq('lesson_id', lessonId)
        .select('lesson_id, status, current_step, completed_steps, updated_at')
    : await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          track_id: trackId,
          lesson_id: lessonId,
          practice_score: null,
          weak_point_tags: [],
          ...payload,
        })
        .select('lesson_id, status, current_step, completed_steps, updated_at');

  if (writeResult.error) {
    return NextResponse.json({ error: writeResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    progress: writeResult.data?.[0] ?? null,
  });
}
