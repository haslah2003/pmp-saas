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
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-ink/5',
        className,
      )}
    >
      <Globe className="size-4" aria-hidden="true" />
      <span className={target === 'ar' ? 'font-[family-name:var(--font-plex-arabic)]' : 'font-[family-name:var(--font-jakarta)]'}>
        {label}
      </span>
    </Link>
  )
}
