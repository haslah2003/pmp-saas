import { formatNumber } from '@/lib/format'
import { getCounts, getSettings } from '@/lib/queries'

import type { BlockProps } from './types'

export async function StatsBlock({ block, locale, t }: BlockProps<'stats'>) {
  let items = block.items?.length ? block.items : null
  if (!items) {
    const settings = await getSettings(locale)
    items = settings.stats?.length ? settings.stats : null
  }
  if (!items) {
    const counts = await getCounts()
    items = [
      { value: formatNumber(counts.universities, locale), label: t.nav.universities },
      { value: formatNumber(counts.programs, locale), label: t.nav.programs },
      { value: formatNumber(counts.cities, locale), label: t.nav.cities },
      { value: locale === 'ar' ? '0 درهم' : '0 MAD', label: t.home.heroCardTuition },
    ]
  }
  return (
    <section className="border-b border-line bg-surface">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 py-section">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col-reverse justify-end border-s-2 border-cta ps-4">
            <dt className="mt-1 text-small text-muted">{item.label}</dt>
            <dd className="text-h2 font-semibold text-primary">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
