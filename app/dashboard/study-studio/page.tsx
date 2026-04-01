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

// ── Synced Slide Player (McKinsey/BCG Style) ─────────────────────────────────

interface Slide {
  title: string;
  points: string[];
  type: 'intro' | 'concept' | 'framework' | 'example' | 'summary';
  highlight?: string;
}

const SLIDE_ICONS: Record<string, string> = {
  intro: '🎯', concept: '📐', framework: '🔷', example: '💡', summary: '✅',
};

const SLIDE_ACCENTS: Record<string, string> = {
  intro: '#1B2A4A', concept: '#2563EB', framework: '#7C3AED', example: '#059669', summary: '#C5A572',
};

function SlidePlayer({
  script, topic, audioRef, isPlaying, duration, currentTime,
}: {
  script: string; topic: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean; duration: number; currentTime: number;
}) {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(true);
  const [transition, setTransition] = React.useState(true);
  const hasLoaded = React.useRef(false);

  React.useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    generateSlides();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance slides synced to audio
  React.useEffect(() => {
    if (slides.length === 0 || duration === 0) return;
    const slideInterval = duration / slides.length;
    const newSlide = Math.min(Math.floor(currentTime / slideInterval), slides.length - 1);
    if (newSlide !== currentSlide) {
      setTransition(false);
      setTimeout(() => { setCurrentSlide(newSlide); setTransition(true); }, 150);
    }
  }, [currentTime, duration, slides.length, currentSlide]);

  async function generateSlides() {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'tip',
          content: `You must create exactly 6 presentation slides. Each slide MUST start with SLIDE: on its own line.

RULES:
- Each slide has EXACTLY 3 bullet points (no more)
- Bullet points are SHORT (under 15 words each)
- Remove all ** markers
- Title should be 3-6 words
- This is for a PMP training presentation about: ${topic}

Based on this script: ${script.slice(0, 1200)}

FORMAT EXACTLY LIKE THIS:

SLIDE:intro
TITLE: ${topic}
- Learning objective one here
- Learning objective two here
- What you will master today
HIGHLIGHT: Your path to PMP excellence

SLIDE:concept
TITLE: Core Principles
- First key principle explained briefly
- Second key principle explained briefly
- Third key principle explained briefly
HIGHLIGHT: Foundation of PMBOK 7

SLIDE:framework
TITLE: The Framework
- Framework element one
- Framework element two
- Framework element three
HIGHLIGHT: How it connects to ECO 2021

SLIDE:example
TITLE: Real-World Application
- Practical scenario one
- Practical scenario two
- How PMP tests this concept
HIGHLIGHT: Think like a project manager

SLIDE:concept
TITLE: Advanced Insights
- Expert-level insight one
- Expert-level insight two
- Common misconception to avoid
HIGHLIGHT: What separates good PMs from great ones

SLIDE:summary
TITLE: Key Takeaways
- Most important point to remember
- Action item for your PMP prep
- Connect this to your experience
HIGHLIGHT: You are building real expertise`,
          lessonTitle: topic,
          domain: 'all',
          framework: 'pmbok7',
        }),
      });
      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      const parsed = parseSlides(acc);
      setSlides(parsed.length >= 3 ? parsed : buildFallbackSlides());
    } catch {
      setSlides(buildFallbackSlides());
    } finally {
      setIsGenerating(false);
    }
  }

  function parseSlides(text: string): Slide[] {
    const result: Slide[] = [];
    const blocks = text.split('SLIDE:').filter(Boolean);
    for (const block of blocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 2) continue;
      const typeLine = lines[0].toLowerCase().replace(/[^a-z]/g, '');
      const type = (['intro','concept','framework','example','summary'].includes(typeLine) ? typeLine : 'concept') as Slide['type'];
      const titleLine = lines.find(l => l.toUpperCase().startsWith('TITLE:'));
      const title = titleLine ? titleLine.replace(/^TITLE:\s*/i, '').replace(/\*\*/g, '').trim() : 'Slide';
      const points = lines.filter(l => l.startsWith('- ')).map(l => l.replace(/^- /, '').replace(/\*\*/g, '').trim()).slice(0, 3);
      const hlLine = lines.find(l => l.toUpperCase().startsWith('HIGHLIGHT:'));
      const highlight = hlLine ? hlLine.replace(/^HIGHLIGHT:\s*/i, '').replace(/\*\*/g, '').trim() : undefined;
      if (title !== 'Slide' || points.length > 0) {
        result.push({ title, points, type, highlight });
      }
    }
    return result;
  }

  function buildFallbackSlides(): Slide[] {
    const paragraphs = script.split('\n\n').filter(p => p.trim().length > 40);
    const slides: Slide[] = [
      { title: topic, points: ['PMBOK Guide 7th Edition 2021', 'PMP ECO January 2021', 'Expert-level analysis'], type: 'intro', highlight: 'Your gateway to PMP mastery' },
    ];
    paragraphs.slice(0, 4).forEach((p, i) => {
      const sentences = p.split('. ').filter(s => s.length > 15 && s.length < 120).slice(0, 3);
      if (sentences.length > 0) {
        slides.push({
          title: i === 0 ? 'Core Concepts' : i === 1 ? 'Key Framework' : i === 2 ? 'In Practice' : 'Deep Insight',
          points: sentences.map(s => s.trim().replace(/\.$/, '')),
          type: i === 0 ? 'concept' : i === 1 ? 'framework' : 'example',
        });
      }
    });
    slides.push({ title: 'Key Takeaways', points: ['Review and reflect', 'Apply to practice questions', 'Connect to your PM experience'], type: 'summary', highlight: 'You are building real PM expertise here' });
    return slides;
  }

  function goToSlide(idx: number) {
    if (slides.length === 0 || !audioRef.current || !duration) return;
    setTransition(false);
    setTimeout(() => {
      setCurrentSlide(idx);
      setTransition(true);
      if (audioRef.current && duration > 0) {
        audioRef.current.currentTime = (idx / slides.length) * duration;
      }
    }, 150);
  }

  if (isGenerating) {
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#1B2A4A] max-w-3xl mx-auto" style={{ aspectRatio: '16/10' }}>
        <div className="h-full flex flex-col items-center justify-center p-8 animate-pulse">
          <div className="w-16 h-1 bg-[#C5A572] rounded-full mb-8 opacity-50" />
          <div className="h-6 bg-white/10 rounded w-2/3 mb-4" />
          <div className="h-4 bg-white/5 rounded w-1/2 mb-8" />
          <div className="space-y-3 w-full max-w-md">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
            <div className="h-3 bg-white/10 rounded w-4/5" />
          </div>
          <p className="text-white/30 text-xs mt-8">Preparing presentation slides...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];
  const accent = SLIDE_ACCENTS[slide.type] || '#1B2A4A';
  const icon = SLIDE_ICONS[slide.type] || '📌';
  const prog = slides.length > 1 ? (currentSlide / (slides.length - 1)) * 100 : 100;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg max-w-3xl mx-auto">
      <div className="relative bg-white" style={{ aspectRatio: '16/10' }}>
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: accent }} />
        <div className="absolute top-5 left-6 flex items-center gap-3">
          <span className="text-xs font-bold text-white px-2.5 py-1 rounded-md" style={{ backgroundColor: accent }}>{currentSlide + 1} / {slides.length}</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{slide.type}</span>
        </div>
        <div className="absolute top-5 right-6">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{topic}</span>
        </div>
        <div className={`h-full flex flex-col justify-center px-8 pt-12 pb-6 transition-all duration-300 ${transition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="w-12 h-1 rounded-full mb-5" style={{ backgroundColor: '#C5A572' }} />
          <h2 className="text-3xl font-bold text-[#1B2A4A] leading-tight mb-8">
            <span className="mr-2">{icon}</span>{slide.title}
          </h2>
          <div className="space-y-4 flex-1">
            {slide.points.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: accent }} />
                <p className="text-base text-gray-700 leading-relaxed">{point.replace(/\*\*/g, '')}</p>
              </div>
            ))}
          </div>
          {slide.highlight && (
            <div className="mt-5 p-4 rounded-xl border-l-4 bg-gray-50" style={{ borderColor: '#C5A572' }}>
              <p className="text-base font-semibold text-[#1B2A4A] italic">{slide.highlight}</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gray-100">
            <div className="h-full transition-all duration-700 ease-out" style={{ width: prog + '%', backgroundColor: accent }} />
          </div>
        </div>
        {isPlaying && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-red-500 rounded-full animate-pulse" style={{ height: '40%' }} />
              <div className="w-0.5 bg-red-500 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
              <div className="w-0.5 bg-red-500 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.4s' }} />
            </div>
            <span className="text-[10px] text-red-500 font-semibold">LIVE</span>
          </div>
        )}
      </div>
      <div className="bg-[#1B2A4A] px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {slides.map((s, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            className={cn('flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              i === currentSlide ? 'bg-white text-[#1B2A4A]' : 'text-white/50 hover:text-white hover:bg-white/10'
            )}>
            <span className="mr-1">{SLIDE_ICONS[s.type]}</span>{i + 1}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-[#C5A572] font-medium flex-shrink-0">PMBOK 7 + ECO 2021</span>
      </div>
    </div>
  );
}

// ── Learning Companion Panel ─────────────────────────────────────────────────

function LearningCompanion({ script, topic, domain }: { script: string; topic: string; domain: string }) {
  const [activeSection, setActiveSection] = React.useState<'takeaways' | 'terms' | 'quiz'>('takeaways');
  const [isLoading, setIsLoading] = React.useState(false);
  const [takeaways, setTakeaways] = React.useState<string[]>([]);
  const [terms, setTerms] = React.useState<{ term: string; definition: string }[]>([]);
  const [quiz, setQuiz] = React.useState<{ question: string; options: string[]; correct: number; rationale: string }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const hasLoaded = React.useRef(false);

  React.useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadMaterials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMaterials() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'tip',
          content: `Based on this audio lesson about "${topic}", generate learning materials.

Script excerpt: ${script.slice(0, 1200)}

Respond with EXACTLY this format:

TAKEAWAY: First key insight from the lesson
TAKEAWAY: Second key insight from the lesson
TAKEAWAY: Third key insight from the lesson
TAKEAWAY: Fourth key insight from the lesson

TERM: [Term Name] | [Short definition in one sentence]
TERM: [Term Name] | [Short definition in one sentence]
TERM: [Term Name] | [Short definition in one sentence]
TERM: [Term Name] | [Short definition in one sentence]

QUESTION: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
ANSWER: [A/B/C/D]
WHY: [Brief rationale]

QUESTION: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
ANSWER: [A/B/C/D]
WHY: [Brief rationale]

QUESTION: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
ANSWER: [A/B/C/D]
WHY: [Brief rationale]`,
          lessonTitle: topic,
          domain: domain,
          framework: 'pmbok7',
        }),
      });
      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      parseMaterials(acc);
    } catch {
      setTakeaways(['Review the audio lesson for key concepts.']);
    } finally {
      setIsLoading(false);
    }
  }

  function parseMaterials(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const t: string[] = [];
    const tr: { term: string; definition: string }[] = [];
    const q: { question: string; options: string[]; correct: number; rationale: string }[] = [];

    let currentQ = '';
    let currentOpts: string[] = [];
    let currentAnswer = -1;
    let currentWhy = '';

    for (const line of lines) {
      if (line.startsWith('TAKEAWAY:')) {
        t.push(line.replace('TAKEAWAY:', '').trim());
      } else if (line.startsWith('TERM:')) {
        const parts = line.replace('TERM:', '').split('|');
        if (parts.length >= 2) {
          tr.push({ term: parts[0].trim(), definition: parts.slice(1).join('|').trim() });
        }
      } else if (line.startsWith('QUESTION:')) {
        if (currentQ && currentOpts.length >= 4) {
          q.push({ question: currentQ, options: currentOpts, correct: currentAnswer, rationale: currentWhy });
        }
        currentQ = line.replace('QUESTION:', '').trim();
        currentOpts = [];
        currentAnswer = -1;
        currentWhy = '';
      } else if (line.match(/^[A-D]\)/)) {
        currentOpts.push(line.replace(/^[A-D]\)\s*/, '').trim());
      } else if (line.startsWith('ANSWER:')) {
        const letter = line.replace('ANSWER:', '').trim().charAt(0);
        currentAnswer = 'ABCD'.indexOf(letter);
      } else if (line.startsWith('WHY:')) {
        currentWhy = line.replace('WHY:', '').trim();
      }
    }
    if (currentQ && currentOpts.length >= 4) {
      q.push({ question: currentQ, options: currentOpts, correct: currentAnswer >= 0 ? currentAnswer : 0, rationale: currentWhy });
    }

    setTakeaways(t.length > 0 ? t : ['Review the audio lesson for key concepts.']);
    setTerms(tr);
    setQuiz(q);
  }

  const sections = [
    { id: 'takeaways' as const, label: 'Key Takeaways', icon: '💡', count: takeaways.length },
    { id: 'terms' as const, label: 'Key Terms', icon: '📖', count: terms.length },
    { id: 'quiz' as const, label: 'Check Understanding', icon: '✅', count: quiz.length },
  ];

  const score = quiz.reduce((s, q, i) => s + (selectedAnswers[i] === q.correct ? 1 : 0), 0);
  const totalAnswered = Object.keys(selectedAnswers).length;

  return (
    <Card padding="none">
      <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
        <span className="text-base">🎓</span>
        <h3 className="font-bold text-sm text-gray-900">Learning Companion</h3>
        <span className="text-xs text-gray-400 ml-1">— Reinforce what you just heard</span>
      </div>
      <div className="flex border-b border-gray-100">
        {sections.map(sec => (
          <button key={sec.id} onClick={() => setActiveSection(sec.id)}
            className={cn('flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors',
              activeSection === sec.id ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}>
            <span>{sec.icon}</span><span>{sec.label}</span>
            {sec.count > 0 && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{sec.count}</span>}
          </button>
        ))}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3 animate-pulse py-4">
            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-100 rounded-md w-full" />
            <div className="h-3 bg-gray-200 rounded-md w-5/6" />
            <p className="text-xs text-gray-400 text-center pt-2">Generating learning materials...</p>
          </div>
        ) : (
          <>
            {activeSection === 'takeaways' && (
              <div className="space-y-3">
                {takeaways.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-gray-800 leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'terms' && (
              <div className="space-y-3">
                {terms.length > 0 ? terms.map((t, i) => (
                  <div key={i} className="p-3 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                    <p className="text-sm font-bold text-indigo-700">{t.term}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{t.definition}</p>
                  </div>
                )) : <p className="text-sm text-gray-500 text-center py-4">No terms generated.</p>}
              </div>
            )}
            {activeSection === 'quiz' && (
              <div className="space-y-6">
                {quiz.length > 0 ? quiz.map((q, qIdx) => {
                  const answered = selectedAnswers[qIdx] !== undefined;
                  const isCorrect = selectedAnswers[qIdx] === q.correct;
                  return (
                    <div key={qIdx} className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Q{qIdx + 1}. {q.question}</p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => (
                          <button key={oIdx}
                            onClick={() => !answered && setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            disabled={answered}
                            className={cn('w-full text-left p-3 rounded-xl text-sm transition-all border',
                              !answered && 'hover:bg-indigo-50 hover:border-indigo-200 border-gray-200',
                              answered && oIdx === selectedAnswers[qIdx] && oIdx === q.correct && 'bg-emerald-50 border-emerald-300',
                              answered && oIdx === selectedAnswers[qIdx] && oIdx !== q.correct && 'bg-red-50 border-red-300',
                              answered && oIdx !== selectedAnswers[qIdx] && oIdx === q.correct && 'bg-emerald-50 border-emerald-200',
                              answered && oIdx !== selectedAnswers[qIdx] && oIdx !== q.correct && 'border-gray-100 opacity-50',
                            )}>
                            <span className="font-semibold mr-2">{'ABCD'[oIdx]})</span>{opt}
                            {answered && oIdx === q.correct && <span className="ml-2">✓</span>}
                            {answered && oIdx === selectedAnswers[qIdx] && oIdx !== q.correct && <span className="ml-2">✗</span>}
                          </button>
                        ))}
                      </div>
                      {answered && q.rationale && (
                        <div className={cn('p-3 rounded-xl text-xs leading-relaxed mt-2', isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>
                          <span className="font-bold">{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</span> {q.rationale}
                        </div>
                      )}
                    </div>
                  );
                }) : <p className="text-sm text-gray-500 text-center py-4">No quiz generated.</p>}
                {quiz.length > 0 && totalAnswered === quiz.length && (
                  <div className={cn('p-4 rounded-xl text-center', score === quiz.length ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200')}>
                    <p className="text-lg font-bold">{score === quiz.length ? '🎉 Perfect Score!' : `📊 Score: ${score}/${quiz.length}`}</p>
                    <p className="text-xs text-gray-500 mt-1">{score === quiz.length ? 'You have mastered this concept!' : 'Review the rationale and listen again to strengthen understanding.'}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

// ── Audio Loading Messages ────────────────────────────────────────────────────

const AUDIO_LOADING_MESSAGES = [
  { text: "Our AI narrator is preparing your lesson...", sub: "Studio-quality voice powered by ElevenLabs" },
  { text: "Writing the narration script from PMBOK 7...", sub: "Every word grounded in official PMI sources" },
  { text: "Converting knowledge into an audio experience...", sub: "Listen, learn, and absorb at your own pace" },
  { text: "Crafting a personalized audio lesson...", sub: "The best PMs learn through multiple channels" },
];

function AudioLoadingMessage() {
  const [index, setIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIndex(prev => (prev + 1) % AUDIO_LOADING_MESSAGES.length); setFade(true); }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  const msg = AUDIO_LOADING_MESSAGES[index];
  return (
    <div className={`text-center transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <p className="text-sm font-semibold text-gray-800">{msg.text}</p>
      <p className="text-xs mt-1.5 font-medium text-indigo-600">{msg.sub}</p>
    </div>
  );
}

