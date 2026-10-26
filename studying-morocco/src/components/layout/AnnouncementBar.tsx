import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { StarOrnament } from '@/components/art/Ornaments'
import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'
import type { SiteSetting } from '@/payload-types'

export function AnnouncementBar({ announcement, locale }: { announcement: SiteSetting['announcement']; locale: Locale }) {
  if (!announcement?.enabled || !announcement.text) return null
  const content = (
    <span className="inline-flex items-center gap-2">
      <StarOrnament className="size-3 text-accent" />
      {announcement.text}
      {announcement.href && <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />}
    </span>
  )
  return (
    <div className="bg-secondary px-4 py-2 text-center text-sm font-medium text-white">
      {announcement.href ? (
        <Link href={localizeHref(announcement.href, locale)} className="hover:text-accent">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}
