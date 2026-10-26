import type { Block, Field } from 'payload'

import { faqCategories, iconKeys, toPayloadOptions } from '@/lib/options'

const L = (en: string, ar: string) => ({ en, ar })

const sectionIntro: Field[] = [
  { name: 'eyebrow', type: 'text', localized: true, label: L('Eyebrow (small label)', 'عنوان صغير') },
  { name: 'heading', type: 'text', localized: true, label: L('Heading', 'العنوان') },
  { name: 'intro', type: 'textarea', localized: true, label: L('Intro text', 'نص تمهيدي') },
]

const link = (name: string, label: { en: string; ar: string }): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', localized: true, label: L('Label', 'النص'), admin: { width: '50%' } },
        {
          name: 'href',
          type: 'text',
          label: L('Link', 'الرابط'),
          admin: { width: '50%', description: L('e.g. /apply or https://… (language prefix is added automatically)', 'مثال: /apply (تتم إضافة اللغة تلقائيًا)') },
        },
      ],
    },
  ],
})

const icon: Field = { name: 'icon', type: 'select', label: L('Icon', 'الأيقونة'), options: iconKeys.map((k) => ({ label: k, value: k })) }

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: L('Hero', 'واجهة رئيسية'), plural: L('Heroes', 'واجهات') },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'home',
      label: L('Style', 'النمط'),
      options: [
        { value: 'home', label: L('Home (large, with search)', 'رئيسية (كبيرة مع بحث)') },
        { value: 'page', label: L('Inner page', 'صفحة داخلية') },
      ],
    },
    { name: 'eyebrow', type: 'text', localized: true, label: L('Eyebrow', 'عنوان صغير') },
    { name: 'heading', type: 'text', localized: true, required: true, label: L('Heading', 'العنوان') },
    { name: 'subheading', type: 'textarea', localized: true, label: L('Sub-heading', 'العنوان الفرعي') },
    link('primaryCta', L('Primary button', 'الزر الرئيسي')),
    link('secondaryCta', L('Secondary button', 'الزر الثانوي')),
    {
      name: 'chips',
      type: 'array',
      label: L('Trust chips', 'شارات الثقة'),
      maxRows: 4,
      fields: [{ name: 'text', type: 'text', required: true, localized: true, label: L('Text', 'النص') }],
    },
    { name: 'showSearch', type: 'checkbox', defaultValue: true, label: L('Show programme finder', 'إظهار محرك البحث عن البرامج') },
    { name: 'image', type: 'upload', relationTo: 'media', label: L('Image (optional — illustration used otherwise)', 'صورة (اختيارية)') },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: L('Key figures', 'أرقام رئيسية'), plural: L('Key figures', 'أرقام رئيسية') },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: L('Figures', 'الأرقام'),
      maxRows: 6,
      admin: { description: L('Leave empty to use the figures from Site settings.', 'اتركه فارغًا لاستخدام الأرقام من إعدادات الموقع.') },
      fields: [
        { name: 'value', type: 'text', required: true, localized: true, label: L('Value', 'القيمة') },
        { name: 'label', type: 'text', required: true, localized: true, label: L('Label', 'الوصف') },
      ],
    },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: L('Feature grid', 'شبكة مزايا'), plural: L('Feature grids', 'شبكات مزايا') },
  fields: [
    ...sectionIntro,
    {
      name: 'items',
      type: 'array',
      label: L('Items', 'العناصر'),
      fields: [
        icon,
        { name: 'title', type: 'text', required: true, localized: true, label: L('Title', 'العنوان') },
        { name: 'text', type: 'textarea', localized: true, label: L('Text', 'النص') },
        { name: 'stat', type: 'text', localized: true, label: L('Big figure (optional)', 'رقم بارز (اختياري)') },
      ],
    },
  ],
}

export const ServicesGridBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: L('Services', 'الخدمات'), plural: L('Services', 'الخدمات') },
  fields: [
    ...sectionIntro,
    { name: 'onlyFeatured', type: 'checkbox', defaultValue: true, label: L('Only featured services', 'الخدمات المميزة فقط') },
    { name: 'showPackages', type: 'checkbox', defaultValue: false, label: L('Show packages & prices', 'إظهار الباقات والأسعار') },
  ],
}

export const UniversitiesBlock: Block = {
  slug: 'universitiesShowcase',
  labels: { singular: L('Universities', 'الجامعات'), plural: L('Universities', 'الجامعات') },
  fields: [
    ...sectionIntro,
    {
      name: 'universities',
      type: 'relationship',
      relationTo: 'universities',
      hasMany: true,
      label: L('Pick universities (optional)', 'اختر الجامعات (اختياري)'),
      admin: { description: L('Empty = featured universities.', 'فارغ = الجامعات المميزة.') },
    },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24, label: L('How many', 'العدد') },
  ],
}

export const CitiesBlock: Block = {
  slug: 'citiesShowcase',
  labels: { singular: L('Cities', 'المدن'), plural: L('Cities', 'المدن') },
  fields: [...sectionIntro, { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 12, label: L('How many', 'العدد') }],
}

