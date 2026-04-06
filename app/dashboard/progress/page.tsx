'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

interface DomainStat {
  domain: string
  correct: number
  total: number
  accuracy: number
  weight: number
}

interface DifficultyStat {
  difficulty: string
  correct: number
  total: number
  accuracy: number
}

interface DayActivity {
  date: string
  count: number
}

interface RecentSession {
  id: string
  date: string
  domain: string
  difficulty: string
  score: number
  total: number
  accuracy: number
}

interface GuruReportItem {
  id: string
  overall_score: number
  overall_correct: number
  overall_total: number
  framework: string
  blocks_completed: number
  created_at: string
  badge_id: string | null
}

interface BadgeItem {
  id: string
  badge_type: string
  badge_name: string
  badge_description: string
  badge_icon: string
  domain: string | null
  score: number
  questions_count: number
  earned_at: string
}

interface PortfolioData {
  guruReports: GuruReportItem[]
  badges: BadgeItem[]
  stats: { totalReports: number; totalBadges: number; bestScore: number; avgScore: number }
}

interface ProgressData {
  empty: boolean
  readinessScore: number
  totalQuestions: number
  totalCorrect: number
  overallAccuracy: number
  avgTimePerQuestion: number
  streak: number
  totalSessions: number
  domainStats: DomainStat[]
  difficultyStats: DifficultyStat[]
  last30Days: DayActivity[]
  recentSessions: RecentSession[]
  weakAreas: string[]
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ReadinessRing({ score }: { score: number }) {
  const RADIUS = 44
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const offset = CIRCUMFERENCE - ((score || 0) / 100) * CIRCUMFERENCE

  const color =
    score >= 85
      ? '#10b981'
      : score >= 70
      ? '#3b82f6'
      : score >= 50
      ? '#f59e0b'
      : '#ef4444'

  const label =
    score >= 85
      ? 'Exam Ready'
      : score >= 70
      ? 'On Track'
      : score >= 50
      ? 'Building Up'
      : 'Early Stage'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none" stroke="#e5e7eb" strokeWidth="9"
          />
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}%</span>
        </div>
      </div>
      <span
        className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{ backgroundColor: color + '20', color }}
      >
        {label}
      </span>
    </div>
  )
}

