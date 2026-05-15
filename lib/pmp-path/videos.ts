import type { LearningStep, Locale } from '@/lib/pmp-path/types';

export interface LessonVideo {
  id: string;
  framework: string;
  moduleId: string;
  lessonId: string;
  step: LearningStep | string;
  title: string;
  description: string | null;
  storagePath: string;
  thumbnailPath: string | null;
  durationSeconds: number | null;
  language: Locale | string;
  sortOrder: number;
  videoUrl: string;
  thumbnailUrl: string | null;
}
