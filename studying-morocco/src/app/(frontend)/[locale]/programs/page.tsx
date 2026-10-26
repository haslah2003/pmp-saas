import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ProgramCard } from '@/components/cards/ProgramCard'
import { FilterBar } from '@/components/forms/FilterBar'
import { buttonClass } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { studyLevels, teachingLanguages } from '@/lib/options'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { getCities, getDisciplines, getPrograms } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/programs', title: t.programs.title, description: t.programs.intro })
}

export default async function ProgramsPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const sp = await searchParams
  const filters = {
    level: param(sp.level),
    field: param(sp.field),
    city: param(sp.city),
    language: param(sp.lang),
    q: param(sp.q)?.slice(0, 80),
    free: param(sp.free) === '1',
  }
  const page = Math.max(1, Number(param(sp.page)) || 1)
  const [result, disciplines, cities] = await Promise.all([getPrograms(locale, { ...filters, page, limit: 24 }), getDisciplines(locale), getCities(locale)])
  const hasFilters = Object.values(filters).some(Boolean)

  const pageHref = (n: number) => {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(sp)) if (typeof v === 'string' && v && k !== 'page') qs.set(k, v)
    if (n > 1) qs.set('page', String(n))
    const s = qs.toString()
    return `/${locale}/programs${s ? `?${s}` : ''}`
  }

  return (
    <>
      <PageHeader
        title={t.programs.title}
        intro={t.programs.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.programs, href: `/${locale}/programs` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page pt-10 pb-section">
        <FilterBar
          action={`/${locale}/programs`}
          q={filters.q}
          searchPlaceholder={t.programs.searchPlaceholder}
          clearLabel={t.common.clear}
          submitLabel={t.nav.search}
          hasFilters={hasFilters}
          checkbox={{ name: 'free', label: t.programs.freeOnly, checked: filters.free }}
          selects={[
            { name: 'level', label: t.common.level, value: filters.level, anyLabel: t.common.all, options: studyLevels.map((o) => ({ value: o.value, label: o.label[locale] })) },
            { name: 'field', label: t.common.field, value: filters.field, anyLabel: t.common.all, options: disciplines.map((d) => ({ value: d.slug ?? '', label: d.name })) },
            { name: 'city', label: t.common.city, value: filters.city, anyLabel: t.common.all, options: cities.map((c) => ({ value: c.slug ?? '', label: c.name })) },
            { name: 'lang', label: t.common.language, value: filters.language, anyLabel: t.common.all, options: teachingLanguages.map((o) => ({ value: o.value, label: o.label[locale] })) },
          ]}
        />
        <p className="mt-8 mb-5 text-small text-muted" aria-live="polite">
          {formatNumber(result.totalDocs, locale)} {t.common.results}
        </p>
        {result.docs.length ? (
          <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((p) => (
              <ProgramCard key={p.id} program={p} locale={locale} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState title={t.common.noResults} text={t.common.noResultsHint} cta={t.nav.consultation} href={`/${locale}/consultation`} />
        )}
        {result.totalPages > 1 && (
          <nav className="mt-10 flex items-center gap-3" aria-label={t.common.page}>
            {result.hasPrevPage && (
              <Link href={pageHref(page - 1)} className={buttonClass('secondary', 'md', undefined, true)}>
                <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /> {t.common.previous}
              </Link>
            )}
            <span className="text-small text-muted">
              {t.common.page} {formatNumber(page, locale)} {t.common.of} {formatNumber(result.totalPages, locale)}
            </span>
            {result.hasNextPage && (
              <Link href={pageHref(page + 1)} className={buttonClass('secondary', 'md', undefined, true)}>
                {t.common.next} <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  )
}
