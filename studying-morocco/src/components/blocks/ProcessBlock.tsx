import { Clock } from 'lucide-react'

import { Section, SectionHeading } from '@/components/ui/Section'
import { formatNumber } from '@/lib/format'

import type { BlockProps } from './types'

export function ProcessBlock({ block, locale }: BlockProps<'processSteps'>) {
  return (
    <Section tone="dark">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} dark />
      <ol className="grid gap-x-grid gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {block.steps?.map((step, i) => (
          <li key={step.id ?? i} className="flex gap-4">
            <span
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-cta text-body font-semibold text-primary"
              aria-hidden="true"
            >
              {formatNumber(i + 1, locale)}
            </span>
            <div>
              <h3 className="text-h4 text-white">{step.title}</h3>
              {step.text && <p className="mt-2 text-line">{step.text}</p>}
              {step.duration && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-small font-medium text-white">
                  <Clock className="size-4 text-cta" aria-hidden="true" /> {step.duration}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
