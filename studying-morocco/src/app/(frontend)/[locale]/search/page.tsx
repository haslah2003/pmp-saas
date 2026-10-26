import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ProgramCard } from '@/components/cards/ProgramCard'
import { UniversityCard } from '@/components/cards/UniversityCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { searchSite } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/search', title: t.search.title, noIndex: true })
}

export default async function SearchPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const q = (param((await searchParams).q) ?? '').trim().slice(0, 80)
  const results = q.length >= 2 ? await searchSite(q, locale) : null
  const total = results ? Object.values(results).reduce((n, list) => n + list.length, 0) : 0
  const linkList = (title: string, items: { id: number; label: string; href: string }[]) =>
    items.length ? (
      <section>
        <h2 className="mb-4 text-h4">{title}</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((i) => (
            <li key={i.id}>
              <Link href={i.href} className="block rounded-card border border-line bg-surface p-4 font-semibold text-primary transition-colors hover:border-primary">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ) : null

  return (
    <>
      <PageHeader title={t.search.title}>
        <form action={`/${locale}/search`} method="get" role="search" className="relative mt-8 max-w-2xl">
          <label htmlFor="site-search" className="sr-only">
            {t.search.placeholder}
          </label>
          <Search className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="site-search"
            name="q"
            type="search"
            defaultValue={q}
            autoFocus
            placeholder={t.search.placeholder}
            className="min-h-12 w-full rounded-control border-0 bg-surface ps-13 pe-5 text-body text-ink outline-none focus:ring-2 focus:ring-cta"
          />
        </form>
      </PageHeader>
      <div className="container-page space-y-12 py-section">
        {!results && <p className="text-muted">{t.search.empty}</p>}
        {results && (
          <p className="text-muted" aria-live="polite">
            {total ? `${t.search.resultsFor} “${q}”` : t.search.none}
          </p>
        )}
        {results?.universities.length ? (
          <section>
            <h2 className="mb-4 text-h4">{t.search.groups.universities}</h2>
            <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
              {results.universities.map((u) => (
                <UniversityCard key={u.id} university={u} locale={locale} t={t} />
              ))}
            </div>
          </section>
        ) : null}
        {results?.programs.length ? (
          <section>
            <h2 className="mb-4 text-h4">{t.search.groups.programs}</h2>
            <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
              {results.programs.map((p) => (
                <ProgramCard key={p.id} program={p} locale={locale} t={t} />
              ))}
            </div>
          </section>
        ) : null}
        {results && linkList(t.search.groups.cities, results.cities.map((c) => ({ id: c.id, label: c.name, href: `/${locale}/cities/${c.slug}` })))}
        {results && linkList(t.search.groups.services, results.services.map((s) => ({ id: s.id, label: s.title, href: `/${locale}/services/${s.slug}` })))}
        {results && linkList(t.search.groups.posts, results.posts.map((p) => ({ id: p.id, label: p.title, href: `/${locale}/blog/${p.slug}` })))}
      </div>
    </>
  )
}
