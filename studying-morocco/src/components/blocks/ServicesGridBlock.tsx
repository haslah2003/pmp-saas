import { ArrowRight } from 'lucide-react'

import { PackageCard } from '@/components/cards/PackageCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { LinkButton } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getPackages, getServices } from '@/lib/queries'

import type { BlockProps } from './types'

export async function ServicesGridBlock({ block, locale, t }: BlockProps<'servicesGrid'>) {
  const [services, packages] = await Promise.all([
    getServices(locale, { featured: block.onlyFeatured ?? true }),
    block.showPackages ? getPackages(locale) : Promise.resolve([]),
  ])
  return (
    <Section>
      <SectionHeading
        eyebrow={block.eyebrow}
        title={block.heading}
        intro={block.intro}
        action={
          <LinkButton href={`/${locale}/services`} variant="secondary">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        }
      />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} locale={locale} t={t} />
        ))}
      </div>
      {packages.length > 0 && (
        <div className="mt-section">
          <SectionHeading title={t.services.packagesTitle} intro={t.services.packagesIntro} />
          <div className="grid items-stretch gap-grid md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} locale={locale} t={t} />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
