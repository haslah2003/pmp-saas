import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';

interface Props {
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

export function PreviewStep({ lesson, phaseId, locale }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;

  const timeLabel = isAr ? 'المدة المتوقعة' : 'Estimated time';
  const questionsLabel = isAr ? 'أسئلة التمرين' : 'Practice questions';
  const minutesLabel = isAr ? 'دقيقة' : 'min';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div
          style={{
            background: theme.pale,
            borderRadius: '8px',
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '11px', color: theme.textOnPale, margin: '0 0 6px', fontWeight: 500 }}>
            {timeLabel}
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: theme.textOnPale, margin: 0 }}>
            {lesson.estimatedMinutes} <span style={{ fontSize: '14px' }}>{minutesLabel}</span>
          </p>
        </div>

        <div
          style={{
            background: theme.pale,
            borderRadius: '8px',
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '11px', color: theme.textOnPale, margin: '0 0 6px', fontWeight: 500 }}>
            {questionsLabel}
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: theme.textOnPale, margin: 0 }}>
            {lesson.practiceQuestionCount}
          </p>
        </div>
      </div>
    </div>
  );
}
