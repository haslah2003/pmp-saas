import { AlertTriangle, CalendarDays, ExternalLink, Globe2, GraduationCap, Landmark, MapPin, MessageCircle, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CityArt, type ArtVariant } from '@/components/art/CityArt'
import { StarOrnament } from '@/components/art/Ornaments'
import { ProgramCard } from '@/components/cards/ProgramCard'
import { TuitionLabel, UniversityCard, UniversityLogo } from '@/components/cards/UniversityCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LinkButton } from '@/components/ui/Button'
import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { Badge } from '@/components/ui/Section'
import { formatDate } from '@/lib/format'
import { admissionChannels, optionLabel, teachingLanguages, universityTypes } from '@/lib/options'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getSettings, getUniversities, getUniversityBySlug } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { absoluteURL, populated, splitParagraphs, whatsappLink } from '@/lib/utils'
import type { City, Program } from '@/payload-types'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const { slug } = await params
  const u = await getUniversityBySlug(slug, locale)
  if (!u) return {}
  return buildMetadata({ locale, path: `/universities/${slug}`, title: u.name, description: u.summary, meta: u.meta, image: u.cover })
}

export default async function UniversityPage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const university = await getUniversityBySlug(slug, locale)
  if (!university) return redirectOrNotFound(`/${locale}/universities/${slug}`, locale)

  const city = populated<City>(university.city)
  const programs = (university.programs?.docs ?? []).filter((p): p is Program => typeof p === 'object')
  const cover = asMedia(university.cover)
  const [settings, siblings] = await Promise.all([
    getSettings(locale),
    city?.slug ? getUniversities(locale, { city: city.slug, limit: 4 }) : Promise.resolve([]),
  ])
  const others = siblings.filter((s) => s.id !== university.id).slice(0, 3)
  const wa = whatsappLink(settings.whatsapp, `${t.whatsapp.message} — ${university.name}`)

  const facts = [
    { icon: Landmark, label: t.common.type, value: optionLabel(universityTypes, university.type, locale) },
    city && { icon: MapPin, label: t.common.city, value: city.name },
    university.founded && { icon: CalendarDays, label: t.common.founded, value: String(university.founded) },
    university.languages?.length && {
      icon: Globe2,
      label: t.universities.teachingLanguages,
      value: university.languages.map((l) => optionLabel(teachingLanguages, l, locale)).join(' · '),
    },
    university.internationalStudents && { icon: Users, label: t.universities.internationalStudents, value: university.internationalStudents },
    university.accreditation && { icon: GraduationCap, label: t.universities.accreditation, value: university.accreditation },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[]

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: university.name,
    url: university.website || absoluteURL(`/${locale}/universities/${slug}`),
    description: university.summary ?? undefined,
    ...(university.founded ? { foundingDate: String(university.founded) } : {}),
    ...(city ? { address: { '@type': 'PostalAddress', addressLocality: city.name, addressCountry: 'MA' } } : {}),
  }

  return (
    <>
      <section className="pattern-zellige relative overflow-hidden bg-secondary text-white [--pattern-opacity:0.07]">
        <div className="container-page relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <Breadcrumbs
              dark
              label={t.common.breadcrumb}
              items={[
                { name: t.nav.home, href: `/${locale}` },
                { name: t.nav.universities, href: `/${locale}/universities` },
                { name: university.name, href: `/${locale}/universities/${slug}` },
              ]}
            />
            <div className="mt-8 flex items-center gap-4">
              <UniversityLogo university={university} className="size-20 text-2xl ring-4 ring-white/10" />
              <div className="flex flex-wrap gap-2">
                <Badge tone="dark">{optionLabel(universityTypes, university.type, locale)}</Badge>
                {university.languages?.map((l) => (
                  <Badge key={l} tone="dark">
                    {optionLabel(teachingLanguages, l, locale)}
                  </Badge>
                ))}
              </div>
            </div>
            <h1 className="mt-6 text-4xl leading-tight text-white sm:text-5xl">{university.name}</h1>
            {city && (
              <p className="mt-3 inline-flex items-center gap-2 text-white/75">
                <MapPin className="size-5 text-accent" aria-hidden="true" />
                <Link href={`/${locale}/cities/${city.slug}`} className="hover:text-white hover:underline">
                  {city.name}
                </Link>
              </p>
            )}
            {university.summary && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{university.summary}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={`/${locale}/apply?university=${slug}`} variant="gold" size="lg">
                {t.universities.applyHere}
              </LinkButton>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp_university" className="inline-flex h-13 items-center gap-2 rounded-full bg-white/10 px-6 font-semibold text-white ring-1 ring-white/25 hover:bg-white/20">
                  <MessageCircle className="size-5" aria-hidden="true" /> {t.universities.askCounselor}
                </a>
              )}
            </div>
          </div>
          <div className="arch relative hidden aspect-[4/5] border-8 border-white/10 lg:block">
            {cover ? <MediaImage media={cover} size="hero" priority sizes="22rem" /> : <CityArt variant={(city?.artVariant as ArtVariant) ?? 'imperial'} seed={slug} />}
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_22rem] lg:py-20">
        <div className="min-w-0 space-y-14">
          {(university.description || university.highlights?.length) && (
            <section>
              <h2 className="text-2xl sm:text-3xl">{t.universities.about}</h2>
              {university.description && <RichText data={university.description} locale={locale} className="mt-5" />}
              {!!university.highlights?.length && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {university.highlights.map((h) => (
                    <li key={h.id ?? h.text} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-[0.95rem]">
                      <StarOrnament className="mt-1 size-3.5 shrink-0 text-accent" />
                      {h.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {university.gccNote && (
            <aside className="rounded-[var(--radius-card)] border border-accent-100 bg-accent-50 p-6">
              <p className="flex items-center gap-2 font-bold text-accent-700">
                <AlertTriangle className="size-5" aria-hidden="true" /> {t.universities.gccNote}
              </p>
              <div className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-ink/85">
                {splitParagraphs(university.gccNote).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </aside>
          )}

          <section>
            <h2 className="text-2xl sm:text-3xl">{t.universities.admissions}</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <dt className="text-sm text-muted">{t.universities.fees}</dt>
                <dd className="mt-1 text-lg">
                  <TuitionLabel min={university.tuitionMin} max={university.tuitionMax} locale={locale} t={t} />
                </dd>
                {university.tuitionNote && <dd className="mt-2 text-sm leading-relaxed text-ink/70">{university.tuitionNote}</dd>}
              </div>
              {university.applicationWindow && (
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <dt className="text-sm text-muted">{t.universities.applicationWindow}</dt>
                  <dd className="mt-1 text-lg font-semibold">{university.applicationWindow}</dd>
                </div>
              )}
              {!!university.admissionChannels?.length && (
                <div className="rounded-2xl border border-line bg-surface p-5 sm:col-span-2">
                  <dt className="text-sm text-muted">{t.universities.channels}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {university.admissionChannels.map((c) => (
                      <Badge key={c} tone="primary">
                        {optionLabel(admissionChannels, c, locale)}
                      </Badge>
                    ))}
                  </dd>
                  {university.admissionNotes && <dd className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/75">{university.admissionNotes}</dd>}
                </div>
              )}
              {university.scholarshipsInfo && (
                <div className="rounded-2xl border border-line bg-surface p-5 sm:col-span-2">
                  <dt className="text-sm text-muted">{t.universities.scholarships}</dt>
                  <dd className="mt-1 leading-relaxed whitespace-pre-line text-ink/85">{university.scholarshipsInfo}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl">
              {t.universities.programs} <span className="text-lg font-normal text-muted">({programs.length})</span>
            </h2>
            {programs.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={{ ...p, university }} locale={locale} t={t} />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-sand p-5 text-ink/75">{t.universities.noPrograms}</p>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft">
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="font-medium text-ink">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {university.website && (
              <a href={university.website} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                {t.common.website} <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
            {university.lastVerified && (
              <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                {t.common.lastVerified}: {formatDate(university.lastVerified, locale, 'medium')}. {t.common.indicative}
              </p>
            )}
          </div>
          <div className="pattern-zellige rounded-[var(--radius-card)] bg-primary p-6 text-white [--pattern-opacity:0.1]">
            <p className="font-display text-xl font-bold text-white">{t.consultation.title}</p>
            <p className="mt-2 text-sm text-white/80">{t.consultation.benefits[0]}</p>
            <LinkButton href={`/${locale}/consultation`} variant="gold" className="mt-5 w-full">
              {t.nav.consultation}
            </LinkButton>
          </div>
        </aside>
      </div>

      {others.length > 0 && city && (
        <section className="border-t border-line bg-sand py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl sm:text-3xl">
              {t.universities.otherInCity} {city.name}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((u) => (
                <UniversityCard key={u.id} university={u} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={ld} />
    </>
  )
}
