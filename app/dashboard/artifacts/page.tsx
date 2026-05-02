'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PMP_ARTIFACTS, ARTIFACT_CATEGORIES, PmpArtifact } from '@/lib/artifacts-data'
import { useLanguage } from '@/lib/i18n/language-context'
import { dt, rtlDir, rtlClass } from '@/lib/i18n/dashboard-content'

function ArtifactCard({
  artifact,
  isExpanded,
  onToggle,
}: {
  artifact: PmpArtifact
  isExpanded: boolean
  onToggle: () => void
}) {
  const { isArabic } = useLanguage()
  const cat = ARTIFACT_CATEGORIES.find((c) => c.id === artifact.category)

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
            <div className={`flex items-center gap-2 mb-1.5 ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: (cat?.color || '#6366f1') + '15', color: cat?.color }}
              >
                {cat ? dt(cat.label, isArabic) : ''}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900">{dt(artifact.name, isArabic)}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">{dt(artifact.description, isArabic)}</p>
          </div>

          <span className={`text-gray-400 text-sm transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        <div className={`flex flex-wrap gap-1.5 mt-2 ${isArabic ? 'justify-end' : ''}`}>
          {artifact.domains.map((domain) => (
            <span key={domain} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {dt(domain, isArabic)}
            </span>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                👤 {dt('Created By', isArabic)}
              </h4>
              <p className="text-sm text-gray-700">{dt(artifact.createdBy, isArabic)}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                ⏰ {dt('When Used', isArabic)}
              </h4>
              <p className="text-sm text-gray-700">{dt(artifact.whenUsed, isArabic)}</p>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">
              🎯 {dt('Key Purpose', isArabic)}
            </h4>
            <p className="text-sm text-violet-800 leading-relaxed">{dt(artifact.keyPurpose, isArabic)}</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              📝 {dt('Exam Tip', isArabic)}
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">{dt(artifact.examTip, isArabic)}</p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              🔗 {dt('Related Artifacts', isArabic)}
            </h4>
            <div className={`flex flex-wrap gap-1.5 ${isArabic ? 'justify-end' : ''}`}>
              {artifact.relatedTo.map((related) => (
                <span key={related} className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2.5 py-1 rounded-full font-medium">
                  {dt(related, isArabic)}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={`/dashboard/tutor?q=${encodeURIComponent(
              isArabic
                ? `اشرح وثيقة ${dt(artifact.name, true)} في PMP: متى تُنشأ، من ينشئها، ماذا تحتوي، وكيف تظهر في الاختبار؟`
                : `Explain the ${artifact.name} artifact in PMP — when is it created, who creates it, what does it contain, and how is it tested on the exam?`
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

export default function ArtifactsPage() {
  const { isArabic } = useLanguage()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = PMP_ARTIFACTS.filter((artifact) => {
    const s = search.toLowerCase()
    const matchesSearch =
      search === '' ||
      artifact.name.toLowerCase().includes(s) ||
      artifact.description.toLowerCase().includes(s) ||
      artifact.keyPurpose.toLowerCase().includes(s) ||
      artifact.examTip.toLowerCase().includes(s)

    const matchesCategory = !activeCategory || artifact.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalArtifacts = PMP_ARTIFACTS.length

  const categoryCounts = ARTIFACT_CATEGORIES.map((c) => ({
    ...c,
    count: PMP_ARTIFACTS.filter((artifact) => artifact.category === c.id).length,
  }))

  return (
    <div dir={rtlDir(isArabic)} className={`min-h-screen bg-gray-50 ${rtlClass(isArabic)}`}>
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center justify-between mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl font-bold text-gray-900">{dt('PMP Artifacts 📋', isArabic)}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalArtifacts} {dt('key artifacts · What they are · When to use · Exam tips', isArabic)}
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
              placeholder={dt('Search artifacts... (e.g., charter, WBS, risk register)', isArabic)}
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
              {dt('All', isArabic)} ({totalArtifacts})
            </button>

            {categoryCounts.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  activeCategory === category.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeCategory === category.id ? { backgroundColor: category.color } : {}}
              >
                {dt(category.label, isArabic)} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5 mb-6">
          <div className={`flex items-center gap-3 mb-3 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg">📋</div>
            <div>
              <p className="text-sm font-bold text-violet-900">{dt('Artifact Quick Guide', isArabic)}</p>
              <p className="text-xs text-violet-500">{dt('Key distinctions for the exam', isArabic)}</p>
            </div>
          </div>

          <div className="text-sm text-violet-800 leading-relaxed space-y-1">
            <p>📌 <strong>{dt('Strategy artifacts', isArabic)}</strong> {dt('are created at project start and rarely change', isArabic)} ({dt('charter, business case', isArabic)}).</p>
            <p>📌 <strong>{dt('Logs & registers', isArabic)}</strong> {dt('are living documents updated continuously', isArabic)} ({dt('risk register, issue log, lessons learned', isArabic)}).</p>
            <p>📌 <strong>{dt('Plans', isArabic)}</strong> {dt('define HOW to manage each area', isArabic)} — {dt("they don't contain the actual work details", isArabic)}.</p>
            <p>📌 <strong>{dt('Baselines', isArabic)}</strong> {dt('are the approved versions used to measure performance', isArabic)} ({dt('scope + schedule + cost = PMB', isArabic)}).</p>
            <p>📌 <strong>{dt('Data → Information → Reports', isArabic)}</strong> {dt('is the work performance flow', isArabic)} — {dt('know the difference', isArabic)}!</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">{dt('No artifacts match your search.', isArabic)}</p>
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
            {filtered.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                isExpanded={expandedId === artifact.id}
                onToggle={() => setExpandedId(expandedId === artifact.id ? null : artifact.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-bold mb-1">{dt('Master PMP artifacts in practice!', isArabic)}</p>
          <p className="text-xs text-violet-200 mb-3">{dt('Questions about which artifact to use and when are common on the exam.', isArabic)}</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/practice" className="bg-white text-violet-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
              🎯 {dt('Practice Now', isArabic)}
            </Link>
            <Link href="/dashboard/formulas" className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
              📐 {dt('Formulas', isArabic)}
            </Link>
            <Link href="/dashboard/processes" className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
              🔄 {dt('Processes', isArabic)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
