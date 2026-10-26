import { ArrowUpRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { UniversityCrest } from '@/components/art/UniversityCrest'
import { Badge } from '@/components/ui/Section'
import type { Dictionary } from '@/i18n'
import { formatMoney } from '@/lib/format'
import { optionLabel, teachingLanguages, universityTypes, type Locale } from '@/lib/options'
import { populated } from '@/lib/utils'
import type { City, Media, University } from '@/payload-types'

export function TuitionLabel({ min, max, locale, t }: { min?: number | null; max?: number | null; locale: Locale; t: Dictionary }) {
  if (min === 0 && !max) return <span className="font-semibold text-primary">{t.common.free}</span>
  if (min == null && max == null) return <span className="text-muted">{t.common.onRequest}</span>
  if (min === 0)
    return (
      <span>
        <span className="font-semibold text-primary">{t.common.free}</span>
        <span className="text-muted"> · {t.common.upTo} {formatMoney(max!, 'MAD', locale, true)}</span>
      </span>
    )
  return (
    <span>
      <span className="text-muted">{t.common.from} </span>
      <span className="font-semibold text-ink">{formatMoney(min ?? max!, 'MAD', locale)}</span>
      <span className="text-muted"> {t.common.perYear}</span>
    </span>
  )
}

export function UniversityLogo({ university, className }: { university: University; className?: string }) {
  const logo = populated<Media>(university.logo)
  if (logo?.url)
    return (
      <span className={`relative inline-flex aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-line ${className ?? ''}`}>
        <Image src={logo.url} alt={logo.alt || university.name} fill sizes="64px" className="object-contain p-1.5" />
      </span>
    )
  return <UniversityCrest name={university.name} shortName={university.shortName} color={university.color} className={className} />
}

export function UniversityCard({ university, locale, t }: { university: University; locale: Locale; t: Dictionary }) {
  const city = populated<City>(university.city)
  return (
    <Link
      href={`/${locale}/universities/${university.slug}`}
      className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <UniversityLogo university={university} className="size-14 text-lg" />
        <Badge tone={university.type === 'public' ? 'primary' : university.type === 'traditional' ? 'clay' : 'gold'}>
          {optionLabel(universityTypes, university.type, locale)}
        </Badge>
      </div>
      <h3 className="mt-5 text-lg leading-snug font-bold text-ink group-hover:text-primary-800">{university.name}</h3>
      {city && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4 text-clay" aria-hidden="true" />
          {city.name}
        </p>
      )}
      {university.summary && <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink/75">{university.summary}</p>}
      <div className="mt-auto pt-5">
        {!!university.languages?.length && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {university.languages.map((l) => (
              <Badge key={l}>{optionLabel(teachingLanguages, l, locale)}</Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
          <TuitionLabel min={university.tuitionMin} max={university.tuitionMax} locale={locale} t={t} />
          <ArrowUpRight className="size-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}
