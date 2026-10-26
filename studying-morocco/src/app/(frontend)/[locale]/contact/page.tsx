import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { InquiryForm } from '@/components/forms/InquiryForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { whatsappDisplay, whatsappLink } from '@/lib/utils'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return buildMetadata({ locale, path: '/contact', title: t.contact.title, description: t.contact.intro })
}

export default async function ContactPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const settings = await getSettings(locale)
  const wa = whatsappLink(settings.whatsapp, t.whatsapp.message)
  const cards = [
    wa && { icon: <SocialIcon name="whatsapp" className="size-6" />, label: t.common.whatsappUs, value: whatsappDisplay(settings.whatsapp!, settings.phone), href: wa, ltr: true, accent: true },
    settings.phone && { icon: <Phone className="size-6" aria-hidden="true" />, label: t.common.callUs, value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}`, ltr: true },
    settings.email && { icon: <Mail className="size-6" aria-hidden="true" />, label: t.common.emailUs, value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: <MapPin className="size-6" aria-hidden="true" />, label: t.contact.office, value: settings.address, href: settings.mapUrl || undefined },
    settings.officeHours && { icon: <Clock className="size-6" aria-hidden="true" />, label: t.contact.hours, value: settings.officeHours },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string; ltr?: boolean; accent?: boolean }[]

  return (
    <>
      <PageHeader
        title={t.contact.title}
        intro={t.contact.intro}
        crumbs={[
          { name: t.nav.home, href: `/${locale}` },
          { name: t.nav.contact, href: `/${locale}/contact` },
        ]}
        crumbLabel={t.common.breadcrumb}
      />
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] py-section">
        <div className="space-y-4">
          {cards.map((c) => {
            const body = (
              <>
                <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-control ${c.accent ? 'bg-primary text-white' : 'bg-canvas text-primary'}`}>{c.icon}</span>
                <span className="min-w-0">
                  <span className="block text-small text-muted">{c.label}</span>
                  <span className="block font-semibold break-words whitespace-pre-line text-primary" dir={c.ltr ? 'ltr' : undefined}>
                    {c.value}
                  </span>
                </span>
              </>
            )
            const cls = 'flex items-center gap-4 rounded-card border border-line bg-surface p-card'
            return c.href ? (
              <a key={c.label} href={c.href} className={`${cls} transition-colors hover:border-primary`} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {body}
              </a>
            ) : (
              <div key={c.label} className={cls}>
                {body}
              </div>
            )
          })}
          {!!settings.socials?.length && (
            <div className="rounded-card border border-line bg-surface p-card">
              <p className="text-small text-muted">{t.contact.followUs}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {settings.socials.map((s) => (
                  <a key={s.id ?? s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} className="inline-flex size-11 items-center justify-center rounded-full bg-canvas text-primary hover:bg-primary hover:text-white">
                    <SocialIcon name={s.platform} className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <InquiryForm mode="contact" locale={locale} t={{ consultation: t.consultation, contact: t.contact, apply: t.apply, common: t.common, errors: t.errors }} />
      </div>
    </>
  )
}
