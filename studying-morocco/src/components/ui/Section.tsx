import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { StarOrnament } from '../art/Ornaments'

type Tone = 'canvas' | 'surface' | 'sand' | 'dark'

const tones: Record<Tone, string> = {
  canvas: 'bg-canvas',
  surface: 'bg-surface',
  sand: 'bg-sand',
  dark: 'bg-secondary text-white pattern-zellige [--pattern-opacity:0.07]',
}

export function Section({
  children,
  tone = 'canvas',
  className,
  id,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  dark = false,
  action,
  className,
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  align?: 'center' | 'start'
  dark?: boolean
  action?: ReactNode
  className?: string
}) {
  if (!eyebrow && !title && !intro) return null
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 sm:mb-12',
        centered ? 'mx-auto max-w-3xl items-center text-center' : 'items-start sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', centered && 'items-center')}>
        {eyebrow && (
          <p
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase rtl:tracking-normal rtl:normal-case',
              dark ? 'text-accent' : 'text-primary',
            )}
          >
            <StarOrnament className="size-3.5" />
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className={cn('text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]', dark && 'text-white')}>{title}</h2>
        )}
        {intro && (
          <p className={cn('max-w-2xl text-base sm:text-lg', dark ? 'text-white/75' : 'text-muted')}>{intro}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'primary' | 'gold' | 'clay' | 'dark'
  className?: string
}) {
  const tones = {
    neutral: 'bg-ink/5 text-ink/80',
    primary: 'bg-primary-50 text-primary-800 ring-1 ring-inset ring-primary-100',
    gold: 'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100',
    clay: 'bg-clay-50 text-clay-700',
    dark: 'bg-white/10 text-white ring-1 ring-inset ring-white/20',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}
