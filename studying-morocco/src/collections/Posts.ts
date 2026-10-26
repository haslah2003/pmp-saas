import type { CollectionConfig } from 'payload'

import { isContentManager, publishedStatusOrStaff } from '@/access'
import { featuredField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'

/** Rough reading time from the Lexical JSON of the current locale. */
const estimateReadingTime = (content: unknown, locale?: string): number => {
  let words = 0
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: string; children?: unknown[]; root?: unknown }
    if (typeof n.text === 'string') words += n.text.trim().split(/\s+/).filter(Boolean).length
    if (n.root) walk(n.root)
    n.children?.forEach(walk)
  }
  walk(content)
  const wpm = locale === 'ar' ? 180 : 220
  return Math.max(1, Math.ceil(words / wpm))
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: { en: 'Article', ar: 'مقال' }, plural: { en: 'Guides & articles', ar: 'الأدلة والمقالات' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    listSearchableFields: ['title', 'slug'],
    group: { en: 'Content', ar: 'المحتوى' },
  },
  defaultSort: '-publishedAt',
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 25 },
  access: { read: publishedStatusOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: {
    ...revalidateHooks,
    beforeChange: [
      ({ data, req }) => {
        if (data.content) data.readingTime = estimateReadingTime(data.content, req.locale ?? undefined)
        if (data._status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', ar: 'العنوان' } },
    { name: 'excerpt', type: 'textarea', localized: true, label: { en: 'Excerpt', ar: 'مقتطف' } },
    { name: 'content', type: 'richText', localized: true, label: { en: 'Content', ar: 'المحتوى' } },
    slug('title'),
    { name: 'cover', type: 'upload', relationTo: 'media', label: { en: 'Cover image', ar: 'صورة الغلاف' }, admin: { position: 'sidebar' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: { en: 'Category', ar: 'التصنيف' }, admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', label: { en: 'Author', ar: 'الكاتب' }, admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', index: true, label: { en: 'Publish date', ar: 'تاريخ النشر' }, admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'readingTime',
      type: 'number',
      localized: true,
      label: { en: 'Reading time (min)', ar: 'مدة القراءة (دقيقة)' },
      admin: { position: 'sidebar', readOnly: true },
    },
    featuredField,
  ],
}
