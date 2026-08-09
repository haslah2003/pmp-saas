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

type Locale = 'en' | 'ar'

function normaliseLocale(value: string | null): Locale | null {
  return value === 'ar' || value === 'en' ? value : null
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const fromQuery = normaliseLocale(new URLSearchParams(window.location.search).get('lang'))
  if (fromQuery) return fromQuery

  const cookieMatch = document.cookie.match(/(?:^|; )pmp_locale=([^;]+)/)
  const fromCookie = normaliseLocale(cookieMatch ? decodeURIComponent(cookieMatch[1]) : null)
  if (fromCookie) return fromCookie

  const fromHtml = normaliseLocale(document.documentElement.lang)
  return fromHtml ?? 'en'
}

const UI = {
  en: {
    title: 'My Progress',
    subtitle: 'Track your PMP exam readiness in real time',
    launchRoute: 'PMBOK 7 + ECO 2021',
    currentExam: 'Current PMP exam route',
    loading: 'Loading your progress…',
    noDataTitle: 'No progress data yet',
    noDataBody: 'Complete your first practice session to start tracking your progress here.',
    startPracticing: 'Start practicing',
    readinessScore: 'Readiness Score',
    readinessNote: 'Weighted by ECO domains',
    overallAccuracy: 'Overall Accuracy',
    correctOf: 'of',
    correct: 'correct',
    questionsAnswered: 'Questions Answered',
    sessionsCompleted: 'sessions completed',
    avgPerQuestion: 'avg per question',
    studyStreak: 'Study Streak',
    day: 'day',
    days: 'days',
    inRow: 'in a row',
    streakGreat: '🏆 Impressive streak!',
    streakGood: '⚡ Keep it going!',
    streakStart: '✨ Build your habit!',
    domainBreakdown: 'Domain Breakdown',
    ecoWeightings: 'ECO 2021 Weightings',
    difficultyLadder: 'Difficulty Ladder',
    activity30: '30-Day Activity',
    sessionsPerDay: 'Practice sessions per day',
    less: 'Less',
    more: 'More',
    studied: "You've studied",
    recentSessions: 'Recent Sessions',
    newSession: '+ New Session',
    date: 'Date',
    domain: 'Domain',
    difficulty: 'Difficulty',
    score: 'Score',
    accuracy: 'Accuracy',
    noData: 'No data',
    mixed: 'Mixed',
    focusAreas: 'Focus Areas',
    needsAttention: 'Needs Attention',
    study: 'Study →',
    openTutor: 'Open Zane for a targeted lesson',
    guruReports: 'Readiness Reports',
    report: 'report',
    reports: 'reports',
    bestScore: 'Best Score',
    average: 'Average',
    sessions: 'Sessions',
    sessionReport: 'Session Report',
    blocks: 'blocks',
    badgesEarned: 'Badges Earned',
    badge: 'badge',
    badges: 'badges',
    certifications: 'Certifications',
    comingSoon: 'Coming Soon',
    certBody: 'Complete domain mastery checks and mock exams to unlock downloadable achievement certificates.',
    readyTip: "🏆 You're approaching exam readiness!",
    keepPractising: '📚 Keep practising — consistency is the key!',
    passMark: 'PMP pass mark is ~61%. Aim for 75%+ to build confidence.',
    practiceNow: 'Practice Now',
    examReady: 'Exam Ready',
    onTrack: 'On Track',
    buildingUp: 'Building Up',
    earlyStage: 'Early Stage',
    ecoWeight: 'ECO Weight',
    noDataYet: 'No data yet',
    people: '👥 People',
    process: '⚙️ Process',
    business: '🌐 Business Env',
    entry: 'Entry',
    paced: 'Paced',
    difficult: 'Difficult',
    challenging: 'Challenging',
  },
  ar: {
    title: 'تقرير الجاهزية',
    subtitle: 'تتبّع جاهزيتك لاختبار PMP الحالي لحظة بلحظة',
    launchRoute: 'PMBOK 7 + ECO 2021',
    currentExam: 'مسار اختبار PMP الحالي',
    loading: 'جاري تحميل تقدمك…',
    noDataTitle: 'لا توجد بيانات بعد',
    noDataBody: 'أكمل أول جلسة تدريبية حتى تبدأ المنصة في تتبع تقدمك هنا.',
    startPracticing: 'ابدأ التدريب',
    readinessScore: 'درجة الجاهزية',
    readinessNote: 'موزونة حسب مجالات ECO',
    overallAccuracy: 'الدقة العامة',
    correctOf: 'من',
    correct: 'صحيحة',
    questionsAnswered: 'الأسئلة المجابة',
    sessionsCompleted: 'جلسات مكتملة',
    avgPerQuestion: 'متوسط لكل سؤال',
    studyStreak: 'استمرارية الدراسة',
    day: 'يوم',
    days: 'أيام',
    inRow: 'متتالية',
    streakGreat: '🏆 استمرارية ممتازة!',
    streakGood: '⚡ واصل بنفس الإيقاع!',
    streakStart: '✨ ابنِ عادة الدراسة!',
    domainBreakdown: 'تفصيل المجالات',
    ecoWeightings: 'أوزان ECO 2021',
    difficultyLadder: 'سُلّم الصعوبة',
    activity30: 'نشاط آخر 30 يومًا',
    sessionsPerDay: 'جلسات التدريب في اليوم',
    less: 'أقل',
    more: 'أكثر',
    studied: 'لقد درست لمدة',
    recentSessions: 'الجلسات الأخيرة',
    newSession: '+ جلسة جديدة',
    date: 'التاريخ',
    domain: 'المجال',
    difficulty: 'الصعوبة',
    score: 'النتيجة',
    accuracy: 'الدقة',
    noData: 'لا توجد بيانات',
    mixed: 'مختلط',
    focusAreas: 'مجالات التركيز',
    needsAttention: 'تحتاج إلى اهتمام',
    study: 'ادرس ←',
    openTutor: 'افتح Zane لدرس موجّه',
    guruReports: 'تقارير الجاهزية',
    report: 'تقرير',
    reports: 'تقارير',
    bestScore: 'أفضل نتيجة',
    average: 'المتوسط',
    sessions: 'الجلسات',
    sessionReport: 'تقرير الجلسة',
    blocks: 'مقاطع',
    badgesEarned: 'الشارات المكتسبة',
    badge: 'شارة',
    badges: 'شارات',
    certifications: 'الشهادات',
    comingSoon: 'قريبًا',
    certBody: 'أكمل اختبارات إتقان المجالات والاختبارات المحاكية للحصول على شهادات إنجاز قابلة للتنزيل.',
    readyTip: '🏆 أنت تقترب من جاهزية الاختبار!',
    keepPractising: '📚 واصل التدريب — الاستمرارية هي المفتاح!',
    passMark: 'درجة النجاح التقريبية في PMP هي 61%. استهدف 75% فأكثر لبناء الثقة.',
    practiceNow: 'تدرّب الآن',
    examReady: 'جاهز للاختبار',
    onTrack: 'على المسار الصحيح',
    buildingUp: 'قيد التحسن',
    earlyStage: 'مرحلة مبكرة',
    ecoWeight: 'وزن ECO',
    noDataYet: 'لا توجد بيانات بعد',
    people: '👥 الأفراد',
    process: '⚙️ العمليات',
    business: '🌐 بيئة الأعمال',
    entry: 'تمهيدي',
    paced: 'متدرّج',
    difficult: 'صعب',
    challenging: 'تحدّي',
  },
} as const

