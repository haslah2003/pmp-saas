import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Eyebrow } from './Section'

/** Purple band at the top of inner pages. */
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
    <section className={cn('on-dark bg-primary text-white', className)}>
      <div className="container-page grid gap-8 py-section lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          {crumbs && crumbLabel && <Breadcrumbs items={crumbs} label={crumbLabel} dark />}
          {eyebrow && (
            <Eyebrow dark className="mt-6">
              {eyebrow}
            </Eyebrow>
          )}
          <h1 className="mt-4 text-white">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-body text-line">{intro}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  )
}
