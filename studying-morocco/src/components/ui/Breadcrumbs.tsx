import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { breadcrumbLD, JsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'

export type Crumb = { name: string; href: string }

export function Breadcrumbs({ items, label, dark = false }: { items: Crumb[]; label: string; dark?: boolean }) {
  return (
    <>
      <nav aria-label={label} className="text-sm">
        <ol className={cn('flex flex-wrap items-center gap-1.5', dark ? 'text-white/65' : 'text-muted')}>
          {items.map((item, i) => (
            <li key={item.href} className="inline-flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 opacity-60 rtl:-scale-x-100" aria-hidden="true" />}
              {i === items.length - 1 ? (
                <span aria-current="page" className={dark ? 'text-white' : 'text-ink'}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className={cn('transition', dark ? 'hover:text-white' : 'hover:text-ink')}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLD(items.map((i) => ({ name: i.name, path: i.href })))} />
    </>
  )
}