// ── Sub-components ────────────────────────────────────────────────────────────

function ReadinessRing({ score, locale }: { score: number; locale: Locale }) {
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
      ? UI[locale].examReady
      : score >= 70
      ? UI[locale].onTrack
      : score >= 50
      ? UI[locale].buildingUp
      : UI[locale].earlyStage

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

function DomainCard({ stat, locale }: { stat: DomainStat; locale: Locale }) {
  const color =
    stat.accuracy >= 75
      ? '#10b981'
      : stat.accuracy >= 60
      ? '#3b82f6'
      : stat.accuracy > 0
      ? '#f59e0b'
      : '#9ca3af'

  const domainNames: Record<string, string> = {
    People: UI[locale].people,
    Process: UI[locale].process,
    'Business Environment': UI[locale].business,
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="mt-1 text-sm font-semibold text-gray-900">
            {domainNames[stat.domain] ?? stat.domain}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {UI[locale].ecoWeight}: {stat.weight}%
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color }}>
            {stat.total > 0 ? `${stat.accuracy}%` : '—'}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">
            {stat.total > 0 ? `${stat.correct} / ${stat.total}` : UI[locale].noDataYet}
          </p>
        </div>
      </div>
      <AccuracyBar accuracy={stat.accuracy} color={color} />
    </div>
  )
}

