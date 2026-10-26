import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { documentPath } from '@/lib/routes'
import { absoluteURL } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const staticPaths = ['', '/universities', '/programs', '/cities', '/services', '/scholarships', '/cost-calculator', '/blog', '/faq', '/apply', '/consultation', '/contact']

/** One <url> per language, each listing every alternate (Google's recommended hreflang setup). */
const entry = (path: string, lastModified?: string, priority = 0.6): MetadataRoute.Sitemap =>
  (['ar', 'en'] as const).map((locale) => ({
    url: absoluteURL(`/${locale}${path}`),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    priority,
    alternates: { languages: { ar: absoluteURL(`/ar${path}`), en: absoluteURL(`/en${path}`), 'x-default': absoluteURL(`/ar${path}`) } },
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = staticPaths.flatMap((p) => entry(p, undefined, p === '' ? 1 : 0.8))
  try {
    const payload = await getPayloadClient()
    const published = { published: { equals: true } }
    const live = { _status: { equals: 'published' } }
    const [universities, programs, cities, services, posts, pages] = await Promise.all([
      payload.find({ collection: 'universities', where: published, limit: 1000, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'programs', where: published, limit: 5000, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'cities', where: published, limit: 200, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'services', where: published, limit: 200, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'posts', where: live, limit: 2000, depth: 0, select: { slug: true, updatedAt: true } }),
      payload.find({ collection: 'pages', where: live, limit: 500, depth: 0, select: { slug: true, updatedAt: true } }),
    ])
    const add = (collection: string, docs: { slug?: string | null; updatedAt: string }[], priority: number) => {
      for (const d of docs) {
        if (!d.slug || (collection === 'pages' && d.slug === 'home')) continue
        items.push(...entry(documentPath(collection, d.slug, 'ar').replace(/^\/ar/, ''), d.updatedAt, priority))
      }
    }
    add('universities', universities.docs, 0.8)
    add('programs', programs.docs, 0.7)
    add('cities', cities.docs, 0.7)
    add('services', services.docs, 0.7)
    add('posts', posts.docs, 0.6)
    add('pages', pages.docs, 0.5)
  } catch (err) {
    console.error('sitemap: CMS unavailable', err)
  }
  return items
}
