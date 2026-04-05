'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────
interface GuruReportData {
  id: string;
  greeting: string;
  overall_assessment: string;
  strengths: { area: string; message: string }[];
  growth_areas: { area: string; priority: string; guidance: string; domain_link: string }[];
  wisdom_quote: string;
  next_session_focus: string;
  confidence_message: string;
  overall_score: number;
  overall_correct: number;
  overall_total: number;
  domain_scores: Record<string, { correct: number; total: number }>;
  weak_areas: { domain: string; score: number }[];
  community_avg: Record<string, number>;
  blocks_completed: number;
  framework: string;
  badge_id: string | null;
  badges: { badge_name: string; badge_icon: string; badge_description: string; score: number } | null;
  created_at: string;
}

interface Props {
  report: GuruReportData;
  learnerName: string;
  sessionNumber: number;
  targetBenchmarks: Record<string, number>;
  aspirationalBenchmarks: Record<string, number>;
  historicalScores: { overall_score: number; created_at: string }[];
}

// ─── Normalize domain keys (fix duplication) ──────────────────────
function normalizeDomainScores(raw: Record<string, { correct: number; total: number }>) {
  const merged: Record<string, { correct: number; total: number; displayName: string }> = {};

  const DOMAIN_MAP: Record<string, string> = {
    'people': 'People',
    'People': 'People',
    'process': 'Process',
    'Process': 'Process',
    'business-environment': 'Business Environment',
    'Business Environment': 'Business Environment',
    'business_environment': 'Business Environment',
  };

  Object.entries(raw).forEach(([key, val]) => {
    const normalized = DOMAIN_MAP[key] || key;
    if (!merged[normalized]) {
      merged[normalized] = { correct: 0, total: 0, displayName: normalized };
    }
    merged[normalized].correct += val.correct || 0;
    merged[normalized].total += val.total || 0;
  });

  return merged;
}

// ─── Tooltip Component ────────────────────────────────────────────
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl leading-relaxed print-tooltip">
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900" />
          {content}
        </span>
      )}
    </span>
  );
}

// ─── Benchmark Bar ────────────────────────────────────────────────
function BenchmarkBar({
  label,
  yourScore,
  communityAvg,
  targetPro,
  aspirational,
  domain,
}: {
  label: string;
  yourScore: number;
  communityAvg: number;
  targetPro: number;
  aspirational: number;
  domain: string;
}) {
  const gap = targetPro - yourScore;
  const sessionsNeeded = gap > 0 ? Math.ceil(gap / 5) : 0;
  const yourColor = yourScore >= targetPro ? '#7c3aed' : yourScore >= communityAvg ? '#a78bfa' : '#f59e0b';

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800">{label}</h4>
        <Tooltip content={
          gap > 0
            ? `You need ${gap}% more to reach the Target Professional level. Approximately ${sessionsNeeded} focused practice session${sessionsNeeded > 1 ? 's' : ''} on ${domain} would close this gap.`
            : `Excellent! You've exceeded the Target Professional benchmark. You're performing at exam-ready level in ${domain}.`
        }>
          <span className={`text-sm font-bold ${yourScore >= targetPro ? 'text-violet-700' : 'text-amber-600'}`}>
            {yourScore}%
            {gap > 0 && <span className="text-xs font-normal text-gray-400 ml-1">({gap}% to target)</span>}
          </span>
        </Tooltip>
      </div>

      {/* Progress Track */}
      <div className="relative h-7 bg-violet-50 rounded-full overflow-visible border border-violet-100">
        {/* Your Score Bar */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${Math.min(yourScore, 100)}%`,
            background: `linear-gradient(90deg, ${yourColor}, ${yourScore >= targetPro ? '#8b5cf6' : '#c4b5fd'})`,
          }}
        />

        {/* Community Average Marker */}
        {communityAvg > 0 && (
          <Tooltip content={`Community Average: ${communityAvg}%. This is the mean score of all learners on the PMP Expert Tutor Platform using the same study materials.`}>
            <div
              className="absolute top-0 h-full w-0.5 z-10"
              style={{ left: `${Math.min(communityAvg, 100)}%`, backgroundColor: '#6366f1' }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-indigo-600 whitespace-nowrap bg-white px-1.5 py-0.5 rounded-md border border-indigo-100 shadow-sm print-marker-label">
                👥 {communityAvg}%
              </div>
            </div>
          </Tooltip>
        )}

        {/* Target Professional Marker */}
        <Tooltip content={`Target Professional: ${targetPro}%. This benchmark represents the performance level statistically correlated with PMP exam success. Reaching this level means you're exam-ready.`}>
          <div
            className="absolute top-0 h-full w-0.5 z-10"
            style={{ left: `${Math.min(targetPro, 100)}%`, backgroundColor: '#059669' }}
          >
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-emerald-700 whitespace-nowrap bg-white px-1.5 py-0.5 rounded-md border border-emerald-100 shadow-sm print-marker-label">
              🎯 {targetPro}%
            </div>
          </div>
        </Tooltip>

        {/* Aspirational Marker */}
        <Tooltip content={`Aspirational Level: ${aspirational}%. This elite benchmark represents mastery-level performance. Reaching this level indicates deep expertise beyond exam requirements.`}>
          <div
            className="absolute top-0 h-full w-0.5 z-10"
            style={{ left: `${Math.min(aspirational, 100)}%`, backgroundColor: '#a78bfa' }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-purple-500 whitespace-nowrap bg-white px-1.5 py-0.5 rounded-md border border-purple-100 shadow-sm print-marker-label">
              ⭐ {aspirational}%
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Print legend */}
      <div className="hidden print:flex items-center gap-4 mt-1 text-[8px] text-gray-500">
        <span>■ Your Score: {yourScore}%</span>
        <span className="text-indigo-600">│ Community: {communityAvg}%</span>
        <span className="text-emerald-700">│ Target: {targetPro}%</span>
        <span className="text-purple-600">│ Elite: {aspirational}%</span>
      </div>
    </div>
  );
}