function AccuracyBar({
  accuracy,
  color = '#6366f1',
}: {
  accuracy: number
  color?: string
}) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${accuracy}%`, backgroundColor: color }}
      />
    </div>
  )
}

function DomainCard({ stat }: { stat: DomainStat }) {
  const color =
    stat.accuracy >= 75
      ? '#10b981'
      : stat.accuracy >= 60
      ? '#3b82f6'
      : stat.accuracy > 0
      ? '#f59e0b'
      : '#9ca3af'

  const icons: Record<string, string> = {
    People: '👥',
    Process: '⚙️',
    'Business Environment': '🌐',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-2xl">{icons[stat.domain] ?? '📊'}</span>
          <h3 className="mt-1 text-sm font-semibold text-gray-900">
            {stat.domain}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            ECO Weight: {stat.weight}%
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color }}>
            {stat.total > 0 ? `${stat.accuracy}%` : '—'}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">
            {stat.total > 0 ? `${stat.correct} / ${stat.total}` : 'No data yet'}
          </p>
        </div>
      </div>
      <AccuracyBar accuracy={stat.accuracy} color={color} />
    </div>
  )
}

const DIFFICULTY_META: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  entry: { label: 'Entry', color: '#10b981', emoji: '🌱' },
  paced: { label: 'Paced', color: '#3b82f6', emoji: '⚡' },
  difficult: { label: 'Difficult', color: '#f59e0b', emoji: '🔥' },
  challenging: { label: 'Challenging', color: '#ef4444', emoji: '💎' },
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [framework, setFramework] = useState<'pmbok7' | 'pmbok8'>('pmbok7')
  const [data, setData] = useState<ProgressData | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
    fetchPortfolio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framework])

  async function fetchProgress() {
    setLoading(true)
    try {
      const res = await fetch(`/api/progress/summary?framework=${framework}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Progress fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPortfolio() {
    try {
      const res = await fetch('/api/progress/portfolio')
      const json = await res.json()
      setPortfolio(json)
    } catch (err) {
      console.error('Portfolio fetch error:', err)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

  const domainLabel: Record<string, string> = {
    People: '👥 People',
    Process: '⚙️ Process',
    'Business Environment': '🌐 Business Env',
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track your PMP exam readiness in real time
            </p>
          </div>

          {/* Framework toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['pmbok7', 'pmbok8'] as const).map((fw) => (
              <button
                key={fw}
                onClick={() => setFramework(fw)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  framework === fw
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {fw === 'pmbok7' ? 'PMBOK 7' : 'PMBOK 8'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-40">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-500 text-sm">
                Loading your progress…
              </p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && (!data || data.empty) && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm text-sm">
              Complete your first practice session to start tracking your
              progress here.
            </p>
            <Link
              href="/practice"
              className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              Start Practicing
            </Link>
          </div>
        )}

        {/* ── Dashboard ── */}
        {!loading && data && !data.empty && (
          <>
            {/* Row 1 — Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Readiness Score */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Readiness Score
                </p>
                <ReadinessRing score={data.readinessScore} />
                <p className="text-[10px] text-gray-400 mt-3 text-center leading-tight">
                  ECO-weighted across all domains
                </p>
              </div>

              {/* Overall Accuracy */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Overall Accuracy
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {data.overallAccuracy}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {data.totalCorrect} of {data.totalQuestions} correct
                </p>
                <div className="mt-3">
                  <AccuracyBar accuracy={data.overallAccuracy} color="#6366f1" />
                </div>
              </div>

              {/* Questions Answered */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Questions Answered
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {(data.totalQuestions ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {data.totalSessions ?? 0} session
                  {(data.totalSessions ?? 0) !== 1 ? 's' : ''} completed
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  ~{data.avgTimePerQuestion ?? 0}s avg per question
                </p>
              </div>

              {/* Study Streak */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Study Streak
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-4xl font-bold text-gray-900">
                    {data.streak}
                  </p>
                  <span className="text-3xl mb-0.5">🔥</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {data.streak === 1 ? 'day' : 'days'} in a row
                </p>
                <p className="text-xs text-amber-500 mt-1 font-medium">
                  {data.streak >= 7
                    ? '🏆 Impressive streak!'
                    : data.streak >= 3
                    ? '⚡ Keep it going!'
                    : '✨ Build your habit!'}
                </p>
              </div>
            </div>

            {/* Row 2 — Domain Breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-base font-bold text-gray-900">
                  Domain Breakdown
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  ECO 2021 weightings
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data.domainStats ?? []).map((stat) => (
                  <DomainCard key={stat.domain} stat={stat} />
                ))}
              </div>
            </div>

            {/* Row 3 — Difficulty + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Difficulty Ladder */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Difficulty Ladder
                </h2>
                <div className="space-y-5">
                  {(data.difficultyStats ?? []).map((s) => {
                    const meta = DIFFICULTY_META[s.difficulty] ?? {
                      label: s.difficulty,
                      color: '#6366f1',
                      emoji: '📊',
                    }
                    return (
                      <div key={s.difficulty}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{meta.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {meta.label}
                            </span>
                          </div>
                          <div className="text-right flex items-baseline gap-2">
                            <span
                              className="text-sm font-bold"
                              style={{ color: meta.color }}
                            >
                              {s.total > 0 ? `${s.accuracy}%` : '—'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {s.total > 0
                                ? `${s.correct}/${s.total}`
                                : 'No data'}
                            </span>
                          </div>
                        </div>
                        <AccuracyBar
                          accuracy={s.accuracy}
                          color={meta.color}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 30-Day Activity Grid */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-0.5">
                  30-Day Activity
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Practice sessions per day
                </p>

                <div className="grid grid-cols-10 gap-1.5">
                  {(data.last30Days ?? []).map((day) => {
                    const intensity =
                      day.count === 0
                        ? 'bg-gray-100'
                        : day.count === 1
                        ? 'bg-violet-200'
                        : day.count === 2
                        ? 'bg-violet-400'
                        : 'bg-violet-600'
                    const isToday = day.date === todayStr
                    return (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} session${
                          day.count !== 1 ? 's' : ''
                        }`}
                        className={`w-full aspect-square rounded-md ${intensity} ${
                          isToday
                            ? 'ring-2 ring-violet-600 ring-offset-1'
                            : ''
                        } transition-colors cursor-default`}
                      />
                    )
                  })}
                </div>

                <div className="flex items-center gap-1.5 mt-4">
                  <span className="text-[10px] text-gray-400 mr-1">Less</span>
                  {[
                    'bg-gray-100',
                    'bg-violet-200',
                    'bg-violet-400',
                    'bg-violet-600',
                  ].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">More</span>
                </div>

                {data.streak > 0 && (
                  <div className="mt-4 flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs text-amber-700 font-medium">
                      You&apos;ve studied {data.streak} day
                      {data.streak !== 1 ? 's' : ''} in a row!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4 — Recent Sessions */}
            {(data.recentSessions ?? []).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900">
                    Recent Sessions
                  </h2>
                  <Link
                    href="/practice"
                    className="text-xs text-violet-600 font-medium hover:underline"
                  >
                    + New Session
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          'Date',
                          'Domain',
                          'Difficulty',
                          'Score',
                          'Accuracy',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(data.recentSessions ?? []).map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {formatDate(s.date)}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {domainLabel[s.domain] ?? s.domain}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                s.difficulty === 'challenging'
                                  ? 'bg-red-100 text-red-700'
                                  : s.difficulty === 'difficult'
                                  ? 'bg-amber-100 text-amber-700'
                                  : s.difficulty === 'paced'
                                  ? 'bg-blue-100 text-blue-700'
                                  : s.difficulty === 'entry'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {s.difficulty || 'Mixed'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {s.score} / {s.total}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-bold ${
                                  s.accuracy >= 75
                                    ? 'text-green-600'
                                    : s.accuracy >= 60
                                    ? 'text-blue-600'
                                    : 'text-amber-600'
                                }`}
                              >
                                {s.accuracy}%
                              </span>
                              <div className="w-16">
                                <AccuracyBar
                                  accuracy={s.accuracy}
                                  color={
                                    s.accuracy >= 75
                                      ? '#10b981'
                                      : s.accuracy >= 60
                                      ? '#3b82f6'
                                      : '#f59e0b'
                                  }
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Row 5 — Focus Areas */}
            {(data.weakAreas ?? []).length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎯</span>
                  <h2 className="text-base font-bold text-gray-900">
                    Focus Areas
                  </h2>
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                    Needs attention
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(data.weakAreas ?? []).map((area) => (
                    <Link
                      key={area}
                      href={`/tutor?topic=${encodeURIComponent(
                        `I need focused help on "${area}" for my PMP exam. Please explain the key concepts, common question patterns, and the most important tips from Rita Mulcahy and the ECO framework for this area.`
                      )}&from=progress`}
                      className="bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-md transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {area}
                        </span>
                        <span className="text-xs text-amber-600 group-hover:translate-x-0.5 transition-transform">
                          Study →
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Open AiTuTorZ for a targeted lesson
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── Guru Reports History ── */}
            {portfolio && portfolio.guruReports.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧙‍♂️</span>
                    <h3 className="text-base font-bold text-gray-900">Guru Progress Reports</h3>
                  </div>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                    {portfolio.stats.totalReports} report{portfolio.stats.totalReports !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.bestScore}%</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">Best Score</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.avgScore}%</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">Average</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.totalReports}</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">Sessions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {portfolio.guruReports.map((r) => {
                    const date = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    const color = r.overall_score >= 80 ? 'text-emerald-600' : r.overall_score >= 60 ? 'text-amber-600' : 'text-red-500'
                    return (
                      <Link key={r.id} href={"/dashboard/guru-report/" + r.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-violet-300 hover:bg-violet-50 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            r.overall_score >= 80 ? 'bg-emerald-100 text-emerald-700' : r.overall_score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {r.overall_score}%
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                              Session Report — {r.overall_correct}/{r.overall_total} correct
                            </p>
                            <p className="text-xs text-gray-400">{date} · {r.blocks_completed} blocks · {r.framework === 'pmbok8' ? 'PMBOK 8' : 'PMBOK 7'}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${color}`}>{r.overall_score}%</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Badges Collection ── */}
            {portfolio && portfolio.badges.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <h3 className="text-base font-bold text-gray-900">Badges Earned</h3>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    {portfolio.stats.totalBadges} badge{portfolio.stats.totalBadges !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {portfolio.badges.map((b) => {
                    const date = new Date(b.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    return (
                      <div key={b.id} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                        <div className="text-3xl mb-2">{b.badge_icon}</div>
                        <p className="text-xs font-bold text-gray-900 mb-0.5">{b.badge_name}</p>
                        <p className="text-[10px] text-gray-500 leading-snug">{b.badge_description}</p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            {b.score}%
                          </span>
                          <span className="text-[10px] text-gray-400">{date}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Certifications (Coming Soon) ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  <h3 className="text-base font-bold text-gray-900">Certifications</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">Coming Soon</span>
              </div>
              <p className="text-sm text-gray-500">Complete domain mastery tests and mock exams to earn downloadable certificates of achievement.</p>
            </div>

            {/* Exam readiness tip banner */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">
                  {data.readinessScore >= 75
                    ? '🏆 You\'re approaching exam readiness!'
                    : '📚 Keep practising — consistency is the key!'}
                </p>
                <p className="text-xs text-violet-200 mt-0.5">
                  PMP pass mark is ~61%. Aim for 75%+ to build confidence.
                </p>
              </div>
              <Link
                href="/practice"
                className="bg-white text-violet-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors whitespace-nowrap ml-4"
              >
                Practice Now
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}