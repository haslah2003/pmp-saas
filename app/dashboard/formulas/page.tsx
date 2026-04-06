'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PMP_FORMULAS, FORMULA_CATEGORIES, PmpFormula } from '@/lib/formulas-data'

function FormulaCard({ formula, isExpanded, onToggle }: {
  formula: PmpFormula; isExpanded: boolean; onToggle: () => void
}) {
  const cat = FORMULA_CATEGORIES.find(c => c.id === formula.category)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${
      isExpanded ? 'border-violet-300 ring-1 ring-violet-100' : 'border-gray-100'
    }`}>
      {/* Header — always visible */}
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: (cat?.color || '#6366f1') + '15', color: cat?.color }}>
                {cat?.label}
              </span>
              <span className="text-gray-300 text-xs">{formula.id.toUpperCase()}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900">{formula.name}</h3>
            <div className="mt-2 bg-gray-50 rounded-xl px-4 py-3 inline-block">
              <code className="text-lg font-bold text-violet-700 tracking-wide">{formula.formula}</code>
            </div>
          </div>
          <span className={`text-gray-400 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        {/* Quick interpretation */}
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{formula.interpretation}</p>

        {/* Good/Bad indicator */}
        <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">
          {formula.goodBad}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
          {/* Variables */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📌 Variables</h4>
            <div className="space-y-1.5">
              {formula.variables.map(v => (
                <div key={v.symbol} className="flex items-start gap-2">
                  <code className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded min-w-[40px] text-center">{v.symbol}</code>
                  <span className="text-sm text-gray-600">{v.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* When to Use */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">🎯 When to Use on the Exam</h4>
            <p className="text-sm text-violet-800 leading-relaxed">{formula.whenToUse}</p>
          </div>

          {/* Example */}
          {formula.example && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📝 Example Calculation</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600"><strong>Given:</strong> {formula.example.setup}</p>
                <p className="text-gray-600"><strong>Calculate:</strong> {formula.example.calculation}</p>
                <p className="text-gray-900 font-bold"><strong>Result:</strong> {formula.example.result}</p>
              </div>
            </div>
          )}

          {/* Exam Scenario */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">📋 Exam Scenario</h4>
            <p className="text-sm text-emerald-800 leading-relaxed">{formula.examScenario}</p>
          </div>

          {/* Confusion Alert */}
          {formula.confusionAlert && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">⚠️ Don&apos;t Confuse With: {formula.confusionAlert.confusedWith}</h4>
              <p className="text-sm text-amber-800 leading-relaxed">{formula.confusionAlert.difference}</p>
            </div>
          )}

          {/* Rita's Tip */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-[10px]">R</div>
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Rita&apos;s Tip</h4>
            </div>
            <p className="text-sm text-purple-800 leading-relaxed italic">{formula.ritaTip}</p>
          </div>

          {/* Ask Companion */}
          <div className="flex gap-2">
            <Link
              href={"/dashboard/tutor?q=" + encodeURIComponent("Explain " + formula.name + " in detail with multiple exam examples and practice questions")}
              className="flex-1 text-center text-xs bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition-all"
            >
              🤖 Deep Dive in AiTuTorZ
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FormulasPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = PMP_FORMULAS.filter(f => {
    const matchesSearch = search === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.interpretation.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalFormulas = PMP_FORMULAS.length
  const categoryCounts = FORMULA_CATEGORIES.map(c => ({
    ...c,
    count: PMP_FORMULAS.filter(f => f.category === c.id).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📐 PMP Formulas</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalFormulas} essential formulas · Exam scenarios · Rita&apos;s techniques
              </p>
            </div>
            <Link href="/dashboard" className="text-sm text-violet-600 hover:underline font-medium">← Dashboard</Link>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search formulas... (e.g., CPI, earned value, variance)"
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                !activeCategory ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({totalFormulas})
            </button>
            {categoryCounts.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  activeCategory === c.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeCategory === c.id ? { backgroundColor: c.color } : {}}
              >
                {c.label} ({c.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Rita's Master Tip */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">R</div>
            <div>
              <p className="text-sm font-bold text-purple-900">Rita Mulcahy&apos;s Formula Strategy</p>
              <p className="text-xs text-purple-500">Master technique for all EVM formulas</p>
            </div>
          </div>
          <div className="text-sm text-purple-800 leading-relaxed space-y-1">
            <p>📌 <strong>EV always comes first</strong> in every EVM formula.</p>
            <p>📌 <strong>Variance = subtraction</strong> (EV minus something). <strong>Index = division</strong> (EV divided by something).</p>
            <p>📌 <strong>Cost formulas use AC.</strong> Schedule formulas use PV.</p>
            <p>📌 <strong>Negative variance = bad.</strong> Index less than 1 = bad. (Except TCPI — opposite!)</p>
          </div>
        </div>

        {/* Formula Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No formulas match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory(null); }}
              className="text-violet-600 text-sm font-medium mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(f => (
              <FormulaCard
                key={f.id}
                formula={f}
                isExpanded={expandedId === f.id}
                onToggle={() => setExpandedId(expandedId === f.id ? null : f.id)}
              />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-bold mb-1">Ready to test your formula knowledge?</p>
          <p className="text-xs text-violet-200 mb-3">Practice questions that use these formulas in real exam scenarios.</p>
          <Link href="/dashboard/practice"
            className="inline-block bg-white text-violet-600 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
            🎯 Practice Now
          </Link>
        </div>
      </div>
    </div>
  )
}
