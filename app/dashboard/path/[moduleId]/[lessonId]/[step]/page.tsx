import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import type { Locale, LearningStep } from '@/lib/pmp-path/types';
import { LEARNING_STEPS } from '@/lib/pmp-path/types';
import { ALL_TRACKS } from '@/lib/pmp-path/tracks';
import { themeFor } from '@/lib/pmp-path/colors';
import { frameworkFromModuleId, getLessonVideos } from '@/lib/pmp-path/videos.server';
import { getApplyActivity } from '@/lib/pmp-path/apply-activities';
import getPracticeActivity from '@/lib/pmp-path/practice-activities';
import getExplainActivity from '@/lib/pmp-path/explain-activities';
import getReviewActivity from '@/lib/pmp-path/review-activities';

import { PreviewStep } from '@/components/path/steps/PreviewStep';
import { LearnStep } from '@/components/path/steps/LearnStep';
import { VisualizeStep } from '@/components/path/steps/VisualizeStep';
import { StepBodyPlaceholder } from '@/components/path/steps/StepBodyPlaceholder';
import { ApplyStep } from '@/components/path/steps/ApplyStep';
import { PracticeStep } from '@/components/path/steps/PracticeStep';
import { ExplainStep } from '@/components/path/steps/ExplainStep';
import { ReviewStep } from '@/components/path/steps/ReviewStep';
import { StepNavigation } from '@/components/path/StepNavigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ moduleId: string; lessonId: string; step: string }>;
  searchParams?: Promise<{ lang?: string | string[]; locale?: string | string[] }>;
}

const STEP_LABELS: Record<LearningStep, { en: string; ar: string }> = {
  preview: { en: 'Preview', ar: 'معاينة' },
  learn: { en: 'Learn', ar: 'تعلّم' },
  visualize: { en: 'Visualize', ar: 'تصوّر' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  practice: { en: 'Practice', ar: 'تمرين' },
  explain: { en: 'Explain', ar: 'توضيح' },
  review: { en: 'Review', ar: 'مراجعة' },
};

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

function normalizeLocale(value: string | string[] | undefined | null): Locale | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'ar' || raw === 'en' ? raw : null;
}

export default async function LessonStepPage({ params, searchParams }: PageProps) {
  const { moduleId, lessonId, step } = await params;
  const currentStep = step.toLowerCase() as LearningStep;

  if (!LEARNING_STEPS.includes(currentStep)) {
    notFound();
  }

  const query = await searchParams;
  const cookieStore = await cookies();
  const locale: Locale =
    normalizeLocale(query?.lang) ??
    normalizeLocale(query?.locale) ??
    normalizeLocale(cookieStore.get('pmp_locale')?.value) ??
    'en';
  const isAr = locale === 'ar';

  let foundModule = null;
  let foundLesson = null;

  for (const track of ALL_TRACKS) {
    for (const phase of track.phases) {
      const trackModule = phase.modules.find((m) => m.id === moduleId);
      if (trackModule) {
        foundModule = trackModule;
        foundLesson = trackModule.lessons.find((l) => l.id === lessonId) ?? null;
        break;
      }
    }
    if (foundModule) break;
  }

  if (!foundModule || !foundLesson) {
    notFound();
  }

  const theme = themeFor(foundModule.phaseId) || FALLBACK_THEME;
  const stepLabel = STEP_LABELS[currentStep][locale];
  const framework = frameworkFromModuleId(foundModule.id);

  const lessonVideos =
    currentStep === 'learn'
      ? await getLessonVideos({
          framework,
          moduleId: foundModule.id,
          lessonId: foundLesson.id,
          step: currentStep,
          locale,
        })
      : [];

  const applyActivity = currentStep === 'apply' ? getApplyActivity(foundLesson.id) : null;
  const practiceActivity = currentStep === 'practice' ? getPracticeActivity(foundLesson.id) : null;
  const explainActivity = currentStep === 'explain' ? getExplainActivity(foundLesson.id) : null;
  const reviewActivity = currentStep === 'review' ? getReviewActivity(foundLesson.id) : null;

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF8', paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        <Link
          href={`/dashboard/path?lang=${locale}`}
          style={{
            fontSize: '13px',
            color: theme.textOnPale,
            textDecoration: 'none',
            marginBottom: '20px',
            display: 'inline-block',
          }}
        >
          ← {isAr ? 'العودة إلى مساري' : 'Back to My Path'}
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
            {foundLesson.title[locale]}
          </h1>
          <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
            {stepLabel} • {foundModule.id}
          </p>
        </div>

        <StepNavigation
          moduleId={foundModule.id}
          lessonId={foundLesson.id}
          trackId={foundModule.trackId}
          currentStep={currentStep}
          locale={locale}
          variant="top"
        />

        <article
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #E8E6E0',
          }}
        >
          {currentStep === 'preview' ? (
            <PreviewStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          ) : currentStep === 'learn' ? (
            <LearnStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} videos={lessonVideos} />
          ) : currentStep === 'visualize' ? (
            <VisualizeStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          ) : currentStep === 'apply' ? (
            <ApplyStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={applyActivity} />
          ) : currentStep === 'practice' ? (
            <PracticeStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={practiceActivity} />
          ) : currentStep === 'explain' ? (
            <ExplainStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={explainActivity} />
          ) : currentStep === 'review' ? (
            <ReviewStep lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} activity={reviewActivity} />
          ) : (
            <StepBodyPlaceholder step={currentStep} lesson={foundLesson} phaseId={foundModule.phaseId} locale={locale} />
          )}
        </article>
      </div>
    </main>
  );
}