// ── Audio Tab ────────────────────────────────────────────────────────────────

const AUDIO_TOPICS = [
  { id: '1', title: 'PMBOK 7 Overview — Principles & Domains', domain: 'all', icon: '📘' },
  { id: '2', title: 'Stakeholder Engagement Strategies', domain: 'stakeholders', icon: '🤝' },
  { id: '3', title: 'Agile vs Predictive — When to Use What', domain: 'development-approach', icon: '🔄' },
  { id: '4', title: 'Earned Value Management Deep Dive', domain: 'measurement', icon: '📊' },
  { id: '5', title: 'ECO People Domain — Task Walkthrough', domain: 'people', icon: '👥' },
  { id: '6', title: 'Risk Management & Uncertainty', domain: 'uncertainty', icon: '⚡' },
  { id: '7', title: 'Team Performance & Servant Leadership', domain: 'team', icon: '👤' },
  { id: '8', title: 'Planning: Scope, Schedule & Budget', domain: 'planning', icon: '📋' },
];

function AudioTab() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [script, setScript] = React.useState('');
  const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showScript, setShowScript] = React.useState(false);
  const [error, setError] = React.useState('');
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  async function generateAudio(topic: typeof AUDIO_TOPICS[0]) {
    if (activeId === topic.id && audioSrc) { togglePlay(); return; }
    setActiveId(topic.id);
    setIsGenerating(true);
    setScript(''); setAudioSrc(null); setError('');
    setProgress(0); setCurrentTime(0); setDuration(0);
    setIsPlaying(false); setShowScript(false);
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.title }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.upgrade ? 'Audio narration requires a Premium subscription.' : (err.error || 'Failed to generate audio.'));
        setIsGenerating(false); return;
      }
      const data = await res.json();
      setScript(data.script || '');
      if (data.audio) {
        const src = `data:audio/mpeg;base64,${data.audio}`;
        setAudioSrc(src);
        setTimeout(() => { audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {}); }, 200);
      } else if (data.script) {
        setShowScript(true);
        setError('Audio conversion unavailable. Script is shown below.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setIsGenerating(false); }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
    setProgress(audioRef.current.duration ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
  }

  function formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s / 60) + ':' + (Math.floor(s % 60) < 10 ? '0' : '') + Math.floor(s % 60);
  }

  const activeTopic = AUDIO_TOPICS.find(t => t.id === activeId);

  return (
    <div className="space-y-4">
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => { setIsPlaying(false); setProgress(100); }}
          onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        />
      )}

      {/* Slide Player */}
      {activeId && !isGenerating && script && (
        <SlidePlayer script={script} topic={activeTopic?.title || ''} audioRef={audioRef} isPlaying={isPlaying} duration={duration} currentTime={currentTime} />
      )}

      {/* Audio Controls */}
      {activeId && !isGenerating && (audioSrc || script) && (
        <Card padding="none">
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={togglePlay} disabled={!audioSrc}
                className="w-12 h-12 rounded-full bg-[#1B2A4A] hover:bg-[#2a3f6e] text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-md disabled:opacity-50">
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{activeTopic?.title}</p>
                <p className="text-xs text-gray-400">AI Narration — PMBOK 7 + ECO 2021</p>
              </div>
              <button onClick={() => setShowScript(!showScript)}
                className={cn('text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', showScript ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                {showScript ? 'Hide Script' : 'Show Script'}
              </button>
            </div>
            {audioSrc && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-10 text-right font-mono">{formatTime(currentTime)}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full cursor-pointer group" onClick={handleSeek}>
                  <div className="h-full bg-[#1B2A4A] rounded-full relative transition-all" style={{ width: progress + '%' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#1B2A4A] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-10 font-mono">{formatTime(duration)}</span>
              </div>
            )}
          </div>
          {showScript && script && (
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 max-h-60 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Narration Script</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{script}</p>
            </div>
          )}
        </Card>
      )}

      {/* Learning Companion */}
      {activeId && !isGenerating && script && (
        <LearningCompanion script={script} topic={activeTopic?.title || ''} domain={activeTopic?.domain || ''} />
      )}

      {/* Loading state */}
      {isGenerating && (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-16 h-16 mb-5">
              <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e0e7ff" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray="50 126" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '2s' }} />
                <g className="animate-pulse">
                  <rect x="20" y="24" width="3" height="16" rx="1.5" fill="#6366f1" opacity="0.6" />
                  <rect x="26" y="20" width="3" height="24" rx="1.5" fill="#6366f1" opacity="0.8" />
                  <rect x="32" y="22" width="3" height="20" rx="1.5" fill="#6366f1" opacity="0.5" />
                  <rect x="38" y="18" width="3" height="28" rx="1.5" fill="#6366f1" opacity="0.7" />
                  <rect x="44" y="26" width="3" height="12" rx="1.5" fill="#6366f1" opacity="0.6" />
                </g>
              </svg>
            </div>
            <AudioLoadingMessage />
          </div>
        </Card>
      )}

      {error && !isGenerating && (
        <Card padding="sm"><p className="text-sm text-red-600 text-center py-2">{error}</p></Card>
      )}

      {/* Lesson List */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Audio Lessons</h3>
          <Badge variant="info">Powered by ElevenLabs TTS</Badge>
        </div>
        <p className="text-sm text-brand-900/50 mb-6">Click any lesson to generate an AI-narrated audio experience.</p>
        <div className="space-y-1">
          {AUDIO_TOPICS.map(topic => {
            const isActive = activeId === topic.id;
            const isCurrentlyPlaying = isActive && isPlaying;
            return (
              <button key={topic.id} onClick={() => generateAudio(topic)}
                disabled={isGenerating && activeId !== topic.id}
                className={cn('w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left',
                  isActive ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent',
                  isGenerating && activeId !== topic.id && 'opacity-50',
                )}>
                <div className={cn('w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-sm',
                  isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500')}>
                  {isCurrentlyPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '60%' }} />
                      <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                      <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                      <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.1s' }} />
                    </div>
                  ) : isActive && audioSrc ? (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <span className="text-lg">{topic.icon}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold truncate', isActive ? 'text-indigo-700' : 'text-gray-900')}>{topic.title}</p>
                  <p className="text-xs text-gray-400">AI-generated narration</p>
                </div>
                <Badge variant="default">{topic.domain}</Badge>
              </button>
            );
          })}
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
      <div onClick={() => setFlipped(!flipped)} className="relative cursor-pointer select-none" style={{ perspective: '1200px', minHeight: '320px' }}>
        <div className={cn('w-full min-h-[320px] rounded-2xl transition-all duration-500 flex items-center justify-center p-8 text-center',
          flipped ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-elevated' : 'bg-white border-2 border-surface-200 shadow-card'
        )} style={{ transformStyle: 'preserve-3d' }}>
          <div>
            <p className="text-xs font-semibold text-brand-900/30 mb-4 uppercase tracking-wider">{flipped ? '✨ Answer' : 'Question'}</p>
            <p className={cn('text-lg font-semibold leading-relaxed', flipped ? 'text-white' : 'text-brand-900')}>{flipped ? cards[currentIndex].back : cards[currentIndex].front}</p>
            <p className="text-xs mt-6 opacity-50">{flipped ? 'Click to see question' : 'Click to reveal answer'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="danger" size="sm" onClick={() => { setFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }}>← Previous</Button>
        <Button variant="secondary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>Still Learning</Button>
        <Button variant="primary" onClick={() => { setFlipped(false); setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); }}>Got It! →</Button>
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

  const handleSubmit = () => { if (!selected) return; setSubmitted(true); if (selected === q.correct_key) setScore(score + 1); };
  const handleNext = () => { setSelected(null); setSubmitted(false); setCurrentQ(Math.min(questions.length - 1, currentQ + 1)); };

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
              <button key={opt.key} onClick={() => !submitted && setSelected(opt.key)} disabled={submitted}
                className={cn('quiz-option w-full text-left', !submitted && isSelected && 'quiz-option-selected', isCorrect && 'quiz-option-correct', isWrong && 'quiz-option-incorrect')}>
                <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                  isCorrect ? 'bg-emerald-500 text-white' : isWrong ? 'bg-red-400 text-white' : isSelected ? 'bg-brand-500 text-white' : 'bg-surface-100 text-brand-900/50'
                )}>{opt.key}</span>
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
