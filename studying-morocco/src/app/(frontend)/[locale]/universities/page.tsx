import type { Metadata } from 'next'

import { UniversityCard } from '@/components/cards/UniversityCard'
import { FilterBar } from '@/components/forms/FilterBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { teachingLanguages, universityTypes } from '@/lib/options'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { getCities, getUniversities } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/universities', title: t.universities.title, description: t.universities.intro })
}

export default async function UniversitiesPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const sp = await searchParams
  const filters = { city: param(sp.city), type: param(sp.type), language: param(sp.lang), q: param(sp.q)?.slice(0, 80) }
  const [universities, cities] = await Promise.all([getUniversities(locale, filters), getCities(locale)])
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <PageHeader
        title={t.universities.title}
        intro={t.universities.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.universities, href: `/${locale}/universities` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page pt-10 pb-section">
        <FilterBar
          action={`/${locale}/universities`}
          q={filters.q}
          searchPlaceholder={t.universities.searchPlaceholder}
          clearLabel={t.common.clear}
          submitLabel={t.nav.search}
          hasFilters={hasFilters}
          selects={[
            { name: 'city', label: t.common.city, value: filters.city, anyLabel: t.common.all, options: cities.map((c) => ({ value: c.slug ?? '', label: c.name })) },
            { name: 'type', label: t.common.type, value: filters.type, anyLabel: t.common.all, options: universityTypes.map((o) => ({ value: o.value, label: o.label[locale] })) },
            { name: 'lang', label: t.common.language, value: filters.language, anyLabel: t.common.all, options: teachingLanguages.map((o) => ({ value: o.value, label: o.label[locale] })) },
          ]}
        />
        <p className="mt-8 mb-5 text-small text-muted" aria-live="polite">
          {formatNumber(universities.length, locale)} {t.common.results}
        </p>
        {universities.length ? (
          <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
            {universities.map((u) => (
              <UniversityCard key={u.id} university={u} locale={locale} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState title={t.common.noResults} text={t.common.noResultsHint} cta={t.nav.consultation} href={`/${locale}/consultation`} />
        )}
      </div>
    </>
  )
}
