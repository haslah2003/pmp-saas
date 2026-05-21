'use client';

import { useMemo, useState } from 'react';

import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import type { RPathReviewActivity } from '@/lib/pmp-path/review-activities';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
  activity: RPathReviewActivity | null;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

export function ReviewStep({ lesson, phaseId, locale, activity }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const completedChecks = useMemo(() => {
    if (!activity) return 0;
    return activity.readinessChecks.filter((item) => checked[item.id]).length;
  }, [activity, checked]);

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
            {isAr ? 'المراجعة غير متاحة حالياً' : 'REVIEW NOT AVAILABLE YET'}
          </p>
          <p style={{ fontSize: '14px', color: theme.textOnPale, margin: 0, lineHeight: 1.7 }}>
            {isAr
              ? `سيتم ربط مراجعة مخصصة بهذا الدرس قريباً: ${lesson.title[locale]}`
              : `A dedicated review checkpoint will be connected to this lesson soon: ${lesson.title[locale]}`}
          </p>
        </div>
      </div>
    );
  }

  const totalChecks = activity.readinessChecks.length;
  const ready = completedChecks === totalChecks;

  function toggleCheck(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
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
          {isAr ? 'مراجعة المسار' : 'R-PATH REVIEW'}
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
          background: ready ? '#ECFDF3' : theme.pale,
          border: ready ? '1px solid #ABEFC6' : `1px solid ${theme.primary}`,
          marginBottom: '22px',
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: 800, color: ready ? '#067647' : theme.textOnPale, margin: '0 0 8px' }}>
          {isAr ? 'حالة الجاهزية' : 'READINESS STATUS'}
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#1f1f1f', margin: 0, fontWeight: 700 }}>
          {ready
            ? activity.completionMessage[locale]
            : isAr
              ? `أكمل ${completedChecks} من ${totalChecks} مؤشرات جاهزية.`
              : `Complete ${completedChecks} of ${totalChecks} readiness checks.`}
        </p>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 14px' }}>
          {isAr ? 'ما يجب أن يبقى معك من هذا الدرس' : 'What should stay with you from this lesson'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.keyTakeaways.map((point) => (
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
          {isAr ? 'مؤشرات الجاهزية' : 'Readiness checks'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.readinessChecks.map((item) => {
            const itemChecked = Boolean(checked[item.id]);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                style={{
                  width: '100%',
                  background: itemChecked ? '#ECFDF3' : '#FFFFFF',
                  border: itemChecked ? '1px solid #ABEFC6' : '1px solid #E8E6E0',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: isAr ? 'right' : 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '999px',
                      border: itemChecked ? '1px solid #067647' : `1px solid ${theme.primary}`,
                      background: itemChecked ? '#067647' : '#FFFFFF',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      flex: '0 0 auto',
                      marginTop: '2px',
                    }}
                  >
                    {itemChecked ? '✓' : ''}
                  </span>

                  <span style={{ display: 'block' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        lineHeight: 1.65,
                        color: '#1f1f1f',
                        fontWeight: 750,
                        marginBottom: '6px',
                      }}
                    >
                      {item.label[locale]}
                    </span>
                    <span style={{ display: 'block', fontSize: '13px', lineHeight: 1.7, color: '#555' }}>
                      {item.evidence[locale]}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '18px', color: '#1a1a1a', margin: '0 0 14px' }}>
          {isAr ? 'قرارك قبل المهمة التالية' : 'Your decision before the next mission'}
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activity.nextMission.map((point, index) => (
            <div
              key={point.title[locale]}
              style={{
                background: index === 0 ? '#ECFDF3' : '#FFFBFA',
                border: index === 0 ? '1px solid #ABEFC6' : '1px solid #FECDCA',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '15px', color: index === 0 ? '#067647' : '#B42318', margin: '0 0 8px', fontWeight: 800 }}>
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
          {isAr ? 'إغلاق دورة التعلم' : 'Close the learning loop'}
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#333', margin: 0 }}>
          {ready
            ? isAr
              ? 'أنت جاهز للانتقال بثقة إلى المهمة التالية.'
              : 'You are ready to move confidently into the next mission.'
            : isAr
              ? 'راجع المؤشرات غير المكتملة قبل اعتبار هذا الدرس مكتسباً بالكامل.'
              : 'Review the unchecked readiness indicators before treating this lesson as fully mastered.'}
        </p>
      </section>
    </div>
  );
}
