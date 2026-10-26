'use client'

import { ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { ComparisonChart } from '@/components/charts/ComparisonChart'
import { buttonClass } from '@/components/ui/Button'
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
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-control border border-muted p-1 md:auto-cols-fr md:grid-flow-col md:grid-cols-none">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn('min-h-11 rounded-[6px] px-2 text-small font-semibold transition-colors', value === o.value ? 'bg-primary text-white' : 'text-ink hover:bg-canvas')}
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
    <div className="grid gap-grid lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <div className="space-y-6 rounded-card border border-line bg-surface p-card">
        <label className="block">
          <span className="mb-2 block text-small font-semibold text-ink">{c.city}</span>
          <select value={cityId} onChange={(e) => setCityId(Number(e.target.value))} className={cn(inputClass, 'appearance-none')}>
            {cities.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-2 block text-small font-semibold text-ink">{c.institution}</span>
          <div className="grid gap-2 md:grid-cols-2">
            {(['publicFree', 'publicFlexible', 'privateLow', 'privateHigh'] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={institution === key}
                onClick={() => setInstitution(key)}
                className={cn(
                  'min-h-14 rounded-card border p-3.5 text-start text-small transition-colors',
                  institution === key ? 'border-2 border-primary bg-canvas' : 'border-muted hover:border-primary',
                )}
              >
                <span className="block font-semibold text-primary">{c[key]}</span>
                <span className="mt-0.5 block text-small text-muted">
                  {tuitionTable[key] === 0 ? t.common.free : `${money(tuitionTable[key])} ${t.common.perYear}`}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-2 block text-small font-semibold text-ink">{c.housing}</span>
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
          <span className="mb-2 block text-small font-semibold text-ink">{c.lifestyle}</span>
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
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex justify-between text-small font-semibold text-ink">
              {c.years}
              <span className="text-primary">
                {years} {t.common.years}
              </span>
            </span>
            <input type="range" min={1} max={7} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-small font-semibold text-ink">{c.currency}</span>
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
        <div className="on-dark rounded-card bg-primary p-card text-white" aria-live="polite">
          <dl className="grid grid-cols-2 gap-5">
            <div>
              <dt className="text-small text-line">{c.monthlyLiving}</dt>
              <dd className="mt-1 text-h3 font-semibold">{money(monthly)}</dd>
            </div>
            <div>
              <dt className="text-small text-line">{c.yearlyTuition}</dt>
              <dd className="mt-1 text-h3 font-semibold">{tuition === 0 ? t.common.free : money(tuition)}</dd>
            </div>
            <div className="col-span-2 border-t border-white/20 pt-5">
              <dt className="text-small text-line">{c.yearlyTotal}</dt>
              <dd className="mt-1 text-h1 font-semibold text-cta">{money(yearly)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-small text-line">
                {c.programTotal} ({years} {t.common.years})
              </dt>
              <dd className="mt-1 text-h4 font-semibold">{money(programTotal)}</dd>
              <dd className="mt-1 text-small text-line">{c.oneTime}</dd>
            </div>
          </dl>
          {saving > 0 && (
            <p className="mt-6 rounded-card p-4 text-small ring-1 ring-white/40">
              {c.saving} <strong className="text-cta">{formatMoney(Math.round(saving / 10) * 10, currency, locale)}</strong> {c.perYearVs} {priciest!.label}
            </p>
          )}
          <Link
            href={`/${locale}/consultation`}
            className={buttonClass('primary', 'md', 'mt-6 w-full')}
          >
            {c.getPlan}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
        {rows.length > 1 && <ComparisonChart rows={rows} currency={currency} locale={locale} t={t} />}
        <p className="flex gap-2 text-small text-muted">
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
