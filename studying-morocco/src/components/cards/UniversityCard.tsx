import { ArrowUpRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/Section'
import type { Dictionary } from '@/i18n'
import { formatMoney } from '@/lib/format'
import { optionLabel, teachingLanguages, universityTypes, type Locale } from '@/lib/options'
import { cn, initials, populated } from '@/lib/utils'
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
      <span className={cn('relative inline-flex aspect-square overflow-hidden rounded-control bg-surface ring-1 ring-line', className)}>
        <Image src={logo.url} alt={logo.alt || university.name} fill sizes="80px" className="object-contain p-1.5" />
      </span>
    )
  // No logo uploaded yet: a plain monogram (never an imitation of the university's crest).
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex aspect-square items-center justify-center rounded-control bg-canvas font-semibold text-primary ring-1 ring-line', className)}
    >
      {university.shortName || initials(university.name)}
    </span>
  )
}

export function UniversityCard({ university, locale, t }: { university: University; locale: Locale; t: Dictionary }) {
  const city = populated<City>(university.city)
  return (
    <Link
      href={`/${locale}/universities/${university.slug}`}
      className="group flex h-full flex-col rounded-card border border-line bg-surface p-card transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <UniversityLogo university={university} className="size-14 text-small" />
        <Badge tone={university.type === 'public' ? 'primary' : 'neutral'}>
          {optionLabel(universityTypes, university.type, locale)}
        </Badge>
      </div>
      <h3 className="mt-5 text-h4">{university.name}</h3>
      {city && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-small text-muted">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          {city.name}
        </p>
      )}
      {university.summary && <p className="mt-3 line-clamp-3 text-ink">{university.summary}</p>}
      <div className="mt-auto pt-5">
        {!!university.languages?.length && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {university.languages.map((l) => (
              <Badge key={l}>{optionLabel(teachingLanguages, l, locale)}</Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-4 text-small">
          <TuitionLabel min={university.tuitionMin} max={university.tuitionMax} locale={locale} t={t} />
          <ArrowUpRight className="size-5 text-primary rtl:-scale-x-100" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}
