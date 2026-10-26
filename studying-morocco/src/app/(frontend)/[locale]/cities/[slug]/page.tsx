import { ArrowRight, Check, CloudSun, Plane } from 'lucide-react'
import type { Metadata } from 'next'

import { CityVisual } from '@/components/cards/CityCard'
import { UniversityCard } from '@/components/cards/UniversityCard'
import { LinkButton } from '@/components/ui/Button'
import { asMedia } from '@/components/ui/MediaImage'
import { PageHeader } from '@/components/ui/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { monthlyLiving } from '@/lib/costs'
import { formatMoney } from '@/lib/format'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getCityBySlug } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { absoluteURL } from '@/lib/utils'
import type { University } from '@/payload-types'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const city = await getCityBySlug(slug, locale)
  if (!city) return {}
  return buildMetadata({ locale, path: `/cities/${slug}`, title: `${t.common.city}: ${city.name}`, description: city.summary, meta: city.meta, image: city.image })
}

export default async function CityPage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const city = await getCityBySlug(slug, locale)
  if (!city) return redirectOrNotFound(`/${locale}/cities/${slug}`, locale)
  const universities = (city.universities?.docs ?? []).filter((u): u is University => typeof u === 'object')

  const rows = [
    { label: t.cities.rentResidence, value: city.rentResidence },
    { label: t.cities.rentShared, value: city.rentShared },
    { label: t.cities.rentStudio, value: city.rentStudio },
    { label: t.cities.homestay, value: city.homestay },
    { label: t.cities.food, value: city.food },
    { label: t.cities.transport, value: city.transport },
    { label: t.cities.utilities, value: city.utilities },
    { label: t.cities.leisure, value: city.leisure },
  ].filter((r) => r.value != null) as { label: string; value: number }[]
  const max = Math.max(...rows.map((r) => r.value), 1)

  return (
    <>
      <PageHeader
        title={city.name}
        eyebrow={city.region}
        intro={city.tagline}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.cities, href: `/${locale}/cities` },
          { name: city.name, href: `/${locale}/cities/${slug}` },
        ]}
        aside={
          <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
            <div className="rounded-card bg-surface p-card text-ink">
              <p className="text-small text-muted">{t.cities.monthlyBudget}</p>
              <p className="mt-1 text-h3 font-semibold text-primary">
                ≈ {formatMoney(monthlyLiving(city), 'MAD', locale)}
                <span className="text-small font-normal text-muted"> {t.common.perMonth}</span>
              </p>
            </div>
            {city.climate && (
              <div className="flex items-center gap-3 rounded-card bg-surface p-card text-ink">
                <CloudSun className="size-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-small text-muted">{t.cities.climate}</p>
                  <p className="font-semibold text-primary">{city.climate}</p>
                </div>
              </div>
            )}
          </div>
        }
      />

      <div className="container-page grid gap-10 py-section lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-10">
          {asMedia(city.image) && (
            <div className="relative aspect-video overflow-hidden rounded-card bg-canvas">
              <CityVisual city={city} priority sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
          )}
          {city.summary && <p className="max-w-3xl text-body text-ink">{city.summary}</p>}
          {!!city.highlights?.length && (
            <ul className="grid gap-3 md:grid-cols-2">
              {city.highlights.map((h) => (
                <li key={h.id ?? h.text} className="flex items-start gap-3 rounded-card border border-line bg-surface p-4">
                  <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" strokeWidth={3} /> {h.text}
                </li>
              ))}
            </ul>
          )}
          {city.description && <RichText data={city.description} locale={locale} />}
          {city.flightTimes && (
            <p className="flex items-start gap-3 rounded-card bg-canvas p-card">
              <Plane className="mt-0.5 size-5 shrink-0 text-primary rtl:-scale-x-100" aria-hidden="true" />
              <span>
                <span className="block text-small font-semibold text-primary">{t.cities.flights}</span>
                <span className="text-ink">{city.flightTimes}</span>
              </span>
            </p>
          )}
        </div>
        <aside className="rounded-card border border-line bg-surface p-card lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-h4">{t.cities.costBreakdown}</h2>
          <ul className="mt-5 space-y-3.5">
            {rows.map((r) => (
              <li key={r.label}>
                <div className="flex justify-between gap-3 text-small">
                  <span className="text-ink">{r.label}</span>
                  <span className="font-semibold tabular-nums">{formatMoney(r.value, 'MAD', locale)}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-small text-muted">{t.cities.estimate}</p>
          <LinkButton href={`/${locale}/cost-calculator`} variant="secondary" className="mt-5 w-full">
            {t.nav.calculator} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        </aside>
      </div>

      {universities.length > 0 && (
        <section className="border-t border-line bg-canvas py-section">
          <div className="container-page">
            <h2 className="mb-8">{t.cities.universitiesHere}</h2>
            <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
              {universities.map((u) => (
                <UniversityCard key={u.id} university={{ ...u, city }} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'City', name: city.name, url: absoluteURL(`/${locale}/cities/${slug}`), containedInPlace: { '@type': 'Country', name: 'Morocco' } }} />
    </>
  )
}
