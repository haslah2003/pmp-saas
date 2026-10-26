import { ArrowRight, CloudSun, MapPin, Plane } from 'lucide-react'
import type { Metadata } from 'next'

import { StarOrnament } from '@/components/art/Ornaments'
import { CityVisual } from '@/components/cards/CityCard'
import { UniversityCard } from '@/components/cards/UniversityCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LinkButton } from '@/components/ui/Button'
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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -start-40 -top-40 -z-10 size-[30rem] rounded-full bg-accent-100/60 blur-3xl" aria-hidden="true" />
        <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <Breadcrumbs
              label={t.common.breadcrumb}
              items={[
                { name: t.nav.home, href: `/${locale}` },
                { name: t.nav.cities, href: `/${locale}/cities` },
                { name: city.name, href: `/${locale}/cities/${slug}` },
              ]}
            />
            {city.region && (
              <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="size-4" aria-hidden="true" /> {city.region}
              </p>
            )}
            <h1 className="mt-3 text-5xl sm:text-6xl">{city.name}</h1>
            {city.tagline && <p className="mt-4 text-xl text-ink/75">{city.tagline}</p>}
            {city.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">{city.summary}</p>}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-line bg-surface px-5 py-4 shadow-soft">
                <p className="text-xs text-muted">{t.cities.monthlyBudget}</p>
                <p className="mt-1 text-2xl font-bold text-primary-800">
                  ≈ {formatMoney(monthlyLiving(city), 'MAD', locale)}
                  <span className="text-sm font-medium text-muted"> {t.common.perMonth}</span>
                </p>
              </div>
              {city.climate && (
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4">
                  <CloudSun className="size-6 text-accent-700" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted">{t.cities.climate}</p>
                    <p className="font-semibold">{city.climate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-md border-[10px] border-surface shadow-lift">
            <CityVisual city={city} priority sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 pb-16 lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-10">
          {!!city.highlights?.length && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {city.highlights.map((h) => (
                <li key={h.id ?? h.text} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                  <StarOrnament className="mt-1 size-3.5 shrink-0 text-accent" /> {h.text}
                </li>
              ))}
            </ul>
          )}
          {city.description && <RichText data={city.description} locale={locale} />}
          {city.flightTimes && (
            <p className="flex items-start gap-3 rounded-2xl bg-sand p-5">
              <Plane className="mt-0.5 size-5 shrink-0 text-primary rtl:-scale-x-100" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">{t.cities.flights}</span>
                <span className="text-ink/80">{city.flightTimes}</span>
              </span>
            </p>
          )}
        </div>
        <aside className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-sans text-lg font-bold">{t.cities.costBreakdown}</h2>
          <ul className="mt-5 space-y-3.5">
            {rows.map((r) => (
              <li key={r.label}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-ink/75">{r.label}</span>
                  <span className="font-semibold tabular-nums">{formatMoney(r.value, 'MAD', locale)}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-ink/5">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${(r.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted">{t.cities.estimate}</p>
          <LinkButton href={`/${locale}/cost-calculator`} variant="outline" className="mt-5 w-full">
            {t.nav.calculator} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </LinkButton>
        </aside>
      </div>

      {universities.length > 0 && (
        <section className="border-t border-line bg-sand py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl sm:text-3xl">{t.cities.universitiesHere}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
