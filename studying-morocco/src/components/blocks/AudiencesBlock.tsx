import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeading } from '@/components/ui/Section'
import { localizeHref } from '@/lib/routes'

import type { BlockProps } from './types'

const tints = ['bg-primary', 'bg-clay', 'bg-secondary', 'bg-accent-700']

export function AudiencesBlock({ block, locale, t }: BlockProps<'audiences'>) {
  return (
    <Section tone="sand">
      <SectionHeading eyebrow={block.eyebrow} title={block.heading} intro={block.intro} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {block.items?.map((item, i) => {
          const body = (
            <>
              <div className={`arch-sm pattern-zellige relative flex h-28 items-end p-5 text-white/90 ${tints[i % tints.length]} [--pattern-opacity:0.15]`}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                  <Icon name={item.icon} className="size-6 text-white" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 pt-5">
                <h3 className="text-lg font-bold">{item.title}</h3>
                {item.text && <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{item.text}</p>}
                {item.href && (
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary">
                    {t.common.learnMore}
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden="true" />
                  </span>
                )}
              </div>
            </>
          )
          const cls = 'group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift'
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
