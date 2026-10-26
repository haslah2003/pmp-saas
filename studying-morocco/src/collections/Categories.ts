import type { CollectionConfig } from 'payload'

import { anyone, isContentManager } from '@/access'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: { en: 'Category', ar: 'تصنيف' }, plural: { en: 'Blog categories', ar: 'تصنيفات المدونة' } },
  admin: { useAsTitle: 'name', group: { en: 'Content', ar: 'المحتوى' } },
  access: { read: anyone, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { en: 'Name', ar: 'الاسم' } },
    slug('name'),
  ],
}