export const ProcessBlock: Block = {
  slug: 'processSteps',
  labels: { singular: L('Process steps', 'خطوات العمل'), plural: L('Process steps', 'خطوات العمل') },
  fields: [
    ...sectionIntro,
    {
      name: 'steps',
      type: 'array',
      label: L('Steps', 'الخطوات'),
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: L('Title', 'العنوان') },
        { name: 'text', type: 'textarea', localized: true, label: L('Text', 'النص') },
        { name: 'duration', type: 'text', localized: true, label: L('Typical timing', 'المدة المعتادة') },
      ],
    },
  ],
}

export const CostComparisonBlock: Block = {
  slug: 'costComparison',
  labels: { singular: L('Cost comparison', 'مقارنة التكاليف'), plural: L('Cost comparisons', 'مقارنات التكاليف') },
  fields: [...sectionIntro],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: L('Testimonials', 'الشهادات'), plural: L('Testimonials', 'الشهادات') },
  fields: [...sectionIntro],
}

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: L('FAQ', 'أسئلة شائعة'), plural: L('FAQ', 'أسئلة شائعة') },
  fields: [
    ...sectionIntro,
    { name: 'category', type: 'select', options: toPayloadOptions(faqCategories), label: L('Category (optional)', 'التصنيف (اختياري)') },
    { name: 'limit', type: 'number', defaultValue: 8, min: 1, max: 40, label: L('How many', 'العدد') },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: L('Call to action', 'دعوة للإجراء'), plural: L('Calls to action', 'دعوات للإجراء') },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true, label: L('Heading', 'العنوان') },
    { name: 'text', type: 'textarea', localized: true, label: L('Text', 'النص') },
    link('primaryCta', L('Primary button', 'الزر الرئيسي')),
    link('secondaryCta', L('Secondary button', 'الزر الثانوي')),
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'dark',
      label: L('Style', 'النمط'),
      options: [
        { value: 'dark', label: L('Dark with pattern', 'داكن مع زخرفة') },
        { value: 'light', label: L('Light', 'فاتح') },
      ],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: L('Text', 'نص'), plural: L('Text', 'نص') },
  fields: [
    { name: 'content', type: 'richText', localized: true, label: L('Content', 'المحتوى') },
    { name: 'narrow', type: 'checkbox', defaultValue: true, label: L('Narrow reading width', 'عرض قراءة ضيق') },
  ],
}

export const AudiencesBlock: Block = {
  slug: 'audiences',
  labels: { singular: L('Audiences', 'الفئات المستهدفة'), plural: L('Audiences', 'الفئات المستهدفة') },
  fields: [
    ...sectionIntro,
    {
      name: 'items',
      type: 'array',
      label: L('Audience cards', 'بطاقات الفئات'),
      fields: [
        icon,
        { name: 'title', type: 'text', required: true, localized: true, label: L('Title', 'العنوان') },
        { name: 'text', type: 'textarea', localized: true, label: L('Text', 'النص') },
        { name: 'href', type: 'text', label: L('Link', 'الرابط') },
      ],
    },
  ],
}

export const ComparisonBlock: Block = {
  slug: 'comparison',
  labels: { singular: L('Comparison table', 'جدول مقارنة'), plural: L('Comparison tables', 'جداول مقارنة') },
  fields: [
    ...sectionIntro,
    {
      type: 'row',
      fields: [
        { name: 'labelA', type: 'text', localized: true, label: L('Column A title', 'عنوان العمود أ'), admin: { width: '50%' } },
        { name: 'labelB', type: 'text', localized: true, label: L('Column B title (Morocco)', 'عنوان العمود ب (المغرب)'), admin: { width: '50%' } },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: L('Rows', 'الصفوف'),
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: L('Row', 'البند') },
        { name: 'a', type: 'text', localized: true, label: L('Column A', 'العمود أ') },
        { name: 'b', type: 'text', localized: true, label: L('Column B', 'العمود ب') },
      ],
    },
    { name: 'footnote', type: 'text', localized: true, label: L('Footnote / source', 'ملاحظة / المصدر') },
  ],
}

export const PostsFeedBlock: Block = {
  slug: 'postsFeed',
  labels: { singular: L('Latest guides', 'أحدث الأدلة'), plural: L('Latest guides', 'أحدث الأدلة') },
  fields: [...sectionIntro, { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12, label: L('How many', 'العدد') }],
}

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: { singular: L('Newsletter sign-up', 'الاشتراك في النشرة'), plural: L('Newsletter sign-ups', 'الاشتراك في النشرة') },
  fields: [
    { name: 'heading', type: 'text', localized: true, label: L('Heading', 'العنوان') },
    { name: 'text', type: 'textarea', localized: true, label: L('Text', 'النص') },
  ],
}

export const ProgramSearchBlock: Block = {
  slug: 'programSearch',
  labels: { singular: L('Programme finder', 'محرك البحث عن البرامج'), plural: L('Programme finders', 'محركات البحث') },
  fields: [...sectionIntro],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  StatsBlock,
  FeatureGridBlock,
  AudiencesBlock,
  ServicesGridBlock,
  UniversitiesBlock,
  CitiesBlock,
  ProcessBlock,
  CostComparisonBlock,
  ComparisonBlock,
  TestimonialsBlock,
  FAQBlock,
  PostsFeedBlock,
  ProgramSearchBlock,
  RichTextBlock,
  CTABlock,
  NewsletterBlock,
]
