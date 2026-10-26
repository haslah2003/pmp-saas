import type { CollectionConfig } from 'payload'

import { isAdmin, isCRMStaff, nobody } from '@/access'
import { contactChannels, countries, inquiryTypes, timeSlots, toPayloadOptions } from '@/lib/options'

const L = (en: string, ar: string) => ({ en, ar })

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: L('Enquiry', 'استفسار'), plural: L('Enquiries & bookings', 'الاستفسارات والحجوزات') },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'country', 'preferredDate', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    group: L('CRM', 'إدارة العلاقات'),
  },
  defaultSort: '-createdAt',
  access: { create: nobody, read: isCRMStaff, update: isCRMStaff, delete: isAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: L('Name', 'الاسم'), admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, label: L('Email', 'البريد الإلكتروني'), admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: L('Phone / WhatsApp', 'الهاتف / واتساب'), admin: { width: '50%' } },
        { name: 'country', type: 'select', options: toPayloadOptions(countries), label: L('Country', 'البلد'), admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'preferredChannel', type: 'select', options: toPayloadOptions(contactChannels), label: L('Preferred channel', 'وسيلة التواصل المفضلة'), admin: { width: '33%' } },
        { name: 'preferredDate', type: 'date', label: L('Preferred date', 'التاريخ المفضل'), admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'preferredTime', type: 'select', options: toPayloadOptions(timeSlots), label: L('Preferred time', 'الوقت المفضل'), admin: { width: '33%' } },
      ],
    },
    { name: 'subject', type: 'text', label: L('Subject', 'الموضوع') },
    { name: 'message', type: 'textarea', label: L('Message', 'الرسالة') },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: L('Internal notes', 'ملاحظات داخلية'),
    },
    { name: 'type', type: 'select', required: true, defaultValue: 'contact', index: true, options: toPayloadOptions(inquiryTypes), label: L('Type', 'النوع'), admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      index: true,
      label: L('Status', 'الحالة'),
      options: [
        { value: 'new', label: L('New', 'جديد') },
        { value: 'scheduled', label: L('Scheduled', 'تمت الجدولة') },
        { value: 'done', label: L('Done', 'منتهٍ') },
        { value: 'spam', label: L('Spam', 'رسالة مزعجة') },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', label: L('Assigned to', 'مسند إلى'), admin: { position: 'sidebar' } },
    { name: 'locale', type: 'select', options: [{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }], label: L('Site language', 'لغة الموقع'), admin: { position: 'sidebar' } },
    { name: 'sourcePage', type: 'text', label: L('Source page', 'صفحة المصدر'), admin: { position: 'sidebar' } },
  ],
}
