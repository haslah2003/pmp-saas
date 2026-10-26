import { BadgeCheck, Plane, Wallet } from 'lucide-react'

import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import type { Dictionary } from '@/i18n'
import type { Media } from '@/payload-types'

import { CityArt } from './CityArt'
import { StarOrnament } from './Ornaments'

export function HeroArt({ t, image }: { t: Dictionary; image?: Media | number | null }) {
  const media = asMedia(image)
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-full bg-accent-100/70 blur-3xl" aria-hidden="true" />
      <svg viewBox="0 0 200 200" className="absolute -top-8 -end-6 -z-10 size-40 text-accent/40" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="40" y="40" width="120" height="120" />
          <rect x="40" y="40" width="120" height="120" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="40" />
        </g>
      </svg>
      <div className="arch relative mx-auto aspect-[4/5] w-[86%] border-[10px] border-surface bg-sand shadow-lift">
        {media ? <MediaImage media={media} size="hero" priority sizes="(min-width: 1024px) 40vw, 90vw" /> : <CityArt variant="coast" seed="rabat-hero" />}
      </div>

      <div className="absolute start-0 top-[14%] w-56 animate-float rounded-2xl border border-line bg-surface/95 p-3.5 shadow-lift backdrop-blur sm:w-64">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-white">
            <BadgeCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">{t.home.heroCardOffer}</p>
            <p className="truncate text-xs text-muted">{t.home.heroCardOfferSub}</p>
          </div>
        </div>
      </div>

      <div className="absolute end-0 top-[48%] w-48 animate-float rounded-2xl bg-secondary p-4 text-white shadow-lift [animation-delay:-2.5s] sm:w-52">
        <p className="flex items-center gap-2 text-xs text-white/70">
          <Wallet className="size-4 text-accent" aria-hidden="true" /> {t.home.heroCardTuition}
        </p>
        <p className="mt-1.5 font-sans text-3xl font-bold tracking-tight">
          0 <span className="text-base font-semibold text-accent">{t.home.heroCardCurrency}</span>
        </p>
        <p className="text-xs text-white/60">{t.common.perYear}</p>
      </div>

      <div className="absolute start-[6%] bottom-[6%] flex items-center gap-2.5 rounded-full border border-line bg-surface/95 py-2 ps-2 pe-4 shadow-lift backdrop-blur animate-float [animation-delay:-4.5s]">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent text-secondary-900">
          <Plane className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-ink">{t.home.heroCardPickup}</span>
        <StarOrnament className="size-3 text-clay" />
      </div>
    </div>
  )
}
