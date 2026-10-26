import type { CheckboxField, NumberField, SelectField, TextField } from 'payload'

import { iconKeys } from '@/lib/options'

export const publishedField: CheckboxField = {
  name: 'published',
  type: 'checkbox',
  defaultValue: true,
  index: true,
  label: { en: 'Published', ar: 'منشور' },
  admin: { position: 'sidebar', description: { en: 'Visible on the public website.', ar: 'ظاهر في الموقع العام.' } },
}

export const featuredField: CheckboxField = {
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  label: { en: 'Featured', ar: 'مميز' },
  admin: { position: 'sidebar', description: { en: 'Highlighted on the home page.', ar: 'يظهر في الصفحة الرئيسية.' } },
}

export const orderField: NumberField = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  label: { en: 'Sort order', ar: 'ترتيب العرض' },
  admin: { position: 'sidebar', description: { en: 'Lower numbers appear first.', ar: 'الأرقام الأصغر تظهر أولًا.' } },
}

export const iconField = (name = 'icon'): SelectField => ({
  name,
  type: 'select',
  label: { en: 'Icon', ar: 'الأيقونة' },
  options: iconKeys.map((key) => ({ label: key, value: key })),
})

export const localizedText = (name: string, label: { en: string; ar: string }, required = false): TextField => ({
  name,
  type: 'text',
  label,
  localized: true,
  required,
})
