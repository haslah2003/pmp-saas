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
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/75">
      <div className="container-page flex h-[4.5rem] items-center gap-4">
        <Logo locale={locale} siteName={siteName} byline={t.meta.by} logo={logo} />

        <nav aria-label={t.nav.menu} className="ms-4 hidden flex-1 items-center gap-0.5 lg:flex xl:ms-6">
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.95rem] font-medium whitespace-nowrap text-ink/85 transition hover:bg-ink/5 hover:text-ink group-focus-within:bg-ink/5"
                >
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
                </button>
                <div className="invisible absolute start-0 top-full w-[34rem] translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-[1fr_11rem] overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
                    <ul className="p-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={href(child.href)}
                            className="block rounded-2xl px-4 py-3 transition hover:bg-primary-50 focus-visible:bg-primary-50"
                          >
                            <span className="block font-semibold text-ink">{child.label}</span>
                            {child.description && <span className="mt-0.5 block text-sm text-muted">{child.description}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="pattern-zellige flex flex-col justify-end gap-3 bg-secondary p-5 text-accent [--pattern-opacity:0.12]">
                      <p className="text-sm leading-relaxed text-white/85">{t.consultation.intro.split('—')[0]}</p>
                      <LinkButton href={href('/consultation')} variant="gold" size="sm">
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
                className="rounded-full px-3 py-2 text-[0.95rem] font-medium whitespace-nowrap text-ink/85 transition hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 lg:ms-0">
          <Link
            href={href('/search')}
            aria-label={t.nav.search}
            className="hidden size-10 items-center justify-center rounded-full text-ink/80 transition hover:bg-ink/5 sm:inline-flex"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <LanguageSwitch locale={locale} label={t.nav.switchLanguage} ariaLabel={t.nav.switchLanguageLabel} className="hidden sm:inline-flex" />
          <LinkButton href={href('/consultation')} variant="outline" size="sm" className="hidden xl:inline-flex">
            {t.nav.consultation}
          </LinkButton>
          <LinkButton href={href('/apply')} size="sm" className="hidden sm:inline-flex">
            {t.nav.apply}
          </LinkButton>
          <MobileNav locale={locale} t={t} nav={nav} />
        </div>
      </div>
    </header>
  )
}
