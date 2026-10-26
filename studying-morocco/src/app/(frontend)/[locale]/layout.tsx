import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { ConsentBanner } from '@/components/layout/ConsentBanner'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { navFromCMS } from '@/components/layout/nav'
import { Tracker } from '@/components/layout/Tracker'
import { dirOf, getDictionary } from '@/i18n'
import { isLocale, locales, type Locale } from '@/lib/options'
import { getNavigation, getSettings } from '@/lib/queries'
import { JsonLd } from '@/lib/seo'
import { absoluteURL, siteURL, whatsappLink } from '@/lib/utils'

import { fontVariables } from '../fonts'
import '../globals.css'

export const revalidate = 600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#322057',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw
  const t = getDictionary(locale)
  const settings = await getSettings(locale)
  const siteName = settings.siteName || t.meta.siteName
  const og = typeof settings.ogImage === 'object' && settings.ogImage?.url ? settings.ogImage.url : '/og-default.png'
  return {
    metadataBase: new URL(siteURL()),
    title: { default: `${siteName} — ${settings.tagline || t.meta.tagline}`, template: `%s | ${siteName}` },
    description: settings.defaultDescription || t.meta.description,
    applicationName: siteName,
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
    openGraph: { siteName, images: [{ url: og, width: 1200, height: 630 }] },
    verification: {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification ? { 'msvalidate.01': settings.bingSiteVerification } : undefined,
    },
    formatDetection: { telephone: false },
  }
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const t = getDictionary(locale)
  const [settings, navigation] = await Promise.all([getSettings(locale), getNavigation(locale)])
  const siteName = settings.siteName || t.meta.siteName
  const logo = typeof settings.logo === 'object' ? settings.logo : null
  const wa = whatsappLink(settings.whatsapp, t.whatsapp.message)

  const organizationLD = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'ProfessionalService'],
    '@id': `${siteURL()}/#organization`,
    name: siteName,
    alternateName: locale === 'ar' ? 'Studying in Morocco' : 'الدراسة في المغرب',
    url: absoluteURL(`/${locale}`),
    logo: absoluteURL('/brand/kno-academy-logo.png'),
    description: settings.defaultDescription || t.meta.description,
    parentOrganization: { '@type': 'Organization', name: settings.organization || 'KNO Academy' },
    areaServed: ['OM', 'AE', 'QA', 'SA', 'KW', 'BH', 'JO', 'LB', 'SY', 'IQ', 'GB', 'EU', 'Africa'],
    knowsLanguage: ['ar', 'en', 'fr'],
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.socials?.length ? { sameAs: settings.socials.map((s) => s.url) } : {}),
  }
  const websiteLD = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteURL()}/#website`,
    name: siteName,
    url: absoluteURL(`/${locale}`),
    inLanguage: locale,
    publisher: { '@id': `${siteURL()}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absoluteURL(`/${locale}/search?q={search_term_string}`) },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <head>
        {settings.adobeFontsKitId && (
          <>
            <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
            <link rel="stylesheet" href={`https://use.typekit.net/${settings.adobeFontsKitId}.css`} />
          </>
        )}
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-control bg-cta px-4 py-2 font-semibold text-primary focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <AnnouncementBar announcement={settings.announcement} locale={locale} />
        <Header locale={locale} t={t} nav={navFromCMS(navigation, t)} siteName={siteName} logo={logo} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t} settings={settings} navigation={navigation} />
        <FloatingActions
          whatsappHref={wa}
          whatsappLabel={t.whatsapp.label}
          applyHref={`/${locale}/apply`}
          applyLabel={t.nav.apply}
          consultHref={`/${locale}/consultation`}
          consultLabel={t.nav.consultation}
        />
        <ConsentBanner
          ga4Id={settings.ga4Id}
          metaPixelId={settings.metaPixelId}
          text={t.consent.text}
          accept={t.consent.accept}
          reject={t.consent.reject}
          policy={t.consent.policy}
          policyHref={`/${locale}/privacy`}
        />
        <Tracker locale={locale} />
        <JsonLd data={[organizationLD, websiteLD]} />
      </body>
    </html>
  )
}
