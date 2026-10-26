import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { orderField, publishedField } from '@/fields/common'
import { revalidateHooks } from '@/hooks/revalidate'
import { currencies } from '@/lib/options'

export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: { en: 'Package', ar: 'باقة' }, plural: { en: 'Packages', ar: 'الباقات' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'currency', 'highlighted', 'published'],
    group: { en: 'Services & pricing', ar: 'الخدمات والأسعار' },
    description: {
      en: 'Service bundles shown on the Services page. Review prices before launch.',
      ar: 'باقات الخدمات المعروضة في صفحة الخدمات. راجع الأسعار قبل الإطلاق.',
    },
  },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { en: 'Package name', ar: 'اسم الباقة' } },
    { name: 'tagline', type: 'text', localized: true, label: { en: 'Who it is for', ar: 'لمن هذه الباقة' } },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', min: 0, label: { en: 'Price', ar: 'السعر' }, admin: { width: '33%', description: { en: 'Empty = “on request”.', ar: 'فارغ = «حسب الطلب».' } } },
        { name: 'currency', type: 'select', defaultValue: 'USD', options: currencies.map((c) => ({ label: c, value: c })), label: { en: 'Currency', ar: 'العملة' }, admin: { width: '33%' } },
        { name: 'priceSuffix', type: 'text', localized: true, label: { en: 'Price suffix', ar: 'لاحقة السعر' }, admin: { width: '33%', placeholder: 'one-time' } },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: { en: 'Features', ar: 'المزايا' },
      fields: [
        { name: 'text', type: 'text', required: true, localized: true, label: { en: 'Feature', ar: 'الميزة' } },
        { name: 'included', type: 'checkbox', defaultValue: true, label: { en: 'Included', ar: 'مشمولة' } },
      ],
    },
    { name: 'badge', type: 'text', localized: true, label: { en: 'Badge', ar: 'شارة' }, admin: { position: 'sidebar', placeholder: 'Most popular' } },
    { name: 'highlighted', type: 'checkbox', defaultValue: false, label: { en: 'Highlight this package', ar: 'إبراز هذه الباقة' }, admin: { position: 'sidebar' } },
    publishedField,
    orderField,
  ],
}
