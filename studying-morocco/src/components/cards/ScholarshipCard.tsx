import { CalendarDays, ExternalLink, Landmark } from 'lucide-react'

import { Badge } from '@/components/ui/Section'
import type { Dictionary } from '@/i18n'
import { optionLabel, studyLevels, type Locale } from '@/lib/options'
import type { Scholarship } from '@/payload-types'

export function ScholarshipCard({ scholarship: s, locale, t }: { scholarship: Scholarship; locale: Locale; t: Dictionary }) {
  return (
    <article id={s.slug ?? undefined} className="flex h-full scroll-mt-28 flex-col rounded-card border border-line bg-surface p-card">
      <div className="flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-control bg-canvas text-primary">
          <Landmark className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-h4">{s.name}</h3>
          {s.provider && <p className="mt-0.5 text-small text-muted">{s.provider}</p>}
        </div>
      </div>
      {!!s.levels?.length && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {s.levels.map((l) => (
            <Badge key={l} tone="primary">
              {optionLabel(studyLevels, l, locale)}
            </Badge>
          ))}
        </div>
      )}
      <dl className="mt-4 space-y-3">
        {s.coverage && (
          <div>
            <dt className="text-small font-semibold text-primary">{t.scholarships.coverage}</dt>
            <dd className="mt-0.5 text-ink">{s.coverage}</dd>
          </div>
        )}
        {s.eligibility && (
          <div>
            <dt className="text-small font-semibold text-primary">{t.scholarships.eligibility}</dt>
            <dd className="mt-0.5 text-ink">{s.eligibility}</dd>
          </div>
        )}
        {s.howToApply && (
          <div>
            <dt className="text-small font-semibold text-primary">{t.scholarships.howToApply}</dt>
            <dd className="mt-0.5 text-ink">{s.howToApply}</dd>
          </div>
        )}
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-small">
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {s.amount && <span className="font-semibold text-primary">{s.amount}</span>}
          {s.deadline && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <CalendarDays className="size-4" aria-hidden="true" /> {s.deadline}
            </span>
          )}
        </span>
        {s.link && (
          <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            {t.scholarships.official} <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}
