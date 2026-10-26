'use client'

import { ChevronDown, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { buttonClass } from '@/components/ui/Button'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'

import { LanguageSwitch } from './LanguageSwitch'
import type { NavItem } from './nav'

export function MobileNav({ locale, t, nav }: { locale: Locale; t: Dictionary; nav: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const href = (h: string) => localizeHref(h, locale)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-control text-primary transition-colors hover:bg-canvas lg:hidden"
        aria-label={t.nav.menu}
        aria-expanded={open}
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-0 ms-auto h-dvh max-h-dvh w-[min(24rem,100vw)] max-w-none bg-surface p-0 text-ink backdrop:bg-primary/60"
        aria-label={t.nav.menu}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <LanguageSwitch locale={locale} label={t.nav.switchLanguage} ariaLabel={t.nav.switchLanguageLabel} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-control text-primary hover:bg-canvas"
              aria-label={t.nav.close}
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={t.nav.menu}>
            <ul className="space-y-1">
              {nav.map((item) =>
                item.children?.length ? (
                  <li key={item.label}>
                    <details className="group" open>
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-control px-4 text-body font-semibold text-primary hover:bg-canvas">
                        {item.label}
                        <ChevronDown className="size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <ul className="ms-4 mt-1 space-y-0.5 border-s-2 border-line ps-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={href(child.href)} className="flex min-h-11 items-center rounded-control px-3 text-body text-ink hover:bg-canvas">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={href(item.href)} className="flex min-h-12 items-center rounded-control px-4 text-body font-semibold text-primary hover:bg-canvas">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link href={href('/track')} className="flex min-h-12 items-center rounded-control px-4 text-body font-semibold text-primary hover:bg-canvas">
                  {t.nav.track}
                </Link>
              </li>
              <li>
                <Link href={href('/search')} className="flex min-h-12 items-center gap-2 rounded-control px-4 text-body font-semibold text-primary hover:bg-canvas">
                  <Search className="size-5" aria-hidden="true" /> {t.nav.search}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="grid gap-2 border-t border-line p-5">
            <Link href={href('/apply')} className={buttonClass('primary', 'lg', 'w-full')}>
              {t.nav.apply}
            </Link>
            <Link href={href('/consultation')} className={buttonClass('secondary', 'lg', 'w-full')}>
              {t.nav.consultation}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  )
}
