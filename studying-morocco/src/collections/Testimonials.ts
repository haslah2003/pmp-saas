import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, orderField } from '@/fields/common'
import { revalidateHooks } from '@/hooks/revalidate'
import { countries, toPayloadOptions } from '@/lib/options'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: { en: 'Testimonial', ar: 'شهادة' }, plural: { en: 'Testimonials', ar: 'شهادات الطلبة' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'university', 'published'],
    group: { en: 'Content', ar: 'المحتوى' },
    description: {
      en: 'Only publish genuine testimonials with the student’s written consent.',
      ar: 'لا تنشر إلا شهادات حقيقية بموافقة كتابية من الطالب.',
    },
  },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true, label: { en: 'Student name', ar: 'اسم الطالب' } },
    { name: 'quote', type: 'textarea', required: true, localized: true, label: { en: 'Testimonial', ar: 'الشهادة' } },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'select', options: toPayloadOptions(countries), label: { en: 'Country', ar: 'البلد' }, admin: { width: '33%' } },
        { name: 'university', type: 'text', localized: true, label: { en: 'University', ar: 'الجامعة' }, admin: { width: '33%' } },
        { name: 'program', type: 'text', localized: true, label: { en: 'Programme', ar: 'البرنامج' }, admin: { width: '33%' } },
      ],
    },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, label: { en: 'Rating (1–5)', ar: 'التقييم (1–5)' } },
    { name: 'videoUrl', type: 'text', label: { en: 'Video URL (YouTube)', ar: 'رابط فيديو (يوتيوب)' } },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { en: 'Photo', ar: 'الصورة' }, admin: { position: 'sidebar' } },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: { en: 'Published', ar: 'منشور' },
      admin: { position: 'sidebar' },
    },
    { name: 'consentOnFile', type: 'checkbox', defaultValue: false, label: { en: 'Written consent on file', ar: 'الموافقة الكتابية محفوظة' }, admin: { position: 'sidebar' } },
    featuredField,
    orderField,
  ],
}
