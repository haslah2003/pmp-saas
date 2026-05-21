import Link from 'next/link';
import type { LearningStep, Locale, TrackId } from '@/lib/pmp-path/types';
import { LEARNING_STEPS } from '@/lib/pmp-path/types';
import { FinishLessonButton } from './FinishLessonButton';

interface Props {
  moduleId: string;
  lessonId: string;
  trackId: TrackId;
  currentStep: LearningStep;
  locale: Locale;
  variant?: 'top' | 'bottom';
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

function stepHref(moduleId: string, lessonId: string, step: LearningStep, locale: Locale) {
  return `/dashboard/path/${moduleId}/${lessonId}/${step}?lang=${locale}`;
}

export function StepNavigation({
  moduleId,
  lessonId,
  trackId,
  currentStep,
  locale,
  variant = 'top',
}: Props) {
  const isAr = locale === 'ar';
  const currentIndex = LEARNING_STEPS.indexOf(currentStep);
  const previousStep = currentIndex > 0 ? LEARNING_STEPS[currentIndex - 1] : null;
  const nextStep =
    currentIndex >= 0 && currentIndex < LEARNING_STEPS.length - 1
      ? LEARNING_STEPS[currentIndex + 1]
      : null;

  return (
    <nav
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={isAr ? 'تنقّل خطوات التعلم' : 'Learning step navigation'}
      style={{
        marginTop: variant === 'top' ? '0' : '22px',
        marginBottom: variant === 'top' ? '22px' : '0',
        padding: '16px',
        border: '1px solid #E8E6E0',
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(82px, 1fr))',
          gap: '8px',
          marginBottom: '14px',
        }}
      >
        {LEARNING_STEPS.map((step, index) => {
          const isCurrent = step === currentStep;
          const isDone = index < currentIndex;

          return (
            <Link
              key={step}
              href={stepHref(moduleId, lessonId, step, locale)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '38px',
                borderRadius: '999px',
                border: `1px solid ${isCurrent ? '#7030A0' : isDone ? '#0F6E56' : '#E3E0DA'}`,
                background: isCurrent ? '#7030A0' : isDone ? '#E1F5EE' : '#FAFAF9',
                color: isCurrent ? '#FFFFFF' : isDone ? '#0F6E56' : '#6B7280',
                fontSize: '12px',
                fontWeight: isCurrent ? 900 : 800,
                textDecoration: 'none',
                textAlign: 'center',
                padding: '0 8px',
                whiteSpace: 'nowrap',
              }}
            >
              {STEP_LABELS[step][locale]}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: '#6B7280', fontSize: '12px', fontWeight: 800 }}>
          {isAr
            ? `الخطوة ${currentIndex + 1} من ${LEARNING_STEPS.length}`
            : `Step ${currentIndex + 1} of ${LEARNING_STEPS.length}`}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {previousStep ? (
            <Link
              href={stepHref(moduleId, lessonId, previousStep, locale)}
              style={{
                border: '1px solid #E3E0DA',
                background: '#FFFFFF',
                color: '#3F3F46',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              {isAr
                ? `السابق: ${STEP_LABELS[previousStep][locale]}`
                : `Previous: ${STEP_LABELS[previousStep][locale]}`}
            </Link>
          ) : null}

          {nextStep ? (
            <Link
              href={stepHref(moduleId, lessonId, nextStep, locale)}
              style={{
                border: '1px solid #7030A0',
                background: '#7030A0',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 900,
                textDecoration: 'none',
              }}
            >
              {isAr
                ? `التالي: ${STEP_LABELS[nextStep][locale]}`
                : `Next: ${STEP_LABELS[nextStep][locale]}`}
            </Link>
          ) : (
            <FinishLessonButton trackId={trackId} lessonId={lessonId} locale={locale} />
          )}
        </div>
      </div>
    </nav>
  );
}
