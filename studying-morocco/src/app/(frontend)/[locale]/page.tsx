import type { Metadata } from 'next'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { fallbackHome } from '@/lib/fallback-home'
import { resolveLocale, type LocaleParams } from '@/lib/page'
import { getPageBySlug, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  const [page, settings] = await Promise.all([getPageBySlug('home', locale), getSettings(locale)])
  return buildMetadata({
    locale,
    path: '/',
    title: `${settings.siteName || t.meta.siteName} — ${settings.tagline || t.meta.tagline}`,
    absoluteTitle: true,
    description: settings.defaultDescription || t.meta.description,
    meta: page?.meta,
  })
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params)
  const page = await getPageBySlug('home', locale)
  return <RenderBlocks blocks={page?.layout?.length ? page.layout : fallbackHome(t)} locale={locale} t={t} />
}
