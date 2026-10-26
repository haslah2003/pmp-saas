import { ArrowRight, Check } from 'lucide-react'

import { HeroArt } from '@/components/art/HeroArt'
import { ProgramFinder } from '@/components/forms/ProgramFinder'
import { LinkButton } from '@/components/ui/Button'
import { StarOrnament } from '@/components/art/Ornaments'
import { getCities, getDisciplines } from '@/lib/queries'
import { localizeHref } from '@/lib/routes'

import type { BlockProps } from './types'

function Heading({ heading, highlight, className }: { heading: string; highlight?: string | null; className?: string }) {
  if (!highlight || !heading.includes(highlight)) return <h1 className={className}>{heading}</h1>
  const [before, after] = heading.split(highlight)
  return (
    <h1 className={className}>
      {before}
      <span className="relative text-primary sm:whitespace-nowrap">
        <span className="relative z-10">{highlight}</span>
        <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-1 h-3 w-full text-accent" aria-hidden="true">
          <path d="M2 8 C 60 2, 120 2, 180 6 S 280 10, 298 4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </span>
      {after}
    </h1>
  )
}

export async function HeroBlock({ block, locale, t }: BlockProps<'hero'>) {
  if (block.variant === 'page') {
    return (
      <section className="pattern-zellige relative overflow-hidden bg-secondary text-white [--pattern-opacity:0.07]">
        <div className="pointer-events-none absolute -end-24 -top-24 size-[28rem] rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            {block.eyebrow && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                <StarOrnament className="size-3.5" /> {block.eyebrow}
              </p>
            )}
            <Heading heading={block.heading} highlight={block.highlight} className="mt-4 text-4xl leading-[1.12] text-white sm:text-5xl [&_span.text-primary]:text-accent" />
            {block.subheading && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{block.subheading}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {block.primaryCta?.label && (
                <LinkButton href={localizeHref(block.primaryCta.href, locale)} variant="gold" size="lg">
                  {block.primaryCta.label}
                </LinkButton>
              )}
              {block.secondaryCta?.label && (
                <LinkButton href={localizeHref(block.secondaryCta.href, locale)} variant="light" size="lg">
                  {block.secondaryCta.label}
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const [disciplines, cities] = block.showSearch ? await Promise.all([getDisciplines(locale), getCities(locale)]) : [[], []]

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -start-40 -top-40 size-[34rem] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute end-0 top-1/3 size-[26rem] rounded-full bg-accent-100/60 blur-3xl" />
        <div className="pattern-zellige absolute inset-y-0 end-0 w-1/2 text-primary [--pattern-opacity:0.06] [mask-image:linear-gradient(to_left,black,transparent)] rtl:[mask-image:linear-gradient(to_right,black,transparent)]" />
      </div>
      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="animate-fade-up">
          {block.eyebrow && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-sm font-semibold text-primary-800 shadow-soft backdrop-blur">
              <StarOrnament className="size-3.5 text-accent" />
              {block.eyebrow}
            </p>
          )}
          <Heading
            heading={block.heading}
            highlight={block.highlight}
            className="mt-6 text-[2.35rem] leading-[1.12] sm:text-5xl lg:text-[3.6rem] rtl:text-[2.1rem] rtl:leading-[1.45] sm:rtl:text-5xl lg:rtl:text-[3.4rem]"
          />
          {block.subheading && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">{block.subheading}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {block.primaryCta?.label && (
              <LinkButton href={localizeHref(block.primaryCta.href, locale)} size="lg" data-track="hero_primary">
                {block.primaryCta.label}
                <ArrowRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
              </LinkButton>
            )}
            {block.secondaryCta?.label && (
              <LinkButton href={localizeHref(block.secondaryCta.href, locale)} variant="outline" size="lg" data-track="hero_secondary">
                {block.secondaryCta.label}
              </LinkButton>
            )}
          </div>
          {!!block.chips?.length && (
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-[0.95rem] text-ink/80">
              {block.chips.map((chip) => (
                <li key={chip.id ?? chip.text} className="inline-flex items-center gap-2">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary-100 text-primary">
                    <Check className="size-3.5" aria-hidden="true" strokeWidth={3} />
                  </span>
                  {chip.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <HeroArt t={t} image={block.image} />
      </div>
      {block.showSearch && (
        <div className="container-page relative -mt-4 pb-14 lg:-mt-10">
          <ProgramFinder locale={locale} t={t} disciplines={disciplines} cities={cities} />
        </div>
      )}
    </section>
  )
}
