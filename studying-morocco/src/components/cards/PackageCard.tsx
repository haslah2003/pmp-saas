import { Check, Minus } from 'lucide-react'
import Link from 'next/link'

import { StarOrnament } from '@/components/art/Ornaments'
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
        'relative flex h-full flex-col rounded-[1.75rem] p-7 transition duration-300',
        hi
          ? 'pattern-zellige bg-secondary text-white shadow-lift ring-2 ring-accent [--pattern-opacity:0.06] lg:-my-4 lg:py-11'
          : 'border border-line bg-surface shadow-soft hover:shadow-lift',
      )}
    >
      {(pkg.badge || hi) && (
        <span className="absolute -top-3.5 start-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-secondary-900">
          <StarOrnament className="size-3" />
          {pkg.badge || t.services.popular}
        </span>
      )}
      <h3 className={cn('text-xl font-bold', hi && 'text-white')}>{pkg.name}</h3>
      {pkg.tagline && <p className={cn('mt-1.5 text-sm', hi ? 'text-white/70' : 'text-muted')}>{pkg.tagline}</p>}
      <p className="mt-6 flex items-baseline gap-2">
        {pkg.price != null ? (
          <>
            <span className={cn('font-display text-4xl font-bold', hi ? 'text-accent' : 'text-ink')}>{formatMoney(pkg.price, pkg.currency || 'USD', locale)}</span>
            {pkg.priceSuffix && <span className={cn('text-sm', hi ? 'text-white/60' : 'text-muted')}>{pkg.priceSuffix}</span>}
          </>
        ) : (
          <span className="font-display text-3xl font-bold">{t.common.onRequest}</span>
        )}
      </p>
      <ul className="mt-6 space-y-3 text-[0.95rem]">
        {pkg.features?.map((f) => (
          <li key={f.id ?? f.text} className={cn('flex items-start gap-2.5', !f.included && 'opacity-50')}>
            {f.included ? (
              <Check className={cn('mt-0.5 size-4.5 shrink-0', hi ? 'text-accent' : 'text-primary')} aria-hidden="true" />
            ) : (
              <Minus className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
            )}
            <span className={!f.included ? 'line-through' : undefined}>{f.text}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/${locale}/apply?package=${encodeURIComponent(pkg.name)}`}
        className={cn(buttonClass(hi ? 'gold' : 'outline', 'lg'), 'mt-8 w-full')}
      >
        {t.services.choose}
      </Link>
    </div>
  )
}
