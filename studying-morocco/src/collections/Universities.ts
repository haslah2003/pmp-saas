import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, hexColorField, orderField, publishedField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { admissionChannels, teachingLanguages, toPayloadOptions, universityTypes } from '@/lib/options'

export const Universities: CollectionConfig = {
  slug: 'universities',
  labels: { singular: { en: 'University', ar: 'جامعة' }, plural: { en: 'Universities', ar: 'الجامعات' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'city', 'featured', 'published'],
    listSearchableFields: ['name', 'shortName', 'slug'],
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
            { name: 'name', type: 'text', required: true, localized: true, label: { en: 'University name', ar: 'اسم الجامعة' } },
            {
              type: 'row',
              fields: [
                { name: 'shortName', type: 'text', label: { en: 'Short name / acronym', ar: 'الاسم المختصر' }, admin: { width: '33%' } },
                { name: 'founded', type: 'number', label: { en: 'Founded (year)', ar: 'سنة التأسيس' }, admin: { width: '33%' } },
                { name: 'website', type: 'text', label: { en: 'Official website', ar: 'الموقع الرسمي' }, admin: { width: '33%' } },
              ],
            },
            { name: 'summary', type: 'textarea', localized: true, label: { en: 'Summary', ar: 'ملخص' } },
            { name: 'description', type: 'richText', localized: true, label: { en: 'About the university', ar: 'عن الجامعة' } },
            {
              name: 'highlights',
              type: 'array',
              label: { en: 'Highlights', ar: 'أبرز المميزات' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { en: 'Text', ar: 'النص' } }],
            },
          ],
        },
        {
          label: { en: 'Admissions & fees', ar: 'القبول والرسوم' },
          fields: [
            {
              name: 'languages',
              type: 'select',
              hasMany: true,
              label: { en: 'Teaching languages', ar: 'لغات التدريس' },
              options: toPayloadOptions(teachingLanguages),
            },
            {
              name: 'admissionChannels',
              type: 'select',
              hasMany: true,
              label: { en: 'Admission channels', ar: 'قنوات القبول' },
              options: toPayloadOptions(admissionChannels),
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tuitionMin',
                  type: 'number',
                  min: 0,
                  label: { en: 'Tuition from (MAD / year)', ar: 'الرسوم من (درهم / سنة)' },
                  admin: { width: '50%', description: { en: '0 = free (public regular track).', ar: '0 = مجاني (التوقيت العادي).' } },
                },
                { name: 'tuitionMax', type: 'number', min: 0, label: { en: 'Tuition up to (MAD / year)', ar: 'الرسوم حتى (درهم / سنة)' }, admin: { width: '50%' } },
              ],
            },
            { name: 'tuitionNote', type: 'textarea', localized: true, label: { en: 'Fees note', ar: 'ملاحظة حول الرسوم' } },
            { name: 'applicationWindow', type: 'text', localized: true, label: { en: 'Application window', ar: 'فترة الترشيح' } },
            { name: 'admissionNotes', type: 'textarea', localized: true, label: { en: 'Admission notes', ar: 'ملاحظات القبول' } },
            { name: 'scholarshipsInfo', type: 'textarea', localized: true, label: { en: 'Scholarships', ar: 'المنح' } },
            {
              name: 'gccNote',
              type: 'textarea',
              localized: true,
              label: { en: 'Note for Gulf students (equivalence)', ar: 'ملاحظة لطلبة الخليج (المعادلة)' },
            },
            { name: 'internationalStudents', type: 'text', localized: true, label: { en: 'International students', ar: 'الطلبة الدوليون' } },
            { name: 'accreditation', type: 'text', localized: true, label: { en: 'Accreditation / status', ar: 'الاعتماد / الوضع القانوني' } },
          ],
        },
      ],
    },
    slug('name'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'public',
      index: true,
      label: { en: 'Type', ar: 'النوع' },
      options: toPayloadOptions(universityTypes),
      admin: { position: 'sidebar' },
    },
    { name: 'city', type: 'relationship', relationTo: 'cities', required: true, index: true, label: { en: 'City', ar: 'المدينة' }, admin: { position: 'sidebar' } },
    { name: 'logo', type: 'upload', relationTo: 'media', label: { en: 'Logo', ar: 'الشعار' }, admin: { position: 'sidebar' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: { en: 'Cover photo', ar: 'صورة الغلاف' }, admin: { position: 'sidebar' } },
    { ...hexColorField('color', { en: 'Crest colour', ar: 'لون الشعار' }, '#0F6E5F'), admin: { position: 'sidebar' } },
    {
      name: 'lastVerified',
      type: 'date',
      label: { en: 'Information last verified', ar: 'آخر تحقق من المعلومات' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    publishedField,
    featuredField,
    orderField,
    {
      name: 'programs',
      type: 'join',
      collection: 'programs',
      on: 'university',
      label: { en: 'Programmes', ar: 'البرامج' },
    },
  ],
}
