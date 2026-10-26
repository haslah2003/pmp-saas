'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

type FilterSelect = { name: string; label: string; value?: string; options: { value: string; label: string }[]; anyLabel: string }

/** GET form that re-submits itself on change (works without JavaScript too). */
export function FilterBar({
  action,
  q,
  searchPlaceholder,
  selects,
  checkbox,
  clearLabel,
  submitLabel,
  hasFilters,
}: {
  action: string
  q?: string
  searchPlaceholder: string
  selects: FilterSelect[]
  checkbox?: { name: string; label: string; checked?: boolean }
  clearLabel: string
  submitLabel: string
  hasFilters: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submit = () => formRef.current?.requestSubmit()

  return (
    <form ref={formRef} action={action} method="get" className="rounded-[1.75rem] border border-line bg-surface p-4 shadow-soft sm:p-5" role="search">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={searchPlaceholder}
            onChange={() => {
              if (timer.current) clearTimeout(timer.current)
              timer.current = setTimeout(submit, 450)
            }}
            className="h-12 w-full rounded-2xl border border-line bg-canvas ps-12 pe-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary-100"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <SlidersHorizontal className="hidden size-5 shrink-0 text-muted sm:block" aria-hidden="true" />
          {selects.map((s) => (
            <label key={s.name} className="shrink-0">
              <span className="sr-only">{s.label}</span>
              <select
                name={s.name}
                defaultValue={s.value ?? ''}
                onChange={submit}
                className={cn(
                  'h-12 rounded-2xl border bg-canvas px-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-100',
                  s.value ? 'border-primary bg-primary-50 text-primary-800' : 'border-line',
                )}
              >
                <option value="">
                  {s.label}: {s.anyLabel}
                </option>
                {s.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {checkbox && (
            <label className="inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl border border-line bg-canvas px-4 text-sm font-medium">
              <input type="checkbox" name={checkbox.name} value="1" defaultChecked={checkbox.checked} onChange={submit} className="size-4 accent-[var(--color-primary)]" />
              {checkbox.label}
            </label>
          )}
          <noscript>
            <button type="submit" className="h-12 rounded-2xl bg-primary px-4 text-sm font-semibold text-white">
              {submitLabel}
            </button>
          </noscript>
          {hasFilters && (
            <Link href={action} className="inline-flex h-12 shrink-0 items-center gap-1 rounded-2xl px-3 text-sm font-semibold text-clay-700 hover:bg-clay-50">
              <X className="size-4" aria-hidden="true" /> {clearLabel}
            </Link>
          )}
        </div>
      </div>
    </form>
  )
}
