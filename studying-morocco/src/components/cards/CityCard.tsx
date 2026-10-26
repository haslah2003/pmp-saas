import Link from 'next/link'

import { CityArt, type ArtVariant } from '@/components/art/CityArt'
import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import type { Dictionary } from '@/i18n'
import { monthlyLiving } from '@/lib/costs'
import { formatMoney } from '@/lib/format'
import type { Locale } from '@/lib/options'
import type { City } from '@/payload-types'

export function CityVisual({ city, priority = false, sizes }: { city: City; priority?: boolean; sizes?: string }) {
  const image = asMedia(city.image)
  return image ? (
    <MediaImage media={image} priority={priority} sizes={sizes} alt={city.name} />
  ) : (
    <CityArt variant={city.artVariant as ArtVariant} seed={city.slug ?? city.name} title={city.name} />
  )
}

export function CityCard({ city, locale, t }: { city: City; locale: Locale; t: Dictionary }) {
  return (
    <Link href={`/${locale}/cities/${city.slug}`} className="group block">
      <div className="arch relative aspect-[4/5] bg-sand shadow-soft transition duration-500 group-hover:shadow-lift">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
          <CityVisual city={city} sizes="(min-width: 1024px) 25vw, 50vw" />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/40 to-transparent p-5 pt-16">
          <h3 className="text-2xl font-bold text-white">{city.name}</h3>
          {city.tagline && <p className="mt-1 line-clamp-2 text-sm text-white/80">{city.tagline}</p>}
          <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            ≈ {formatMoney(monthlyLiving(city), 'MAD', locale)} {t.common.perMonth}
          </p>
        </div>
      </div>
    </Link>
  )
}
