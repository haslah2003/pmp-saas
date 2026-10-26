import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

const L = (en: string, ar: string) => ({ en, ar })

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: L('Site settings', 'إعدادات الموقع'),
  admin: { group: L('Settings', 'الإعدادات') },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('General', 'عام'),
          fields: [
            { name: 'siteName', type: 'text', required: true, localized: true, label: L('Site name', 'اسم الموقع') },
            { name: 'tagline', type: 'text', localized: true, label: L('Tagline', 'الشعار النصي') },
            { name: 'organization', type: 'text', localized: true, label: L('Operated by', 'تديره'), admin: { placeholder: 'KNO Academy' } },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', label: L('Logo (light backgrounds)', 'الشعار (خلفيات فاتحة)'), admin: { width: '50%' } },
                { name: 'logoOnDark', type: 'upload', relationTo: 'media', label: L('Logo (dark backgrounds)', 'الشعار (خلفيات داكنة)'), admin: { width: '50%' } },
              ],
            },
            {
              name: 'announcement',
              type: 'group',
              label: L('Announcement bar', 'شريط الإعلانات'),
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false, label: L('Show announcement', 'إظهار الإعلان') },
                { name: 'text', type: 'text', localized: true, label: L('Text', 'النص') },
                { name: 'href', type: 'text', label: L('Link', 'الرابط') },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              label: L('Key figures (trust bar)', 'الأرقام الرئيسية'),
              maxRows: 6,
              admin: { description: L('Only publish figures you can substantiate.', 'لا تنشر إلا أرقامًا يمكن إثباتها.') },
              fields: [
                { name: 'value', type: 'text', required: true, localized: true, label: L('Value', 'القيمة') },
                { name: 'label', type: 'text', required: true, localized: true, label: L('Label', 'الوصف') },
              ],
            },
          ],
        },
        {
          label: L('Contact', 'التواصل'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: L('Public email', 'البريد العام'), admin: { width: '50%' } },
                { name: 'phone', type: 'text', label: L('Phone (display)', 'الهاتف (للعرض)'), admin: { width: '50%' } },
              ],
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: L('WhatsApp number', 'رقم واتساب'),
              admin: { description: L('International format, digits only, e.g. 96895885074', 'بالصيغة الدولية، أرقام فقط، مثال 96895885074') },
              validate: (value: unknown) => (!value || /^\d{8,15}$/.test(String(value)) ? true : 'Digits only, 8–15 characters'),
            },
            { name: 'address', type: 'textarea', localized: true, label: L('Address', 'العنوان') },
            { name: 'officeHours', type: 'text', localized: true, label: L('Office hours', 'ساعات العمل') },
            { name: 'mapUrl', type: 'text', label: L('Google Maps link', 'رابط خرائط جوجل') },
            {
              name: 'socials',
              type: 'array',
              label: L('Social profiles', 'حسابات التواصل الاجتماعي'),
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '33%' },
                      options: ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x', 'snapchat', 'telegram'].map((p) => ({ label: p, value: p })),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '66%' } },
                  ],
                },
              ],
            },
            {
              name: 'notificationEmails',
              type: 'text',
              label: L('Send new applications to', 'إرسال الطلبات الجديدة إلى'),
              admin: { description: L('Comma-separated staff emails (requires SMTP settings).', 'بريد الفريق مفصولًا بفواصل (يتطلب إعداد SMTP).') },
            },
          ],
        },
        {
          label: L('Brand', 'الهوية البصرية'),
          description: L(
            'Colours, fonts and sizes follow the KNO Academy Web Branding & UI Governance Guidelines and are fixed in the code. Changes need written brand approval.',
            'الألوان والخطوط والمقاسات تتبع دليل الهوية الرقمية لأكاديمية KNO وهي مثبتة في الشيفرة، وأي تغيير يتطلب موافقة مكتوبة من مالك العلامة.',
          ),
          fields: [
            {
              name: 'adobeFontsKitId',
              type: 'text',
              label: L('Adobe Fonts web project ID (English font)', 'معرّف مشروع Adobe Fonts (الخط الإنجليزي)'),
              admin: {
                placeholder: 'abc1def',
                description: L(
                  'The ID of the Adobe Fonts web project that contains Acumin Variable Concept (from https://use.typekit.net/<ID>.css). Until it is set, English text uses the visitor’s system font. Arabic always uses Noto Kufi Arabic.',
                  'معرّف مشروع الويب في Adobe Fonts الذي يضم خط Acumin Variable Concept (من الرابط https://use.typekit.net/<ID>.css). إلى أن يُضبط، يظهر النص الإنجليزي بخط النظام لدى الزائر. النص العربي يستخدم دائمًا خط Noto Kufi Arabic.',
                ),
              },
              validate: (value: unknown) => (!value || /^[a-z0-9]{5,12}$/.test(String(value)) ? true : 'Letters and digits only, e.g. abc1def'),
            },
          ],
        },
        {
          label: L('SEO & tracking', 'تحسين البحث والتتبع'),
          fields: [
            { name: 'defaultDescription', type: 'textarea', localized: true, label: L('Default meta description', 'الوصف الافتراضي لمحركات البحث') },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: L('Default social sharing image (1200×630)', 'صورة المشاركة الافتراضية (1200×630)') },
            {
              type: 'row',
              fields: [
                { name: 'googleSiteVerification', type: 'text', label: L('Google Search Console code', 'رمز Google Search Console'), admin: { width: '50%' } },
                { name: 'bingSiteVerification', type: 'text', label: L('Bing Webmaster code', 'رمز Bing Webmaster'), admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ga4Id',
                  type: 'text',
                  label: L('Google Analytics 4 ID', 'معرف Google Analytics 4'),
                  admin: { width: '50%', placeholder: 'G-XXXXXXX', description: L('Loaded only after visitor consent.', 'يُحمّل فقط بعد موافقة الزائر.') },
                },
                {
                  name: 'metaPixelId',
                  type: 'text',
                  label: L('Meta (Facebook) Pixel ID', 'معرف بكسل ميتا'),
                  admin: { width: '50%', description: L('Loaded only after visitor consent.', 'يُحمّل فقط بعد موافقة الزائر.') },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
