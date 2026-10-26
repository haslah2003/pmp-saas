import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, iconField, orderField, publishedField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { currencies, serviceKeys, toPayloadOptions } from '@/lib/options'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: { en: 'Service', ar: 'خدمة' }, plural: { en: 'Services', ar: 'الخدمات' } },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'priceFrom', 'published', 'order'], group: { en: 'Services & pricing', ar: 'الخدمات والأسعار' } },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Service', ar: 'الخدمة' },
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Title', ar: 'العنوان' } },
            { name: 'summary', type: 'textarea', localized: true, label: { en: 'Short summary', ar: 'ملخص قصير' } },
            { name: 'description', type: 'richText', localized: true, label: { en: 'Full description', ar: 'الوصف الكامل' } },
            {
              name: 'features',
              type: 'array',
              label: { en: "What's included", ar: 'ما تشمله الخدمة' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { en: 'Item', ar: 'البند' } }],
            },
            {
              name: 'steps',
              type: 'array',
              label: { en: 'How it works', ar: 'كيف تعمل' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Step', ar: 'الخطوة' } },
                { name: 'text', type: 'textarea', localized: true, label: { en: 'Details', ar: 'التفاصيل' } },
              ],
            },
          ],
        },
        {
          label: { en: 'Pricing', ar: 'السعر' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'priceFrom', type: 'number', min: 0, label: { en: 'Price from', ar: 'السعر ابتداءً من' }, admin: { width: '33%', description: { en: 'Leave empty to show “on request”.', ar: 'اتركه فارغًا لعرض «حسب الطلب».' } } },
                { name: 'currency', type: 'select', defaultValue: 'USD', options: currencies.map((c) => ({ label: c, value: c })), label: { en: 'Currency', ar: 'العملة' }, admin: { width: '33%' } },
                { name: 'priceNote', type: 'text', localized: true, label: { en: 'Price note', ar: 'ملاحظة السعر' }, admin: { width: '33%' } },
              ],
            },
          ],
        },
      ],
    },
    slug('title'),
    {
      name: 'serviceKey',
      type: 'select',
      label: { en: 'Service type (for application form)', ar: 'نوع الخدمة (لاستمارة الطلب)' },
      options: toPayloadOptions(serviceKeys),
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'core',
      label: { en: 'Category', ar: 'الفئة' },
      options: [
        { value: 'core', label: { en: 'Core service', ar: 'خدمة أساسية' } },
        { value: 'addon', label: { en: 'Add-on', ar: 'خدمة إضافية' } },
        { value: 'family', label: { en: 'Families', ar: 'العائلات' } },
      ],
      admin: { position: 'sidebar' },
    },
    { ...iconField(), admin: { position: 'sidebar' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: { en: 'Image', ar: 'الصورة' }, admin: { position: 'sidebar' } },
    publishedField,
    featuredField,
    orderField,
  ],
}
