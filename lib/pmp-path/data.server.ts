/**
 * lib/pmp-path/data.server.ts
 * Server-only Supabase fetcher for the My PMP Path page.
 *
 * IMPORTANT: adjust the `createClient` import path on line 16 if your
 * project's Supabase helper lives elsewhere (e.g. '@/utils/supabase/server').
 */

import 'server-only';

import type {
  LessonProgress,
  LessonProgressRow,
  PathProgress,
  Track,
  TrackId,
  UserPathPrefRow,
  NextBestAction,
} from './types';
import { TRACK_IDS } from './types';
import { getTrack, DEFAULT_TRACK_ID } from './tracks';
import { derivePathProgress, deriveNextBestAction } from './progress';

import { createClient } from '@/lib/supabase/server';

export interface PathDataResult {
  track: Track;
  activeTrackId: TrackId;
  progress: PathProgress;
  nextBestAction: NextBestAction;
  isAuthenticated: boolean;
}

/** Validate that the trackId string is one of the known TrackId values. */
function isTrackId(s: string | null | undefined): s is TrackId {
  return typeof s === 'string' && (TRACK_IDS as readonly string[]).includes(s);
}

/**
 * Fetch path data for the current user on the given track.
 * If `requestedTrackId` is null, falls back to the user's stored preference,
 * and ultimately to DEFAULT_TRACK_ID.
 *
 * Anonymous users (not authenticated) get a clean, empty progress on the requested
 * or default track — the page should still render with everything locked except F1/B1.
 */
export async function getPathDataForUser(
  requestedTrackId?: string | null
): Promise<PathDataResult> {
  const supabase = await createClient();

  // 1) Resolve current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);

  // 2) Resolve active track
  let activeTrackId: TrackId = DEFAULT_TRACK_ID;

  if (isTrackId(requestedTrackId)) {
    activeTrackId = requestedTrackId;
  } else if (user) {
    const { data: prefRow } = await supabase
      .from('user_path_pref')
      .select('active_track')
      .eq('user_id', user.id)
      .maybeSingle<Pick<UserPathPrefRow, 'active_track'>>();

    if (prefRow?.active_track && isTrackId(prefRow.active_track)) {
      activeTrackId = prefRow.active_track;
    }
  }

  const track = getTrack(activeTrackId);

  // 3) Load lesson progress for this user on this track
  let lessonProgress: LessonProgress[] = [];

  if (user) {
    const { data: rows, error } = await supabase
      .from('lesson_progress')
      .select(
        'lesson_id, status, current_step, completed_steps, practice_score, weak_point_tags'
      )
      .eq('user_id', user.id)
      .eq('track_id', activeTrackId);

    if (!error && rows) {
      lessonProgress = (rows as Pick<
        LessonProgressRow,
        | 'lesson_id'
        | 'status'
        | 'current_step'
        | 'completed_steps'
        | 'practice_score'
        | 'weak_point_tags'
      >[]).map((r) => ({
        lessonId: r.lesson_id,
        status: r.status,
        currentStep: r.current_step,
        completedSteps: r.completed_steps ?? [],
        practiceScore: r.practice_score,
        weakPointTags: r.weak_point_tags ?? [],
      }));
    }
  }

  // 4) Derive progress + Best Next Action
  const progress = derivePathProgress(track, lessonProgress);
  const nextBestAction = deriveNextBestAction(track, progress);

  return {
    track,
    activeTrackId,
    progress,
    nextBestAction,
    isAuthenticated,
  };
}

/**
 * Persist the user's active-track choice. Call this from a Server Action
 * triggered by clicking a tab in TrackTabs.
 */
export async function setActiveTrackForUser(trackId: TrackId): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_path_pref')
    .upsert(
      { user_id: user.id, active_track: trackId, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
}
