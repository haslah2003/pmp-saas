'use client';

import { useMemo, useState } from 'react';
import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import type { ApplyActivity, ApplyOption } from '@/lib/pmp-path/apply-activities';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
  activity: ApplyActivity | null;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

function optionLetter(option: ApplyOption, locale: Locale) {
  if (locale === 'ar') {
    return ({ a: 'أ', b: 'ب', c: 'ج', d: 'د' } as const)[option.id];
  }

  return option.id.toUpperCase();
}

export function ApplyStep({ lesson, phaseId, locale, activity }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [selectedOptionId, setSelectedOptionId] = useState<ApplyOption['id'] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = useMemo(
    () => activity?.options.find((option) => option.id === selectedOptionId) ?? null,
    [activity, selectedOptionId]
  );

  const isCorrect = Boolean(activity && selectedOptionId === activity.correctOptionId);

  if (!activity) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'}>
        <div
          style={{
            background: theme.pale,
            borderRadius: '12px',
            padding: '20px',
            borderInlineStart: `4px solid ${theme.primary}`,
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: theme.textOnPale,
              margin: '0 0 8px',
              letterSpacing: '0.08em',
            }}
          >
            {isAr ? 'تطبيق قريباً' : 'APPLY COMING SOON'}
          </p>
          <p style={{ fontSize: '15px', color: theme.textOnPale, margin: 0, lineHeight: 1.7, fontWeight: 700 }}>
            {isAr
              ? `سيتم إضافة نشاط تطبيقي لهذا الدرس: ${lesson.title.ar}`
              : `An applied scenario activity will be added for this lesson: ${lesson.title.en}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      <section
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E6E0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.pale}, #FFFFFF)`,
            borderBottom: '1px solid #E8E6E0',
            padding: '22px',
          }}
        >
          <p
            style={{
              color: theme.textOnPale,
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              margin: '0 0 10px',
              textTransform: 'uppercase',
            }}
          >
            {isAr ? 'نشاط تطبيقي' : 'APPLY ACTIVITY'}
          </p>

          <h2
            style={{
              color: '#1F1F23',
              fontSize: '24px',
              lineHeight: 1.25,
              margin: '0 0 10px',
              fontWeight: 900,
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {activity.title[locale]}
          </h2>

          <p
            style={{
              color: '#5F6368',
              fontSize: '14px',
              lineHeight: 1.8,
              margin: 0,
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {isAr
              ? 'اقرأ الموقف، اختر أفضل إجراء أول، ثم راجع التفكير المهني خلف الإجابة.'
              : 'Read the scenario, choose the best first action, then review the professional reasoning behind the answer.'}
          </p>
        </div>

        <div style={{ padding: '22px' }}>
          <div
            style={{
              background: '#FAFAF8',
              border: '1px solid #E8E6E0',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '18px',
            }}
          >
            <p
              style={{
                color: '#1F1F23',
                fontSize: '15px',
                lineHeight: 1.85,
                margin: 0,
                fontWeight: 650,
                textAlign: isAr ? 'right' : 'left',
              }}
            >
              {activity.scenario[locale]}
            </p>
          </div>

          <h3
            style={{
              color: '#1F1F23',
              fontSize: '17px',
              margin: '0 0 14px',
              fontWeight: 900,
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {activity.prompt[locale]}
          </h3>

          <div style={{ display: 'grid', gap: '10px' }}>
            {activity.options.map((option) => {
              const isSelected = option.id === selectedOptionId;
              const revealCorrect = submitted && option.id === activity.correctOptionId;
              const revealWrong = submitted && isSelected && option.id !== activity.correctOptionId;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (!submitted) setSelectedOptionId(option.id);
                  }}
                  disabled={submitted}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: isAr ? '1fr 38px' : '38px 1fr',
                    gap: '12px',
                    alignItems: 'start',
                    textAlign: isAr ? 'right' : 'left',
                    borderRadius: '14px',
                    border: `1px solid ${
                      revealCorrect ? '#0F6E56' : revealWrong ? '#B42318' : isSelected ? theme.primary : '#E3E0DA'
                    }`,
                    background: revealCorrect ? '#E1F5EE' : revealWrong ? '#FEE8E8' : isSelected ? theme.palest : '#FFFFFF',
                    color: '#1F1F23',
                    padding: '14px',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  {isAr ? (
                    <>
                      <span style={{ fontSize: '14px', lineHeight: 1.7, fontWeight: 700 }}>{option.label[locale]}</span>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '999px',
                          background: isSelected || revealCorrect ? theme.primary : '#F2F1EE',
                          color: isSelected || revealCorrect ? '#FFFFFF' : '#5F6368',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 900,
                        }}
                      >
                        {optionLetter(option, locale)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '999px',
                          background: isSelected || revealCorrect ? theme.primary : '#F2F1EE',
                          color: isSelected || revealCorrect ? '#FFFFFF' : '#5F6368',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 900,
                        }}
                      >
                        {optionLetter(option, locale)}
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: 1.7, fontWeight: 700 }}>{option.label[locale]}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: isAr ? 'flex-start' : 'flex-end',
              gap: '10px',
              marginTop: '18px',
              flexWrap: 'wrap',
            }}
          >
            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedOptionId(null);
                  setSubmitted(false);
                }}
                style={{
                  border: '1px solid #E3E0DA',
                  background: '#FFFFFF',
                  color: '#3F3F46',
                  borderRadius: '12px',
                  padding: '11px 16px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إعادة المحاولة' : 'Try again'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!selectedOptionId || submitted}
              style={{
                border: `1px solid ${theme.primary}`,
                background: !selectedOptionId || submitted ? '#D8D5DC' : theme.primary,
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '11px 18px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: !selectedOptionId || submitted ? 'not-allowed' : 'pointer',
              }}
            >
              {isAr ? 'تحقق من الحكم المهني' : 'Check judgment'}
            </button>
          </div>

          {submitted && selectedOption ? (
            <div
              style={{
                marginTop: '20px',
                borderRadius: '14px',
                border: `1px solid ${isCorrect ? '#0F6E56' : '#B42318'}`,
                background: isCorrect ? '#F0FBF7' : '#FFF5F5',
                padding: '18px',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px',
                  color: isCorrect ? '#0F6E56' : '#B42318',
                  fontSize: '13px',
                  fontWeight: 900,
                }}
              >
                {isCorrect ? (isAr ? 'إجابة صحيحة' : 'Correct judgment') : isAr ? 'راجع الحكم المهني' : 'Review the judgment'}
              </p>

              <p style={{ margin: '0 0 14px', color: '#1F1F23', fontSize: '14px', lineHeight: 1.8, fontWeight: 650 }}>
                {selectedOption.feedback[locale]}
              </p>

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E6E0',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '12px',
                }}
              >
                <p style={{ margin: '0 0 6px', color: theme.textOnPale, fontSize: '12px', fontWeight: 900 }}>
                  {isAr ? 'المبدأ المهني' : 'Professional principle'}
                </p>
                <p style={{ margin: 0, color: '#3F3F46', fontSize: '13px', lineHeight: 1.75 }}>
                  {activity.principle[locale]}
                </p>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8E6E0',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <p style={{ margin: '0 0 6px', color: theme.textOnPale, fontSize: '12px', fontWeight: 900 }}>
                  {isAr ? 'خلاصة للاختبار' : 'Exam takeaway'}
                </p>
                <p style={{ margin: 0, color: '#3F3F46', fontSize: '13px', lineHeight: 1.75 }}>
                  {activity.examTakeaway[locale]}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
