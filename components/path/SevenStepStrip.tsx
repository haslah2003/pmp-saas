
/**
 * components/path/SevenStepStrip.tsx
 * Renders the 7-step learning loop indicator as a slim dot strip.
 * States per step: done (filled, brand color) · current (filled + ring) · upcoming (muted).
 */

import type { LearningStep, Locale, PhaseId } from '@/lib/pmp-path/types';
import { LEARNING_STEPS } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';

const STEP_LABELS: Record<LearningStep, { en: string; ar: string }> = {
  preview: { en: 'Preview', ar: 'معاينة' },
  learn: { en: 'Learn', ar: 'تعلّم' },
  visualize: { en: 'Visualize', ar: 'تصوّر' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  practice: { en: 'Practice', ar: 'تمرين' },
  explain: { en: 'Explain', ar: 'توضيح' },
  review: { en: 'Review', ar: 'مراجعة' },
};

interface Props {
  phaseId: PhaseId;
  currentStep: LearningStep | null;
  completedSteps: LearningStep[];
  locale: Locale;
}

export function SevenStepStrip({
  phaseId,
  currentStep,
  completedSteps,
  locale,
}: Props) {
  const theme = themeFor(phaseId);
  const isAr = locale === 'ar';
  const loopLabel = isAr ? 'الحلقة' : 'LOOP';
  const currentStepLabel = currentStep
    ? STEP_LABELS[currentStep][locale]
    : STEP_LABELS.preview[locale];

  const stepState = (step: LearningStep): 'done' | 'current' | 'upcoming' => {
    if (completedSteps.includes(step)) return 'done';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div
      className="flex items-center"
      style={{
        margin: '10px 0',
        padding: '8px 0',
        borderTop: '0.5px solid rgba(26,20,48,0.08)',
        borderBottom: '0.5px solid rgba(26,20,48,0.08)',
        gap: '4px',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={isAr ? 'تقدّم حلقة التعلّم السبعية' : 'Seven-step learning loop progress'}
    >
      <span
        style={{
          fontSize: '10px',
          color: '#5E6078',
          letterSpacing: '0.06em',
          marginInlineEnd: '6px',
          fontWeight: 500,
          flex: '0 0 auto',
        }}
      >
        {loopLabel}
      </span>

      {LEARNING_STEPS.map((step, idx) => {
        const state = stepState(step);
        const dotBg =
          state === 'done' || state === 'current'
            ? theme.primary
            : 'rgba(26,20,48,0.15)';
        const dotRing =
          state === 'current' ? `0 0 0 3px ${theme.pale}` : 'none';
        return (
          <div
            key={step}
            className="flex items-center"
            style={{ flex: 1, gap: '4px', minWidth: 0 }}
          >
            <span
              title={STEP_LABELS[step][locale]}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: dotBg,
                boxShadow: dotRing,
                flex: '0 0 8px',
              }}
              aria-current={state === 'current' ? 'step' : undefined}
            />
            {idx < LEARNING_STEPS.length - 1 && (
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(26,20,48,0.12)',
                  minWidth: '4px',
                }}
              />
            )}
          </div>
        );
      })}

      <span
        style={{
          fontSize: '10px',
          color: theme.textOnPale,
          letterSpacing: '0.04em',
          marginInlineStart: '8px',
          fontWeight: 500,
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
        }}
      >
        {currentStepLabel}
      </span>
    </div>
  );
}
