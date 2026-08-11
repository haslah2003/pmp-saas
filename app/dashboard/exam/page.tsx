'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { dt, rtlDir, rtlClass } from '@/lib/i18n/dashboard-content';
import { Card, Badge, Button, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';

type ExamState = 'intro' | 'active' | 'break' | 'results';

type ApiQuestionRow = {
  id?: string;
  framework?: string;
  domain?: string;
  difficulty?: string;
  source?: string;
  question_text?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: string;
};

type ExamOption = {
  key: string;
  text: string;
};

type ExamQuestion = {
  id: string;
  stem: string;
  options: ExamOption[];
  correct_key: string;
  domain: string;
  source: string;
  difficulty: string;
};

function normalizeAnswerKey(value: unknown) {
  const key = String(value || '').trim().charAt(0).toLowerCase();
  return ['a', 'b', 'c', 'd'].includes(key) ? key : 'a';
}

function answerLabel(key: string, isArabic: boolean) {
  const labelsArabic: Record<string, string> = {
    a: 'أ',
    b: 'ب',
    c: 'ج',
    d: 'د',
  };

  return isArabic ? labelsArabic[key] ?? key.toUpperCase() : key.toUpperCase();
}

function difficultyVariant(difficulty: string) {
  const value = difficulty.toLowerCase();

  if (value === 'easy' || value === 'entry') return 'success';
  if (value === 'hard' || value === 'advanced' || value === 'mastery') return 'danger';

  return 'warning';
}

function mapApiQuestion(row: ApiQuestionRow, index: number): ExamQuestion {
  return {
    id: row.id || `question-${index}`,
    stem: row.question_text || '',
    options: [
      { key: 'a', text: row.option_a || '' },
      { key: 'b', text: row.option_b || '' },
      { key: 'c', text: row.option_c || '' },
      { key: 'd', text: row.option_d || '' },
    ].filter((option) => option.text.trim().length > 0),
    correct_key: normalizeAnswerKey(row.correct_answer),
    domain: row.domain || 'all',
    source: row.framework || row.source || 'pmbok7',
    difficulty: row.difficulty || 'paced',
  };
}

function mixedTextProps(isArabic: boolean) {
  return {
    dir: (isArabic ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    style: { unicodeBidi: 'isolate' as const },
  };
}

function questionCounterLabel(currentQ: number, total: number, isArabic: boolean) {
  return isArabic ? `س ${currentQ + 1} / ${total}` : `Q${currentQ + 1} / ${total}`;
}

export default function MockExamPage() {
  const { isArabic } = useLanguage();
  const [examState, setExamState] = useState<ExamState>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(230 * 60);
  const [showNav, setShowNav] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textProps = mixedTextProps(isArabic);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setQuestionError(null);

      try {
        const params = new URLSearchParams({
          framework: 'pmbok7',
          difficulty: 'paced',
          domain: 'all',
          lang: isArabic ? 'ar' : 'en',
          count: '10',
        });

        const response = await fetch(`/api/practice/questions?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Questions API returned ${response.status}`);
        }

        const payload = await response.json();
        const rows = Array.isArray(payload.questions) ? payload.questions : [];
        const mapped = rows
          .map((row: ApiQuestionRow, index: number) => mapApiQuestion(row, index))
          .filter((question: ExamQuestion) => question.stem.trim().length > 0 && question.options.length === 4)
          .slice(0, 10);

        if (mapped.length === 0) {
          throw new Error('No valid questions returned from API.');
        }

        if (!cancelled) {
          setQuestions(mapped);
          setCurrentQ(0);
          setSelected(null);
          setAnswers({});
          setFlagged(new Set());
          setShowNav(false);
          setTimeLeft(230 * 60);
        }
      } catch (error) {
        console.error('Mock exam question loading failed:', error);

        if (!cancelled) {
          setQuestionError(
            isArabic
              ? 'تعذر تحميل أسئلة الاختبار التجريبي. يرجى المحاولة مرة أخرى.'
              : 'Could not load mock exam questions. Please try again.'
          );
          setQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [isArabic]);

  useEffect(() => {
    if (examState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setExamState('results');
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const selectAnswer = (key: string) => {
    setSelected(key);
    setAnswers((prev) => ({ ...prev, [currentQ]: key }));
  };

  const toggleFlag = () => {
    const next = new Set(flagged);

    if (next.has(currentQ)) {
      next.delete(currentQ);
    } else {
      next.add(currentQ);
    }

    setFlagged(next);
  };

  const goTo = (i: number) => {
    setCurrentQ(i);
    setSelected(answers[i] || null);
    setShowNav(false);
  };

  const resetExam = () => {
    setExamState('intro');
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setSelected(null);
    setTimeLeft(230 * 60);
    setShowNav(false);
  };

  const totalCorrect = Object.entries(answers).filter(([i, key]) => {
    const q = questions[+i];
    return q && key === q.correct_key;
  }).length;

  if (examState === 'intro') {
    return (
      <div dir={rtlDir(isArabic)} className={`max-w-2xl mx-auto space-y-6 ${rtlClass(isArabic)}`}>
        <div>
          <h1 className="text-2xl font-bold">{dt('PMP Mock Exam', isArabic)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {dt('Simulate the real PMP exam experience', isArabic)}
          </p>
        </div>

        <Card padding="lg">
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 text-3xl">
              ⏱️
            </div>

            <h2 className="text-xl font-bold mb-2">{dt('Ready for the Challenge?', isArabic)}</h2>

            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              {dt('180 questions in 230 minutes, split into two sections with a 10-minute break.', isArabic)}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold">180</p>
                <p className="text-xs text-gray-400">{dt('Questions', isArabic)}</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">230</p>
                <p className="text-xs text-gray-400">{dt('Minutes', isArabic)}</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-400">{dt('Sections', isArabic)}</p>
              </div>
            </div>

            {isLoadingQuestions && (
              <p className="text-xs text-blue-500 mb-4">
                {isArabic ? 'جارٍ تحميل أسئلة الاختبار...' : 'Loading exam questions...'}
              </p>
            )}

            {questionError && (
              <p className="text-xs text-red-500 mb-4">
                {questionError}
              </p>
            )}

            {!isLoadingQuestions && !questionError && (
              <p className="text-xs text-gray-300 mb-6">
                {isArabic
                  ? `نسخة تجريبية: ${questions.length} أسئلة من قاعدة الأسئلة المترجمة.`
                  : `Demo: ${questions.length} translated database questions.`}
              </p>
            )}

            <Button
              size="lg"
              disabled={isLoadingQuestions || !!questionError || questions.length === 0}
              onClick={() => setExamState('active')}
            >
              {dt('Begin Exam', isArabic)}
            </Button>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-bold mb-4">{dt('Previous Attempts', isArabic)}</h3>
          <p className="text-sm text-gray-400 py-6 text-center">
            {isArabic ? 'لا توجد محاولات سابقة بعد.' : 'No previous attempts yet.'}
          </p>
        </Card>
      </div>
    );
  }

  if (examState === 'results') {
    const pct = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;
    const passed = pct >= 65;

    return (
      <div dir={rtlDir(isArabic)} className={`max-w-2xl mx-auto space-y-6 ${rtlClass(isArabic)}`}>
        <Card padding="lg" className="text-center">
          <div
            className={cn(
              'w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4',
              passed
                ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-200'
                : 'bg-red-50 text-red-500 ring-4 ring-red-200'
            )}
          >
            {pct}%
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {passed ? `🎉 ${dt('You Passed!', isArabic)}` : dt('Keep Going!', isArabic)}
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            {totalCorrect} {isArabic ? 'إجابة صحيحة من أصل' : 'correct out of'} {questions.length}
          </p>

          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={resetExam}>
              {dt('Back', isArabic)}
            </Button>

            <Button
              onClick={() => {
                setCurrentQ(0);
                setAnswers({});
                setFlagged(new Set());
                setSelected(null);
                setTimeLeft(230 * 60);
                setExamState('active');
              }}
            >
              {dt('Retake', isArabic)}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div dir={rtlDir(isArabic)} className={`max-w-2xl mx-auto space-y-6 ${rtlClass(isArabic)}`}>
        <Card padding="lg" className="text-center">
          <p className="text-sm text-gray-500">
            {isArabic ? 'جارٍ تحميل أسئلة الاختبار...' : 'Loading exam questions...'}
          </p>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];

  if (!q) {
    return (
      <div dir={rtlDir(isArabic)} className={`max-w-2xl mx-auto space-y-6 ${rtlClass(isArabic)}`}>
        <Card padding="lg" className="text-center">
          <p className="text-sm text-red-500">
            {isArabic ? 'لا توجد أسئلة متاحة للاختبار.' : 'No exam questions are available.'}
          </p>

          <Button className="mt-4" onClick={resetExam}>
            {dt('Back', isArabic)}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div dir={rtlDir(isArabic)} className={`max-w-4xl mx-auto space-y-4 ${rtlClass(isArabic)}`}>
      <div
        className={cn(
          'bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between sticky top-0 z-20 shadow-sm',
          isArabic && 'flex-row-reverse'
        )}
      >
        <div className={cn('flex items-center gap-4', isArabic && 'flex-row-reverse')}>
          <Badge variant="info">
            {dt('Section', isArabic)} {currentQ < Math.ceil(questions.length / 2) ? '1' : '2'}
          </Badge>

          <span className="text-sm font-medium" dir={isArabic ? 'rtl' : 'ltr'}>
            {questionCounterLabel(currentQ, questions.length, isArabic)}
          </span>
        </div>

        <div className={cn('flex items-center gap-4', isArabic && 'flex-row-reverse')}>
          <div
            dir="ltr"
            className={cn(
              'px-3 py-1 rounded-lg text-sm font-mono font-bold',
              timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-900'
            )}
          >
            {formatTime(timeLeft)}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowNav(!showNav)}>
            {dt('Navigator', isArabic)}
          </Button>
        </div>
      </div>

      {showNav && (
        <Card padding="lg">
          <h3 className={cn('font-bold mb-3', isArabic ? 'text-right' : 'text-left')}>
            {isArabic ? 'متصفح الأسئلة' : 'Question Navigator'}
          </h3>

          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  'w-9 h-9 rounded-lg text-xs font-bold transition-colors',
                  i === currentQ
                    ? 'bg-blue-600 text-white'
                    : answers[i]
                      ? 'bg-emerald-100 text-emerald-700'
                      : flagged.has(i)
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card padding="lg">
        <div className={cn('flex items-center gap-2 mb-4', isArabic && 'flex-row-reverse')}>
          <Badge variant="default">
            <span dir="ltr">{q.source.toUpperCase()}</span>
          </Badge>

          <Badge variant={difficultyVariant(q.difficulty)}>
            <span dir="ltr">{q.difficulty}</span>
          </Badge>

          <button
            onClick={toggleFlag}
            className={cn(
              'p-1.5 rounded-lg',
              isArabic ? 'mr-auto' : 'ml-auto',
              flagged.has(currentQ) ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-300'
            )}
          >
            🚩
          </button>
        </div>

        <h3
          {...textProps}
          className={cn(
            'text-lg font-semibold leading-loose mb-6',
            isArabic ? 'text-right' : 'text-left'
          )}
        >
          {q.stem}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => selectAnswer(opt.key)}
              className={cn(
                'w-full rounded-xl border p-4 flex items-start gap-3 transition-all',
                isArabic ? 'text-right' : 'text-left',
                selected === opt.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                  selected === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                )}
              >
                {answerLabel(opt.key, isArabic)}
              </span>

              <span
                {...textProps}
                className={cn(
                  'flex-1 text-sm leading-6',
                  isArabic ? 'text-right' : 'text-left'
                )}
              >
                {opt.text}
              </span>
            </button>
          ))}
        </div>

        <div className={cn('flex items-center justify-between mt-6', isArabic && 'flex-row-reverse')}>
          <Button
            variant="ghost"
            onClick={() => {
              if (currentQ > 0) goTo(currentQ - 1);
            }}
            disabled={currentQ === 0}
          >
            {isArabic ? '→ السابق' : '← Previous'}
          </Button>

          {currentQ === questions.length - 1 ? (
            <Button onClick={() => setExamState('results')}>
              {dt('Submit Exam', isArabic)}
            </Button>
          ) : (
            <Button onClick={() => goTo(currentQ + 1)}>
              {isArabic ? 'التالي ←' : 'Next →'}
            </Button>
          )}
        </div>
      </Card>

      <Progress
        value={Object.keys(answers).length}
        max={questions.length}
        size="sm"
        color="bg-emerald-500"
        showLabel
      />
    </div>
  );
}
