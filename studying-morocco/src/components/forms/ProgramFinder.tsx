import { Search } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import { studyLevels, teachingLanguages, type Locale } from '@/lib/options'
import { buttonClass } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { City, Discipline } from '@/payload-types'

import { inputClass } from './styles'

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
      <span className="mb-1.5 block text-small font-semibold text-ink">{label}</span>
      <select id={id} name={name} defaultValue="" className={cn(inputClass, 'appearance-none')}>
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
      className={cn('rounded-card border border-line bg-surface p-card text-ink shadow-card', className)}
    >
      <h2 className="mb-4 text-h4">{t.home.finderTitle}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
        {field('finder-level', t.home.finderLevel, 'level', studyLevels.map((l) => ({ value: l.value, label: l.label[locale] })))}
        {field('finder-field', t.home.finderField, 'field', disciplines.map((d) => ({ value: d.slug ?? '', label: d.name })))}
        {field('finder-city', t.home.finderCity, 'city', cities.map((c) => ({ value: c.slug ?? '', label: c.name })))}
        {field('finder-lang', t.home.finderLanguage, 'lang', teachingLanguages.map((l) => ({ value: l.value, label: l.label[locale] })))}
        <button type="submit" className={buttonClass('primary', 'md', 'min-h-12 md:col-span-2 lg:col-span-1')}>
          <Search className="size-5" aria-hidden="true" />
          {t.home.finderButton}
        </button>
      </div>
    </form>
  )
}
