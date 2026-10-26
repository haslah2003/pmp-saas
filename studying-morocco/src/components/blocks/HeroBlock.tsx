import { ArrowRight, BadgeCheck, Check, Plane, Wallet } from 'lucide-react'

import { ProgramFinder } from '@/components/forms/ProgramFinder'
import { LinkButton } from '@/components/ui/Button'
import { asMedia, MediaImage } from '@/components/ui/MediaImage'
import { Eyebrow } from '@/components/ui/Section'
import type { Dictionary } from '@/i18n'
import { getCities, getDisciplines } from '@/lib/queries'
import { localizeHref } from '@/lib/routes'

import type { BlockProps } from './types'

/** Shown beside the home hero until a 16:9 hero photo is uploaded. */
function GlanceCard({ t }: { t: Dictionary }) {
  const rows = [
    { icon: BadgeCheck, title: t.home.heroCardOffer, text: t.home.heroCardOfferSub },
    { icon: Wallet, title: t.home.heroCardTuition, text: `0 ${t.home.heroCardCurrency} ${t.common.perYear}` },
    { icon: Plane, title: t.home.heroCardPickup, text: t.home.heroCardPickupSub, flip: true },
  ]
  return (
    <div className="rounded-card bg-surface p-card text-ink shadow-card">
      <h2 className="text-h4">{t.home.heroCardTitle}</h2>
      <ul className="mt-5 divide-y divide-line">
        {rows.map(({ icon: RowIcon, title, text, flip }) => (
          <li key={title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-canvas text-primary">
              <RowIcon className={flip ? 'size-5 rtl:-scale-x-100' : 'size-5'} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-primary">{title}</span>
              <span className="block text-small text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function HeroBlock({ block, locale, t }: BlockProps<'hero'>) {
  const ctas = (
    <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
      {block.primaryCta?.label && (
        <LinkButton href={localizeHref(block.primaryCta.href, locale)} size="lg" data-track="hero_primary">
          {block.primaryCta.label}
          <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
        </LinkButton>
      )}
      {block.secondaryCta?.label && (
        <LinkButton href={localizeHref(block.secondaryCta.href, locale)} variant="light" size="lg" data-track="hero_secondary">
          {block.secondaryCta.label}
        </LinkButton>
      )}
    </div>
  )

  if (block.variant === 'page') {
    return (
      <section className="on-dark bg-primary text-white">
        <div className="container-page py-section">
          <div className="max-w-3xl">
            {block.eyebrow && <Eyebrow dark>{block.eyebrow}</Eyebrow>}
            <h1 className="mt-4 text-white">{block.heading}</h1>
            {block.subheading && <p className="mt-4 max-w-2xl text-body text-line">{block.subheading}</p>}
            {ctas}
          </div>
        </div>
      </section>
    )
  }

  const image = asMedia(block.image)
  const [disciplines, cities] = block.showSearch ? await Promise.all([getDisciplines(locale), getCities(locale)]) : [[], []]

  return (
    <section className="on-dark bg-primary text-white">
      <div className="container-page grid items-center gap-10 pt-section pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          {block.eyebrow && <Eyebrow dark>{block.eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-white">{block.heading}</h1>
          {block.subheading && <p className="mt-4 max-w-xl text-body text-line">{block.subheading}</p>}
          {ctas}
          {!!block.chips?.length && (
            <ul className="mt-8 flex flex-col gap-3 text-small text-white md:flex-row md:flex-wrap md:gap-x-6">
              {block.chips.map((chip) => (
                <li key={chip.id ?? chip.text} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-cta" aria-hidden="true" strokeWidth={3} />
                  {chip.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        {image ? (
          <div className="relative aspect-video overflow-hidden rounded-card bg-canvas">
            <MediaImage media={image} size="hero" priority sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        ) : (
          <GlanceCard t={t} />
        )}
      </div>
      {block.showSearch && (
        <div className="container-page pb-section">
          <ProgramFinder locale={locale} t={t} disciplines={disciplines} cities={cities} />
        </div>
      )}
    </section>
  )
}
