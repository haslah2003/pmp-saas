'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PMP_ARTIFACTS, ARTIFACT_CATEGORIES, PmpArtifact } from '@/lib/artifacts-data'

function ArtifactCard({ artifact, isExpanded, onToggle }: {
  artifact: PmpArtifact; isExpanded: boolean; onToggle: () => void
}) {
  const cat = ARTIFACT_CATEGORIES.find(c => c.id === artifact.category)

  return (
    <div className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${
      isExpanded ? 'border-violet-300 ring-1 ring-violet-100' : 'border-gray-100'
    }`}>
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: (cat?.color || '#6366f1') + '15', color: cat?.color }}>
                {cat?.label}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">{artifact.name}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">{artifact.description}</p>
          </div>
          <span className={`text-gray-400 text-sm transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>

        {/* Domain tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {artifact.domains.map(d => (
            <span key={d} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{d}</span>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
          {/* Created By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">👤 Created By</h4>
              <p className="text-sm text-gray-700">{artifact.createdBy}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">⏰ When Used</h4>
              <p className="text-sm text-gray-700">{artifact.whenUsed}</p>
            </div>
          </div>

          {/* Key Purpose */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">🎯 Key Purpose</h4>
            <p className="text-sm text-violet-800 leading-relaxed">{artifact.keyPurpose}</p>
          </div>

          {/* Exam Tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">📝 Exam Tip</h4>
            <p className="text-sm text-amber-800 leading-relaxed">{artifact.examTip}</p>
          </div>

          {/* Related Artifacts */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">🔗 Related Artifacts</h4>
            <div className="flex flex-wrap gap-1.5">
              {artifact.relatedTo.map(r => (
                <span key={r} className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2.5 py-1 rounded-full font-medium">{r}</span>
              ))}
            </div>
          </div>

          {/* Deep Dive Link */}
          <Link
            href={"/dashboard/tutor?q=" + encodeURIComponent("Explain the " + artifact.name + " artifact in PMP — when is it created, who creates it, what does it contain, and how is it tested on the exam?")}
            className="block text-center text-xs bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl font-semibold transition-all"
          >
            🤖 Deep Dive in AiTuTorZ
          </Link>
        </div>
      )}
    </div>
  )
}

export default function ArtifactsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = PMP_ARTIFACTS.filter(a => {
    const matchesSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.keyPurpose.toLowerCase().includes(search.toLowerCase()) ||
      a.examTip.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || a.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const totalArtifacts = PMP_ARTIFACTS.length
  const categoryCounts = ARTIFACT_CATEGORIES.map(c => ({
    ...c,
    count: PMP_ARTIFACTS.filter(a => a.category === c.id).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📋 PMP Artifacts</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalArtifacts} key artifacts · What they are · When to use · Exam tips
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
              placeholder="Search artifacts... (e.g., charter, WBS, risk register)"
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
              All ({totalArtifacts})
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
        {/* Quick Reference Card */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg">📋</div>
            <div>
              <p className="text-sm font-bold text-violet-900">Artifact Quick Guide</p>
              <p className="text-xs text-violet-500">Key distinctions for the exam</p>
            </div>
          </div>
          <div className="text-sm text-violet-800 leading-relaxed space-y-1">
            <p>📌 <strong>Strategy artifacts</strong> are created at project start and rarely change (charter, business case).</p>
            <p>📌 <strong>Logs &amp; registers</strong> are living documents updated continuously (risk register, issue log, lessons learned).</p>
            <p>📌 <strong>Plans</strong> define HOW to manage each area — they don&apos;t contain the actual work details.</p>
            <p>📌 <strong>Baselines</strong> are the approved versions used to measure performance (scope + schedule + cost = PMB).</p>
            <p>📌 <strong>Data → Information → Reports</strong> is the work performance flow — know the difference!</p>
          </div>
        </div>

        {/* Artifact Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No artifacts match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory(null); }}
              className="text-violet-600 text-sm font-medium mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <ArtifactCard
                key={a.id}
                artifact={a}
                isExpanded={expandedId === a.id}
                onToggle={() => setExpandedId(expandedId === a.id ? null : a.id)}
              />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-bold mb-1">Master PMP artifacts in practice!</p>
          <p className="text-xs text-violet-200 mb-3">Questions about which artifact to use and when are common on the exam.</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/practice"
              className="bg-white text-violet-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
              🎯 Practice Now
            </Link>
            <Link href="/dashboard/formulas"
              className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
              📐 Formulas
            </Link>
            <Link href="/dashboard/processes"
              className="bg-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors">
              🔄 Processes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
