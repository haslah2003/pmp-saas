'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ExamFramework = 'pmbok7' | 'pmbok8' | 'bridge'
type EcoDomain = 'people' | 'process' | 'business-environment'
type QuestionDifficulty = 'entry' | 'paced' | 'difficult' | 'challenging'

const FRAMEWORKS: {
  value: ExamFramework
  label: string
  desc: string
  badge: string
}[] = [
  {
    value: 'pmbok7',
    label: 'PMBOK 7 + ECO 2021',
    desc: 'Stable current PMP bank',
    badge: '📘',
  },
  {
    value: 'pmbok8',
    label: 'PMBOK 8 + ECO 2026',
    desc: 'Native updated PMP route',
    badge: '📗',
  },
  {
    value: 'bridge',
    label: 'Bridge Mode',
    desc: 'PMBOK 7 → PMBOK 8 transition questions',
    badge: '🌉',
  },
]

const DOMAIN_WEIGHTS: Record<
  ExamFramework,
  Record<EcoDomain, { label: string; desc: string; weight: string; target: number }>
> = {
  pmbok7: {
    people: {
      label: '👥 People',
      desc: 'ECO 2021 weight: 42%',
      weight: '42%',
      target: 228,
    },
    process: {
      label: '⚙️ Process',
      desc: 'ECO 2021 weight: 50%',
      weight: '50%',
      target: 270,
    },
    'business-environment': {
      label: '🏢 Business Environment',
      desc: 'ECO 2021 weight: 8%',
      weight: '8%',
      target: 42,
    },
  },
  pmbok8: {
    people: {
      label: '👥 People',
      desc: 'ECO 2026 weight: 33%',
      weight: '33%',
      target: 10,
    },
    process: {
      label: '⚙️ Process',
      desc: 'ECO 2026 weight: 41%',
      weight: '41%',
      target: 12,
    },
    'business-environment': {
      label: '🏢 Business Environment',
      desc: 'ECO 2026 weight: 26%',
      weight: '26%',
      target: 8,
    },
  },
  bridge: {
    people: {
      label: '👥 People',
      desc: 'Transition: people, leadership, team, stakeholder changes',
      weight: 'Bridge',
      target: 5,
    },
    process: {
      label: '⚙️ Process',
      desc: 'Transition: process, tailoring, focus areas, delivery approach',
      weight: 'Bridge',
      target: 6,
    },
    'business-environment': {
      label: '🏢 Business Environment',
      desc: 'Transition: value, compliance, strategy, sustainability',
      weight: 'Bridge',
      target: 4,
    },
  },
}

const DIFFICULTIES: {
  value: QuestionDifficulty
  label: string
  desc: string
}[] = [
  { value: 'entry', label: '🟢 Entry', desc: 'Foundational but scenario-based' },
  { value: 'paced', label: '🟡 Paced', desc: 'Standard PMP application' },
  { value: 'difficult', label: '🟠 Difficult', desc: 'Advanced judgment and prioritization' },
  { value: 'challenging', label: '🔴 Challenging', desc: 'Complex exam-style scenarios' },
]

interface QuestionStats {
  framework: string
  domain: string
  difficulty: string
  count: number
}

interface GenerateResult {
  success?: boolean
  framework?: string
  domain?: string
  difficulty?: string
  generated: number
  skipped_exact_duplicates?: number
  skipped_near_duplicates?: number
  skipped_weak_options?: number
  answer_distribution?: {
    a?: number
    b?: number
    c?: number
    d?: number
  }
  warnings?: string[]
  errors?: string[]
}

