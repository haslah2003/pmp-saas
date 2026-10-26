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
    <section className="border-y border-line bg-surface">
      <dl className="container-page grid grid-cols-2 divide-line py-8 sm:py-10 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col-reverse px-4 py-4 text-center lg:py-2">
            <dt className="mt-1 text-sm text-muted">{item.label}</dt>
            <dd className="font-sans text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
