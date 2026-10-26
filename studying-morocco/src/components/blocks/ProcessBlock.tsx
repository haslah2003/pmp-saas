import { Clock } from 'lucide-react'

import { Section, SectionHeading } from '@/components/ui/Section'
import { formatNumber } from '@/lib/format'

import type { BlockProps } from './types'

export function ProcessBlock({ block, locale }: BlockProps<'processSteps'>) {
  return (
    <Section tone="dark">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} dark />
      <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {block.steps?.map((step, i) => (
          <li key={step.id ?? i} className="relative ps-16">
            <span className="absolute start-0 top-0 inline-flex size-12 items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 48 48" className="absolute inset-0 text-accent">
                <rect x="9" y="9" width="30" height="30" rx="3" fill="currentColor" />
                <rect x="9" y="9" width="30" height="30" rx="3" fill="currentColor" transform="rotate(45 24 24)" />
              </svg>
              <span className="relative font-sans text-base font-bold text-secondary-900">{formatNumber(i + 1, locale)}</span>
            </span>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
            {step.text && <p className="mt-2 leading-relaxed text-white/70">{step.text}</p>}
            {step.duration && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-accent ring-1 ring-white/10">
                <Clock className="size-3.5" aria-hidden="true" /> {step.duration}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}
