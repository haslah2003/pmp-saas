import { BadgeCheck, CalendarDays, Check, Clock, Globe2, GraduationCap, MapPin, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ProgramCard } from '@/components/cards/ProgramCard'
import { UniversityLogo } from '@/components/cards/UniversityCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { LinkButton } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { Badge } from '@/components/ui/Section'
import { formatMoney, formatNumber } from '@/lib/format'
import { optionLabel, studyLevels, studyModes, teachingLanguages } from '@/lib/options'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getProgramBySlug, getPrograms } from '@/lib/queries'
import { buildMetadata, JsonLd } from '@/lib/seo'
import { absoluteURL, populated } from '@/lib/utils'
import type { City, Discipline, University } from '@/payload-types'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const { slug } = await params
  const p = await getProgramBySlug(slug, locale)
  if (!p) return {}
  const uni = populated<University>(p.university)
  return buildMetadata({ locale, path: `/programs/${slug}`, title: uni ? `${p.title} — ${uni.name}` : p.title, description: p.summary, meta: p.meta })
}

export default async function ProgramPage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  const program = await getProgramBySlug(slug, locale)
  if (!program) return redirectOrNotFound(`/${locale}/programs/${slug}`, locale)
  const university = populated<University>(program.university)
  const city = populated<City>(university?.city)
  const discipline = populated<Discipline>(program.discipline)
  const related = discipline?.slug ? (await getPrograms(locale, { field: discipline.slug, limit: 3, exclude: program.id })).docs : []
  const free = program.tuitionPerYear === 0
  const tuition = free ? t.common.free : program.tuitionPerYear != null ? `${formatMoney(program.tuitionPerYear, 'MAD', locale)} ${t.common.perYear}` : t.common.onRequest

  const facts = [
    { icon: GraduationCap, label: t.common.level, value: optionLabel(studyLevels, program.level, locale) },
    program.durationYears && { icon: Clock, label: t.common.duration, value: `${formatNumber(program.durationYears, locale, 1)} ${t.common.years}` },
    { icon: Wallet, label: t.common.tuition, value: tuition },
    program.languages?.length && { icon: Globe2, label: t.common.language, value: program.languages.map((l) => optionLabel(teachingLanguages, l, locale)).join(' · ') },
    program.intakes && { icon: CalendarDays, label: t.common.intakes, value: program.intakes },
    program.studyMode && { icon: BadgeCheck, label: t.programs.studyMode, value: optionLabel(studyModes, program.studyMode, locale) },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[]

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: program.title,
    description: program.summary ?? undefined,
    url: absoluteURL(`/${locale}/programs/${slug}`),
    educationalProgramMode: 'full-time',
    ...(program.durationYears ? { timeToComplete: `P${program.durationYears}Y` } : {}),
    ...(program.languages?.length ? { inLanguage: program.languages } : {}),
    ...(university ? { provider: { '@type': 'CollegeOrUniversity', name: university.name, ...(city ? { address: { '@type': 'PostalAddress', addressLocality: city.name, addressCountry: 'MA' } } : {}) } } : {}),
    ...(program.tuitionPerYear != null ? { offers: { '@type': 'Offer', price: program.tuitionPerYear, priceCurrency: 'MAD', category: 'Tuition per year' } } : {}),
  }

  return (
    <>
      <PageHeader
        title={program.title}
        intro={program.summary}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.programs, href: `/${locale}/programs` },
          { name: program.title, href: `/${locale}/programs/${slug}` },
        ]}
        crumbLabel={t.common.breadcrumb}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="dark">{optionLabel(studyLevels, program.level, locale)}</Badge>
          {discipline && <Badge tone="dark">{discipline.name}</Badge>}
          {program.scholarshipAvailable && <Badge tone="gold">{t.programs.scholarshipAvailable}</Badge>}
        </div>
        {university && (
          <Link href={`/${locale}/universities/${university.slug}`} className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/8 p-2 pe-4 ring-1 ring-white/15 transition hover:bg-white/15">
            <UniversityLogo university={university} className="size-11 text-sm" />
            <span>
              <span className="block font-semibold text-white">{university.name}</span>
              {city && (
                <span className="inline-flex items-center gap-1 text-sm text-white/70">
                  <MapPin className="size-3.5" aria-hidden="true" /> {city.name}
                </span>
              )}
            </span>
          </Link>
        )}
      </PageHeader>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_21rem] lg:py-20">
        <div className="min-w-0 space-y-12">
          {program.description && (
            <section>
              <h2 className="text-2xl sm:text-3xl">{t.programs.overview}</h2>
              <RichText data={program.description} locale={locale} className="mt-5" />
            </section>
          )}
          {!!program.requirements?.length && (
            <section>
              <h2 className="text-2xl sm:text-3xl">{t.programs.requirements}</h2>
              <ul className="mt-5 space-y-3">
                {program.requirements.map((r) => (
                  <li key={r.id ?? r.text} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /> {r.text}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!!program.careerOutcomes?.length && (
            <section>
              <h2 className="text-2xl sm:text-3xl">{t.programs.careers}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {program.careerOutcomes.map((c) => (
                  <li key={c.id ?? c.text} className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-800 ring-1 ring-primary-100">
                    {c.text}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {program.tuitionNote && <p className="rounded-2xl bg-sand p-5 text-sm leading-relaxed text-ink/80">{program.tuitionNote}</p>}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft">
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="font-medium">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <LinkButton href={`/${locale}/apply?program=${slug}`} size="lg" className="mt-6 w-full">
              {t.programs.applyNow}
            </LinkButton>
            <LinkButton href={`/${locale}/consultation`} variant="outline" className="mt-2 w-full">
              {t.nav.consultation}
            </LinkButton>
            <p className="mt-4 text-xs text-muted">{t.common.indicative}</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-sand py-16">
          <div className="container-page">
            <h2 className="mb-8 text-2xl sm:text-3xl">{t.programs.related}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProgramCard key={p.id} program={p} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={ld} />
    </>
  )
}
