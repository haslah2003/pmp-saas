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
      className="group flex h-full flex-col rounded-card border border-line bg-surface p-card transition-colors hover:border-primary"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="primary">
          <GraduationCap className="size-3.5" aria-hidden="true" />
          {optionLabel(studyLevels, program.level, locale)}
        </Badge>
        {program.languages?.map((l) => <Badge key={l}>{optionLabel(teachingLanguages, l, locale)}</Badge>)}
        {program.scholarshipAvailable && <Badge tone="highlight">{t.programs.scholarshipAvailable}</Badge>}
      </div>
      <h3 className="mt-4 text-h4">{program.title}</h3>
      {discipline && <p className="mt-1 text-small text-muted">{discipline.name}</p>}
      {university && (
        <p className="mt-3 text-small font-medium text-ink">
          {university.name}
          {city && (
            <span className="ms-1 inline-flex items-center gap-1 font-normal text-muted">
              · <MapPin className="size-3.5 text-primary" aria-hidden="true" /> {city.name}
            </span>
          )}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-small">
        <span className="flex items-center gap-3">
          {program.durationYears ? (
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="size-4" aria-hidden="true" />
              {formatNumber(program.durationYears, locale, 1)} {t.common.years}
            </span>
          ) : null}
          <span className="font-semibold text-primary">
            {free ? t.common.free : program.tuitionPerYear != null ? `${formatMoney(program.tuitionPerYear, 'MAD', locale)} ${t.common.perYear}` : t.common.onRequest}
          </span>
        </span>
        <ArrowUpRight className="size-5 shrink-0 text-primary rtl:-scale-x-100" aria-hidden="true" />
      </div>
    </Link>
  )
}
