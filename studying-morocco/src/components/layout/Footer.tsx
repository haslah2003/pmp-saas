import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import { StarDivider } from '@/components/art/Ornaments'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/lib/options'
import { localizeHref } from '@/lib/routes'
import { whatsappLink } from '@/lib/utils'
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
    <footer className="pattern-zellige bg-secondary-900 text-white/80 [--pattern-opacity:0.05]">
      <div className="container-page pt-16 pb-28 md:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm space-y-5">
            <Logo locale={locale} siteName={settings.siteName || t.meta.siteName} byline={t.meta.by} logo={logoOnDark} dark />
            <p className="text-[0.95rem] leading-relaxed text-white/70">{navigation?.footerNote || t.footer.about}</p>
            <ul className="space-y-2.5 text-sm">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-white" data-track="whatsapp_footer">
                    <SocialIcon name="whatsapp" className="size-4 text-[#4ade80]" />
                    <span dir="ltr">+{settings.whatsapp}</span>
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2.5 hover:text-white">
                    <Phone className="size-4 text-accent" aria-hidden="true" />
                    <span dir="ltr">{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 hover:text-white">
                    <Mail className="size-4 text-accent" aria-hidden="true" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
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
                    className="inline-flex size-10 items-center justify-center rounded-full bg-white/8 text-white/80 ring-1 ring-white/10 transition hover:bg-accent hover:text-secondary-900"
                  >
                    <SocialIcon name={s.platform} className="size-[1.1rem]" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="mb-4 font-sans text-sm font-bold tracking-wide text-accent uppercase rtl:normal-case">{col.title}</h2>
                <ul className="space-y-2.5 text-[0.95rem]">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={localizeHref(link.href, locale)} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <StarDivider className="my-10" />
        <div className="flex flex-col gap-3 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.siteName || t.meta.siteName} — {settings.organization || 'KNO Academy'}. {t.footer.rights}
          </p>
          <p className="max-w-2xl md:text-end">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
