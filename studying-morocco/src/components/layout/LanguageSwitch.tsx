'use client'

import { Globe } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Locale } from '@/lib/options'
import { swapLocale } from '@/lib/routes'
import { cn } from '@/lib/utils'

export function LanguageSwitch({
  locale,
  label,
  ariaLabel,
  className,
}: {
  locale: Locale
  label: string
  ariaLabel: string
  className?: string
}) {
  const pathname = usePathname() || `/${locale}`
  const target: Locale = locale === 'ar' ? 'en' : 'ar'
  return (
    <Link
      href={swapLocale(pathname, target)}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      prefetch={false}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`
      }}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-control px-3 text-small font-semibold text-primary transition-colors hover:bg-canvas',
        className,
      )}
    >
      <Globe className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