// ─── Score Gauge ──────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#7c3aed' : score >= 60 ? '#a78bfa' : '#f59e0b';

  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#ede9fe" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>{score}%</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Overall</span>
      </div>
    </div>
  );
}

// ─── Trend Sparkline ─────────────────────────────────────────────
function TrendSparkline({ scores }: { scores: { overall_score: number; created_at: string }[] }) {
  if (scores.length < 2) return null;
  const max = Math.max(...scores.map(s => s.overall_score), 100);
  const min = Math.min(...scores.map(s => s.overall_score), 0);
  const range = max - min || 1;
  const w = 160, h = 40;

  const points = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * w;
    const y = h - ((s.overall_score - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Tooltip content={`Your score trend over ${scores.length} sessions. ${
      scores[scores.length - 1].overall_score > scores[0].overall_score
        ? 'You are improving!' : 'Keep practicing to see improvement.'
    }`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-40 h-10">
        <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {scores.map((s, i) => {
          const x = (i / (scores.length - 1)) * w;
          const y = h - ((s.overall_score - min) / range) * h;
          return <circle key={i} cx={x} cy={y} r="3" fill={i === scores.length - 1 ? '#7c3aed' : '#ddd6fe'} />;
        })}
      </svg>
    </Tooltip>
  );
}

// ─── Main Report Component ───────────────────────────────────────
export default function ReportClient({
  report,
  learnerName,
  sessionNumber,
  targetBenchmarks,
  aspirationalBenchmarks,
  historicalScores,
}: Props) {
  const [expandedStrength, setExpandedStrength] = useState<number | null>(null);
  const [expandedGrowth, setExpandedGrowth] = useState<number | null>(null);

  const reportDate = new Date(report.created_at).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Normalize domains to remove duplicates
  const normalizedDomains = normalizeDomainScores(
    report.domain_scores as Record<string, { correct: number; total: number }>
  );
  const domainEntries = Object.entries(normalizedDomains);

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #guru-report, #guru-report * { visibility: visible; }
          #guru-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          .print-tooltip { position: static !important; display: block !important; transform: none !important;
            background: #f9fafb !important; color: #374151 !important; border: 1px solid #e5e7eb !important;
            margin-top: 4px; width: 100% !important; border-radius: 8px; }
          .print-tooltip span { display: none; }
          .print-marker-label { font-size: 7px !important; }
        }
      `}</style>

      <div id="guru-report" className="min-h-screen bg-gray-50">
        {/* ── Top Nav (no-print) ── */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20 no-print">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/practice" className="hover:text-gray-700">Practice</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">Guru Report</span>
            </div>
            <button onClick={handlePrint}
              className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2">
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

          {/* ── 1. Header ── */}
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-violet-700 rounded-3xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">🧙‍♂️</span>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">Guru Progress Report</h1>
                    <p className="text-white/70 text-sm">PMP Expert Tutor · Master Chen Wei</p>
                  </div>
                </div>
              </div>
              {report.badges && (
                <div className="bg-white/20 rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
                  <span className="text-3xl block">{report.badges.badge_icon}</span>
                  <p className="text-xs font-bold mt-1">{report.badges.badge_name}</p>
                </div>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Learner</p>
                <p className="text-white font-bold text-sm mt-0.5">{learnerName}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Date</p>
                <p className="text-white font-bold text-sm mt-0.5">{reportDate.split(',').slice(0, 2).join(',')}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Session</p>
                <p className="text-white font-bold text-sm mt-0.5">#{sessionNumber}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Framework</p>
                <p className="text-white font-bold text-sm mt-0.5">{report.framework === 'pmbok8' ? 'PMBOK 8' : 'PMBOK 7'}</p>
              </div>
            </div>
          </div>

          {/* ── 2. Executive Summary ── */}
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
              <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wider">Executive Summary</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreGauge score={report.overall_score} />
                <div className="flex-1">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-amber-900 text-sm leading-relaxed italic">&ldquo;{report.greeting}&rdquo;</p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{report.overall_assessment}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Tooltip content={`You answered ${report.overall_correct} out of ${report.overall_total} questions correctly in this checkpoint.`}>
                      <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full font-medium cursor-help">
                        📊 {report.overall_correct}/{report.overall_total} correct
                      </span>
                    </Tooltip>
                    <Tooltip content={`You have completed ${report.blocks_completed} practice blocks (${report.blocks_completed * 5} total questions) in this session.`}>
                      <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full font-medium cursor-help">
                        📝 {report.blocks_completed} blocks completed
                      </span>
                    </Tooltip>
                    {historicalScores.length >= 2 && (
                      <div className="ml-auto">
                        <p className="text-[10px] text-gray-400 mb-1">Score Trend</p>
                        <TrendSparkline scores={historicalScores} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Benchmark Dashboard ── */}
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wider">Strategic Benchmark Dashboard</h2>
              <Tooltip content="These benchmarks help you understand where you stand relative to exam requirements, peer performance, and mastery-level achievement. Hover over any marker for details.">
                <span className="text-xs text-violet-600 font-medium cursor-help">ℹ️ How to read</span>
              </Tooltip>
            </div>
            <div className="p-6 pt-10">
              {/* Overall */}
              <BenchmarkBar
                label="Overall Performance"
                yourScore={report.overall_score}
                communityAvg={report.community_avg?.overall || 0}
                targetPro={targetBenchmarks['overall'] || 80}
                aspirational={aspirationalBenchmarks['overall'] || 95}
                domain="all domains"
              />

              {/* Per Domain — deduplicated */}
              {domainEntries.map(([domain, vals]) => {
                const score = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
                const communityDomain = report.community_avg?.[domain] || report.community_avg?.[domain.toLowerCase()] || 0;
                const targetDomain = targetBenchmarks[domain] || targetBenchmarks[domain.toLowerCase()] || 80;
                const aspirationalDomain = aspirationalBenchmarks[domain] || aspirationalBenchmarks[domain.toLowerCase()] || 95;

                return (
                  <BenchmarkBar
                    key={domain}
                    label={vals.displayName}
                    yourScore={score}
                    communityAvg={communityDomain}
                    targetPro={targetDomain}
                    aspirational={aspirationalDomain}
                    domain={vals.displayName}
                  />
                );
              })}

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-5 mt-6 pt-4 border-t border-violet-100 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-violet-600" />
                  <Tooltip content="Your current score — the filled bar shows your accuracy percentage.">
                    <span className="cursor-help">Your Score</span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-indigo-500" />
                  <Tooltip content="The average score across all learners on the PMP Expert Tutor platform.">
                    <span className="cursor-help">Community Average</span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-600" />
                  <Tooltip content="The Target Professional benchmark — the minimum level for PMP exam success.">
                    <span className="cursor-help">Target Professional</span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-purple-400" />
                  <Tooltip content="The Elite level — mastery-grade performance beyond exam requirements.">
                    <span className="cursor-help">Elite Level</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. Gap Analysis ── */}
          {domainEntries.some(([, vals]) => {
            const score = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
            const target = targetBenchmarks[vals.displayName] || targetBenchmarks[vals.displayName.toLowerCase()] || 80;
            return score < target;
          }) && (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Gap Analysis — Path to Exam Ready</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {domainEntries.map(([domain, vals]) => {
                  const score = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
                  const target = targetBenchmarks[domain] || targetBenchmarks[domain.toLowerCase()] || 80;
                  const gap = target - score;
                  if (gap <= 0) return null;
                  const sessions = Math.ceil(gap / 5);

                  return (
                    <Tooltip key={domain} content={`Focus on ${vals.displayName} practice questions. Each session of 15 questions typically improves accuracy by 3-5%. At your current pace, ${sessions} targeted session${sessions > 1 ? 's' : ''} should close this gap.`}>
                      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 cursor-help hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-gray-900">{vals.displayName}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            gap > 15 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>{gap > 15 ? 'High Priority' : 'Medium Priority'}</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-black text-amber-700">{gap}%</span>
                          <span className="text-xs text-amber-600 mb-1">gap to target</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          ~{sessions} focused session{sessions > 1 ? 's' : ''} needed · Current: {score}% → Target: {target}%
                        </p>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 5. Strengths ── */}
          {report.strengths?.length > 0 && (
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
                <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wider">✅ Identified Strengths</h2>
              </div>
              <div className="p-6 space-y-3">
                {report.strengths.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setExpandedStrength(expandedStrength === i ? null : i)}
                    className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-800">{s.area}</h4>
                      <span className="text-emerald-400 text-xs">{expandedStrength === i ? '▲' : '▼'}</span>
                    </div>
                    {(expandedStrength === i) && (
                      <p className="text-sm text-emerald-700 mt-2 leading-relaxed">{s.message}</p>
                    )}
                    <p className="hidden print:block text-sm text-emerald-700 mt-2 leading-relaxed">{s.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 6. Growth Areas ── */}
          {report.growth_areas?.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden print-break">
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider">🎯 Growth Areas & Recommendations</h2>
              </div>
              <div className="p-6 space-y-3">
                {report.growth_areas.map((g, i) => (
                  <div
                    key={i}
                    onClick={() => setExpandedGrowth(expandedGrowth === i ? null : i)}
                    className="border border-amber-200 bg-amber-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-800">{g.area}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          g.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>{g.priority}</span>
                        <span className="text-amber-400 text-xs">{expandedGrowth === i ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {(expandedGrowth === i) && (
                      <div className="mt-3">
                        <p className="text-sm text-amber-700 leading-relaxed">{g.guidance}</p>
                        <Link href={"/dashboard/tutor?q=" + encodeURIComponent("Help me improve in " + g.domain_link + " for the PMP exam")}
                          className="inline-flex items-center gap-1 text-xs text-violet-600 font-semibold mt-2 hover:underline no-print">
                          → Open in AI Tutor
                        </Link>
                      </div>
                    )}
                    <div className="hidden print:block mt-3">
                      <p className="text-sm text-amber-700 leading-relaxed">{g.guidance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 7. Domain Breakdown ── */}
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
              <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wider">Domain Performance Breakdown</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {domainEntries.map(([domain, vals]) => {
                const score = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
                const target = targetBenchmarks[domain] || targetBenchmarks[domain.toLowerCase()] || 80;
                const status = score >= target ? 'Exam Ready' : score >= target - 10 ? 'Almost There' : 'Needs Focus';
                const statusColor = score >= target
                  ? 'text-violet-700 bg-violet-50 border-violet-200'
                  : score >= target - 10
                  ? 'text-amber-600 bg-amber-50 border-amber-200'
                  : 'text-red-600 bg-red-50 border-red-200';

                return (
                  <Tooltip key={domain} content={`${vals.displayName}: ${vals.correct} correct out of ${vals.total} questions (${score}%). Target: ${target}%.`}>
                    <div className={`rounded-xl border p-5 text-center cursor-help hover:shadow-md transition-shadow ${statusColor}`}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">{vals.displayName}</p>
                      <p className="text-3xl font-black">{score}%</p>
                      <p className="text-xs mt-1">{vals.correct}/{vals.total} correct</p>
                      <p className="text-xs font-bold mt-2 uppercase">{status}</p>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* ── 8. Next Steps & Wisdom ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-violet-900 uppercase tracking-wider mb-3">📋 Next Session Recommendations</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{report.next_session_focus}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6">
              <h3 className="text-sm font-bold text-violet-800 uppercase tracking-wider mb-3">💡 Master&apos;s Wisdom</h3>
              <p className="text-sm text-violet-900 leading-relaxed italic">&ldquo;{report.wisdom_quote}&rdquo;</p>
            </div>
          </div>

          {/* ── 9. Footer ── */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-center text-white">
            <p className="text-sm leading-relaxed mb-2">{report.confidence_message}</p>
            <p className="text-white/60 text-xs">— Master Chen Wei, PMP Expert Tutor</p>
            <div className="mt-4 pt-4 border-t border-white/20 text-[10px] text-white/40">
              Report ID: {report.id.slice(0, 8)} · Generated {reportDate} · PMP Expert Tutor Platform · pmp-saas.vercel.app
            </div>
          </div>

          {/* Back button (no-print) */}
          <div className="text-center no-print">
            <Link href="/dashboard/practice"
              className="text-sm text-violet-600 hover:underline font-medium">
              ← Back to Practice
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
