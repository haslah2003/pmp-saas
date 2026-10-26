import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeading } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

import type { BlockProps } from './types'

const bentoSpan = (i: number, n: number) => (n === 6 ? (i === 0 || i === 5 ? 'md:col-span-2' : '') : '')

export function FeatureGridBlock({ block }: BlockProps<'featureGrid'>) {
  const items = block.items ?? []
  const bento = block.layout !== 'grid' && items.length === 6
  return (
    <Section>
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className={cn('grid gap-4 sm:gap-5', bento ? 'md:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3')}>
        {items.map((item, i) => {
          const featured = bento && i === 0
          const warm = bento && i === 5
          return (
            <div
              key={item.id ?? i}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-7 transition duration-300',
                bento && bentoSpan(i, items.length),
                featured
                  ? 'pattern-zellige bg-secondary text-white [--pattern-opacity:0.08]'
                  : warm
                    ? 'bg-accent-50 ring-1 ring-accent-100 ring-inset'
                    : 'border border-line bg-surface shadow-soft hover:shadow-lift',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-12 items-center justify-center rounded-2xl',
                  featured ? 'bg-accent text-secondary-900' : warm ? 'bg-accent text-secondary-900' : 'bg-primary-50 text-primary',
                )}
              >
                <Icon name={item.icon} className="size-6" />
              </span>
              {item.stat && (
                <p className={cn('mt-6 font-sans text-4xl font-bold tracking-tight', featured ? 'text-accent' : 'text-primary-800')}>{item.stat}</p>
              )}
              <h3 className={cn('text-lg font-bold', item.stat ? 'mt-2' : 'mt-5', featured && 'text-xl text-white sm:text-2xl')}>{item.title}</h3>
              {item.text && <p className={cn('mt-2 leading-relaxed', featured ? 'max-w-lg text-white/75' : 'text-[0.95rem] text-ink/75')}>{item.text}</p>}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
