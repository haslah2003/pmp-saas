import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeading } from '@/components/ui/Section'
import { localizeHref } from '@/lib/routes'

import type { BlockProps } from './types'

export function AudiencesBlock({ block, locale, t }: BlockProps<'audiences'>) {
  return (
    <Section tone="canvas">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-4">
        {block.items?.map((item, i) => {
          const body = (
            <>
              <span className="inline-flex size-12 items-center justify-center rounded-control bg-primary text-white">
                <Icon name={item.icon} className="size-6" />
              </span>
              <h3 className="mt-5 text-h4">{item.title}</h3>
              {item.text && <p className="mt-2 text-ink">{item.text}</p>}
              {item.href && (
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-small font-semibold text-primary group-hover:underline">
                  {t.common.learnMore}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </span>
              )}
            </>
          )
          const cls = 'group flex h-full flex-col rounded-card border border-line bg-surface p-card transition-colors hover:border-primary'
          return item.href ? (
            <Link key={item.id ?? i} href={localizeHref(item.href, locale)} className={cls}>
              {body}
            </Link>
          ) : (
            <div key={item.id ?? i} className={cls}>
              {body}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
