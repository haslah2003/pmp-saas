import type { CollectionConfig } from 'payload'

import { isContentManager, publishedOrStaff } from '@/access'
import { orderField, publishedField } from '@/fields/common'
import { revalidateHooks } from '@/hooks/revalidate'
import { faqCategories, toPayloadOptions } from '@/lib/options'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: { en: 'FAQ', ar: 'سؤال شائع' }, plural: { en: 'FAQs', ar: 'الأسئلة الشائعة' } },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'category', 'order', 'published'], group: { en: 'Content', ar: 'المحتوى' } },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isContentManager, update: isContentManager, delete: isContentManager },
  hooks: revalidateHooks,
  fields: [
    { name: 'question', type: 'text', required: true, localized: true, label: { en: 'Question', ar: 'السؤال' } },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Answer', ar: 'الجواب' },
      admin: { description: { en: 'Plain text. Blank lines start new paragraphs.', ar: 'نص عادي. السطر الفارغ يبدأ فقرة جديدة.' } },
    },
    { name: 'category', type: 'select', required: true, defaultValue: 'general', index: true, options: toPayloadOptions(faqCategories), label: { en: 'Category', ar: 'التصنيف' }, admin: { position: 'sidebar' } },
    publishedField,
    orderField,
  ],
}
