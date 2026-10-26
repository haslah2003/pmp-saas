import type { Metadata } from 'next'

import { ogLocale } from '@/i18n'
import type { Media } from '@/payload-types'

import type { Locale } from './options'
import { absoluteURL } from './utils'

type Meta = { title?: string | null; description?: string | null; image?: number | Media | null } | null | undefined

/**
 * Builds page metadata with canonical + hreflang alternates.
 * `path` is the locale-less path, e.g. "/universities/um5".
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  meta,
  image,
  type = 'website',
  noIndex = false,
  absoluteTitle = false,
}: {
  locale: Locale
  path: string
  title?: string | null
  description?: string | null
  meta?: Meta
  image?: Media | number | null
  type?: 'website' | 'article'
  noIndex?: boolean
  absoluteTitle?: boolean
}): Metadata {
  const clean = path === '/' ? '' : path
  const url = absoluteURL(`/${locale}${clean}`)
  const finalTitle = meta?.title || title || undefined
  const finalDescription = meta?.description || description || undefined
  const img = (typeof meta?.image === 'object' && meta?.image) || (typeof image === 'object' && image) || null
  const imageURL = img?.url ? (img.url.startsWith('http') ? img.url : absoluteURL(img.url)) : undefined

  return {
    title: finalTitle ? (absoluteTitle || meta?.title ? { absolute: finalTitle } : finalTitle) : undefined,
    description: finalDescription,
    alternates: {
      canonical: url,
      languages: {
        ar: absoluteURL(`/ar${clean}`),
        en: absoluteURL(`/en${clean}`),
        'x-default': absoluteURL(`/ar${clean}`),
      },
    },
    openGraph: {
      type,
      url,
      title: finalTitle,
      description: finalDescription,
      locale: ogLocale(locale),
      alternateLocale: ogLocale(locale === 'ar' ? 'en' : 'ar'),
      ...(imageURL ? { images: [{ url: imageURL, width: img?.width ?? 1200, height: img?.height ?? 630, alt: img?.alt ?? undefined }] } : {}),
    },
    twitter: { card: 'summary_large_image', title: finalTitle, description: finalDescription, ...(imageURL ? { images: [imageURL] } : {}) },
    robots: noIndex ? { index: false, follow: true } : undefined,
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; "<" is escaped so CMS content cannot close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export const breadcrumbLD = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteURL(item.path),
  })),
})
