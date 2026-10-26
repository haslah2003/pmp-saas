import { ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import type { Dictionary } from '@/i18n'
import { formatMoney } from '@/lib/format'
import type { Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { Service } from '@/payload-types'

export function ServiceCard({ service, locale, t, compact = false }: { service: Service; locale: Locale; t: Dictionary; compact?: boolean }) {
  return (
    <Link
      href={`/${locale}/services/${service.slug}`}
      className="group flex h-full flex-col rounded-card border border-line bg-surface p-card transition-colors hover:border-primary"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-control bg-canvas text-primary">
        <Icon name={service.icon} className="size-6" />
      </span>
      <h3 className="mt-5 text-h4">{service.title}</h3>
      {service.summary && <p className="mt-2 text-ink">{service.summary}</p>}
      {!compact && !!service.features?.length && (
        <ul className="mt-4 space-y-2 text-small text-ink">
          {service.features.slice(0, 3).map((f) => (
            <li key={f.id ?? f.text} className="flex items-start gap-2">
              <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              {f.text}
            </li>
          ))}
        </ul>
      )}
      <div className={cn('mt-auto flex items-center justify-between pt-5 text-small', !compact && 'mt-5 border-t border-line')}>
        <span className="text-muted">
          {service.priceFrom != null ? (
            <>
              {t.services.priceFrom} <span className="font-semibold text-ink">{formatMoney(service.priceFrom, service.currency || 'USD', locale)}</span>
            </>
          ) : (
            t.common.learnMore
          )}
        </span>
        <ArrowUpRight className="size-5 text-primary rtl:-scale-x-100" aria-hidden="true" />
      </div>
    </Link>
  )
}
