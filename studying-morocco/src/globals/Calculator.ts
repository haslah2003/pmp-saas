import type { GlobalConfig } from 'payload'

import { anyone, isContentManager } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { currencies } from '@/lib/options'

const L = (en: string, ar: string) => ({ en, ar })

export const Calculator: GlobalConfig = {
  slug: 'calculator',
  label: L('Cost calculator', 'حاسب التكاليف'),
  admin: {
    group: L('Settings', 'الإعدادات'),
    description: L(
      'Figures behind the public cost calculator and comparison. All values are indicative — review them regularly.',
      'الأرقام التي يعتمدها حاسب التكاليف والمقارنة. كل القيم تقديرية — راجعها دوريًا.',
    ),
  },
  access: { read: anyone, update: isContentManager },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'rates',
      type: 'array',
      label: L('Exchange rates (MAD per 1 unit)', 'أسعار الصرف (درهم مقابل وحدة واحدة)'),
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'currency', type: 'select', required: true, options: currencies.map((c) => ({ label: c, value: c })), admin: { width: '50%' } },
            { name: 'madPerUnit', type: 'number', required: true, min: 0, label: L('MAD per unit', 'درهم لكل وحدة'), admin: { width: '50%', step: 0.0001 } },
          ],
        },
      ],
    },
    { name: 'ratesUpdated', type: 'date', label: L('Rates last updated', 'آخر تحديث للأسعار'), admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'tuition',
      type: 'group',
      label: L('Tuition assumptions (MAD / year)', 'افتراضات الرسوم (درهم / سنة)'),
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'publicFlexible', type: 'number', defaultValue: 15000, label: L('Public — flexible track', 'عمومي — توقيت ميسر'), admin: { width: '33%' } },
            { name: 'privateMin', type: 'number', defaultValue: 50000, label: L('Private — from', 'خاص — من'), admin: { width: '33%' } },
            { name: 'privateMax', type: 'number', defaultValue: 130000, label: L('Private — up to', 'خاص — حتى'), admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'oneTimeSetup', type: 'number', defaultValue: 6000, label: L('One-off arrival costs', 'تكاليف الوصول لمرة واحدة'), admin: { width: '50%', description: L('Deposit, residence card, insurance, setup.', 'التأمين، بطاقة الإقامة، الضمان، التجهيز.') } },
            { name: 'insurancePerYear', type: 'number', defaultValue: 3000, label: L('Health insurance / year', 'التأمين الصحي / سنة'), admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'benchmarks',
      type: 'array',
      label: L('Comparison destinations (per year)', 'وجهات المقارنة (سنويًا)'),
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: L('Destination', 'الوجهة') },
        {
          type: 'row',
          fields: [
            { name: 'tuition', type: 'number', required: true, min: 0, label: L('Tuition', 'الرسوم الدراسية'), admin: { width: '33%' } },
            { name: 'living', type: 'number', required: true, min: 0, label: L('Living costs', 'تكاليف المعيشة'), admin: { width: '33%' } },
            { name: 'currency', type: 'select', required: true, defaultValue: 'EUR', options: currencies.map((c) => ({ label: c, value: c })), admin: { width: '33%' } },
          ],
        },
        { name: 'note', type: 'text', localized: true, label: L('Source / note', 'المصدر / ملاحظة') },
      ],
    },
    { name: 'disclaimer', type: 'textarea', localized: true, label: L('Disclaimer', 'تنبيه') },
  ],
}
