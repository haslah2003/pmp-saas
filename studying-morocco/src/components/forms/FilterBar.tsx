'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

import { buttonClass } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

import { inputClass } from './styles'

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
    <form ref={formRef} action={action} method="get" className="rounded-card border border-line bg-surface p-4 shadow-card md:p-5" role="search">
      <div className="grid gap-3 md:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
        <label className="relative md:col-span-2 lg:min-w-64 lg:flex-1">
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
            className={cn(inputClass, 'ps-12')}
          />
        </label>
        <div className="contents">
          <SlidersHorizontal className="hidden size-5 shrink-0 text-primary lg:block" aria-hidden="true" />
          {selects.map((s) => (
            <label key={s.name} className="block lg:shrink-0">
              <span className="sr-only">{s.label}</span>
              <select
                name={s.name}
                defaultValue={s.value ?? ''}
                onChange={submit}
                className={cn(
                  inputClass,
                  'appearance-none pe-8 text-small font-medium lg:w-auto',
                  s.value && 'border-2 border-primary text-primary',
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
            <label className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-control border border-muted px-4 text-small font-medium">
              <input type="checkbox" name={checkbox.name} value="1" defaultChecked={checkbox.checked} onChange={submit} className="size-4 accent-[var(--color-primary)]" />
              {checkbox.label}
            </label>
          )}
          <noscript>
            <button type="submit" className={buttonClass('primary', 'md', undefined, true)}>
              {submitLabel}
            </button>
          </noscript>
          {hasFilters && (
            <Link href={action} className="inline-flex min-h-12 shrink-0 items-center gap-1 rounded-control px-3 text-small font-semibold text-primary hover:bg-canvas">
              <X className="size-4" aria-hidden="true" /> {clearLabel}
            </Link>
          )}
        </div>
      </div>
    </form>
  )
}
