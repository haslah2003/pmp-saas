import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { SocialIcon } from '@/components/ui/SocialIcon'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'
import { whatsappDisplay, whatsappLink } from '@/lib/utils'
import type { Navigation, SiteSetting } from '@/payload-types'

import { Logo } from './Logo'

type Column = { title: string; links: { label: string; href: string }[] }

const defaultColumns = (t: Dictionary): Column[] => [
  {
    title: t.footer.explore,
    links: [
      { label: t.nav.universities, href: '/universities' },
      { label: t.nav.programs, href: '/programs' },
      { label: t.nav.cities, href: '/cities' },
      { label: t.nav.scholarships, href: '/scholarships' },
      { label: t.nav.calculator, href: '/cost-calculator' },
    ],
  },
  {
    title: t.footer.support,
    links: [
      { label: t.nav.services, href: '/services' },
      { label: t.nav.consultation, href: '/consultation' },
      { label: t.nav.apply, href: '/apply' },
      { label: t.nav.track, href: '/track' },
      { label: t.nav.faq, href: '/faq' },
    ],
  },
  {
    title: t.footer.company,
    links: [
      { label: t.nav.about, href: '/about' },
      { label: t.nav.guides, href: '/blog' },
      { label: t.nav.contact, href: '/contact' },
      { label: t.footer.privacy, href: '/privacy' },
      { label: t.footer.terms, href: '/terms' },
    ],
  },
]

export function Footer({
  locale,
  t,
  settings,
  navigation,
}: {
  locale: Locale
  t: Dictionary
  settings: SiteSetting
  navigation: Navigation | null
}) {
  const columns: Column[] = navigation?.footer?.length
    ? navigation.footer.map((c) => ({ title: c.title, links: (c.links ?? []).map((l) => ({ label: l.label, href: l.href })) }))
    : defaultColumns(t)
  const wa = whatsappLink(settings.whatsapp, t.whatsapp.message)
  const logoOnDark = typeof settings.logoOnDark === 'object' ? settings.logoOnDark : null
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark bg-primary text-line">
      <div className="container-page pt-section pb-28 md:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm space-y-5">
            <Logo locale={locale} siteName={settings.siteName || t.meta.siteName} logo={logoOnDark} dark />
            <p className="text-small text-line">{navigation?.footerNote || t.footer.about}</p>
            <ul className="space-y-3 text-small">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-white" data-track="whatsapp_footer">
                    <SocialIcon name="whatsapp" className="size-4 text-cta" />
                    <span dir="ltr">{whatsappDisplay(settings.whatsapp!, settings.phone)}</span>
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2.5 hover:text-white">
                    <Phone className="size-4 text-cta" aria-hidden="true" />
                    <span dir="ltr">{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 hover:text-white">
                    <Mail className="size-4 text-cta" aria-hidden="true" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-1 size-4 shrink-0 text-cta" aria-hidden="true" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
            </ul>
            {!!settings.socials?.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {settings.socials.map((s) => (
                  <a
                    key={s.id ?? s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="inline-flex size-11 items-center justify-center rounded-full text-white ring-1 ring-white/40 transition-colors hover:bg-cta hover:text-primary hover:ring-cta"
                  >
                    <SocialIcon name={s.platform} className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="mb-4 text-body font-semibold text-white">{col.title}</h2>
                <ul className="space-y-3 text-small">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={localizeHref(link.href, locale)} className="transition-colors hover:text-white hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/20 pt-8 text-small text-line lg:flex-row lg:justify-between lg:gap-12">
          <p className="shrink-0">
            © {year} {settings.siteName || t.meta.siteName} — {settings.organization || 'KNO Academy'}. {t.footer.rights}
          </p>
          <p className="max-w-2xl">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
