import type { Metadata } from 'next'

import { CTABlock } from '@/components/blocks/MiscBlocks'
import { PackageCard } from '@/components/cards/PackageCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, SectionHeading } from '@/components/ui/Section'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getPackages, getServices } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/services', title: t.services.title, description: t.services.intro })
}

export default async function ServicesPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const [services, packages] = await Promise.all([getServices(locale), getPackages(locale)])
  const groups = [
    { key: 'core', title: null as string | null },
    { key: 'family', title: t.services.familyServices },
    { key: 'addon', title: t.services.addons },
  ]
  return (
    <>
      <PageHeader
        title={t.services.title}
        intro={t.services.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.services, href: `/${locale}/services` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      {groups.map((g) => {
        const list = services.filter((s) => (s.category ?? 'core') === g.key)
        if (!list.length) return null
        return (
          <Section key={g.key} className={g.key === 'core' ? undefined : 'pt-0 md:pt-0 lg:pt-0'}>
            {g.title && <SectionHeading title={g.title} />}
            <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <ServiceCard key={s.id} service={s} locale={locale} t={t} />
              ))}
            </div>
          </Section>
        )
      })}
      {packages.length > 0 && (
        <Section tone="canvas" id="packages">
          <SectionHeading title={t.services.packagesTitle} intro={t.services.packagesIntro} />
          <div className="grid items-stretch gap-grid md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} locale={locale} t={t} />
            ))}
          </div>
        </Section>
      )}
      <CTABlock
        locale={locale}
        t={t}
        block={{
          blockType: 'cta',
          heading: t.consultation.title,
          text: t.consultation.intro,
          primaryCta: { label: t.nav.consultation, href: '/consultation' },
          secondaryCta: { label: t.nav.apply, href: '/apply' },
          variant: 'dark',
        }}
      />
    </>
  )
}
