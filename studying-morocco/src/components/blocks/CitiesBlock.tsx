import { CityCard } from '@/components/cards/CityCard'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getCities } from '@/lib/queries'

import type { BlockProps } from './types'

export async function CitiesBlock({ block, locale, t }: BlockProps<'citiesShowcase'>) {
  const cities = await getCities(locale, block.limit ?? 6)
  if (!cities.length) return null
  return (
    <Section>
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <CityCard key={c.id} city={c} locale={locale} t={t} />
        ))}
      </div>
    </Section>
  )
}
