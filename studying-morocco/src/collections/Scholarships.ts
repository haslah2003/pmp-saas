import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, orderField, publishedField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { studyLevels, toPayloadOptions } from '@/lib/options'

export const Scholarships: CollectionConfig = {
  slug: 'scholarships',
  labels: { singular: { en: 'Scholarship', ar: 'منحة' }, plural: { en: 'Scholarships', ar: 'المنح' } },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'provider', 'published', 'order'], group: { en: 'Study catalogue', ar: 'دليل الدراسة' } },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { en: 'Scholarship name', ar: 'اسم المنحة' } },
    { name: 'provider', type: 'text', localized: true, label: { en: 'Provider', ar: 'الجهة المانحة' } },
    { name: 'coverage', type: 'textarea', localized: true, label: { en: 'What it covers', ar: 'ما تغطيه' } },
    { name: 'eligibility', type: 'textarea', localized: true, label: { en: 'Eligibility', ar: 'شروط الأهلية' } },
    { name: 'howToApply', type: 'textarea', localized: true, label: { en: 'How to apply', ar: 'طريقة التقديم' } },
    {
      type: 'row',
      fields: [
        { name: 'amount', type: 'text', localized: true, label: { en: 'Value', ar: 'القيمة' }, admin: { width: '50%' } },
        { name: 'deadline', type: 'text', localized: true, label: { en: 'Deadline', ar: 'آخر أجل' }, admin: { width: '50%' } },
      ],
    },
    { name: 'link', type: 'text', label: { en: 'Official link', ar: 'الرابط الرسمي' } },
    { name: 'levels', type: 'select', hasMany: true, options: toPayloadOptions(studyLevels), label: { en: 'Levels', ar: 'المستويات' } },
    { name: 'universities', type: 'relationship', relationTo: 'universities', hasMany: true, label: { en: 'Universities', ar: 'الجامعات' } },
    slug('name'),
    publishedField,
    featuredField,
    orderField,
  ],
}
