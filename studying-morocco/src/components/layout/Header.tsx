import { ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

import { LinkButton } from '@/components/ui/Button'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'
import type { Media } from '@/payload-types'

import { LanguageSwitch } from './LanguageSwitch'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import type { NavItem } from './nav'

export function Header({
  locale,
  t,
  nav,
  siteName,
  logo,
}: {
  locale: Locale
  t: Dictionary
  nav: NavItem[]
  siteName: string
  logo?: Media | null
}) {
  const href = (h: string) => localizeHref(h, locale)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-page flex h-16 items-center gap-4 lg:h-20">
        <Logo locale={locale} siteName={siteName} logo={logo} nameClassName="max-md:hidden lg:max-xl:hidden" />

        <nav aria-label={t.nav.menu} className="ms-2 hidden flex-1 items-center lg:flex xl:ms-6 xl:gap-1">
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="inline-flex min-h-11 items-center gap-1 rounded-control px-2 text-small font-medium whitespace-nowrap xl:px-3 text-ink transition-colors hover:text-primary group-focus-within:text-primary"
                >
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
                </button>
                <div className="invisible absolute start-0 top-full w-[34rem] translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-[1fr_11rem] overflow-hidden rounded-card border border-line bg-surface shadow-card">
                    <ul className="p-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={href(child.href)}
                            className="block rounded-control px-4 py-3 transition-colors hover:bg-canvas focus-visible:bg-canvas"
                          >
                            <span className="block font-semibold text-primary">{child.label}</span>
                            {child.description && <span className="mt-0.5 block text-small text-muted">{child.description}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="on-dark flex flex-col justify-end gap-4 bg-primary p-5 text-white">
                      <p className="text-small text-line">{t.consultation.intro.split('—')[0]}</p>
                      <LinkButton href={href('/consultation')}>
                        {t.nav.consultation}
                      </LinkButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={href(item.href)}
                className="inline-flex min-h-11 items-center rounded-control px-2 text-small font-medium whitespace-nowrap xl:px-3 text-ink transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ms-auto flex items-center gap-1 lg:ms-0 xl:gap-2">
          <Link
            href={href('/search')}
            aria-label={t.nav.search}
            className="hidden size-11 items-center justify-center rounded-control text-primary transition-colors hover:bg-canvas md:inline-flex"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <LanguageSwitch locale={locale} label={t.nav.switchLanguage} ariaLabel={t.nav.switchLanguageLabel} className="hidden md:inline-flex" />
          <LinkButton href={href('/apply')} inline className="hidden md:inline-flex">
            {t.nav.apply}
          </LinkButton>
          <MobileNav locale={locale} t={t} nav={nav} />
        </div>
      </div>
    </header>
  )
}
