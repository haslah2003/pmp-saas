import type { CollectionConfig } from 'payload'

import { isContentManager, publishedStatusOrStaff } from '@/access'
import { pageBlocks } from '@/blocks'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: { en: 'Page', ar: 'صفحة' }, plural: { en: 'Pages', ar: 'الصفحات' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: { en: 'Content', ar: 'المحتوى' },
    description: {
      en: 'Build pages from blocks. The page with slug “home” is the home page.',
      ar: 'ابنِ الصفحات من الكتل. الصفحة ذات المعرف «home» هي الصفحة الرئيسية.',
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 25 },
  access: { read: publishedStatusOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', ar: 'العنوان' } },
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
      label: { en: 'Page sections', ar: 'أقسام الصفحة' },
      admin: { initCollapsed: true },
    },
    slug('title'),
    {
      name: 'showInFooter',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'List in footer', ar: 'عرض في التذييل' },
      admin: { position: 'sidebar' },
    },
  ],
}