export default function AdminQuestionsPage() {
  const [framework, setFramework] = useState<ExamFramework>('pmbok8')
  const [domain, setDomain] = useState<EcoDomain>('people')
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('entry')
  const [count, setCount] = useState(3)
  const [variants, setVariants] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<QuestionStats[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)

  const supabase = createClient()

  const domains = useMemo(() => {
    return (['people', 'process', 'business-environment'] as EcoDomain[]).map((value) => ({
      value,
      ...DOMAIN_WEIGHTS[framework][value],
    }))
  }, [framework])

  useEffect(() => {
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framework])

  async function loadStats() {
    setLoadingStats(true)

    try {
      const { count: total } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('framework', framework)

      setTotalQuestions(total || 0)

      const { data } = await supabase
        .from('questions')
        .select('framework, domain, difficulty')
        .eq('is_active', true)
        .eq('framework', framework)

      if (data) {
        const grouped: Record<string, number> = {}

        data.forEach((q) => {
          const key = `${q.framework}__${q.domain}__${q.difficulty}`
          grouped[key] = (grouped[key] || 0) + 1
        })

        const statsArr = Object.entries(grouped).map(([key, count]) => {
          const [frameworkValue, domainValue, difficultyValue] = key.split('__')
          return {
            framework: frameworkValue,
            domain: domainValue,
            difficulty: difficultyValue,
            count,
          }
        })

        setStats(statsArr)
      }
    } finally {
      setLoadingStats(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework, domain, difficulty, count, variants }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Generation failed')
      } else {
        setResult(data)
        await loadStats()
      }
    } catch {
      setError('Generation request timed out or the connection was interrupted. Try 1 variant at a time or reduce the batch size, then retry.')
    } finally {
      setGenerating(false)
    }
  }

  const frameworkLabel = (fw: string) =>
    FRAMEWORKS.find((x) => x.value === fw)?.label || fw

  const domainLabel = (d: string) =>
    DOMAIN_WEIGHTS[framework][d as EcoDomain]?.label || d

  const diffLabel = (d: string) =>
    DIFFICULTIES.find((x) => x.value === d)?.label || d

  const currentDomainTotal = (domainValue: EcoDomain) =>
    stats
      .filter((s) => s.domain === domainValue)
      .reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🧠 AI Question Bank</h1>
        <p className="text-gray-500 mt-1">
          Generate and manage PMP exam questions with route-safe PMBOK/ECO guardrails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Selected Route</p>
          <p className="text-lg font-bold text-violet-700 mt-2">
            {frameworkLabel(framework)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {FRAMEWORKS.find((fw) => fw.value === framework)?.desc}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active Questions</p>
          <p className="text-3xl font-bold text-violet-600 mt-1">
            {loadingStats ? '...' : totalQuestions}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Filtered by selected route</p>
        </div>

        {domains.slice(0, 2).map((d) => (
          <div key={d.value} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{d.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {loadingStats ? '...' : currentDomainTotal(d.value)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Generate Questions</h2>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Framework Route</label>
            <div className="space-y-2">
              {FRAMEWORKS.map((fw) => (
                <label
                  key={fw.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    framework === fw.value
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="framework"
                    value={fw.value}
                    checked={framework === fw.value}
                    onChange={(e) => setFramework(e.target.value as ExamFramework)}
                    className="text-violet-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {fw.badge} {fw.label}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{fw.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">ECO Domain</label>
            <div className="space-y-2">
              {domains.map((d) => (
                <label
                  key={d.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    domain === d.value
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="domain"
                    value={d.value}
                    checked={domain === d.value}
                    onChange={(e) => setDomain(e.target.value as EcoDomain)}
                    className="text-violet-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{d.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{d.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map((d) => (
                <label
                  key={d.value}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    difficulty === d.value
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={d.value}
                    checked={difficulty === d.value}
                    onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                    className="text-violet-600"
                  />
                  <div>
                    <span className="text-xs font-medium text-gray-900">{d.label}</span>
                    <p className="text-[11px] text-gray-400">{d.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions per batch
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[1, 3, 5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} question{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Use 1–3 for pilot QA.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variants</label>
              <select
                value={variants}
                onChange={(e) => setVariants(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} variant{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Prevents memorisation</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
            Will generate{' '}
            <strong className="text-violet-600">{count * variants} questions</strong>{' '}
            for <strong>{frameworkLabel(framework)}</strong> ·{' '}
            <strong>{domainLabel(domain)}</strong> · <strong>{diffLabel(difficulty)}</strong>
          </div>

          {framework === 'pmbok8' && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
              PMBOK 8 generation uses ECO 2026 weights and PMBOK 8 guardrails: six principles,
              five Focus Areas, seven Performance Domains, and no PMBOK 7 structure leakage.
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div
              className={`mb-4 border rounded-lg p-3 text-sm ${
                result.errors && result.errors.length > 0
                  ? 'bg-orange-50 border-orange-200 text-orange-800'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              ✅ Generated and saved <strong>{result.generated} questions</strong> to database.
              <p className="text-xs mt-1">
                Route: {result.framework} · Domain: {result.domain} · Difficulty: {result.difficulty}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-xs">
                <div className="bg-white/70 border border-white rounded-lg p-2">
                  <p className="font-semibold text-gray-700">Exact duplicates skipped</p>
                  <p className="text-lg font-bold text-gray-900">{result.skipped_exact_duplicates ?? 0}</p>
                </div>

                <div className="bg-white/70 border border-white rounded-lg p-2">
                  <p className="font-semibold text-gray-700">Near duplicates skipped</p>
                  <p className="text-lg font-bold text-gray-900">{result.skipped_near_duplicates ?? 0}</p>
                </div>

                <div className="bg-white/70 border border-white rounded-lg p-2">
                  <p className="font-semibold text-gray-700">Weak options skipped</p>
                  <p className="text-lg font-bold text-gray-900">{result.skipped_weak_options ?? 0}</p>
                </div>
              </div>

              {result.answer_distribution && (
                <div className="mt-3 bg-white/70 border border-white rounded-lg p-2 text-xs">
                  <p className="font-semibold text-gray-700 mb-1">Correct-answer distribution</p>
                  <p className="text-gray-900">
                    A: <strong>{result.answer_distribution.a ?? 0}</strong> ·{' '}
                    B: <strong>{result.answer_distribution.b ?? 0}</strong> ·{' '}
                    C: <strong>{result.answer_distribution.c ?? 0}</strong> ·{' '}
                    D: <strong>{result.answer_distribution.d ?? 0}</strong>
                  </p>
                </div>
              )}

              {result.warnings && result.warnings.length > 0 && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                  <p className="font-semibold mb-1">Warnings</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
                  <p className="font-semibold mb-1">Errors</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.errors.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating... this may take around 30 seconds
              </>
            ) : (
              <>⚡ Generate {count * variants} Questions</>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📊 Question Breakdown</h2>
            <button onClick={loadStats} className="text-xs text-violet-600 hover:text-violet-700">
              Refresh
            </button>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🏗️</p>
              <p className="text-sm">No questions yet for {frameworkLabel(framework)}.</p>
              <p className="text-xs mt-1">Use the generator to create the first controlled batch.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Domain
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Difficulty
                    </th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats
                    .sort(
                      (a, b) =>
                        a.domain.localeCompare(b.domain) ||
                        a.difficulty.localeCompare(b.difficulty)
                    )
                    .map((s, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 text-gray-700">{domainLabel(s.domain)}</td>
                        <td className="py-2 text-gray-500">{diffLabel(s.difficulty)}</td>
                        <td className="py-2 text-right font-semibold text-violet-600">
                          {s.count}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={2} className="py-2 font-semibold text-gray-900">
                      Total for {frameworkLabel(framework)}
                    </td>
                    <td className="py-2 text-right font-bold text-violet-700">
                      {totalQuestions}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
              {framework === 'pmbok8'
                ? 'Sprint 5B PMBOK 8 pilot target'
                : framework === 'bridge'
                  ? 'Bridge pilot guide'
                  : 'PMBOK 7 reference target'}
            </p>

            <div className="space-y-1.5">
              {domains.map((item) => {
                const current = currentDomainTotal(item.value)
                return (
                  <div key={item.value}>
                    <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                      <span>
                        {item.label} ({item.weight})
                      </span>
                      <span>
                        {current}/{item.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (current / item.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {framework === 'pmbok8' && (
              <p className="text-xs text-gray-400 mt-3">
                PMBOK 8 pilot target is 30 entry questions: People 10, Process 12, Business
                Environment 8.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
