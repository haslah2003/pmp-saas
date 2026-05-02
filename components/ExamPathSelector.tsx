'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  EXAM_PATH_ORDER,
  EXAM_PATHS,
  getExamPathCopy,
  normalizeAppLocale,
  normalizeExamPath,
  type AppLocale,
  type ExamPathId,
} from '@/lib/pmp/exam-paths'

type ExamPathSelectorProps = {
  initialPath: ExamPathId
  locale: AppLocale
}

export default function ExamPathSelector({
  initialPath,
  locale,
}: ExamPathSelectorProps) {
  const router = useRouter()
  const safeLocale = normalizeAppLocale(locale)
  const isArabic = safeLocale === 'ar'
  const [selectedPath, setSelectedPath] = useState<ExamPathId>(normalizeExamPath(initialPath))
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const selectedCopy = getExamPathCopy(selectedPath, safeLocale)

  async function updatePath(nextPath: ExamPathId) {
    if (nextPath === selectedPath || isSaving) return

    const previousPath = selectedPath
    setSelectedPath(nextPath)
    setError('')
    setIsSaving(true)

    try {
      const response = await fetch('/api/profile/exam-path', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_framework: nextPath }),
        cache: 'no-store',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to update PMP exam path.')
      }

      startTransition(() => {
        router.refresh()
      })
    } catch (err) {
      setSelectedPath(previousPath)
      setError(
        err instanceof Error
          ? err.message
          : isArabic
            ? 'تعذر تحديث مسار اختبار PMP.'
            : 'Unable to update PMP exam path.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
      aria-label={isArabic ? 'اختيار مسار اختبار PMP' : 'PMP exam path selector'}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {isArabic ? 'مسار اختبار PMP' : 'PMP Exam Path'}
          </p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">
            {selectedCopy.label}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {selectedCopy.description}
          </p>
        </div>

        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{
            borderColor: EXAM_PATHS[selectedPath].color + '33',
            backgroundColor: EXAM_PATHS[selectedPath].color + '10',
            color: EXAM_PATHS[selectedPath].color,
          }}
        >
          <span>{selectedCopy.badge}</span>
          <span className="h-1 w-1 rounded-full bg-current opacity-60" aria-hidden="true" />
          <span>{selectedCopy.shortLabel}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {EXAM_PATH_ORDER.map((path) => {
          const copy = getExamPathCopy(path, safeLocale)
          const active = path === selectedPath
          const config = EXAM_PATHS[path]

          return (
            <button
              key={path}
              type="button"
              onClick={() => updatePath(path)}
              disabled={isSaving || isPending}
              className={`rounded-2xl border p-4 text-start transition-all ${
                active
                  ? 'shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
              } ${isArabic ? 'text-right' : 'text-left'}`}
              style={
                active
                  ? {
                      borderColor: config.color,
                      backgroundColor: config.color + '08',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    backgroundColor: config.color + '12',
                    color: config.color,
                  }}
                >
                  {copy.badge}
                </span>
                {active && (
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: config.color }}
                    aria-label={isArabic ? 'المسار المحدد' : 'Selected path'}
                  >
                    ✓
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-bold text-gray-900">
                {copy.label}
              </h3>
              <p className="mt-1 text-xs font-semibold" style={{ color: config.color }}>
                {copy.shortLabel}
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                {copy.seoHint}
              </p>
            </button>
          )
        })}
      </div>

      {error && (
        <p className={`mt-3 text-sm font-semibold text-red-600 ${isArabic ? 'text-right' : 'text-left'}`}>
          {error}
        </p>
      )}
    </section>
  )
}
