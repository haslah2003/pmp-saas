import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { featuredField, publishedField } from '@/fields/common'
import { slug } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { studyLevels, studyModes, teachingLanguages, toPayloadOptions } from '@/lib/options'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: { en: 'Programme', ar: 'برنامج' }, plural: { en: 'Programmes', ar: 'البرامج' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'university', 'level', 'tuitionPerYear', 'published'],
    listSearchableFields: ['title', 'slug'],
    group: { en: 'Study catalogue', ar: 'دليل الدراسة' },
  },
  defaultSort: 'title',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Programme', ar: 'البرنامج' },
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, label: { en: 'Programme title', ar: 'اسم البرنامج' } },
            { name: 'summary', type: 'textarea', localized: true, label: { en: 'Summary', ar: 'ملخص' } },
            { name: 'description', type: 'richText', localized: true, label: { en: 'Description', ar: 'الوصف' } },
            {
              name: 'careerOutcomes',
              type: 'array',
              label: { en: 'Career outcomes', ar: 'الآفاق المهنية' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { en: 'Text', ar: 'النص' } }],
            },
          ],
        },
        {
          label: { en: 'Admission & fees', ar: 'القبول والرسوم' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'tuitionPerYear',
                  type: 'number',
                  min: 0,
                  index: true,
                  label: { en: 'Tuition (MAD / year)', ar: 'الرسوم (درهم / سنة)' },
                  admin: { width: '33%', description: { en: '0 = free', ar: '0 = مجاني' } },
                },
                { name: 'durationYears', type: 'number', min: 0, label: { en: 'Duration (years)', ar: 'المدة (سنوات)' }, admin: { width: '33%', step: 0.5 } },
                { name: 'intakes', type: 'text', localized: true, label: { en: 'Intakes', ar: 'مواعيد الالتحاق' }, admin: { width: '33%' } },
              ],
            },
            { name: 'tuitionNote', type: 'text', localized: true, label: { en: 'Fees note', ar: 'ملاحظة حول الرسوم' } },
            {
              name: 'requirements',
              type: 'array',
              label: { en: 'Entry requirements', ar: 'شروط القبول' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { en: 'Requirement', ar: 'الشرط' } }],
            },
            {
              name: 'scholarshipAvailable',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Scholarships available', ar: 'منح متاحة' },
            },
          ],
        },
      ],
    },
    slug('title'),
    { name: 'university', type: 'relationship', relationTo: 'universities', required: true, index: true, label: { en: 'University', ar: 'الجامعة' }, admin: { position: 'sidebar' } },
    {
      name: 'level',
      type: 'select',
      required: true,
      index: true,
      label: { en: 'Level', ar: 'المستوى' },
      options: toPayloadOptions(studyLevels),
      admin: { position: 'sidebar' },
    },
    { name: 'discipline', type: 'relationship', relationTo: 'disciplines', index: true, label: { en: 'Field of study', ar: 'المجال الدراسي' }, admin: { position: 'sidebar' } },
    {
      name: 'languages',
      type: 'select',
      hasMany: true,
      label: { en: 'Teaching language(s)', ar: 'لغة التدريس' },
      options: toPayloadOptions(teachingLanguages),
      admin: { position: 'sidebar' },
    },
    {
      name: 'studyMode',
      type: 'select',
      defaultValue: 'full-time',
      label: { en: 'Study mode', ar: 'نمط الدراسة' },
      options: toPayloadOptions(studyModes),
      admin: { position: 'sidebar' },
    },
    publishedField,
    featuredField,
  ],
}
