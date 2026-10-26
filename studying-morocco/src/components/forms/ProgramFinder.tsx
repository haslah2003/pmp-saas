import { Search } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import { studyLevels, teachingLanguages, type Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { City, Discipline } from '@/payload-types'

const selectClass =
  'h-12 w-full appearance-none rounded-2xl border border-line bg-canvas px-4 text-[0.95rem] text-ink transition outline-none hover:border-primary-200 focus:border-primary focus:ring-4 focus:ring-primary-100'

/** Progressive-enhancement search form: a plain GET to the programmes listing. */
export function ProgramFinder({
  locale,
  t,
  disciplines,
  cities,
  className,
}: {
  locale: Locale
  t: Dictionary
  disciplines: Discipline[]
  cities: City[]
  className?: string
}) {
  const field = (id: string, label: string, name: string, options: { value: string; label: string }[]) => (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <select id={id} name={name} defaultValue="" className={selectClass}>
        <option value="">{t.common.any}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
  return (
    <form
      action={`/${locale}/programs`}
      method="get"
      role="search"
      aria-label={t.home.finderTitle}
      className={cn('rounded-[1.75rem] border border-line bg-surface p-4 shadow-lift sm:p-5', className)}
    >
      <p className="mb-3 px-1 text-sm font-bold text-ink">{t.home.finderTitle}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
        {field('finder-level', t.home.finderLevel, 'level', studyLevels.map((l) => ({ value: l.value, label: l.label[locale] })))}
        {field('finder-field', t.home.finderField, 'field', disciplines.map((d) => ({ value: d.slug ?? '', label: d.name })))}
        {field('finder-city', t.home.finderCity, 'city', cities.map((c) => ({ value: c.slug ?? '', label: c.name })))}
        {field('finder-lang', t.home.finderLanguage, 'lang', teachingLanguages.map((l) => ({ value: l.value, label: l.label[locale] })))}
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-white transition hover:bg-primary-700 sm:col-span-2 lg:col-span-1"
        >
          <Search className="size-5" aria-hidden="true" />
          <span className="lg:sr-only xl:not-sr-only">{t.home.finderButton}</span>
        </button>
      </div>
    </form>
  )
}
