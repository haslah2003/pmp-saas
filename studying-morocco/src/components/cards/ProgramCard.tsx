import { ArrowUpRight, Clock, GraduationCap, MapPin } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/Section'
import type { Dictionary } from '@/i18n'
import { formatMoney, formatNumber } from '@/lib/format'
import { optionLabel, studyLevels, teachingLanguages, type Locale } from '@/lib/options'
import { populated } from '@/lib/utils'
import type { City, Discipline, Program, University } from '@/payload-types'

export function ProgramCard({ program, locale, t }: { program: Program; locale: Locale; t: Dictionary }) {
  const university = populated<University>(program.university)
  const city = populated<City>(university?.city)
  const discipline = populated<Discipline>(program.discipline)
  const free = program.tuitionPerYear === 0
  return (
    <Link
      href={`/${locale}/programs/${program.slug}`}
      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="primary">
          <GraduationCap className="size-3.5" aria-hidden="true" />
          {optionLabel(studyLevels, program.level, locale)}
        </Badge>
        {program.languages?.map((l) => <Badge key={l}>{optionLabel(teachingLanguages, l, locale)}</Badge>)}
        {program.scholarshipAvailable && <Badge tone="gold">{t.programs.scholarshipAvailable}</Badge>}
      </div>
      <h3 className="mt-4 text-[1.08rem] leading-snug font-bold text-ink group-hover:text-primary-800">{program.title}</h3>
      {discipline && <p className="mt-1 text-sm text-muted">{discipline.name}</p>}
      {university && (
        <p className="mt-3 text-sm font-medium text-ink/80">
          {university.name}
          {city && (
            <span className="ms-1 inline-flex items-center gap-1 font-normal text-muted">
              · <MapPin className="size-3.5 text-clay" aria-hidden="true" /> {city.name}
            </span>
          )}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="flex items-center gap-3">
          {program.durationYears ? (
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="size-4" aria-hidden="true" />
              {formatNumber(program.durationYears, locale, 1)} {t.common.years}
            </span>
          ) : null}
          <span className={free ? 'font-semibold text-primary' : 'font-semibold'}>
            {free ? t.common.free : program.tuitionPerYear != null ? `${formatMoney(program.tuitionPerYear, 'MAD', locale)} ${t.common.perYear}` : t.common.onRequest}
          </span>
        </span>
        <ArrowUpRight className="size-5 shrink-0 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden="true" />
      </div>
    </Link>
  )
}
