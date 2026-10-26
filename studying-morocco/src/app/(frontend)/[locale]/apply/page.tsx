import { Clock, Lock, MessageCircle, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

import { StarOrnament } from '@/components/art/Ornaments'
import { ApplyWizard, type ApplyInitial } from '@/components/forms/ApplyWizard'
import { serviceKeys, studyLevels } from '@/lib/options'
import { param, resolveLocale, type LocaleParams, type SearchParams } from '@/lib/page'
import { getCities, getDisciplines, getPrograms, getSettings, getUniversities } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { populated, whatsappLink } from '@/lib/utils'
import type { University } from '@/payload-types'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/apply', title: t.apply.title, description: t.apply.intro })
}

export default async function ApplyPage({ params, searchParams }: { params: LocaleParams; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params)
  const sp = await searchParams
  const [disciplines, cities, universities, programs, settings] = await Promise.all([
    getDisciplines(locale),
    getCities(locale),
    getUniversities(locale),
    getPrograms(locale, { limit: 300 }),
    getSettings(locale),
  ])

  const initial: ApplyInitial = {}
  const programSlug = param(sp.program)
  const uniSlug = param(sp.university)
  const service = param(sp.service)
  const level = param(sp.level)
  const pkg = param(sp.package)
  const program = programSlug ? programs.docs.find((p) => p.slug === programSlug) : undefined
  if (program) {
    initial.program = String(program.id)
    initial.level = program.level
    const uni = populated<University>(program.university)
    if (uni) initial.universities = [uni.id]
    if (program.discipline) initial.discipline = String(typeof program.discipline === 'object' ? program.discipline.id : program.discipline)
  }
  const uni = uniSlug ? universities.find((u) => u.slug === uniSlug) : undefined
  if (uni) initial.universities = [uni.id]
  if (level && studyLevels.some((l) => l.value === level)) initial.level = level
  if (service && serviceKeys.some((s) => s.value === service)) initial.services = service === 'placement' ? ['placement'] : ['placement', service]
  if (pkg) initial.message = `${locale === 'ar' ? 'الباقة' : 'Package'}: ${pkg.slice(0, 60)}`

  const icons = [Clock, Lock, ShieldCheck]
  const reassurance = t.apply.reassure.map((text, i) => ({ icon: icons[i] ?? ShieldCheck, text }))

  return (
    <div className="pattern-zellige text-primary [--pattern-opacity:0.035]">
      <div className="container-page grid gap-10 py-12 text-ink lg:grid-cols-[1fr_20rem] lg:py-16">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <StarOrnament className="size-3.5 text-accent" /> {t.meta.siteName}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{t.apply.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/75">{t.apply.intro}</p>
          <div className="mt-8">
            <ApplyWizard
              locale={locale}
              t={{ apply: t.apply, common: t.common, errors: t.errors, nav: t.nav, footer: t.footer }}
              disciplines={disciplines.map((d) => ({ id: d.id, name: d.name }))}
              cities={cities.map((c) => ({ id: c.id, name: c.name }))}
              universities={universities.map((u) => ({ id: u.id, name: u.name }))}
              programs={programs.docs.map((p) => ({
                id: p.id,
                name: p.title,
                university: typeof p.university === 'object' ? p.university.id : p.university,
              }))}
              initial={initial}
              whatsappHref={whatsappLink(settings.whatsapp, t.whatsapp.message)}
            />
          </div>
        </div>
        <aside className="space-y-4 lg:pt-36">
          {reassurance.map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink/80">
              <r.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /> {r.text}
            </div>
          ))}
          {settings.whatsapp && (
            <a
              href={whatsappLink(settings.whatsapp, t.whatsapp.message)!}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_apply"
              className="flex items-center gap-3 rounded-2xl bg-[#1f9d55] p-4 text-sm font-semibold text-white"
            >
              <MessageCircle className="size-5" aria-hidden="true" /> {t.whatsapp.label}
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
