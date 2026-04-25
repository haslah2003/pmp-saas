'use client'

import React, { useState, useRef } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'

type Locale = 'en' | 'ar'

interface GoDeeperPanelProps {
  language?: string
  sectionType: 'concept' | 'deepdive' | 'tip' | 'rita' | 'pitfall'
  content: Record<string, string> | string
  lessonTitle: string
  domain: string
  framework?: string
}

function normalizeLocale(value?: string, contextIsArabic?: boolean): Locale {
  if (value === 'ar' || contextIsArabic) return 'ar'
  return 'en'
}

function getSectionLabel(sectionType: GoDeeperPanelProps['sectionType'], isAr: boolean): string {
  const labels = {
    concept: {
      en: 'Exam scenarios, real-world example, misconceptions & case study',
      ar: 'سيناريوهات اختبار، مثال واقعي، مفاهيم خاطئة ودراسة حالة',
    },
    deepdive: {
      en: 'Advanced analysis, frameworks, case study & exam patterns',
      ar: 'تحليل متقدم، أطر عمل، دراسة حالة وأنماط اختبار',
    },
    tip: {
      en: 'PMI reasoning, practice scenarios & trap patterns',
      ar: 'منطق PMI، سيناريوهات تطبيقية وأنماط الفخاخ',
    },
    rita: {
      en: "Rita's full teaching, techniques & ECO connection",
      ar: 'شرح ريتا الكامل، التقنيات والربط مع ECO',
    },
    pitfall: {
      en: 'Root cause, exam trap, correct model & prevention',
      ar: 'السبب الجذري، فخ الاختبار، النموذج الصحيح والوقاية',
    },
  }

  return isAr ? labels[sectionType].ar : labels[sectionType].en
}

function getLoadingMessage(sectionType: GoDeeperPanelProps['sectionType'], isAr: boolean): string {
  const labels = {
    concept: {
      en: 'Generating exam scenarios, case study & deeper analysis...',
      ar: 'جاري توليد سيناريوهات الاختبار ودراسة الحالة والتحليل المتعمق...',
    },
    deepdive: {
      en: 'Building advanced analysis and case study...',
      ar: 'جاري بناء تحليل متقدم ودراسة حالة...',
    },
    tip: {
      en: 'Unpacking the PMI reasoning and practice scenarios...',
      ar: 'جاري تحليل منطق PMI وسيناريوهات التطبيق...',
    },
    rita: {
      en: "Drawing from Rita Mulcahy's full teaching...",
      ar: 'جاري الاستناد إلى شرح ريتا الكامل...',
    },
    pitfall: {
      en: 'Analysing root cause and building prevention strategies...',
      ar: 'جاري تحليل السبب الجذري وبناء استراتيجيات الوقاية...',
    },
  }

  return isAr ? labels[sectionType].ar : labels[sectionType].en
}

function getFrameworkBadge(framework: string, isAr: boolean): string {
  if (framework === 'pmbok8') {
    return isAr ? 'PMBOK 8 · ECO 2026 · أحدث إصدار' : 'PMBOK 8 · ECO 2026 · Rita Latest'
  }

  return isAr ? 'PMBOK 7 · ECO 2021 · ريتا' : 'PMBOK 7 · ECO 2021 · Rita Mulcahy'
}

function renderMarkdown(text: string, isAr: boolean) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="space-y-1.5 my-2 ml-1">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-violet-400 mt-1 flex-shrink-0">•</span>
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
        <div
          key={i}
          className={`my-2 bg-violet-50 py-2 rounded-lg ${
            isAr ? 'border-r-4 border-violet-300 pr-3 pl-2' : 'border-l-4 border-violet-300 pl-3 pr-2'
          }`}
        >
          <p className="text-xs text-violet-700 italic">{line.replace('> ', '')}</p>
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
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
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

