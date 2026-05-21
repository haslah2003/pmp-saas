/**
 * lib/pmp-path/progress.ts
 * Pure functions for deriving path progress and the Best Next Action.
 * No I/O, no side effects — easy to test.
 */

import type {
  LearningStep,
  LessonProgress,
  LessonStatus,
  ModuleProgress,
  NextBestAction,
  PathProgress,
  Phase,
  PhaseProgress,
  Track,
} from './types';
import { LEARNING_STEPS } from './types';
import { flattenModules } from './tracks';

// ============================================================
// Next-step helper
// ============================================================

/** Return the next learning step in the 7-step loop, or null if we're done. */
export function nextStep(current: LearningStep | null): LearningStep | null {
  if (current === null) return 'preview';
  const idx = LEARNING_STEPS.indexOf(current);
  if (idx < 0 || idx === LEARNING_STEPS.length - 1) return null;
  return LEARNING_STEPS[idx + 1];
}

// ============================================================
// Module-level derivation
// ============================================================

function deriveModuleProgress(
  lessons: { id: string }[],
  progressByLessonId: Map<string, LessonProgress>,
  isModuleUnlocked: boolean
): ModuleProgress {
  const total = lessons.length;
  let completed = 0;
  let firstUnfinishedLessonId: string | null = null;
  let firstUnfinishedStep: LearningStep | null = null;
  let firstUnfinishedCompletedSteps: LearningStep[] = [];
  let hasInProgress = false;
  let hasNeedsReview = false;

  for (const lesson of lessons) {
    const p = progressByLessonId.get(lesson.id);
    if (!p || p.status === 'not_started') {
      if (firstUnfinishedLessonId === null) {
        firstUnfinishedLessonId = lesson.id;
        firstUnfinishedStep = 'preview';
        firstUnfinishedCompletedSteps = [];
      }
    } else if (p.status === 'completed') {
      completed++;
    } else if (p.status === 'in_progress') {
      hasInProgress = true;
      if (firstUnfinishedLessonId === null) {
        firstUnfinishedLessonId = lesson.id;
        firstUnfinishedStep = p.currentStep ?? 'preview';
        firstUnfinishedCompletedSteps = p.completedSteps ?? [];
      }
    } else if (p.status === 'needs_review') {
      hasNeedsReview = true;
      if (firstUnfinishedLessonId === null) {
        firstUnfinishedLessonId = lesson.id;
        firstUnfinishedStep = 'review';
        firstUnfinishedCompletedSteps = p.completedSteps ?? [];
      }
    }
  }

  let status: LessonStatus;
  if (!isModuleUnlocked) {
    status = 'locked';
  } else if (completed === total) {
    status = 'completed';
  } else if (hasInProgress) {
    status = 'in_progress';
  } else if (hasNeedsReview) {
    status = 'needs_review';
  } else if (completed > 0) {
    status = 'in_progress';
  } else {
    status = 'not_started';
  }

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    moduleId: '',
    status,
    lessonsCompleted: completed,
    lessonsTotal: total,
    percent,
    nextLessonId: firstUnfinishedLessonId,
    nextStep: firstUnfinishedStep,
    completedSteps: status === 'completed' ? [...LEARNING_STEPS] : firstUnfinishedCompletedSteps,
  };
}

// ============================================================
// Path-level derivation
// ============================================================

