import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeading } from '@/components/ui/Section'

import type { BlockProps } from './types'

export function FeatureGridBlock({ block }: BlockProps<'featureGrid'>) {
  const items = block.items ?? []
  return (
    <Section>
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="flex flex-col rounded-card border border-line bg-surface p-card">
            <span className="inline-flex size-12 items-center justify-center rounded-control bg-canvas text-primary">
              <Icon name={item.icon} className="size-6" />
            </span>
            {item.stat && <p className="mt-5 text-h2 font-semibold text-primary">{item.stat}</p>}
            <h3 className={item.stat ? 'mt-1 text-h4' : 'mt-5 text-h4'}>{item.title}</h3>
            {item.text && <p className="mt-2 text-ink">{item.text}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}
