import Image from 'next/image'
import Link from 'next/link'

import { BrandMark } from '@/components/brand/BrandMark'
import type { Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

export function Logo({
  locale,
  siteName,
  byline,
  logo,
  dark = false,
  className,
}: {
  locale: Locale
  siteName: string
  byline: string
  logo?: Media | null
  dark?: boolean
  className?: string
}) {
  return (
    <Link href={`/${locale}`} className={cn('group inline-flex items-center gap-2.5', className)} aria-label={siteName}>
      {logo?.url ? (
        <Image src={logo.url} alt={logo.alt || siteName} width={logo.width ?? 160} height={logo.height ?? 48} className="h-11 w-auto" priority />
      ) : (
        <>
          <BrandMark size={44} className="shrink-0 transition-transform duration-500 group-hover:rotate-45" />
          <span className="flex flex-col leading-none">
            <span className={cn('font-display text-[1.08rem] font-bold', dark ? 'text-white' : 'text-ink')}>{siteName}</span>
            <span className={cn('mt-1 text-[0.72rem] font-medium', dark ? 'text-white/60' : 'text-muted')}>{byline}</span>
          </span>
        </>
      )}
    </Link>
  )
}
