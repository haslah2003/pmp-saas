'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Button, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SAMPLE_QUESTIONS } from '@/lib/pmp-data';

type ExamState = 'intro' | 'active' | 'break' | 'results';

export default function MockExamPage() {
  const [examState, setExamState] = useState<ExamState>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(230 * 60);
  const [showNav, setShowNav] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = [...SAMPLE_QUESTIONS, ...SAMPLE_QUESTIONS].slice(0, 10);

  useEffect(() => {
    if (examState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 0) { clearInterval(timerRef.current!); setExamState('results'); return 0; } return prev - 1; });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [examState]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const selectAnswer = (key: string) => { setSelected(key); setAnswers({ ...answers, [currentQ]: key }); };
  const toggleFlag = () => { const next = new Set(flagged); if (next.has(currentQ)) next.delete(currentQ); else next.add(currentQ); setFlagged(next); };
  const goTo = (i: number) => { setCurrentQ(i); setSelected(answers[i] || null); setShowNav(false); };

  const totalCorrect = Object.entries(answers).filter(([i, key]) => {
    const q = questions[+i]; return q && key === q.correct_key;
  }).length;

  if (examState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div><h1 className="text-2xl font-bold">PMP Mock Exam</h1><p className="text-sm text-gray-500 mt-1">Simulate the real PMP exam experience</p></div>
        <Card padding="lg">
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 text-3xl">⏱️</div>
            <h2 className="text-xl font-bold mb-2">Ready for the Challenge?</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">180 questions in 230 minutes, split into two sections with a 10-minute break.</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="text-center"><p className="text-2xl font-bold">180</p><p className="text-xs text-gray-400">Questions</p></div>
              <div className="text-center"><p className="text-2xl font-bold">230</p><p className="text-xs text-gray-400">Minutes</p></div>
              <div className="text-center"><p className="text-2xl font-bold">2</p><p className="text-xs text-gray-400">Sections</p></div>
            </div>
            <p className="text-xs text-gray-300 mb-6">Demo: 10 questions. Full 180 in production.</p>
            <Button size="lg" onClick={() => setExamState('active')}>Begin Exam</Button>
          </div>
        </Card>
        <Card padding="lg">
          <h3 className="font-bold mb-4">Previous Attempts</h3>
          <div className="space-y-2">
            {[{ date: 'Mar 18, 2026', score: 74, passed: true }, { date: 'Mar 10, 2026', score: 62, passed: false }, { date: 'Feb 28, 2026', score: 58, passed: false }].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm">{a.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{a.score}%</span>
                  <Badge variant={a.passed ? 'success' : 'danger'}>{a.passed ? 'PASS' : 'FAIL'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (examState === 'results') {
    const pct = Math.round((totalCorrect / questions.length) * 100);
    const passed = pct >= 65;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card padding="lg" className="text-center">
          <div className={cn('w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4', passed ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-200' : 'bg-red-50 text-red-500 ring-4 ring-red-200')}>{pct}%</div>
          <h2 className="text-2xl font-bold mb-1">{passed ? '🎉 You Passed!' : 'Keep Going!'}</h2>
          <p className="text-sm text-gray-500 mb-6">{totalCorrect} correct out of {questions.length}</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => { setExamState('intro'); setCurrentQ(0); setAnswers({}); setFlagged(new Set()); setTimeLeft(230*60); }}>Back</Button>
            <Button onClick={() => { setExamState('active'); setCurrentQ(0); setAnswers({}); setFlagged(new Set()); setSelected(null); setTimeLeft(230*60); }}>Retake</Button>
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) { setExamState('results'); return null; }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Badge variant="info">Section {currentQ < 5 ? '1' : '2'}</Badge>
          <span className="text-sm font-medium">Q{currentQ + 1} / {questions.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn('px-3 py-1 rounded-lg text-sm font-mono font-bold', timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-900')}>{formatTime(timeLeft)}</div>
          <Button variant="ghost" size="sm" onClick={() => setShowNav(!showNav)}>Navigator</Button>
        </div>
      </div>

      {showNav && (
        <Card padding="lg">
          <h3 className="font-bold mb-3">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={cn('w-9 h-9 rounded-lg text-xs font-bold transition-colors',
                  i === currentQ ? 'bg-blue-600 text-white' : answers[i] ? 'bg-emerald-100 text-emerald-700' : flagged.has(i) ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200')}>
                {i + 1}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">{q.source.toUpperCase()}</Badge>
          <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}>{q.difficulty}</Badge>
          <button onClick={toggleFlag} className={cn('ml-auto p-1.5 rounded-lg', flagged.has(currentQ) ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-300')}>🚩</button>
        </div>
        <h3 className="text-lg font-semibold leading-relaxed mb-6">{q.stem}</h3>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button key={opt.key} onClick={() => selectAnswer(opt.key)}
              className={cn('w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all',
                selected === opt.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white')}>
              <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0', selected === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400')}>{opt.key}</span>
              <span className="text-sm">{opt.text}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={() => { if (currentQ > 0) goTo(currentQ - 1); }} disabled={currentQ === 0}>← Previous</Button>
          {currentQ === questions.length - 1 ? (
            <Button onClick={() => setExamState('results')}>Submit Exam</Button>
          ) : (
            <Button onClick={() => goTo(currentQ + 1)}>Next →</Button>
          )}
        </div>
      </Card>
      <Progress value={Object.keys(answers).length} max={questions.length} size="sm" color="bg-emerald-500" showLabel />
    </div>
  );
}