export default function GoDeeperPanel({
  sectionType,
  content,
  lessonTitle,
  domain,
  framework = 'pmbok7',
  language = 'en',
}: GoDeeperPanelProps) {
  const { isArabic } = useLanguage()

  const activeLocale = normalizeLocale(language, isArabic)
  const isAr = activeLocale === 'ar'

  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiContent, setAiContent] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [followUpContent, setFollowUpContent] = useState('')
  const hasLoaded = useRef(false)

  const badge = getFrameworkBadge(framework, isAr)
  const isV8 = framework === 'pmbok8'

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
        body: JSON.stringify({ sectionType, content, lessonTitle, domain, framework, language: activeLocale }),
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
      setAiContent(isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.')
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
          language: activeLocale,
          content: isAr
            ? `السياق: ${lessonTitle} (${domain}). ملخص المحتوى السابق: ${aiContent.slice(0, 400)}. سؤال المتابعة: ${question}`
            : `Context: ${lessonTitle} (${domain}). Previous content summary: ${aiContent.slice(0, 400)}. Follow-up question: ${question}`,
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
      setFollowUpContent(isAr ? 'حدث خطأ.' : 'Something went wrong.')
    } finally {
      setFollowUpLoading(false)
    }
  }

  return (
    <div className="mt-3" dir={isAr ? 'rtl' : 'ltr'}>
      <button
        onClick={loadDeeper}
        className="group flex items-center gap-2 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
      >
        <span className="w-5 h-5 rounded-full bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center transition-colors text-violet-600 font-bold text-sm leading-none">
          {isExpanded ? '−' : '+'}
        </span>

        <span>{isExpanded ? (isAr ? 'طي' : 'Collapse') : (isAr ? 'تعمّق أكثر' : 'Go Deeper')}</span>

        {!isExpanded && (
          <span className="text-violet-400 font-normal hidden sm:inline">
            — {getSectionLabel(sectionType, isAr)}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-violet-50 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-100 bg-white/60">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isV8
                  ? 'bg-gradient-to-br from-violet-500 to-purple-700'
                  : 'bg-gradient-to-br from-violet-500 to-violet-600'
              }`}
            >
              <span className="text-white text-[10px] font-bold">AI</span>
            </div>

            <p className="text-xs font-semibold text-violet-800">
              {isAr ? `تحليل ذكي متعمق — ${lessonTitle}` : `Deep AI Analysis — ${lessonTitle}`}
            </p>

            <span
              className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isV8 ? 'bg-purple-100 text-purple-700' : 'bg-violet-100 text-violet-600'
              }`}
            >
              {badge}
            </span>
          </div>

          {isV8 && (
            <div className="px-4 py-2 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
              <span className="text-xs">🆕</span>
              <p className="text-xs text-purple-700 font-medium">
                {isAr
                  ? 'المحتوى مبني على PMBOK 8 و ECO 2026 — مع ملاحظات التطور من PMBOK 7'
                  : 'Content grounded in PMBOK 8 & ECO 2026 — includes evolution notes from PMBOK 7'}
              </p>
            </div>
          )}

          <div className="p-4">
            {isLoading && !aiContent && (
              <div className="flex items-center gap-3 py-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>

                <span className="text-xs text-violet-600">
                  {getLoadingMessage(sectionType, isAr)} ({badge})
                </span>
              </div>
            )}

            {aiContent && (
              <div className="space-y-0.5">
                {renderMarkdown(aiContent, isAr)}
                {isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-violet-500 animate-pulse ml-0.5 rounded-sm" />
                )}
              </div>
            )}

            {!isLoading && aiContent && (
              <div className="mt-5 pt-4 border-t border-violet-100">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  {isAr ? '💬 اطرح سؤال متابعة' : '💬 Ask a follow-up question'}
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendFollowUp()}
                    placeholder={
                      isAr
                        ? 'مثال: كيف أطبق هذا في مشروع أجايل؟'
                        : 'e.g. How does this apply in an agile project?'
                    }
                    className="flex-1 text-xs border border-violet-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-gray-400"
                  />

                  <button
                    onClick={sendFollowUp}
                    disabled={!followUp.trim() || followUpLoading}
                    className="bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    {followUpLoading ? '...' : isAr ? 'اسأل' : 'Ask'}
                  </button>
                </div>

                {(followUpContent || followUpLoading) && (
                  <div className="mt-3 bg-white rounded-xl border border-violet-100 p-3">
                    {followUpLoading && !followUpContent && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>

                        <span className="text-xs text-violet-500">
                          {isAr ? 'جاري التفكير...' : 'Thinking...'}
                        </span>
                      </div>
                    )}

                    {followUpContent && (
                      <div className="space-y-0.5">
                        {renderMarkdown(followUpContent, isAr)}
                        {followUpLoading && (
                          <span className="inline-block w-1.5 h-4 bg-violet-500 animate-pulse ml-0.5 rounded-sm" />
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