export function derivePathProgress(
  track: Track,
  lessonProgressRows: LessonProgress[]
): PathProgress {
  const progressByLessonId = new Map<string, LessonProgress>();
  for (const row of lessonProgressRows) {
    progressByLessonId.set(row.lessonId, row);
  }

  const orderedModules = flattenModules(track);
  // We walk modules in order, only unlocking a module if its prerequisite is fully completed.
  const moduleStatusById = new Map<string, ModuleProgress>();

  for (const mod of orderedModules) {
    const prereqId = mod.prerequisiteModuleId;
    const unlocked =
      prereqId === null ||
      moduleStatusById.get(prereqId)?.status === 'completed';
    const mp = deriveModuleProgress(mod.lessons, progressByLessonId, unlocked);
    mp.moduleId = mod.id;
    moduleStatusById.set(mod.id, mp);
  }

  const phaseProgress: PhaseProgress[] = track.phases.map((phase: Phase) => {
    const moduleStats = phase.modules.map(
      (m) => moduleStatusById.get(m.id)!
    );
    const modulesCompleted = moduleStats.filter(
      (m) => m.status === 'completed'
    ).length;
    const totalLessons = phase.modules.reduce(
      (s, m) => s + m.lessons.length,
      0
    );
    const completedLessons = moduleStats.reduce(
      (s, m) => s + m.lessonsCompleted,
      0
    );
    return {
      phaseId: phase.id,
      modules: moduleStats,
      percent:
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100),
      modulesCompleted,
      modulesTotal: phase.modules.length,
    };
  });

  const totalLessons = orderedModules.reduce(
    (s, m) => s + m.lessons.length,
    0
  );
  const completedLessons = Array.from(moduleStatusById.values()).reduce(
    (s, m) => s + m.lessonsCompleted,
    0
  );
  const totalMinutes = orderedModules.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0),
    0
  );

  return {
    trackId: track.meta.id,
    phases: phaseProgress,
    overallPercent:
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100),
    totalLessons,
    completedLessons,
    totalHours: Math.round(totalMinutes / 60),
  };
}

// ============================================================
// Best Next Action
// ============================================================

/**
 * Decision table (first match wins):
 *  1. resume in_progress         → first in_progress module
 *  2. review needs_review        → first needs_review module
 *  3. start next not_started     → first unlocked, not-started module
 *  4. path_complete              → everything done
 */
export function deriveNextBestAction(
  track: Track,
  path: PathProgress
): NextBestAction {
  const orderedModules = flattenModules(track);
  const modulesById = new Map(orderedModules.map((m) => [m.id, m]));

  const allModuleProgress = path.phases.flatMap((p) => p.modules);

  // Rule 1 — resume
  const inProgress = allModuleProgress.find((m) => m.status === 'in_progress');
  if (inProgress) {
    const mod = modulesById.get(inProgress.moduleId)!;
    return {
      kind: 'resume_lesson',
      moduleId: inProgress.moduleId,
      lessonId: inProgress.nextLessonId,
      step: inProgress.nextStep ?? 'preview',
      rationale: {
        en: `Pick up where you left off in ${mod.code} — you have ${mod.lessons.length - inProgress.lessonsCompleted} lessons remaining.`,
        ar: `استكمل من حيث توقفت في ${mod.code} — لديك ${mod.lessons.length - inProgress.lessonsCompleted} درساً متبقياً.`,
      },
    };
  }

  // Rule 2 — review
  const needsReview = allModuleProgress.find((m) => m.status === 'needs_review');
  if (needsReview) {
    const mod = modulesById.get(needsReview.moduleId)!;
    return {
      kind: 'review_lesson',
      moduleId: needsReview.moduleId,
      lessonId: needsReview.nextLessonId,
      step: 'review',
      rationale: {
        en: `Reinforce a weak area in ${mod.code} before moving on.`,
        ar: `تعزيز نقطة ضعف في ${mod.code} قبل المتابعة.`,
      },
    };
  }

  // Rule 3 — start next
  const notStarted = allModuleProgress.find((m) => m.status === 'not_started');
  if (notStarted) {
    const mod = modulesById.get(notStarted.moduleId)!;
    return {
      kind: 'start_module',
      moduleId: notStarted.moduleId,
      lessonId: mod.lessons[0]?.id ?? null,
      step: 'preview',
      rationale: {
        en: `Start ${mod.code} — ${mod.lessons.length} lessons, your next step in the path.`,
        ar: `ابدأ ${mod.code} — ${mod.lessons.length} درساً، خطوتك التالية في المسار.`,
      },
    };
  }

  // Rule 4 — path complete
  return {
    kind: 'path_complete',
    moduleId: orderedModules[orderedModules.length - 1]?.id ?? '',
    lessonId: null,
    step: 'review',
    rationale: {
      en: 'Path complete. Schedule your exam — you are ready.',
      ar: 'اكتمل المسار. حدد موعد امتحانك — أنت جاهز.',
    },
  };
}
