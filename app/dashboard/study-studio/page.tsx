'use client';

import React, { useState } from 'react';
import { Card, Tabs, Button, Badge, Progress } from '@/components/ui';
import { cn, shuffleArray } from '@/lib/utils';
import { SAMPLE_QUESTIONS } from '@/lib/pmp-data';
import type { StudyTab } from '@/types';

// ── Notes Tab ───────────────────────────────────────────────────────────────
function NotesTab() {
  const [note, setNote] = useState('');
  const [savedNotes] = useState([
    { id: '1', topic: 'Stakeholder Engagement', content: 'Key strategies: identify early, analyze power/interest, develop engagement plans, monitor continuously.', tags: ['stakeholders', 'pmbok7'], date: '2 hours ago' },
    { id: '2', topic: 'Servant Leadership', content: 'Focus on team needs, remove impediments, coaching over directing. Essential for agile environments.', tags: ['team', 'leadership'], date: '1 day ago' },
    { id: '3', topic: 'EVM Formulas', content: 'CPI = EV/AC, SPI = EV/PV, EAC = BAC/CPI, ETC = EAC - AC, VAC = BAC - EAC, TCPI = (BAC-EV)/(BAC-AC)', tags: ['measurement', 'formulas'], date: '3 days ago' },
  ]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card padding="lg">
          <h3 className="font-bold mb-4">New Study Note</h3>
          <input type="text" placeholder="Topic (e.g., Risk Management)" className="w-full px-4 py-2.5 rounded-lg border border-surface-200 text-sm mb-3 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here... Markdown supported."
            className="w-full px-4 py-3 rounded-lg border border-surface-200 text-sm min-h-[200px] resize-y focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none"
          />
          <div className="flex items-center justify-between mt-4">
            <input type="text" placeholder="Tags (comma separated)" className="px-3 py-2 rounded-lg border border-surface-200 text-xs w-60 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none" />
            <Button>Save Note</Button>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-3">
        <h3 className="font-bold text-brand-900">Saved Notes</h3>
        {savedNotes.map((n) => (
          <Card key={n.id} hover padding="sm" className="cursor-pointer">
            <h4 className="font-semibold text-sm">{n.topic}</h4>
            <p className="text-xs text-brand-900/50 mt-1 line-clamp-2">{n.content}</p>
            <div className="flex items-center gap-2 mt-3">
              {n.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
              <span className="text-[10px] text-brand-900/30 ml-auto">{n.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Audio Tab ────────────────────────────────────────────────────────────────
function AudioTab() {
  const audioLessons = [
    { id: '1', title: 'PMBOK 7 Overview — Principles & Domains', duration: '12:30', domain: 'all' },
    { id: '2', title: 'Stakeholder Engagement Strategies', duration: '8:45', domain: 'stakeholders' },
    { id: '3', title: 'Agile vs Predictive — When to Use What', duration: '10:15', domain: 'development-approach' },
    { id: '4', title: 'Earned Value Management Deep Dive', duration: '15:00', domain: 'measurement' },
    { id: '5', title: 'ECO People Domain — Task Walkthrough', duration: '18:20', domain: 'people' },
  ];

  return (
    <div className="space-y-4">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Audio Lessons</h3>
          <Badge variant="info">Powered by ElevenLabs TTS</Badge>
        </div>
        <p className="text-sm text-brand-900/50 mb-6">Listen to AI-narrated lessons based on PMBOK 7 and ECO 2021 content.</p>
        <div className="space-y-2">
          {audioLessons.map((lesson, i) => (
            <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors group">
              <button className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-brand-600 transition-colors shadow-sm">
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{lesson.title}</p>
                <p className="text-xs text-brand-900/40">{lesson.duration}</p>
              </div>
              <Badge variant="default">{lesson.domain}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Flashcards Tab ──────────────────────────────────────────────────────────
function FlashcardsTab() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = [
    { front: 'What are the 8 Performance Domains in PMBOK 7?', back: 'Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty' },
    { front: 'What percentage of the PMP exam covers the People domain (ECO 2021)?', back: '42% — 14 tasks covering leadership, team management, conflict resolution, and stakeholder collaboration' },
    { front: 'Define CPI in Earned Value Management', back: 'Cost Performance Index = EV / AC. CPI > 1.0 means under budget, CPI < 1.0 means over budget.' },
    { front: 'What is Servant Leadership?', back: 'A leadership philosophy where the leader\'s primary goal is to serve the team. Focus on removing impediments, coaching, and empowering team members.' },
    { front: 'Name 3 conflict resolution techniques', back: 'Collaborate/Problem Solve (best), Compromise/Reconcile, Withdraw/Avoid, Smooth/Accommodate, Force/Direct' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-brand-900/50">Card {currentIndex + 1} of {cards.length}</span>
          <Progress value={currentIndex + 1} max={cards.length} className="w-40 mt-1" size="sm" />
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Know: 12</Badge>
          <Badge variant="danger">Review: 8</Badge>
        </div>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="relative cursor-pointer select-none"
        style={{ perspective: '1200px', minHeight: '320px' }}
      >
        <div className={cn(
          'w-full min-h-[320px] rounded-2xl transition-all duration-500 flex items-center justify-center p-8 text-center',
          flipped
            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-elevated'
            : 'bg-white border-2 border-surface-200 shadow-card'
        )} style={{ transformStyle: 'preserve-3d' }}>
          <div>
            <p className="text-xs font-semibold text-brand-900/30 mb-4 uppercase tracking-wider">
              {flipped ? '✨ Answer' : 'Question'}
            </p>
            <p className={cn('text-lg font-semibold leading-relaxed', flipped ? 'text-white' : 'text-brand-900')}>
              {flipped ? cards[currentIndex].back : cards[currentIndex].front}
            </p>
            <p className="text-xs mt-6 opacity-50">{flipped ? 'Click to see question' : 'Click to reveal answer'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="danger" size="sm" onClick={() => { setFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }}>
          ← Previous
        </Button>
        <Button variant="secondary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>
          Still Learning
        </Button>
        <Button variant="primary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>
          Got It! →
        </Button>
      </div>
    </div>
  );
}

// ── Quiz Tab ────────────────────────────────────────────────────────────────
function QuizTab() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const questions = SAMPLE_QUESTIONS;
  const q = questions[currentQ];

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === q.correct_key) setScore(score + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    setCurrentQ(Math.min(questions.length - 1, currentQ + 1));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="info">Question {currentQ + 1} of {questions.length}</Badge>
        <Badge variant={score > 0 ? 'success' : 'default'}>Score: {score}/{currentQ + (submitted ? 1 : 0)}</Badge>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">{q.source.toUpperCase()}</Badge>
          <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}>{q.difficulty}</Badge>
        </div>
        <h3 className="text-lg font-semibold text-brand-900 mb-6 leading-relaxed">{q.stem}</h3>
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrect = submitted && opt.key === q.correct_key;
            const isWrong = submitted && isSelected && opt.key !== q.correct_key;
            return (
              <button
                key={opt.key}
                onClick={() => !submitted && setSelected(opt.key)}
                disabled={submitted}
                className={cn(
                  'quiz-option w-full text-left',
                  !submitted && isSelected && 'quiz-option-selected',
                  isCorrect && 'quiz-option-correct',
                  isWrong && 'quiz-option-incorrect',
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                  isCorrect ? 'bg-emerald-500 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-brand-500 text-white' : 'bg-surface-100 text-brand-900/50'
                )}>
                  {opt.key}
                </span>
                <span className="text-sm">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={cn('mt-6 p-4 rounded-xl', selected === q.correct_key ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200')}>
            <p className="text-sm font-semibold mb-1">{selected === q.correct_key ? '✅ Correct!' : `❌ Incorrect — Correct answer: ${q.correct_key}`}</p>
            <p className="text-sm text-brand-900/70">{q.explanation}</p>
          </div>
        )}

        <div className="flex justify-end mt-6 gap-3">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selected}>Submit Answer</Button>
          ) : (
            <Button onClick={handleNext} disabled={currentQ >= questions.length - 1}>Next Question →</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── Study Studio Page ───────────────────────────────────────────────────────
export default function StudyStudioPage() {
  const [activeTab, setActiveTab] = useState<StudyTab>('notes');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Study Studio</h1>
        <p className="text-sm text-brand-900/50 mt-1">Your personal learning workspace — take notes, listen, review flashcards, and test yourself.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'notes', label: 'Notes', icon: <span>📝</span> },
          { id: 'audio', label: 'Audio', icon: <span>🎧</span> },
          { id: 'flashcards', label: 'Flashcards', icon: <span>🃏</span> },
          { id: 'quiz', label: 'Quick Quiz', icon: <span>❓</span> },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as StudyTab)}
      />

      <div className="animate-fade-in">
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'audio' && <AudioTab />}
        {activeTab === 'flashcards' && <FlashcardsTab />}
        {activeTab === 'quiz' && <QuizTab />}
      </div>
    </div>
  );
}
