import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'
import type { SiteSetting } from '@/payload-types'

export function AnnouncementBar({ announcement, locale }: { announcement: SiteSetting['announcement']; locale: Locale }) {
  if (!announcement?.enabled || !announcement.text) return null
  const content = (
    <span className="inline-flex items-center gap-2">
      {announcement.text}
      {announcement.href && <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />}
    </span>
  )
  return (
    <div className="on-dark bg-primary py-2 text-small font-medium text-white">
      <div className="container-page">
        {announcement.href ? (
          <Link href={localizeHref(announcement.href, locale)} className="underline-offset-4 hover:underline">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  )
}
