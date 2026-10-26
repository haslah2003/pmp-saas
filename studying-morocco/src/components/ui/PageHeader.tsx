import type { ReactNode } from 'react'

import { StarOrnament } from '@/components/art/Ornaments'
import { cn } from '@/lib/utils'

import { Breadcrumbs, type Crumb } from './Breadcrumbs'

/** Dark, patterned band at the top of inner pages. */
export function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  crumbLabel,
  children,
  aside,
  className,
}: {
  title: string
  intro?: string | null
  eyebrow?: string | null
  crumbs?: Crumb[]
  crumbLabel?: string
  children?: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('pattern-zellige relative overflow-hidden bg-secondary text-white [--pattern-opacity:0.07]', className)}>
      <div
        className="pointer-events-none absolute -end-24 -top-24 size-[28rem] rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative grid gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
        <div className="max-w-3xl">
          {crumbs && crumbLabel && <Breadcrumbs items={crumbs} label={crumbLabel} dark />}
          {eyebrow && (
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <StarOrnament className="size-3.5" /> {eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-4xl leading-[1.12] text-white sm:text-5xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{intro}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  )
}
