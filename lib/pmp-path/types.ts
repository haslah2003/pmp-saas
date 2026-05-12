/**
 * lib/pmp-path/types.ts
 * Canonical TypeScript contracts for My PMP Path.
 * Framework-strict: 4 phases · 7 learning steps · 1 CTA per module.
 * Multi-track: PMBOK 7 + ECO 2021 · PMBOK 8 + ECO 2026 · Bridge 7 → 8.
 */

// ============================================================
// IDs and enumerations
// ============================================================

export type TrackId = 'pmbok7-eco2021' | 'pmbok8-eco2026' | 'bridge-7-to-8';

export const TRACK_IDS: readonly TrackId[] = [
  'pmbok7-eco2021',
  'pmbok8-eco2026',
  'bridge-7-to-8',
] as const;

export type PhaseId = 'foundation' | 'mastery' | 'integration' | 'simulation';

export const PHASE_IDS: readonly PhaseId[] = [
  'foundation',
  'mastery',
  'integration',
  'simulation',
] as const;

export type LearningStep =
  | 'preview'
  | 'learn'
  | 'visualize'
  | 'apply'
  | 'practice'
  | 'explain'
  | 'review';

export const LEARNING_STEPS: readonly LearningStep[] = [
  'preview',
  'learn',
  'visualize',
  'apply',
  'practice',
  'explain',
  'review',
] as const;

export type LessonStatus =
  | 'locked'
  | 'not_started'
  | 'in_progress'
  | 'needs_review'
  | 'completed';

export type Locale = 'en' | 'ar';

export type BiLingual = { en: string; ar: string };

// ============================================================
// Content model
// ============================================================

export interface Lesson {
  /** Stable globally-unique id, e.g. "pmbok8-F1-L1" */
  id: string;
  /** Display code, e.g. "F1.L1" */
  code: string;
  title: BiLingual;
  objective: BiLingual;
  estimatedMinutes: number;
  practiceQuestionCount: number;
  mindmapRef?: string;
  reviewTags?: string[];
}

export interface Module {
  /** Stable globally-unique id, e.g. "pmbok8-F1" */
  id: string;
  /** Display code, e.g. "F1" or "M1" or "B1" or "S1" */
  code: string;
  phaseId: PhaseId;
  trackId: TrackId;
  title: BiLingual;
  description: BiLingual;
  lessons: Lesson[];
  /** Globally-unique id of the prerequisite module, or null for the first module of the track */
  prerequisiteModuleId: string | null;
  /** ECO weight for Mastery-phase modules (e.g. 33 for People in PMBOK 8) */
  ecoWeightPct?: number;
  /** Question count for Simulation-phase modules */
  questionCount?: number;
}

export interface Phase {
  id: PhaseId;
  number: 1 | 2 | 3 | 4;
  title: BiLingual;
  promise: BiLingual;
  modules: Module[];
}

export interface TrackMeta {
  id: TrackId;
  shortName: BiLingual;
  fullName: BiLingual;
  description: BiLingual;
  badgeLabel: BiLingual;
  icon: string;
  estimatedHours: number;
  moduleCount: number;
  lessonCount: number;
  ecoWeights: {
    people: number;
    process: number;
    businessEnvironment: number;
  };
  available: boolean;
}

export interface Track {
  meta: TrackMeta;
  phases: Phase[];
}

// ============================================================
// Progress model (persisted in Supabase)
// ============================================================

export interface LessonProgressRow {
  user_id: string;
  track_id: TrackId;
  lesson_id: string;
  status: LessonStatus;
  current_step: LearningStep | null;
  completed_steps: LearningStep[];
  practice_score: number | null;
  weak_point_tags: string[];
  updated_at: string;
}

export interface UserPathPrefRow {
  user_id: string;
  active_track: TrackId;
  updated_at: string;
}

// ============================================================
// Derived runtime types
// ============================================================

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentStep: LearningStep | null;
  completedSteps: LearningStep[];
  practiceScore: number | null;
  weakPointTags: string[];
}

export interface ModuleProgress {
  moduleId: string;
  status: LessonStatus;
  lessonsCompleted: number;
  lessonsTotal: number;
  percent: number;
  nextLessonId: string | null;
  nextStep: LearningStep | null;
}

export interface PhaseProgress {
  phaseId: PhaseId;
  modules: ModuleProgress[];
  percent: number;
  modulesCompleted: number;
  modulesTotal: number;
}

export interface PathProgress {
  trackId: TrackId;
  phases: PhaseProgress[];
  overallPercent: number;
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
}

export interface NextBestAction {
  kind: 'resume_lesson' | 'review_lesson' | 'start_module' | 'path_complete';
  moduleId: string;
  lessonId: string | null;
  step: LearningStep;
  rationale: BiLingual;
}
