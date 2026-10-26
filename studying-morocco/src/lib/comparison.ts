import type { Calculator, City } from '@/payload-types'

import { monthlyLiving } from './costs'
import type { Locale } from './options'

export type ComparisonRow = { key: string; label: string; tuition: number; living: number; total: number; highlight?: boolean; note?: string | null }

export const ratesMap = (calc: Calculator | null | undefined): Record<string, number> => {
  const map: Record<string, number> = { MAD: 1 }
  for (const r of calc?.rates ?? []) if (r.currency && r.madPerUnit > 0) map[r.currency] = r.madPerUnit
  return map
}

export const defaultDisplayCurrency = (locale: Locale) => (locale === 'ar' ? 'USD' : 'EUR')

/**
 * Yearly cost of study in Morocco (reference city, shared flat) versus the
 * benchmark destinations configured in Admin → Cost calculator, in `currency`.
 */
export const buildComparison = ({
  calc,
  city,
  currency,
  labels,
}: {
  calc: Calculator | null
  city: Partial<City>
  currency: string
  labels: { moroccoPublic: string; moroccoPrivate: string }
}): ComparisonRow[] => {
  const rates = ratesMap(calc)
  const per = rates[currency] ?? 1
  const toDisplay = (mad: number) => mad / per
  const insurance = calc?.tuition?.insurancePerYear ?? 3000
  const livingMAD = monthlyLiving(city, 'shared', 1) * 12 + insurance
  const privateMAD = calc?.tuition?.privateMin ?? 50000

  const rows: ComparisonRow[] = (calc?.benchmarks ?? []).map((b, i) => {
    const r = rates[b.currency] ?? 1
    const tuition = toDisplay(b.tuition * r)
    const living = toDisplay(b.living * r)
    return { key: `b${i}`, label: b.label, tuition, living, total: tuition + living, note: b.note }
  })
  rows.push({
    key: 'ma-private',
    label: labels.moroccoPrivate,
    tuition: toDisplay(privateMAD),
    living: toDisplay(livingMAD),
    total: toDisplay(privateMAD + livingMAD),
  })
  rows.push({ key: 'ma-public', label: labels.moroccoPublic, tuition: 0, living: toDisplay(livingMAD), total: toDisplay(livingMAD), highlight: true })
  return rows.sort((a, b) => b.total - a.total)
}
