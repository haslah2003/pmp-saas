'use client';

import { useMemo, useState } from 'react';

import type { Lesson, Locale, PhaseId } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import type { PracticeOptionId, RPathPracticeActivity } from '@/lib/pmp-path/practice-activities';

interface Props {
  lesson: Lesson;
  phaseId: PhaseId;
  locale: Locale;
  activity: RPathPracticeActivity | null;
}

const FALLBACK_THEME = {
  primary: '#7030A0',
  pale: '#F5F4FF',
  palest: '#F8F7FD',
  textOnPale: '#3C3489',
  textOnPrimary: '#FFFFFF',
};

export function PracticeStep({ lesson, phaseId, locale, activity }: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phaseId) || FALLBACK_THEME;
  const [answers, setAnswers] = useState<Record<string, PracticeOptionId>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!activity) return 0;
    return activity.questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  }, [activity, answers]);

  if (!activity) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'}>
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
            {isAr ? 'تمرين غير متاح حالياً' : 'PRACTICE NOT AVAILABLE YET'}
          </p>
          <p style={{ fontSize: '14px', color: theme.textOnPale, margin: 0, lineHeight: 1.7 }}>
            {isAr
              ? `سيتم ربط تمرين خاص بهذا الدرس قريباً: ${lesson.title[locale]}`
              : `A dedicated practice activity will be connected to this lesson soon: ${lesson.title[locale]}`}
          </p>
        </div>
      </div>
    );
  }

  const completed = activity.questions.every((question) => answers[question.id]);

  function selectAnswer(questionId: string, optionId: PracticeOptionId) {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ textAlign: isAr ? 'right' : 'left' }}>
      <section
        style={{
          background: theme.palest,
          borderRadius: '14px',
          padding: '20px',
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
          {isAr ? 'تمرين المسار' : 'R-PATH PRACTICE'}
        </p>
        <h2 style={{ fontSize: '22px', lineHeight: 1.35, color: '#1a1a1a', margin: '0 0 8px' }}>
          {activity.title[locale]}
        </h2>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555', margin: '0 0 8px' }}>
          {activity.intro[locale]}
        </p>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: theme.textOnPale, margin: 0, fontWeight: 600 }}>
          {activity.topic[locale]}
        </p>
      </section>

      <div style={{ display: 'grid', gap: '18px' }}>
        {activity.questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctOptionId;

          return (
            <section
              key={question.id}
              style={{
                border: '1px solid #E8E6E0',
                borderRadius: '14px',
                padding: '20px',
                background: '#FFFFFF',
              }}
            >
              <p style={{ fontSize: '13px', color: '#777', margin: '0 0 8px', fontWeight: 600 }}>
                {isAr ? `السؤال ${index + 1}` : `Question ${index + 1}`}
              </p>

              <h3 style={{ fontSize: '17px', lineHeight: 1.55, color: '#1a1a1a', margin: '0 0 16px' }}>
                {question.prompt[locale]}
              </h3>

              <div style={{ display: 'grid', gap: '10px' }}>
                {question.options.map((option) => {
                  const optionSelected = selected === option.id;
                  const optionCorrect = submitted && option.id === question.correctOptionId;
                  const optionWrong = submitted && optionSelected && option.id !== question.correctOptionId;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectAnswer(question.id, option.id)}
                      disabled={submitted}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        border: optionCorrect
                          ? '1px solid #14804A'
                          : optionWrong
                            ? '1px solid #B42318'
                            : optionSelected
                              ? `1px solid ${theme.primary}`
                              : '1px solid #E8E6E0',
                        background: optionCorrect
                          ? '#ECFDF3'
                          : optionWrong
                            ? '#FEF3F2'
                            : optionSelected
                              ? theme.pale
                              : '#FFFFFF',
                        color: '#1f1f1f',
                        padding: '12px 14px',
                        cursor: submitted ? 'default' : 'pointer',
                        textAlign: isAr ? 'right' : 'left',
                        fontSize: '14px',
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: theme.textOnPale, marginInlineEnd: '8px' }}>{option.id}.</strong>
                      {option.text[locale]}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: isCorrect ? '#ECFDF3' : '#FEF3F2',
                    border: isCorrect ? '1px solid #ABEFC6' : '1px solid #FECDCA',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      margin: '0 0 8px',
                      color: isCorrect ? '#067647' : '#B42318',
                    }}
                  >
                    {isCorrect ? (isAr ? 'إجابة صحيحة' : 'Correct') : isAr ? 'تحتاج إلى مراجعة' : 'Review needed'}
                  </p>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, margin: '0 0 8px', color: '#333' }}>
                    {question.explanation[locale]}
                  </p>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, margin: 0, color: '#555' }}>
                    <strong>{isAr ? 'نصيحة اختبارية: ' : 'Exam tip: '}</strong>
                    {question.examTip[locale]}
                  </p>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '22px',
          display: 'flex',
          flexDirection: isAr ? 'row-reverse' : 'row',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!completed || submitted}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '11px 18px',
            background: !completed || submitted ? '#D0D0D0' : theme.primary,
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            cursor: !completed || submitted ? 'not-allowed' : 'pointer',
          }}
        >
          {isAr ? 'تحقق من النتيجة' : 'Check score'}
        </button>

        {submitted ? (
          <button
            type="button"
            onClick={retry}
            style={{
              border: `1px solid ${theme.primary}`,
              borderRadius: '999px',
              padding: '10px 16px',
              background: '#FFFFFF',
              color: theme.textOnPale,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        ) : null}

        <p style={{ margin: 0, fontSize: '14px', color: '#555', fontWeight: 600 }}>
          {submitted
            ? isAr
              ? `نتيجتك: ${score} من ${activity.questions.length}`
              : `Your score: ${score}/${activity.questions.length}`
            : isAr
              ? `${Object.keys(answers).length} من ${activity.questions.length} مكتملة`
              : `${Object.keys(answers).length}/${activity.questions.length} completed`}
        </p>
      </div>
    </div>
  );
}
