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
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
        {cities.map((c) => (
          <div key={c.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <CityCard city={c} locale={locale} t={t} />
          </div>
        ))}
      </div>
    </Section>
  )
}
