import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, orderField, publishedField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'

const madPerMonth = (name: string, en: string, ar: string, defaultValue: number) => ({
  name,
  type: 'number' as const,
  label: { en, ar },
  defaultValue,
  min: 0,
  admin: { width: '25%', description: { en: 'MAD / month', ar: 'درهم / شهر' } },
})

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: { singular: { en: 'City', ar: 'مدينة' }, plural: { en: 'Cities', ar: 'المدن' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'featured', 'published', 'order'],
    group: { en: 'Study catalogue', ar: 'دليل الدراسة' },
  },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Overview', ar: 'نظرة عامة' },
          fields: [
            { name: 'name', type: 'text', required: true, localized: true, label: { en: 'City name', ar: 'اسم المدينة' } },
            { name: 'region', type: 'text', localized: true, label: { en: 'Region', ar: 'الجهة' } },
            { name: 'tagline', type: 'text', localized: true, label: { en: 'Tagline', ar: 'عبارة تعريفية' } },
            { name: 'summary', type: 'textarea', localized: true, label: { en: 'Summary', ar: 'ملخص' } },
            { name: 'description', type: 'richText', localized: true, label: { en: 'Full description', ar: 'الوصف الكامل' } },
            {
              name: 'highlights',
              type: 'array',
              label: { en: 'Highlights', ar: 'أبرز المميزات' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { en: 'Text', ar: 'النص' } }],
            },
            { name: 'climate', type: 'text', localized: true, label: { en: 'Climate', ar: 'المناخ' } },
            { name: 'flightTimes', type: 'text', localized: true, label: { en: 'Typical flight connections', ar: 'الرحلات الجوية' } },
          ],
        },
        {
          label: { en: 'Cost of living', ar: 'تكلفة المعيشة' },
          description: {
            en: 'Indicative monthly student costs in Moroccan dirham (MAD). Used by the cost calculator.',
            ar: 'تكاليف شهرية تقديرية للطالب بالدرهم المغربي، يعتمدها حاسب التكاليف.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                madPerMonth('rentResidence', 'University residence', 'السكن الجامعي', 1500),
                madPerMonth('rentShared', 'Shared apartment (room)', 'غرفة في شقة مشتركة', 2200),
                madPerMonth('rentStudio', 'Private studio', 'استوديو خاص', 4000),
                madPerMonth('homestay', 'Homestay (incl. meals)', 'سكن عائلي مع الوجبات', 4200),
              ],
            },
            {
              type: 'row',
              fields: [
                madPerMonth('food', 'Food', 'الطعام', 1800),
                madPerMonth('transport', 'Transport', 'المواصلات', 300),
                madPerMonth('utilities', 'Internet, phone & utilities', 'الإنترنت والهاتف والفواتير', 400),
                madPerMonth('leisure', 'Leisure & personal', 'الترفيه والمصاريف الشخصية', 700),
              ],
            },
          ],
        },
      ],
    },
    slug('name'),
    { name: 'image', type: 'upload', relationTo: 'media', label: { en: 'Cover photo', ar: 'صورة الغلاف' }, admin: { position: 'sidebar' } },
    publishedField,
    featuredField,
    orderField,
    {
      name: 'universities',
      type: 'join',
      collection: 'universities',
      on: 'city',
      label: { en: 'Universities in this city', ar: 'الجامعات في هذه المدينة' },
    },
  ],
}
