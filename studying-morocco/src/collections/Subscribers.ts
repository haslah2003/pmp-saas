import type { CollectionConfig } from 'payload'

import { isAdmin, isCRMStaff, isContentManager, nobody } from '@/access'

const L = (en: string, ar: string) => ({ en, ar })

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: L('Subscriber', 'مشترك'), plural: L('Newsletter subscribers', 'مشتركو النشرة') },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'locale', 'status', 'createdAt'], group: L('CRM', 'إدارة العلاقات') },
  defaultSort: '-createdAt',
  access: {
    create: nobody,
    read: (args) => Boolean(isCRMStaff(args) || isContentManager(args)),
    update: isCRMStaff,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, label: L('Email', 'البريد الإلكتروني') },
    { name: 'locale', type: 'select', options: [{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }], label: L('Language', 'اللغة') },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: L('Status', 'الحالة'),
      options: [
        { value: 'active', label: L('Active', 'نشط') },
        { value: 'unsubscribed', label: L('Unsubscribed', 'ألغى الاشتراك') },
      ],
    },
    { name: 'source', type: 'text', label: L('Source page', 'صفحة المصدر') },
  ],
}
