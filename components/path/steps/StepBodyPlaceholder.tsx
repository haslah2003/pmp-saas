import type { Lesson, Locale, PhaseId, LearningStep } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';

interface Props {
  step: LearningStep;
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

const STEP_LABELS: Record<LearningStep, { en: string; ar: string }> = {
  preview: { en: 'Preview', ar: 'معاينة' },
  learn: { en: 'Learn', ar: 'تعلّم' },
  visualize: { en: 'Visualize', ar: 'تصوّر' },
  apply: { en: 'Apply', ar: 'تطبيق' },
  practice: { en: 'Practice', ar: 'تمرين' },
  explain: { en: 'Explain', ar: 'توضيح' },
  review: { en: 'Review', ar: 'مراجعة' },
};

export function StepBodyPlaceholder({ step, lesson, phaseId, locale }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const stepLabel = STEP_LABELS[step][locale];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      <div
        style={{
          background: theme.pale,
          borderRadius: '12px',
          padding: '20px',
          borderLeft: `4px solid ${theme.primary}`,
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: theme.textOnPale,
            margin: '0 0 8px',
            letterSpacing: '0.08em',
          }}
        >
          {isAr ? 'قريباً' : 'COMING SOON'}
        </p>
        <p style={{ fontSize: '15px', color: theme.textOnPale, margin: '0 0 4px', lineHeight: 1.6, fontWeight: 500 }}>
          {stepLabel} {isAr ? 'قيد التطوير' : 'is in development'}
        </p>
        <p style={{ fontSize: '13px', color: theme.textOnPale, margin: 0, lineHeight: 1.6, opacity: 0.85 }}>
          {isAr ? 'سيكون هذا الجزء متاحاً قريباً.' : 'This step will be available soon.'}
        </p>
      </div>
    </div>
  );
}
