'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const DOMAINS = [
  { value: 'people', label: '👥 People', desc: '42% of exam' },
  { value: 'process', label: '⚙️ Process', desc: '50% of exam' },
  { value: 'business', label: '🏢 Business Environment', desc: '8% of exam' },
]

const DIFFICULTIES = [
  { value: 'entry', label: '🟢 Entry', desc: 'Basic recall & understanding' },
  { value: 'intermediate', label: '🟡 Intermediate', desc: 'Application of concepts' },
  { value: 'advanced', label: '🟠 Advanced', desc: 'Analysis & evaluation' },
  { value: 'expert', label: '🔴 Expert', desc: 'Complex scenarios' },
]

interface QuestionStats {
  domain: string
  difficulty: string
  count: number
}

interface GenerateResult {
  generated: number
  errors?: string[]
}

export default function AdminQuestionsPage() {
  const [domain, setDomain] = useState('people')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [count, setCount] = useState(5)
  const [variants, setVariants] = useState(3)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<QuestionStats[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoadingStats(true)
    try {
      const { count: total } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      setTotalQuestions(total || 0)

      // Get breakdown by domain + difficulty
      const { data } = await supabase
        .from('questions')
        .select('domain, difficulty')
        .eq('is_active', true)

      if (data) {
        const grouped: Record<string, number> = {}
        data.forEach(q => {
          const key = `${q.domain}__${q.difficulty}`
          grouped[key] = (grouped[key] || 0) + 1
        })
        const statsArr = Object.entries(grouped).map(([key, count]) => {
          const [domain, difficulty] = key.split('__')
          return { domain, difficulty, count }
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
        body: JSON.stringify({ domain, difficulty, count, variants }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Generation failed')
      } else {
        setResult(data)
        loadStats()
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setGenerating(false)
    }
  }

  const domainLabel = (d: string) => DOMAINS.find(x => x.value === d)?.label || d
  const diffLabel = (d: string) => DIFFICULTIES.find(x => x.value === d)?.label || d

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🧠 AI Question Bank</h1>
        <p className="text-gray-500 mt-1">Generate and manage PMP exam questions powered by Claude AI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Questions</p>
          <p className="text-3xl font-bold text-violet-600 mt-1">
            {loadingStats ? '...' : totalQuestions}
          </p>
        </div>
        {DOMAINS.map(d => {
          const domainTotal = stats
            .filter(s => s.domain === d.value)
            .reduce((sum, s) => sum + s.count, 0)
          return (
            <div key={d.value} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{d.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {loadingStats ? '...' : domainTotal}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Generate Questions</h2>

          {/* Domain */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">ECO Domain</label>
            <div className="space-y-2">
              {DOMAINS.map(d => (
                <label key={d.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${domain === d.value ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="domain"
                    value={d.value}
                    checked={domain === d.value}
                    onChange={e => setDomain(e.target.value)}
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

          {/* Difficulty */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map(d => (
                <label key={d.value} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${difficulty === d.value ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={d.value}
                    checked={difficulty === d.value}
                    onChange={e => setDifficulty(e.target.value)}
                    className="text-violet-600"
                  />
                  <div>
                    <span className="text-xs font-medium text-gray-900">{d.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Count + Variants */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions per batch
              </label>
              <select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[3, 5, 10, 15, 20].map(n => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variants
              </label>
              <select
                value={variants}
                onChange={e => setVariants(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[1, 2, 3].map(n => (
                  <option key={n} value={n}>{n} variant{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Prevents memorisation</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
            Will generate <strong className="text-violet-600">{count * variants} questions</strong> total
            ({count} × {variants} variants) for <strong>{domainLabel(domain)}</strong> at <strong>{diffLabel(difficulty)}</strong> level
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              ✅ Generated and saved <strong>{result.generated} questions</strong> to database!
              {result.errors && result.errors.length > 0 && (
                <p className="text-orange-600 mt-1">⚠️ {result.errors.join(', ')}</p>
              )}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating... (this takes ~30s)
              </>
            ) : (
              <>⚡ Generate {count * variants} Questions</>
            )}
          </button>
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📊 Question Breakdown</h2>
            <button
              onClick={loadStats}
              className="text-xs text-violet-600 hover:text-violet-700"
            >
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
              <p className="text-sm">No questions yet.</p>
              <p className="text-xs mt-1">Use the generator to create your first batch.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Domain</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats
                    .sort((a, b) => a.domain.localeCompare(b.domain) || a.difficulty.localeCompare(b.difficulty))
                    .map((s, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 text-gray-700">{domainLabel(s.domain)}</td>
                        <td className="py-2 text-gray-500">{diffLabel(s.difficulty)}</td>
                        <td className="py-2 text-right font-semibold text-violet-600">{s.count}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={2} className="py-2 font-semibold text-gray-900">Total</td>
                    <td className="py-2 text-right font-bold text-violet-700">{totalQuestions}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Target guide */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Target for Full Bank</p>
            <div className="space-y-1.5">
              {[
                { label: '👥 People (42%)', target: 228, current: stats.filter(s => s.domain === 'people').reduce((sum, s) => sum + s.count, 0) },
                { label: '⚙️ Process (50%)', target: 270, current: stats.filter(s => s.domain === 'process').reduce((sum, s) => sum + s.count, 0) },
                { label: '🏢 Business (8%)', target: 42, current: stats.filter(s => s.domain === 'business').reduce((sum, s) => sum + s.count, 0) },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                    <span>{item.label}</span>
                    <span>{item.current}/{item.target}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}