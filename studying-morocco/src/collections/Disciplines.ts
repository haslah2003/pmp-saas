import type { CollectionConfig } from 'payload'

import { anyone, isContentManager } from '@/access'
import { iconField, orderField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'

export const Disciplines: CollectionConfig = {
  slug: 'disciplines',
  labels: { singular: { en: 'Field of study', ar: 'مجال دراسي' }, plural: { en: 'Fields of study', ar: 'المجالات الدراسية' } },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'icon', 'order'], group: { en: 'Study catalogue', ar: 'دليل الدراسة' } },
  defaultSort: 'order',
  access: { read: anyone, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { en: 'Name', ar: 'الاسم' } },
    { name: 'description', type: 'textarea', localized: true, label: { en: 'Short description', ar: 'وصف قصير' } },
    slug('name'),
    { ...iconField(), admin: { position: 'sidebar' } },
    orderField,
  ],
}
