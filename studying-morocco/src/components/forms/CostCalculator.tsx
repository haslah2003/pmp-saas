'use client'

import { ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { ComparisonChart } from '@/components/charts/ComparisonChart'
import type { Dictionary } from '@/i18n'
import type { ComparisonRow } from '@/lib/comparison'
import { monthlyLiving, type Housing } from '@/lib/costs'
import { formatDate, formatMoney } from '@/lib/format'
import { currencies, type Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { Calculator, City } from '@/payload-types'

import { inputClass } from './fields'

type Institution = 'publicFree' | 'publicFlexible' | 'privateLow' | 'privateHigh'
type Lifestyle = 'budget' | 'standard' | 'comfort'

const lifestyleFactor: Record<Lifestyle, number> = { budget: 0.8, standard: 1, comfort: 1.35 }

function Segmented<V extends string>({ value, onChange, options, label }: { value: V; onChange: (v: V) => void; options: { value: V; label: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-ink/5 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn('rounded-xl px-2 py-2.5 text-sm font-semibold transition', value === o.value ? 'bg-surface text-primary-800 shadow-soft' : 'text-ink/70 hover:text-ink')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function CostCalculator({
  locale,
  t,
  cities,
  calc,
  defaultCurrency,
}: {
  locale: Locale
  t: Pick<Dictionary, 'calculator' | 'common' | 'nav'>
  cities: Pick<City, 'id' | 'name' | 'slug' | 'rentResidence' | 'rentShared' | 'rentStudio' | 'homestay' | 'food' | 'transport' | 'utilities' | 'leisure'>[]
  calc: Pick<Calculator, 'rates' | 'tuition' | 'benchmarks' | 'ratesUpdated' | 'disclaimer'> | null
  defaultCurrency: string
}) {
  const c = t.calculator
  const [cityId, setCityId] = useState(cities[0]?.id ?? 0)
  const [housing, setHousing] = useState<Housing>('shared')
  const [institution, setInstitution] = useState<Institution>('publicFree')
  const [lifestyle, setLifestyle] = useState<Lifestyle>('standard')
  const [years, setYears] = useState(3)
  const [currency, setCurrency] = useState(defaultCurrency)

  const rates = useMemo(() => {
    const map: Record<string, number> = { MAD: 1 }
    for (const r of calc?.rates ?? []) if (r.madPerUnit > 0) map[r.currency] = r.madPerUnit
    return map
  }, [calc])
  const availableCurrencies = currencies.filter((code) => rates[code])
  const per = rates[currency] ?? 1
  const fx = (mad: number) => mad / per
  const money = (mad: number) => formatMoney(Math.round(fx(mad) / 10) * 10, currency, locale)

  const city = cities.find((x) => x.id === cityId) ?? cities[0] ?? {}
  const tuitionTable: Record<Institution, number> = {
    publicFree: 0,
    publicFlexible: calc?.tuition?.publicFlexible ?? 15000,
    privateLow: calc?.tuition?.privateMin ?? 50000,
    privateHigh: calc?.tuition?.privateMax ?? 130000,
  }
  const monthly = monthlyLiving(city, housing, lifestyleFactor[lifestyle])
  const insurance = calc?.tuition?.insurancePerYear ?? 3000
  const oneTime = calc?.tuition?.oneTimeSetup ?? 6000
  const tuition = tuitionTable[institution]
  const yearly = tuition + monthly * 12 + insurance
  const programTotal = yearly * years + oneTime

  const rows: ComparisonRow[] = useMemo(() => {
    const list: ComparisonRow[] = (calc?.benchmarks ?? []).map((b, i) => {
      const r = rates[b.currency] ?? 1
      return { key: `b${i}`, label: b.label, tuition: (b.tuition * r) / per, living: (b.living * r) / per, total: ((b.tuition + b.living) * r) / per, note: b.note }
    })
    list.push({ key: 'you', label: c.morocco, tuition: fx(tuition), living: fx(monthly * 12 + insurance), total: fx(yearly), highlight: true })
    return list.sort((a, b) => b.total - a.total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc, rates, per, tuition, monthly, insurance, yearly, c.morocco])

  const priciest = rows[0]
  const saving = priciest && !priciest.highlight ? priciest.total - fx(yearly) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <div className="space-y-6 rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-8">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{c.city}</span>
          <select value={cityId} onChange={(e) => setCityId(Number(e.target.value))} className={cn(inputClass, 'appearance-none')}>
            {cities.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-2 block text-sm font-semibold">{c.institution}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {(['publicFree', 'publicFlexible', 'privateLow', 'privateHigh'] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={institution === key}
                onClick={() => setInstitution(key)}
                className={cn(
                  'rounded-2xl border p-3.5 text-start text-sm transition',
                  institution === key ? 'border-primary bg-primary-50 ring-2 ring-primary-100' : 'border-line hover:border-primary-200',
                )}
              >
                <span className="block font-semibold">{c[key]}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {tuitionTable[key] === 0 ? t.common.free : `${money(tuitionTable[key])} ${t.common.perYear}`}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-2 block text-sm font-semibold">{c.housing}</span>
          <Segmented
            label={c.housing}
            value={housing}
            onChange={setHousing}
            options={[
              { value: 'residence', label: c.residence },
              { value: 'shared', label: c.shared },
              { value: 'studio', label: c.studio },
              { value: 'homestay', label: c.homestay },
            ]}
          />
        </div>
        <div>
          <span className="mb-2 block text-sm font-semibold">{c.lifestyle}</span>
          <Segmented
            label={c.lifestyle}
            value={lifestyle}
            onChange={setLifestyle}
            options={[
              { value: 'budget', label: c.budget },
              { value: 'standard', label: c.standard },
              { value: 'comfort', label: c.comfort },
            ]}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex justify-between text-sm font-semibold">
              {c.years}
              <span className="text-primary">
                {years} {t.common.years}
              </span>
            </span>
            <input type="range" min={1} max={7} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{c.currency}</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={cn(inputClass, 'appearance-none')} dir="ltr">
              {availableCurrencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="pattern-zellige rounded-[2rem] bg-secondary p-6 text-white shadow-lift [--pattern-opacity:0.07] sm:p-8" aria-live="polite">
          <dl className="grid grid-cols-2 gap-5">
            <div>
              <dt className="text-sm text-white/65">{c.monthlyLiving}</dt>
              <dd className="mt-1 text-2xl font-bold">{money(monthly)}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/65">{c.yearlyTuition}</dt>
              <dd className="mt-1 text-2xl font-bold">{tuition === 0 ? t.common.free : money(tuition)}</dd>
            </div>
            <div className="col-span-2 border-t border-white/15 pt-5">
              <dt className="text-sm text-white/65">{c.yearlyTotal}</dt>
              <dd className="mt-1 font-sans text-5xl font-bold tracking-tight text-accent">{money(yearly)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-white/65">
                {c.programTotal} ({years} {t.common.years})
              </dt>
              <dd className="mt-1 text-xl font-semibold">{money(programTotal)}</dd>
              <dd className="mt-1 text-xs text-white/55">{c.oneTime}</dd>
            </div>
          </dl>
          {saving > 0 && (
            <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm ring-1 ring-white/15">
              {c.saving} <strong className="text-accent">{formatMoney(Math.round(saving / 10) * 10, currency, locale)}</strong> {c.perYearVs} {priciest!.label}
            </p>
          )}
          <Link
            href={`/${locale}/consultation`}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-semibold text-secondary-900 transition hover:bg-accent-300"
          >
            {c.getPlan}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
        {rows.length > 1 && <ComparisonChart rows={rows} currency={currency} locale={locale} t={t} />}
        <p className="flex gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            {calc?.disclaimer || c.disclaimer}
            {calc?.ratesUpdated ? ` ${c.ratesUpdated}: ${formatDate(calc.ratesUpdated, locale, 'medium')}.` : ''}
          </span>
        </p>
      </div>
    </div>
  )
}
