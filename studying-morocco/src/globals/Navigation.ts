import type { Field, GlobalConfig } from 'payload'

import { anyone, isContentManager } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

const L = (en: string, ar: string) => ({ en, ar })

const linkFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', required: true, localized: true, label: L('Label', 'النص'), admin: { width: '50%' } },
      { name: 'href', type: 'text', required: true, label: L('Link', 'الرابط'), admin: { width: '50%', placeholder: '/universities' } },
    ],
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: L('Menus', 'القوائم'),
  admin: { group: L('Settings', 'الإعدادات') },
  access: { read: anyone, update: isContentManager },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: L('Main menu', 'القائمة الرئيسية'),
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: L('Sub-menu', 'القائمة الفرعية'),
          fields: [...linkFields, { name: 'description', type: 'text', localized: true, label: L('Description', 'الوصف') }],
        },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      label: L('Footer columns', 'أعمدة التذييل'),
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: L('Column title', 'عنوان العمود') },
        { name: 'links', type: 'array', label: L('Links', 'الروابط'), fields: linkFields },
      ],
    },
    { name: 'footerNote', type: 'textarea', localized: true, label: L('Footer note', 'ملاحظة التذييل') },
  ],
}
