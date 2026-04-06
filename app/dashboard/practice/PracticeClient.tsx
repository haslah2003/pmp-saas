'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  domain: string;
  subdomain: string;
  difficulty: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  rita_tip: string;
  pmbok_reference: string;
  eco_reference: string;
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  ritaTip: string;
  domain: string;
  difficulty: string;
}

interface WrapUp {
  score_message: string;
  key_learnings: { concept: string; insight: string; source: string }[];
  rita_technique: string;
  mindmap_center: string;
  mindmap_branches: {
    label: string;
    color: string;
    children: { label: string; explanation: string }[];
  }[];
  next_focus: string;
}

interface GuruReport {
  greeting: string;
  overall_assessment: string;
  strengths: { area: string; message: string }[];
  growth_areas: { area: string; priority: string; guidance: string; domain_link: string }[];
  wisdom_quote: string;
  next_session_focus: string;
  confidence_message: string;
}

interface Badge {
  id: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  score: number;
  earned_at: string;
}

interface Video {
  id: string;
  title: string;
  youtube_id: string;
  youtube_url: string;
  domain: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTIES = [
  { id: 'entry', label: 'Entry', emoji: '🟢', desc: 'Easy — Build your foundation' },
  { id: 'paced', label: 'Paced', emoji: '🟡', desc: 'Moderate — Apply your knowledge' },
  { id: 'difficult', label: 'Difficult', emoji: '🟠', desc: 'Real exam-style questions' },
  { id: 'challenging', label: 'Challenging', emoji: '🔴', desc: 'Professional level mastery' },
];

const DOMAINS = [
  { id: 'all', label: 'All Domains' },
  { id: 'people', label: 'People (42%)' },
  { id: 'process', label: 'Process (50%)' },
  { id: 'business-environment', label: 'Business Environment (8%)' },
];

const ANSWER_LABELS: Record<string, string> = { a: 'A', b: 'B', c: 'C', d: 'D' };

// ─── Radial Mind Map ──────────────────────────────────────────────────────────

function RadialMindMap({ center, branches }: { center: string; branches: WrapUp['mindmap_branches'] }) {
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [activeLeaf, setActiveLeaf] = useState<{ label: string; explanation: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const cx = 260, cy = 260, centerR = 52;
  const branchDist = 130, leafDist = 105, branchR = 40, leafR = 34;

  const branchAngles = branches.map((_, i) =>
    (i / branches.length) * 2 * Math.PI - Math.PI / 2
  );

  const downloadSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${center.replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs text-gray-400 mb-3 text-center">
        🌀 Click a branch to explore · Click again to collapse
      </p>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 520 520" className="w-full max-w-md mx-auto block">
          <rect width="520" height="520" fill="#f8fafc" rx="16" />
          {branches.map((branch, bi) => {
            const angle = branchAngles[bi];
            const bx = cx + Math.cos(angle) * branchDist;
            const by = cy + Math.sin(angle) * branchDist;
            const isExpanded = expandedBranch === bi;
            return (
              <g key={bi}>
                <line x1={cx} y1={cy} x2={bx} y2={by}
                  stroke={branch.color} strokeWidth="2"
                  strokeOpacity={isExpanded ? '0.8' : '0.35'}
                  strokeDasharray={isExpanded ? 'none' : '5,3'} />
                {isExpanded && branch.children.map((child, ci) => {
                  const total = branch.children.length;
                  const spread = total === 1 ? 0 : Math.PI * 0.55;
                  const startA = angle - spread / 2;
                  const childAngle = total === 1 ? angle : startA + (ci / (total - 1)) * spread;
                  const lx = bx + Math.cos(childAngle) * leafDist;
                  const ly = by + Math.sin(childAngle) * leafDist;
                  const isActive = activeLeaf?.label === child.label;
                  const clampedLx = Math.max(leafR + 4, Math.min(520 - leafR - 4, lx));
                  const clampedLy = Math.max(leafR + 4, Math.min(520 - leafR - 4, ly));
                  return (
                    <g key={ci} className="cursor-pointer" onClick={() => setActiveLeaf(isActive ? null : child)}>
                      <line x1={bx} y1={by} x2={clampedLx} y2={clampedLy}
                        stroke={branch.color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,3" />
                      <circle cx={clampedLx} cy={clampedLy} r={leafR}
                        fill={isActive ? branch.color : 'white'}
                        stroke={branch.color} strokeWidth={isActive ? '0' : '1.8'} opacity="0.95" />
                      <text x={clampedLx} y={clampedLy} textAnchor="middle" dominantBaseline="middle"
                        fontSize="8.5" fontWeight="600" fill={isActive ? 'white' : '#374151'}
                        className="select-none pointer-events-none">
                        {child.label.length > 11 ? child.label.slice(0, 10) + '…' : child.label}
                      </text>
                    </g>
                  );
                })}
                <g className="cursor-pointer" onClick={() => { setExpandedBranch(isExpanded ? null : bi); setActiveLeaf(null); }}>
                  <circle cx={bx} cy={by} r={branchR}
                    fill={isExpanded ? branch.color : 'white'}
                    stroke={branch.color} strokeWidth="2.5" className="transition-all" />
                  {!isExpanded && (
                    <text x={bx + branchR - 8} y={by - branchR + 8}
                      textAnchor="middle" fontSize="10" fill={branch.color}
                      fontWeight="bold" className="select-none pointer-events-none">+</text>
                  )}
                  <text x={bx} y={branch.label.includes(' ') ? by - 5 : by}
                    textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight="700"
                    fill={isExpanded ? 'white' : branch.color} className="select-none pointer-events-none">
                    {branch.label.split(' ').slice(0, 1).join(' ')}
                  </text>
                  {branch.label.includes(' ') && (
                    <text x={bx} y={by + 7} textAnchor="middle" dominantBaseline="middle"
                      fontSize="9.5" fontWeight="700" fill={isExpanded ? 'white' : branch.color}
                      className="select-none pointer-events-none">
                      {branch.label.split(' ').slice(1).join(' ')}
                    </text>
                  )}
                </g>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={centerR} fill="url(#centerGrad)" />
          <defs>
            <radialGradient id="centerGrad">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </radialGradient>
          </defs>
          <text x={cx} y={cy - 7} textAnchor="middle" fontSize="11" fill="white" fontWeight="800"
            className="select-none pointer-events-none">
            {center.length > 12 ? center.slice(0, 11) + '…' : center}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="8" fill="white" fillOpacity="0.75"
            className="select-none pointer-events-none">tap branches</text>
        </svg>
      </div>
      {activeLeaf && (
        <div className="mt-3 bg-violet-50 border border-violet-200 rounded-xl p-3 w-full max-w-md">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-violet-800 text-sm">📌 {activeLeaf.label}</p>
            <button onClick={() => setActiveLeaf(null)} className="text-violet-400 hover:text-violet-600 text-xs ml-2 flex-shrink-0">✕</button>
          </div>
          <p className="text-violet-700 text-xs mt-1.5 leading-relaxed">{activeLeaf.explanation}</p>
        </div>
      )}
      <button onClick={downloadSVG}
        className="mt-4 text-xs text-gray-400 hover:text-violet-600 border border-gray-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
        ⬇️ Download Mind Map
      </button>
    </div>
  );
}

// ─── Guru Panel ───────────────────────────────────────────────────────────────

function GuruPanel({ report, onClose, onLinkClick }: {
  report: GuruReport;
  onClose: () => void;
  onLinkClick: (domain: string) => void;
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const text = report.greeting + '\n\n' + report.overall_assessment;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guru-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧙‍♂️</span>
            <div>
              <p className="text-white font-bold text-sm">Master Chen Wei</p>
              <p className="text-amber-100 text-xs">Your Personal PMP Guru</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-all">
              {saved ? '✓ Saved' : '⬇ Save'}
            </button>
            <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-amber-900 text-sm leading-relaxed italic">&ldquo;{report.greeting}&rdquo;</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Overall Assessment</p>
          <p className="text-gray-700 text-sm leading-relaxed">{report.overall_assessment}</p>
        </div>
        {report.strengths?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">✅ Your Strengths</p>
            <div className="space-y-2">
              {report.strengths.map((s, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <p className="text-green-800 font-semibold text-xs">{s.area}</p>
                  <p className="text-green-700 text-xs mt-0.5">{s.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {report.growth_areas?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">🎯 Focus Areas</p>
            <p className="text-xs text-gray-400 mb-2">Click any area to load targeted practice in the AiTuTorZ</p>
            <div className="space-y-2">
              {report.growth_areas.map((g, i) => (
                <button key={i} onClick={() => onLinkClick(g.domain_link)}
                  className="w-full text-left bg-red-50 border border-red-200 hover:border-red-400 hover:bg-red-100 rounded-lg p-2.5 transition-all group">
                  <div className="flex items-center justify-between">
                    <p className="text-red-800 font-semibold text-xs">{g.area}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${g.priority === 'high' ? 'bg-red-200 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {g.priority}
                    </span>
                  </div>
                  <p className="text-red-700 text-xs mt-0.5">{g.guidance}</p>
                  <p className="text-violet-600 text-xs mt-1 group-hover:underline">→ Open in AiTuTorZ</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-violet-600 mb-1">💡 Master&apos;s Wisdom</p>
          <p className="text-violet-800 text-sm italic leading-relaxed">&ldquo;{report.wisdom_quote}&rdquo;</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Next Session</p>
          <p className="text-gray-700 text-sm">{report.next_session_focus}</p>
        </div>
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-3">
          <p className="text-violet-800 text-sm leading-relaxed">{report.confidence_message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Practice Component ──────────────────────────────────────────────────

export default function PracticeClient() {
  const [mode, setMode] = useState<'setup' | 'question' | 'wrapup' | 'loading'>('setup');
  const [difficulty, setDifficulty] = useState('entry');
  const [domain, setDomain] = useState('all');
  const [framework, setFramework] = useState('pmbok7');

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState(1);
  const [blocksCompleted, setBlocksCompleted] = useState(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [blockResults, setBlockResults] = useState<QuestionResult[]>([]);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);

  const [wrapUp, setWrapUp] = useState<WrapUp | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [blockScore, setBlockScore] = useState({ correct: 0, total: 0 });

  const [guruReport, setGuruReport] = useState<GuruReport | null>(null);
  const [showGuru, setShowGuru] = useState(false);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [overallScore, setOverallScore] = useState<{correct: number; total: number; pct: number} | null>(null);
  const [guruReportId, setGuruReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/practice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework, domain, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessionId(data.session.id);
      await loadBlock(data.session.id, []);
    } catch {
      setError('Failed to start session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlock = useCallback(async (sid: string, exclude: string[]) => {
    setIsLoading(true);
    setMode('loading');
    try {
      const params = new URLSearchParams({ domain, difficulty, framework, exclude: exclude.join(',') });
      const res = await fetch(`/api/practice/questions?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions);
      setCurrentQ(0);
      setSelectedAnswer(null);
      setSubmitted(false);
      setBlockResults([]);
      setMode('question');
    } catch {
      setError('Could not load questions. Please check your connection.');
      setMode('setup');
    } finally {
      setIsLoading(false);
    }
  }, [domain, difficulty, framework]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const q = questions[currentQ];
    const isCorrect = selectedAnswer === q.correct_answer;
    const result: QuestionResult = {
      questionId: q.id,
      questionText: q.question_text,
      selectedAnswer,
      correctAnswer: q.correct_answer,
      isCorrect,
      explanation: q.explanation,
      ritaTip: q.rita_tip,
      domain: q.domain,
      difficulty: q.difficulty,
    };
    setBlockResults(prev => [...prev, result]);
    setSubmitted(true);
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    } else {
      setMode('loading');
      const finalResults = blockResults;
      const newAnsweredIds = [...answeredIds, ...questions.map(q => q.id)];
      setAnsweredIds(newAnsweredIds);
      try {
        const res = await fetch('/api/practice/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, blockNumber, results: finalResults, framework }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setWrapUp(data.wrapUp);
        setVideos(data.videos || []);
        setBlockScore({ correct: data.correct, total: data.total });
        setBlocksCompleted(data.blocksCompleted);
        setBlockNumber(prev => prev + 1);
        if (data.guruReport) {
          setGuruReport(data.guruReport);
          setShowGuru(true);
        }
        if (data.badge) {
          setBadge(data.badge);
        }
        if (data.overallScore) {
          setOverallScore(data.overallScore);
        }
        if (data.guruReportId) {
          setGuruReportId(data.guruReportId);
        }
        setMode('wrapup');
      } catch {
        setError('Failed to submit block. Please try again.');
        setMode('question');
      }
    }
  };

 const handleGuruLink = (domain: string) => {
  const msg = `I am struggling with "${domain}" in the PMP exam. Please help me with:

1. A clear, simple explanation of the key concepts in this area
2. The most common mistakes candidates make on exam questions about this topic
3. Rita Mulcahy's specific technique for answering these questions correctly
4. 2 practice questions with detailed explanations to test my understanding

Please be warm, encouraging, and focus on what I need to know to pass the exam.`;
  window.open(`/dashboard/tutor?q=${encodeURIComponent(msg)}`, '_blank');
};

  const currentQuestion = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + (submitted ? 1 : 0)) / questions.length) * 100 : 0;

  // ── Setup Screen ──
  if (mode === 'setup') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Questions</h1>
          <p className="text-gray-500">Adaptive Learning Engine · PMBOK 7 & 8</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-6 text-sm">{error}</div>
        )}

        {/* Framework Switcher */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose your framework</p>
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button onClick={() => setFramework('pmbok7')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                framework === 'pmbok7' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              📘 PMBOK 7 + ECO 2021
            </button>
            <button onClick={() => setFramework('pmbok8')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                framework === 'pmbok8' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              📗 PMBOK 8 + ECO 2026
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose your difficulty level</p>
          <div className="grid grid-cols-2 gap-3">
            {DIFFICULTIES.map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  difficulty === d.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{d.emoji}</span>
                  <span className="font-semibold text-gray-900 text-sm">{d.label}</span>
                </div>
                <p className="text-xs text-gray-500">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Domain */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filter by domain</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button key={d.id} onClick={() => setDomain(d.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  domain === d.id ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={startSession} disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 text-lg">
          {isLoading ? 'Starting…' : '🚀 Start Practice Session'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          5 questions per block · AI wrap-up after each block · Guru report after 15 questions
        </p>
      </div>
    );
  }

  // ── Loading Screen ──
  if (mode === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Preparing your questions…</p>
        </div>
      </div>
    );
  }

  // ── Question Screen ──
  if (mode === 'question' && currentQuestion) {
    const optionKeys = ['a', 'b', 'c', 'd'] as const;
    const optionTexts: Record<string, string> = {
      a: currentQuestion.option_a,
      b: currentQuestion.option_b,
      c: currentQuestion.option_c,
      d: currentQuestion.option_d,
    };

    return (
      <div className={`max-w-2xl mx-auto py-6 px-4 ${showGuru ? 'mr-96' : ''} transition-all`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMode('setup')} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
            <span className="text-xs text-gray-400">Block {blockNumber} · Q{currentQ + 1}/5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              difficulty === 'entry' ? 'bg-green-100 text-green-700' :
              difficulty === 'paced' ? 'bg-yellow-100 text-yellow-700' :
              difficulty === 'difficult' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {DIFFICULTIES.find(d => d.id === difficulty)?.emoji} {DIFFICULTIES.find(d => d.id === difficulty)?.label}
            </span>
            {guruReport && (
              <button onClick={() => setShowGuru(true)}
                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1 rounded-full transition-all">
                🧙‍♂️ Guru
              </button>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div className="bg-violet-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="mb-4">
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">
            {currentQuestion.domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
          <p className="text-gray-900 font-medium text-base leading-relaxed">{currentQuestion.question_text}</p>
        </div>

        <div className="space-y-3 mb-6">
          {optionKeys.map(key => {
            const isSelected = selectedAnswer === key;
            const isCorrect = key === currentQuestion.correct_answer;
            let style = 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50';
            if (submitted) {
              if (isCorrect) style = 'border-green-400 bg-green-50';
              else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50';
              else style = 'border-gray-100 bg-gray-50 opacity-60';
            } else if (isSelected) {
              style = 'border-violet-500 bg-violet-50';
            }
            return (
              <button key={key} onClick={() => !submitted && setSelectedAnswer(key)} disabled={submitted}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}>
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    submitted && isCorrect ? 'bg-green-500 text-white' :
                    submitted && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {submitted && isCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✗' : ANSWER_LABELS[key]}
                  </span>
                  <span className="text-gray-800 text-sm leading-relaxed">{optionTexts[key]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">📖 Explanation</p>
              <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            {currentQuestion.rita_tip && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">💡 Rita&apos;s Tip</p>
                <p className="text-amber-800 text-sm leading-relaxed">{currentQuestion.rita_tip}</p>
              </div>
            )}
            <div className="flex gap-2 text-xs text-gray-400">
              <span>{currentQuestion.pmbok_reference}</span>
              <span>·</span>
              <span>{currentQuestion.eco_reference}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!submitted ? (
            <button onClick={handleSubmit} disabled={!selectedAnswer}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40">
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all">
              {currentQ < questions.length - 1 ? 'Next Question →' : 'Complete Block →'}
            </button>
          )}
        </div>

        {showGuru && guruReport && (
          <GuruPanel report={guruReport} onClose={() => setShowGuru(false)} onLinkClick={handleGuruLink} />
        )}
      </div>
    );
  }

  // ── Wrap-up Screen ──
  if (mode === 'wrapup' && wrapUp) {
    const pct = Math.round((blockScore.correct / blockScore.total) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';

    return (
      <div className={`max-w-2xl mx-auto py-6 px-4 ${showGuru ? 'mr-96' : ''} transition-all`}>
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${
            pct >= 80 ? 'bg-green-100' : pct >= 60 ? 'bg-yellow-100' : 'bg-orange-100'
          }`}>{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900">Block {blockNumber - 1} Complete</h2>
          <p className="text-4xl font-bold mt-1" style={{ color: pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#ea580c' }}>
            {blockScore.correct}/{blockScore.total}
          </p>
          <p className="text-gray-500 text-sm mt-1">{wrapUp.score_message}</p>
          {overallScore && (
            <div className="mt-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2 inline-block">
              <p className="text-sm font-semibold text-violet-700">
                📊 Overall: {overallScore.correct}/{overallScore.total} ({overallScore.pct}%) across last 15 questions
              </p>
            </div>
          )}
        </div>
        {badge && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 mb-4 text-center animate-pulse-once">
            <div className="text-5xl mb-3">{badge.badge_icon}</div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Badge Earned!</p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{badge.badge_name}</h3>
            <p className="text-sm text-gray-600">{badge.badge_description}</p>
            <div className="mt-3 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              🎯 {badge.score}% accuracy
            </div>
          </div>
        )}

        <WrapUpTabs wrapUp={wrapUp} videos={videos} />

        <div className="mt-6 space-y-3">
          {guruReport && !showGuru && (
            <button onClick={() => setShowGuru(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              🧙‍♂️ View Your Guru Progress Report
            </button>
            )}
            {guruReportId && (
              <a href={"/dashboard/guru-report/" + guruReportId} target="_blank"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center">
                📊 View Full Interactive Report
              </a>
            )}
          <button onClick={() => loadBlock(sessionId!, answeredIds)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all">
            Continue — Next Block of 5 →
          </button>
          <button onClick={() => { setMode('setup'); setBlockNumber(1); setAnsweredIds([]); setBlocksCompleted(0); }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all text-sm">
            Start New Session
          </button>
        </div>

        {showGuru && guruReport && (
          <GuruPanel report={guruReport} onClose={() => setShowGuru(false)} onLinkClick={handleGuruLink} />
        )}
      </div>
    );
  }

  return null;
}

// ─── Wrap-up Tabs ─────────────────────────────────────────────────────────────

function WrapUpTabs({ wrapUp, videos }: { wrapUp: WrapUp; videos: Video[] }) {
  const [activeTab, setActiveTab] = useState<'learnings' | 'rita' | 'mindmap' | 'videos'>('learnings');

  const tabs = [
    { id: 'learnings', label: '📚 Key Learnings' },
    { id: 'rita', label: '🎯 Rita Technique' },
    { id: 'mindmap', label: '🧠 Mind Map' },
    ...(videos.length > 0 ? [{ id: 'videos', label: '🎥 Videos' }] : []),
  ] as const;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'text-violet-700 border-b-2 border-violet-600 bg-violet-50' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === 'learnings' && (
          <div className="space-y-3">
            {wrapUp.key_learnings.map((kl, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{kl.concept}</p>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{kl.source}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{kl.insight}</p>
              </div>
            ))}
            <div className="bg-violet-50 rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-violet-600 mb-1">Next Focus</p>
              <p className="text-violet-800 text-sm">{wrapUp.next_focus}</p>
            </div>
          </div>
        )}
        {activeTab === 'rita' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <p className="font-semibold text-amber-800">Rita Mulcahy Exam Technique</p>
              </div>
              <p className="text-amber-900 text-sm leading-relaxed">{wrapUp.rita_technique}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">QUICK STRATEGY REMINDERS</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>• Read the <strong>last sentence first</strong> to know what&apos;s being asked</li>
                <li>• Ask: <strong>&quot;What would a GOOD PM do?&quot;</strong></li>
                <li>• Eliminate answers with <strong>&quot;always&quot;</strong> or <strong>&quot;never&quot;</strong></li>
                <li>• When in doubt: pick the most <strong>proactive, communicative</strong> answer</li>
                <li>• Agile questions: look for <strong>servant leadership</strong></li>
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'mindmap' && (
          <RadialMindMap center={wrapUp.mindmap_center} branches={wrapUp.mindmap_branches} />
        )}
        {activeTab === 'videos' && videos.length > 0 && (
          <div className="space-y-4">
            {videos.map(v => (
              <div key={v.id} className="rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-video bg-black">
                  <iframe src={`https://www.youtube.com/embed/${v.youtube_id}`} title={v.title}
                    className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm">{v.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.domain}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}