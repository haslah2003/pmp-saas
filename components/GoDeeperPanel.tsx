'use client'

import { useState, useRef } from 'react'

interface GoDeeperPanelProps {
  sectionType: 'concept' | 'deepdive' | 'tip' | 'rita' | 'pitfall'
  content: Record<string, string> | string
  lessonTitle: string
  domain: string
  framework?: string
}

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="space-y-1.5 my-2 ml-1">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-indigo-400 mt-1 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
      listBuffer = []
    }
  }

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      flushList(String(i))
      elements.push(
        <h3 key={i} className="flex items-center gap-2 text-sm font-bold text-gray-900 mt-5 mb-2 first:mt-0">
          {line.replace('## ', '')}
        </h3>
      )
    } else if (line.startsWith('### ')) {
      flushList(String(i))
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-gray-800 mt-3 mb-1">
          {line.replace('### ', '')}
        </h4>
      )
    } else if (line.startsWith('> ')) {
      flushList(String(i))
      elements.push(
        <div key={i} className="border-l-4 border-indigo-300 pl-3 my-2 bg-indigo-50 rounded-r-lg py-2 pr-2">
          <p className="text-xs text-indigo-700 italic">{line.replace('> ', '')}</p>
        </div>
      )
    } else if (line.match(/^[-*] /)) {
      listBuffer.push(line.replace(/^[-*] /, ''))
    } else if (line.match(/^\d+\. /)) {
      flushList(String(i))
      const num = line.match(/^(\d+)\. (.*)/)?.[1] ?? ''
      const content = line.replace(/^\d+\. /, '')
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1.5">
          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {num}
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        </div>
      )
    } else if (line.trim() === '') {
      flushList(String(i))
      elements.push(<div key={i} className="h-1" />)
    } else {
      flushList(String(i))
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      elements.push(
        <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j}>{part.replace(/\*\*/g, '')}</strong>
            ) : (
              part
            )
          )}
        </p>
      )
    }
  })

  flushList('final')
  return elements
}

const SECTION_LABELS: Record<string, string> = {
  concept: 'Exam scenarios, real-world example, misconceptions & case study',
  deepdive: 'Advanced analysis, frameworks, case study & exam patterns',
  tip: 'PMI reasoning, practice scenarios & trap patterns',
  rita: "Rita's full teaching, techniques & ECO connection",
  pitfall: 'Root cause, exam trap, correct model & prevention',
}

const LOADING_MESSAGES: Record<string, string> = {
  concept: 'Generating exam scenarios, case study & deeper analysis...',
  deepdive: 'Building advanced analysis and case study...',
  tip: 'Unpacking the PMI reasoning and practice scenarios...',
  rita: "Drawing from Rita Mulcahy's full teaching...",
  pitfall: 'Analysing root cause and building prevention strategies...',
}

const FRAMEWORK_BADGE: Record<string, string> = {
  pmbok7: 'PMBOK 7 · ECO 2021 · Rita Mulcahy',
  pmbok8: 'PMBOK 8 · ECO 2026 · Rita (Latest)',
}

export default function GoDeeperPanel({
  sectionType,
  content,
  lessonTitle,
  domain,
  framework = 'pmbok7',
}: GoDeeperPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiContent, setAiContent] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [followUpContent, setFollowUpContent] = useState('')
  const hasLoaded = useRef(false)

  async function loadDeeper() {
    if (hasLoaded.current) {
      setIsExpanded((prev) => !prev)
      return
    }
    setIsExpanded(true)
    setIsLoading(true)
    hasLoaded.current = true

    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionType, content, lessonTitle, domain, framework }),
      })
      if (!res.body) throw new Error('No body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setAiContent(acc)
      }
    } catch {
      setAiContent('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function sendFollowUp() {
    if (!followUp.trim()) return
    setFollowUpLoading(true)
    setFollowUpContent('')
    const question = followUp
    setFollowUp('')

    try {
      const res = await fetch('/api/deeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'tip',
          content: `Context: ${lessonTitle} (${domain}). Previous content summary: ${aiContent.slice(0, 400)}. Follow-up question: ${question}`,
          lessonTitle,
          domain,
          framework,
        }),
      })
      if (!res.body) throw new Error('No body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setFollowUpContent(acc)
      }
    } catch {
      setFollowUpContent('Something went wrong.')
    } finally {
      setFollowUpLoading(false)
    }
  }

  const badge = FRAMEWORK_BADGE[framework] ?? FRAMEWORK_BADGE.pmbok7
  const isV8 = framework === 'pmbok8'

  return (
    <div className="mt-3">
      <button
        onClick={loadDeeper}
        className="group flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors text-indigo-600 font-bold text-sm leading-none">
          {isExpanded ? '−' : '+'}
        </span>
        <span>{isExpanded ? 'Collapse' : 'Go Deeper'}</span>
        {!isExpanded && (
          <span className="text-indigo-400 font-normal hidden sm:inline">
            — {SECTION_LABELS[sectionType]}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-100 bg-white/60">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isV8 ? 'bg-gradient-to-br from-violet-500 to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-violet-600'}`}>
              <span className="text-white text-[10px] font-bold">AI</span>
            </div>
            <p className="text-xs font-semibold text-indigo-800">
              Deep AI Analysis — {lessonTitle}
            </p>
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${isV8 ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-600'}`}>
              {badge}
            </span>
          </div>

          {/* PMBOK 8 banner */}
          {isV8 && (
            <div className="px-4 py-2 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
              <span className="text-xs">🆕</span>
              <p className="text-xs text-purple-700 font-medium">
                Content grounded in PMBOK 8 & ECO 2026 — includes evolution notes from PMBOK 7
              </p>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            {isLoading && !aiContent && (
              <div className="flex items-center gap-3 py-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-indigo-600">
                  {LOADING_MESSAGES[sectionType]} ({badge})
                </span>
              </div>
            )}

            {aiContent && (
              <div className="space-y-0.5">
                {renderMarkdown(aiContent)}
                {isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5 rounded-sm" />
                )}
              </div>
            )}

            {!isLoading && aiContent && (
              <div className="mt-5 pt-4 border-t border-indigo-100">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  💬 Ask a follow-up question
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendFollowUp()}
                    placeholder="e.g. How does this apply in an agile project?"
                    className="flex-1 text-xs border border-indigo-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400"
                  />
                  <button
                    onClick={sendFollowUp}
                    disabled={!followUp.trim() || followUpLoading}
                    className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    {followUpLoading ? '...' : 'Ask'}
                  </button>
                </div>

                {(followUpContent || followUpLoading) && (
                  <div className="mt-3 bg-white rounded-xl border border-indigo-100 p-3">
                    {followUpLoading && !followUpContent && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-indigo-500">Thinking...</span>
                      </div>
                    )}
                    {followUpContent && (
                      <div className="space-y-0.5">
                        {renderMarkdown(followUpContent)}
                        {followUpLoading && (
                          <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5 rounded-sm" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}