const DIFFICULTY_META: Record<
  string,
  { label: { en: string; ar: string }; color: string; emoji: string }
> = {
  entry: { label: { en: 'Entry', ar: 'تمهيدي' }, color: '#10b981', emoji: '🌱' },
  paced: { label: { en: 'Paced', ar: 'متدرّج' }, color: '#3b82f6', emoji: '⚡' },
  difficult: { label: { en: 'Difficult', ar: 'صعب' }, color: '#f59e0b', emoji: '🔥' },
  challenging: { label: { en: 'Challenging', ar: 'تحدّي' }, color: '#ef4444', emoji: '💎' },
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const framework = 'pmbok7'
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const nextLocale = detectLocale()
    setLocale(nextLocale)
    document.documentElement.lang = nextLocale
    document.cookie = `pmp_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
  }, [])
  const [data, setData] = useState<ProgressData | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLocale(detectLocale())
    fetchProgress()
    fetchPortfolio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const isArabic = locale === 'ar'
  const copy = UI[locale]

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isArabic ? 'ar' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })

  const domainLabel: Record<string, string> = {
    People: copy.people,
    Process: copy.process,
    'Business Environment': copy.business,
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {copy.subtitle}
            </p>
          </div>

          <div className="rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
            <span>{copy.launchRoute}</span>
            <span className="mx-2 text-violet-300">•</span>
            <span className="text-xs text-violet-500">{copy.currentExam}</span>
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
                {copy.loading}
              </p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && (!data || data.empty) && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {copy.noDataTitle}
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm text-sm">
              {copy.noDataBody}
            </p>
            <Link
              href={`/dashboard/practice?lang=${locale}`}
              className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              {copy.startPracticing}
            </Link>
          </div>
        )}

        {/* ── Dashboard ── */}
        {!loading && data && !data.empty && (
          <>
            {/* Row 1 — Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* {copy.readinessScore} */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {copy.readinessScore}
                </p>
                <ReadinessRing score={data.readinessScore} locale={locale} />
                <p className="text-[10px] text-gray-400 mt-3 text-center leading-tight">
                  {copy.readinessNote}
                </p>
              </div>

              {/* {copy.overallAccuracy} */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {copy.overallAccuracy}
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {data.overallAccuracy}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {data.totalCorrect} {copy.correctOf} {data.totalQuestions} {copy.correct}
                </p>
                <div className="mt-3">
                  <AccuracyBar accuracy={data.overallAccuracy} color="#6366f1" />
                </div>
              </div>

              {/* {copy.questionsAnswered} */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {copy.questionsAnswered}
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {(data.totalQuestions ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {data.totalSessions ?? 0} {copy.sessionsCompleted}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  ~{data.avgTimePerQuestion ?? 0}s {copy.avgPerQuestion}
                </p>
              </div>

              {/* {copy.studyStreak} */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {copy.studyStreak}
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-4xl font-bold text-gray-900">
                    {data.streak}
                  </p>
                  <span className="text-3xl mb-0.5">🔥</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {data.streak === 1 ? copy.day : copy.days} {copy.inRow}
                </p>
                <p className="text-xs text-amber-500 mt-1 font-medium">
                  {data.streak >= 7
                    ? copy.streakGreat
                    : data.streak >= 3
                    ? copy.streakGood
                    : copy.streakStart}
                </p>
              </div>
            </div>

            {/* Row 2 — {copy.domainBreakdown} */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-base font-bold text-gray-900">
                  {copy.domainBreakdown}
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {copy.ecoWeightings}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data.domainStats ?? []).map((stat) => (
                  <DomainCard key={stat.domain} stat={stat} locale={locale} />
                ))}
              </div>
            </div>

            {/* Row 3 — Difficulty + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* {copy.difficultyLadder} */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  {copy.difficultyLadder}
                </h2>
                <div className="space-y-5">
                  {(data.difficultyStats ?? []).map((s) => {
                    const meta = DIFFICULTY_META[s.difficulty] ?? {
                      label: { en: s.difficulty, ar: s.difficulty },
                      color: '#6366f1',
                      emoji: '📊',
                    }
                    return (
                      <div key={s.difficulty}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{meta.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {meta.label[locale]}
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
                                : copy.noData}
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

              {/* {copy.activity30} Grid */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-0.5">
                  {copy.activity30}
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  {copy.sessionsPerDay}
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
                  <span className="text-[10px] text-gray-400 mr-1">{copy.less}</span>
                  {[
                    'bg-gray-100',
                    'bg-violet-200',
                    'bg-violet-400',
                    'bg-violet-600',
                  ].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">{copy.more}</span>
                </div>

                {data.streak > 0 && (
                  <div className="mt-4 flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs text-amber-700 font-medium">
                      {copy.studied} {data.streak} {data.streak === 1 ? copy.day : copy.days} {copy.inRow}!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4 — {copy.recentSessions} */}
            {(data.recentSessions ?? []).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900">
                    {copy.recentSessions}
                  </h2>
                  <Link
                    href={`/dashboard/practice?lang=${locale}`}
                    className="text-xs text-violet-600 font-medium hover:underline"
                  >
                    {copy.newSession}
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          copy.date,
                          copy.domain,
                          copy.difficulty,
                          copy.score,
                          copy.accuracy,
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
                              {s.difficulty || copy.mixed}
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

            {/* Row 5 — {copy.focusAreas} */}
            {(data.weakAreas ?? []).length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎯</span>
                  <h2 className="text-base font-bold text-gray-900">
                    {copy.focusAreas}
                  </h2>
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                    {copy.needsAttention}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(data.weakAreas ?? []).map((area) => (
                    <Link
                      key={area}
                      href={`/tutor?topic=${encodeURIComponent(
                        isArabic
                          ? `أحتاج إلى مساعدة مركزة في "${area}" لاختبار PMP. اشرح المفاهيم الأساسية وأنماط الأسئلة الشائعة وأهم نصائح ريتا ملقاهي وإطار ECO لهذا المجال.`
                          : `I need focused help on "${area}" for my PMP exam. Please explain the key concepts, common question patterns, and the most important tips from Rita Mulcahy and the ECO framework for this area.`
                      )}&from=progress&lang=${locale}`}
                      className="bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-300 hover:shadow-md transition-all group block"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {area}
                        </span>
                        <span className="text-xs text-amber-600 group-hover:translate-x-0.5 transition-transform">
                          {copy.study}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {copy.openTutor}
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
                    <h3 className="text-base font-bold text-gray-900">{copy.guruReports}</h3>
                  </div>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                    {portfolio.stats.totalReports} {portfolio.stats.totalReports === 1 ? copy.report : copy.reports}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.bestScore}%</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">{copy.bestScore}</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.avgScore}%</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">{copy.average}</p>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-violet-700">{portfolio.stats.totalReports}</p>
                    <p className="text-[10px] text-violet-500 font-medium uppercase">{copy.sessions}</p>
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
                              {copy.sessionReport} — {r.overall_correct}/{r.overall_total} {copy.correct}
                            </p>
                            <p className="text-xs text-gray-400">{date} · {r.blocks_completed} {copy.blocks} · PMBOK 7</p>
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
                    <h3 className="text-base font-bold text-gray-900">{copy.badgesEarned}</h3>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    {portfolio.stats.totalBadges} {portfolio.stats.totalBadges === 1 ? copy.badge : copy.badges}
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

            {/* ── {copy.certifications} ({copy.comingSoon}) ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  <h3 className="text-base font-bold text-gray-900">{copy.certifications}</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">{copy.comingSoon}</span>
              </div>
              <p className="text-sm text-gray-500">{copy.certBody}</p>
            </div>

            {/* Exam readiness tip banner */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">
                  {data.readinessScore >= 75
                    ? copy.readyTip
                    : copy.keepPractising}
                </p>
                <p className="text-xs text-violet-200 mt-0.5">
                  {copy.passMark}
                </p>
              </div>
              <Link
                href={`/dashboard/practice?lang=${locale}`}
                className="bg-white text-violet-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors whitespace-nowrap ml-4"
              >
                {copy.practiceNow}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}