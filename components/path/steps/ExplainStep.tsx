import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import type { RPathExplainActivity } from '@/lib/pmp-path/explain-activities';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
  activity: RPathExplainActivity | null;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

export function ExplainStep({ lesson, phaseId, locale, activity }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;

  if (!activity) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} style={{ textAlign: isAr ? 'right' : 'left' }}>
        <div
          style={{
            background: theme.pale,
            borderRadius: '12px',
            padding: '20px',
            borderLeft: isAr ? undefined : `4px solid ${theme.primary}`,
            borderRight: isAr ? `4px solid ${theme.primary}` : undefined,
          }}
        >
          <p style={{ fontSize: '11px', fontWeight: 600, color: theme.textOnPale, margin: '0 0 8px' }}>
            {isAr ? 'التوضيح غير متاح حالياً' : 'EXPLANATION NOT AVAILABLE YET'}
          </p>
          <p style={{ fontSize: '14px', color: theme.textOnPale, margin: 0, lineHeight: 1.7 }}>
            {isAr
              ? `سيتم ربط توضيح مخصص بهذا الدرس قريباً: ${lesson.title[locale]}`
              : `A dedicated explanation will be connected to this lesson soon: ${lesson.title[locale]}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ textAlign: isAr ? 'right' : 'left' }}>
      <section
        style={{
          background: theme.palest,
          borderRadius: '14px',
          padding: '22px',
          border: `1px solid ${theme.pale}`,
          marginBottom: '22px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: theme.textOnPale,
            margin: '0 0 8px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {isAr ? 'توضيح المسار' : 'R-PATH EXPLAIN'}
        </p>

        <h2 style={{ fontSize: '22px', lineHeight: 1.35, color: '#1a1a1a', margin: '0 0 10px' }}>
          {activity.title[locale]}
        </h2>

        <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#555', margin: 0 }}>
          {activity.intro[locale]}
        </p>
      </section>

      <section
        style={{
          borderRadius: '14px',
          padding: '20px',
          background: theme.pale,
          border: `1px solid ${theme.primary}`,
          marginBottom: '22px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: theme.textOnPale,
            margin: '0 0 8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {isAr ? 'قاعدة التفكير المهني' : 'PROFESSIONAL THINKING RULE'}
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#1f1f1f', margin: 0, fontWeight: 650 }}>
          {activity.mindsetRule[locale]}
        </p>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 14px' }}>
          {isAr ? 'نموذج التفكير خطوة بخطوة' : 'Step-by-step reasoning model'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.reasoningSteps.map((point) => (
            <div
              key={point.title[locale]}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E6E0',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '15px', color: theme.textOnPale, margin: '0 0 8px', fontWeight: 800 }}>
                {point.title[locale]}
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#444', margin: 0 }}>
                {point.body[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 14px' }}>
          {isAr ? 'فخاخ شائعة في أسئلة PMP' : 'Common PMP answer traps'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.commonTraps.map((trap) => (
            <div
              key={trap.temptingAnswer[locale]}
              style={{
                background: '#FFFBFA',
                border: '1px solid #FECDCA',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <p style={{ fontSize: '13px', color: '#B42318', fontWeight: 800, margin: '0 0 8px' }}>
                {isAr ? 'إجابة مغرية لكنها ضعيفة' : 'Tempting but weak answer'}
              </p>
              <p style={{ fontSize: '14px', color: '#1f1f1f', lineHeight: 1.7, margin: '0 0 8px', fontWeight: 650 }}>
                {trap.temptingAnswer[locale]}
              </p>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.75, margin: 0 }}>
                {trap.whyItFails[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 14px' }}>
          {isAr ? 'كيف تنقل هذا التفكير إلى أسئلة الاختبار' : 'How to transfer this thinking to exam questions'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.examTransfer.map((point) => (
            <div
              key={point.title[locale]}
              style={{
                background: '#ECFDF3',
                border: '1px solid #ABEFC6',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '15px', color: '#067647', margin: '0 0 8px', fontWeight: 800 }}>
                {point.title[locale]}
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: '#333', margin: 0 }}>
                {point.body[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: '#FFFFFF',
          border: `1px solid ${theme.primary}`,
          borderRadius: '14px',
          padding: '18px',
        }}
      >
        <p style={{ fontSize: '13px', color: theme.textOnPale, fontWeight: 800, margin: '0 0 8px' }}>
          {isAr ? 'وقفة تأمل قبل المراجعة' : 'Reflection before Review'}
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#333', margin: 0 }}>
          {activity.reflectionPrompt[locale]}
        </p>
      </section>
    </div>
  );
}
