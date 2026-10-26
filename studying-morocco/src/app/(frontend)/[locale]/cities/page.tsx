import type { Metadata } from 'next'

import { CityCard } from '@/components/cards/CityCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getCities } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/cities', title: t.cities.title, description: t.cities.intro })
}

export default async function CitiesPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const cities = await getCities(locale)
  return (
    <>
      <PageHeader
        title={t.cities.title}
        intro={t.cities.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.cities, href: `/${locale}/cities` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page py-section">
        <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <CityCard key={c.id} city={c} locale={locale} t={t} />
          ))}
        </div>
        <p className="mt-10 text-small text-muted">{t.cities.estimate}</p>
      </div>
    </>
  )
}
