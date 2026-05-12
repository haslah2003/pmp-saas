'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PMP_FORMULAS, FORMULA_CATEGORIES, PmpFormula } from '@/lib/formulas-data'
import { useLanguage } from '@/lib/i18n/language-context'
import { dt, rtlDir, rtlClass } from '@/lib/i18n/dashboard-content'

function FormulaCard({
  formula,
  isExpanded,
  onToggle,
}: {
  formula: PmpFormula
  isExpanded: boolean
  onToggle: () => void
}) {
  const { isArabic } = useLanguage()
  const cat = FORMULA_CATEGORIES.find((c) => c.id === formula.category)

  return (
    <div
      dir={rtlDir(isArabic)}
      className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${
        isExpanded ? 'border-violet-300 ring-1 ring-violet-100' : 'border-gray-100'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full p-5 ${rtlClass(isArabic)}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-2 ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: (cat?.color || '#6366f1') + '15', color: cat?.color }}
              >
                {cat ? dt(cat.label, isArabic) : ''}
              </span>
              <span className="text-gray-300 text-xs">{formula.id.toUpperCase()}</span>
            </div>

            <h3 className="text-base font-bold text-gray-900">{dt(formula.name, isArabic)}</h3>

            <div className="mt-2 bg-gray-50 rounded-xl px-4 py-3 inline-block" dir="ltr">
              <code className="text-lg font-bold text-violet-700 tracking-wide">{formula.formula}</code>
            </div>
          </div>

          <span className={`text-gray-400 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{dt(formula.interpretation, isArabic)}</p>

        <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">
          {dt(formula.goodBad, isArabic)}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              📌 {dt('Variables', isArabic)}
            </h4>

            <div className="space-y-1.5">
              {formula.variables.map((v) => (
                <div key={v.symbol} className={`flex items-start gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <code className="text-sm font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded min-w-[40px] text-center" dir="ltr">
                    {v.symbol}
                  </code>
                  <span className="text-sm text-gray-600">{dt(v.meaning, isArabic)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">
              🎯 {dt('When to Use on the Exam', isArabic)}
            </h4>
            <p className="text-sm text-violet-800 leading-relaxed">{dt(formula.whenToUse, isArabic)}</p>
          </div>

          {formula.example && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                📝 {dt('Example Calculation', isArabic)}
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  <strong>{dt('Given:', isArabic)}</strong> {dt(formula.example.setup, isArabic)}
                </p>
                <p className="text-gray-600">
                  <strong>{dt('Calculate:', isArabic)}</strong> {dt(formula.example.calculation, isArabic)}
                </p>
                <p className="text-gray-900 font-bold">
                  <strong>{dt('Result:', isArabic)}</strong> {dt(formula.example.result, isArabic)}
                </p>
              </div>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              📋 {dt('Exam Scenario', isArabic)}
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed">{dt(formula.examScenario, isArabic)}</p>
          </div>

          {formula.confusionAlert && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                ⚠️ {isArabic ? 'لا تخلط بينها وبين:' : "Don't Confuse With:"} {dt(formula.confusionAlert.confusedWith, isArabic)}
              </h4>
              <p className="text-sm text-amber-800 leading-relaxed">{dt(formula.confusionAlert.difference, isArabic)}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-[10px]">R</div>
              <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">{dt("Rita's Tip", isArabic)}</h4>
            </div>
            <p className="text-sm text-purple-800 leading-relaxed italic">{dt(formula.ritaTip, isArabic)}</p>
          </div>

          <Link
            href={`/dashboard/tutor?q=${encodeURIComponent(
              isArabic
                ? `اشرح ${dt(formula.name, true)} بالتفصيل مع أمثلة اختبار وأسئلة تدريبية.`
                : `Explain ${formula.name} in detail with multiple exam examples and practice questions.`
            )}`}
            className="block text-center text-xs bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            🤖 {dt('Deep Dive in AiTuTorZ', isArabic)}
          </Link>
        </div>
      )}
    </div>
  )
}

export default function FormulasPage() {
  const { isArabic } = useLanguage()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = PMP_FORMULAS.filter((f) => {
    const s = search.toLowerCase()
    const matchesSearch =
      search === '' ||
      f.name.toLowerCase().includes(s) ||
      f.formula.toLowerCase().includes(s) ||
      f.interpretation.toLowerCase().includes(s) ||
      f.id.toLowerCase().includes(s)

    const matchesCategory = !activeCategory || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalFormulas = PMP_FORMULAS.length

  const categoryCounts = FORMULA_CATEGORIES.map((c) => ({
    ...c,
    count: PMP_FORMULAS.filter((f) => f.category === c.id).length,
  }))

  return (
    <div dir={rtlDir(isArabic)} className={`min-h-screen bg-gray-50 ${rtlClass(isArabic)}`}>
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{dt('PMP Formulas 📐', isArabic)}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalFormulas} {dt('essential formulas · Exam scenarios · Rita techniques', isArabic)}
              </p>
            </div>

            <Link href="/dashboard" className="text-sm text-violet-600 hover:underline font-medium">
              {dt('← Dashboard', isArabic)}
            </Link>
          </div>

          <div className="relative mb-4">
            <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-4' : 'left-4'}`}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dt('Search formulas... (e.g., CPI, earned value, variance)', isArabic)}
              dir={rtlDir(isArabic)}
              className={`w-full py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all ${
                isArabic ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
              }`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isArabic ? 'left-4' : 'right-4'}`}
              >
                ✕
              </button>
            )}
          </div>

          <div className={`flex flex-wrap gap-2 ${isArabic ? 'justify-end' : ''}`}>
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                !activeCategory ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {dt('All', isArabic)} ({totalFormulas})
            </button>

            {categoryCounts.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  activeCategory === c.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeCategory === c.id ? { backgroundColor: c.color } : {}}
              >
                {dt(c.label, isArabic)} ({c.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-5 mb-6">
          <div className={`flex items-center gap-3 mb-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">R</div>
            <div>
              <p className="text-sm font-bold text-purple-900">{dt("Rita Mulcahy's Formula Strategy", isArabic)}</p>
              <p className="text-xs text-purple-500">{dt('Master technique for all EVM formulas', isArabic)}</p>
            </div>
          </div>

          <div className="text-sm text-purple-800 leading-relaxed space-y-1">
            <p>📌 <strong>{dt('EV always comes first', isArabic)}</strong> {dt('in every EVM formula.', isArabic)}</p>
            <p>📌 <strong>{dt('Variance = subtraction', isArabic)}</strong> ({dt('EV minus something', isArabic)}). <strong>{dt('Index = division', isArabic)}</strong> ({dt('EV divided by something', isArabic)})</p>
            <p>📌 <strong>{dt('Cost formulas use AC', isArabic)}.</strong> {dt('Schedule formulas use PV', isArabic)}</p>
            <p>📌 <strong>{dt('Negative variance = bad', isArabic)}.</strong> {dt('Index less than 1 = bad', isArabic)}. ({dt('Except TCPI — opposite!', isArabic)})</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">{dt('No formulas match your search.', isArabic)}</p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory(null)
              }}
              className="text-violet-600 text-sm font-medium mt-2 hover:underline"
            >
              {dt('Clear filters', isArabic)}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((f) => (
              <FormulaCard
                key={f.id}
                formula={f}
                isExpanded={expandedId === f.id}
                onToggle={() => setExpandedId(expandedId === f.id ? null : f.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-bold mb-1">{dt('Ready to test your formula knowledge?', isArabic)}</p>
          <p className="text-xs text-violet-200 mb-3">{dt('Practice questions that use these formulas in real exam scenarios.', isArabic)}</p>
          <Link
            href="/dashboard/practice"
            className="inline-block bg-white text-violet-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors"
          >
            🎯 {dt('Practice Now', isArabic)}
          </Link>
        </div>
      </div>
    </div>
  )
}
