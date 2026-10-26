import type { Metadata } from 'next'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHeader } from '@/components/ui/PageHeader'
import { redirectOrNotFound, resolveLocale, type SlugParams } from '@/lib/page'
import { getPageBySlug } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { locale } = await resolveLocale(params)
  const { slug } = await params
  const page = await getPageBySlug(slug, locale)
  if (!page) return {}
  return buildMetadata({ locale, path: `/${slug}`, title: page.title, meta: page.meta })
}

export default async function CMSPage({ params }: { params: SlugParams }) {
  const { locale, t } = await resolveLocale(params)
  const { slug } = await params
  if (slug === 'home') return redirectOrNotFound(`/${locale}`, locale)
  const page = await getPageBySlug(slug, locale)
  if (!page) return redirectOrNotFound(`/${locale}/${slug}`, locale)
  const startsWithHero = page.layout?.[0]?.blockType === 'hero'
  return (
    <>
      {!startsWithHero && (
        <PageHeader
          title={page.title}
          crumbs={[
            { name: t.nav.home, href: `/${locale}` },
            { name: page.title, href: `/${locale}/${slug}` },
          ]}
          crumbLabel={t.common.breadcrumb}
        />
      )}
      <RenderBlocks blocks={page.layout} locale={locale} t={t} />
    </>
  )
}
