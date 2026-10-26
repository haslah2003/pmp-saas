import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Tone = 'surface' | 'canvas' | 'dark'

const tones: Record<Tone, string> = {
  surface: 'bg-surface',
  canvas: 'bg-canvas',
  dark: 'on-dark bg-primary text-white',
}

export function Section({
  children,
  tone = 'surface',
  className,
  id,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('py-section', tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

/** Small label above a heading, marked with a short amber rule. */
export function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 text-small font-semibold', dark ? 'text-white' : 'text-primary', className)}>
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 bg-cta" />
      {children}
    </p>
  )
}

/** Section title block. Always start-aligned (left in English, right in Arabic). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  action,
  className,
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  dark?: boolean
  action?: ReactNode
  className?: string
}) {
  if (!eyebrow && !title && !intro) return null
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:mb-10 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        {title && <h2 className={cn(dark && 'text-white')}>{title}</h2>}
        {intro && <p className={cn('text-body', dark ? 'text-line' : 'text-muted')}>{intro}</p>}
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
  tone?: 'neutral' | 'primary' | 'highlight' | 'dark'
  className?: string
}) {
  const tones = {
    neutral: 'bg-canvas text-ink ring-1 ring-inset ring-line',
    primary: 'bg-canvas text-primary ring-1 ring-inset ring-line',
    highlight: 'bg-cta text-primary',
    dark: 'text-white ring-1 ring-inset ring-white/40',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-small font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}
