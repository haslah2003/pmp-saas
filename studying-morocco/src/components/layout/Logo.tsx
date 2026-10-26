import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/lib/options'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

const KNO = { light: '/brand/kno-academy-logo.png', dark: '/brand/kno-academy-logo-on-dark.png', width: 1200, height: 398 }

/** KNO Academy logo with the platform name beside it. A logo uploaded in Site settings replaces the built-in file. */
export function Logo({
  locale,
  siteName,
  logo,
  dark = false,
  className,
  nameClassName,
}: {
  locale: Locale
  siteName: string
  logo?: Media | null
  dark?: boolean
  className?: string
  nameClassName?: string
}) {
  const src = logo?.url ?? (dark ? KNO.dark : KNO.light)
  const ratio = logo?.url && logo.width && logo.height ? logo.width / logo.height : KNO.width / KNO.height
  // Intrinsic size = largest displayed size (48px tall), so the optimiser serves a 1x/2x pair, not a 1200px file.
  return (
    <Link href={`/${locale}`} className={cn('inline-flex shrink-0 items-center gap-3 md:gap-4', className)}>
      <Image src={src} alt="KNO Academy" width={Math.round(48 * ratio)} height={48} className="h-10 w-auto md:h-12" priority={!dark} />
      <span className={cn('flex items-center gap-3 md:gap-4', nameClassName)}>
        <span aria-hidden="true" className={cn('h-8 w-px', dark ? 'bg-white/40' : 'bg-line')} />
        <span className={cn('text-body font-semibold whitespace-nowrap', dark ? 'text-white' : 'text-primary')}>{siteName}</span>
      </span>
    </Link>
  )
}
