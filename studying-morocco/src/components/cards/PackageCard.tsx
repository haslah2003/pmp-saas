import { Check, Minus } from 'lucide-react'
import Link from 'next/link'

import { buttonClass } from '@/components/ui/Button'
import type { Dictionary } from '@/i18n'
import { formatMoney } from '@/lib/format'
import type { Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { Package } from '@/payload-types'

export function PackageCard({ pkg, locale, t }: { pkg: Package; locale: Locale; t: Dictionary }) {
  const hi = Boolean(pkg.highlighted)
  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-card p-card',
        hi ? 'on-dark bg-primary text-white ring-2 ring-cta' : 'border border-line bg-surface',
      )}
    >
      {(pkg.badge || hi) && (
        <span className="absolute -top-3.5 start-6 inline-flex items-center rounded-full bg-cta px-3 py-0.5 text-small font-semibold text-primary">
          {pkg.badge || t.services.popular}
        </span>
      )}
      <h3 className={cn('text-h4', hi && 'text-white')}>{pkg.name}</h3>
      {pkg.tagline && <p className={cn('mt-1.5 text-small', hi ? 'text-line' : 'text-muted')}>{pkg.tagline}</p>}
      <p className="mt-6 flex items-baseline gap-2">
        {pkg.price != null ? (
          <>
            <span className={cn('text-h2 font-semibold', hi ? 'text-white' : 'text-primary')}>{formatMoney(pkg.price, pkg.currency || 'USD', locale)}</span>
            {pkg.priceSuffix && <span className={cn('text-small', hi ? 'text-line' : 'text-muted')}>{pkg.priceSuffix}</span>}
          </>
        ) : (
          <span className={cn('text-h3 font-semibold', hi ? 'text-white' : 'text-primary')}>{t.common.onRequest}</span>
        )}
      </p>
      <ul className="mt-6 space-y-3">
        {pkg.features?.map((f) => (
          <li key={f.id ?? f.text} className={cn('flex items-start gap-2.5', !f.included && (hi ? 'text-line' : 'text-muted'))}>
            {f.included ? (
              <Check className={cn('mt-1 size-4.5 shrink-0', hi ? 'text-cta' : 'text-primary')} aria-hidden="true" />
            ) : (
              <Minus className="mt-1 size-4.5 shrink-0" aria-hidden="true" />
            )}
            <span className={!f.included ? 'line-through' : undefined}>{f.text}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/${locale}/apply?package=${encodeURIComponent(pkg.name)}`}
        className={buttonClass(hi ? 'primary' : 'secondary', 'lg', 'mt-8 w-full')}
      >
        {t.services.choose}
      </Link>
    </div>
  )
}
