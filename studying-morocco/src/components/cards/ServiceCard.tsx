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
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift"
    >
      <span className="absolute -end-10 -top-10 size-32 rounded-full bg-primary-50 transition duration-500 group-hover:scale-125" aria-hidden="true" />
      <span className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_10px_24px_-10px_var(--color-primary)]">
        <Icon name={service.icon} className="size-6" />
      </span>
      <h3 className="relative mt-5 text-lg font-bold text-ink">{service.title}</h3>
      {service.summary && <p className="relative mt-2 text-[0.95rem] leading-relaxed text-ink/75">{service.summary}</p>}
      {!compact && !!service.features?.length && (
        <ul className="relative mt-4 space-y-2 text-sm text-ink/80">
          {service.features.slice(0, 3).map((f) => (
            <li key={f.id ?? f.text} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {f.text}
            </li>
          ))}
        </ul>
      )}
      <div className={cn('relative mt-auto flex items-center justify-between pt-5 text-sm', !compact && 'border-t border-line mt-5')}>
        <span className="text-muted">
          {service.priceFrom != null ? (
            <>
              {t.services.priceFrom} <span className="font-semibold text-ink">{formatMoney(service.priceFrom, service.currency || 'USD', locale)}</span>
            </>
          ) : (
            t.common.learnMore
          )}
        </span>
        <ArrowUpRight className="size-5 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden="true" />
      </div>
    </Link>
  )
}
