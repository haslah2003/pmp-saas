/**
 * lib/pmp-path/tracks/index.ts
 * Central registry for all three pathways.
 * Add a new track by importing it here and adding it to TRACK_REGISTRY.
 */

import type { Track, TrackId, Module, Phase } from '../types';
import { PMBOK7_TRACK } from './pmbok7';
import { PMBOK8_TRACK } from './pmbok8';
import { BRIDGE_TRACK } from './bridge';

export const TRACK_REGISTRY: Record<TrackId, Track> = {
  'pmbok7-eco2021': PMBOK7_TRACK,
  'pmbok8-eco2026': PMBOK8_TRACK,
  'bridge-7-to-8': BRIDGE_TRACK,
};

export const ALL_TRACKS: Track[] = [
  PMBOK7_TRACK,
  PMBOK8_TRACK,
  BRIDGE_TRACK,
];

/** Default track for new users (the new exam structure). */
export const DEFAULT_TRACK_ID: TrackId = 'pmbok8-eco2026';

export function getTrack(trackId: TrackId): Track {
  const track = TRACK_REGISTRY[trackId];
  if (!track) {
    throw new Error(`Unknown trackId: ${trackId}`);
  }
  return track;
}

/** Flatten every module across all phases of a track, in order. */
export function flattenModules(track: Track): Module[] {
  return track.phases.flatMap((p) => p.modules);
}

/** Flatten every lesson id across all modules and phases of a track, in order. */
export function flattenLessonIds(track: Track): string[] {
  return flattenModules(track).flatMap((m) => m.lessons.map((l) => l.id));
}

/** Find the phase that owns a module. */
export function phaseOfModule(track: Track, moduleId: string): Phase | null {
  for (const phase of track.phases) {
    if (phase.modules.some((m) => m.id === moduleId)) return phase;
  }
  return null;
}

/** Find a module by id within a track. */
export function findModule(track: Track, moduleId: string): Module | null {
  for (const phase of track.phases) {
    const m = phase.modules.find((x) => x.id === moduleId);
    if (m) return m;
  }
  return null;
}

/** Cross-sell mapping — given the active track, suggest the most likely alternative. */
export interface CrossSellSuggestion {
  fromTrackId: TrackId;
  toTrackId: TrackId;
  headlineEn: string;
  headlineAr: string;
  bodyEn: string;
  bodyAr: string;
  ctaEn: string;
  ctaAr: string;
}

export const CROSS_SELL_SUGGESTIONS: Record<TrackId, CrossSellSuggestion> = {
  'pmbok7-eco2021': {
    fromTrackId: 'pmbok7-eco2021',
    toTrackId: 'bridge-7-to-8',
    headlineEn: 'Sitting the new exam after July?',
    headlineAr: 'هل ستؤدي الامتحان الجديد بعد يوليو؟',
    bodyEn: 'If your exam date falls after the July 2026 update, take the Bridge track — you already have the PMBOK 7 foundation. The Bridge focuses only on what changed: 6 new principles, the BE expansion (8% → 26%), the 5 new focus areas, and the new question style. ~21 hours.',
    bodyAr: 'إذا كان تاريخ امتحانك بعد تحديث يوليو 2026، خذ مسار الجسر — لديك بالفعل أساس PMBOK 7. يركّز الجسر فقط على ما تغيّر: 6 مبادئ جديدة، توسّع بيئة الأعمال (8% → 26%)، 5 مجالات تركيز جديدة، وأسلوب الأسئلة الجديد. ~21 ساعة.',
    ctaEn: 'Switch to Bridge 7 → 8',
    ctaAr: 'التحوّل إلى الجسر 7 → 8',
  },
  'pmbok8-eco2026': {
    fromTrackId: 'pmbok8-eco2026',
    toTrackId: 'bridge-7-to-8',
    headlineEn: 'Already know PMBOK 7?',
    headlineAr: 'هل تعرف PMBOK 7 مسبقاً؟',
    bodyEn: 'Skip the foundation — take the Bridge track instead. Just the deltas: 6 principles vs 12, new domains, new exam style. ~21 hours instead of ~44.',
    bodyAr: 'تجاوز التأسيس — خذ مسار الجسر بدلاً منه. التغيرات فقط: 6 مبادئ مقابل 12، مجالات جديدة، أسلوب امتحان جديد. ~21 ساعة بدلاً من ~44.',
    ctaEn: 'Switch to Bridge 7 → 8',
    ctaAr: 'التحوّل إلى الجسر 7 → 8',
  },
  'bridge-7-to-8': {
    fromTrackId: 'bridge-7-to-8',
    toTrackId: 'pmbok8-eco2026',
    headlineEn: 'New to PMP rather than transitioning?',
    headlineAr: 'مبتدئ في PMP بدلاً من التحوّل؟',
    bodyEn: 'If you have not prepared on PMBOK 7 before, the Bridge will leave gaps. Switch to the full PMBOK 8 + ECO 2026 track for complete coverage — ~44 hours of structured prep.',
    bodyAr: 'إذا لم تتحضّر على PMBOK 7 من قبل، سيترك الجسر فجوات. تحوّل إلى مسار PMBOK 8 + ECO 2026 الكامل للتغطية الشاملة — ~44 ساعة من التحضير المنظّم.',
    ctaEn: 'Switch to PMBOK 8 + ECO 2026',
    ctaAr: 'التحوّل إلى PMBOK 8 + ECO 2026',
  },
};

export { PMBOK7_TRACK, PMBOK8_TRACK, BRIDGE_TRACK };
