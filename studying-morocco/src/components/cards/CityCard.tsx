import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import type { Dictionary } from '@/i18n'
import { monthlyLiving } from '@/lib/costs'
import { formatMoney } from '@/lib/format'
import type { Locale } from '@/lib/options'
import type { City } from '@/payload-types'

/** The city's cover photo, or nothing until one is uploaded. */
export function CityVisual({ city, priority = false, sizes }: { city: City; priority?: boolean; sizes?: string }) {
  const image = asMedia(city.image)
  return image ? <MediaImage media={image} priority={priority} sizes={sizes} alt={city.name} /> : null
}

export function CityCard({ city, locale, t }: { city: City; locale: Locale; t: Dictionary }) {
  const image = asMedia(city.image)
  return (
    <Link
      href={`/${locale}/cities/${city.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-primary"
    >
      {image && (
        <div className="relative aspect-[4/3] bg-canvas">
          <MediaImage media={image} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" alt={city.name} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-card">
        <h3 className="text-h4">{city.name}</h3>
        {city.tagline && <p className="mt-2 line-clamp-2 text-ink">{city.tagline}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4 text-small">
          <span>
            <span className="block text-muted">{t.cities.monthlyBudget}</span>
            <span className="block font-semibold text-ink">
              ≈ {formatMoney(monthlyLiving(city), 'MAD', locale)} {t.common.perMonth}
            </span>
          </span>
          <ArrowUpRight className="size-5 shrink-0 text-primary rtl:-scale-x-100" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}
