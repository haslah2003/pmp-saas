import { AlertTriangle, CalendarDays, Check, ExternalLink, Globe2, GraduationCap, Landmark, MapPin, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ProgramCard } from '@/components/cards/ProgramCard'
import { TuitionLabel, UniversityCard, UniversityLogo } from '@/components/cards/UniversityCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonClass, LinkButton } from '@/components/ui/Button'
import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { SocialIcon } from '@/components/ui/SocialIcon'
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
      <section className="on-dark bg-primary text-white">
        <div className={cover ? 'container-page grid gap-10 py-section lg:grid-cols-[1fr_28rem] lg:items-center' : 'container-page py-section'}>
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
              <UniversityLogo university={university} className="size-20 text-body" />
              <div className="flex flex-wrap gap-2">
                <Badge tone="dark">{optionLabel(universityTypes, university.type, locale)}</Badge>
                {university.languages?.map((l) => (
                  <Badge key={l} tone="dark">
                    {optionLabel(teachingLanguages, l, locale)}
                  </Badge>
                ))}
              </div>
            </div>
            <h1 className="mt-6 text-white">{university.name}</h1>
            {city && (
              <p className="mt-3 inline-flex items-center gap-2 text-line">
                <MapPin className="size-5 text-cta" aria-hidden="true" />
                <Link href={`/${locale}/cities/${city.slug}`} className="hover:text-white hover:underline">
                  {city.name}
                </Link>
              </p>
            )}
            {university.summary && <p className="mt-5 max-w-2xl text-body text-line">{university.summary}</p>}
            <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
              <LinkButton href={`/${locale}/apply?university=${slug}`} size="lg">
                {t.universities.applyHere}
              </LinkButton>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp_university" className={buttonClass('light', 'lg')}>
                  <SocialIcon name="whatsapp" className="size-5" /> {t.universities.askCounselor}
                </a>
              )}
            </div>
          </div>
          {cover && (
            <div className="relative aspect-video overflow-hidden rounded-card bg-canvas">
              <MediaImage media={cover} size="hero" priority sizes="(min-width: 1024px) 28rem, 100vw" />
            </div>
          )}
        </div>
      </section>

      <div className="container-page grid gap-10 py-section lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-14">
          {(university.description || university.highlights?.length) && (
            <section>
              <h2>{t.universities.about}</h2>
              {university.description && <RichText data={university.description} locale={locale} className="mt-5" />}
              {!!university.highlights?.length && (
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {university.highlights.map((h) => (
                    <li key={h.id ?? h.text} className="flex items-start gap-3 rounded-card border border-line bg-surface p-4">
                      <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" strokeWidth={3} />
                      {h.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {university.gccNote && (
            <aside className="rounded-card border-s-4 border-cta bg-canvas p-card">
              <p className="flex items-center gap-2 font-semibold text-primary">
                <AlertTriangle className="size-5" aria-hidden="true" /> {t.universities.gccNote}
              </p>
              <div className="mt-2 space-y-2 text-small text-ink">
                {splitParagraphs(university.gccNote).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </aside>
          )}

          <section>
            <h2>{t.universities.admissions}</h2>
            <dl className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-card border border-line bg-surface p-card">
                <dt className="text-small text-muted">{t.universities.fees}</dt>
                <dd className="mt-1 text-body">
                  <TuitionLabel min={university.tuitionMin} max={university.tuitionMax} locale={locale} t={t} />
                </dd>
                {university.tuitionNote && <dd className="mt-2 text-small text-ink">{university.tuitionNote}</dd>}
              </div>
              {university.applicationWindow && (
                <div className="rounded-card border border-line bg-surface p-card">
                  <dt className="text-small text-muted">{t.universities.applicationWindow}</dt>
                  <dd className="mt-1 text-body font-semibold">{university.applicationWindow}</dd>
                </div>
              )}
              {!!university.admissionChannels?.length && (
                <div className="rounded-card border border-line bg-surface p-card md:col-span-2">
                  <dt className="text-small text-muted">{t.universities.channels}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {university.admissionChannels.map((c) => (
                      <Badge key={c} tone="primary">
                        {optionLabel(admissionChannels, c, locale)}
                      </Badge>
                    ))}
                  </dd>
                  {university.admissionNotes && <dd className="mt-3 text-small whitespace-pre-line text-ink">{university.admissionNotes}</dd>}
                </div>
              )}
              {university.scholarshipsInfo && (
                <div className="rounded-card border border-line bg-surface p-card md:col-span-2">
                  <dt className="text-small text-muted">{t.universities.scholarships}</dt>
                  <dd className="mt-1 whitespace-pre-line text-ink">{university.scholarshipsInfo}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h2>
              {t.universities.programs} <span className="text-body font-normal text-muted">({programs.length})</span>
            </h2>
            {programs.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={{ ...p, university }} locale={locale} t={t} />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-card bg-canvas p-card text-ink">{t.universities.noPrograms}</p>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-card">
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-small text-muted">{f.label}</dt>
                    <dd className="font-medium text-ink">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {university.website && (
              <a href={university.website} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline">
                {t.common.website} <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
            {university.lastVerified && (
              <p className="mt-4 border-t border-line pt-4 text-small text-muted">
                {t.common.lastVerified}: {formatDate(university.lastVerified, locale, 'medium')}. {t.common.indicative}
              </p>
            )}
          </div>
          <div className="on-dark rounded-card bg-primary p-card text-white">
            <p className="text-h4 font-semibold text-white">{t.consultation.title}</p>
            <p className="mt-2 text-small text-line">{t.consultation.benefits[0]}</p>
            <LinkButton href={`/${locale}/consultation`} className="mt-5 w-full">
              {t.nav.consultation}
            </LinkButton>
          </div>
        </aside>
      </div>

      {others.length > 0 && city && (
        <section className="border-t border-line bg-canvas py-section">
          <div className="container-page">
            <h2 className="mb-8">
              {t.universities.otherInCity} {city.name}
            </h2>
            <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
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
