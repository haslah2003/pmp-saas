import { randomInt } from 'node:crypto'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { isAdmin, isCRMStaff, nobody } from '@/access'
import {
  applicationStatuses,
  budgetRanges,
  countries,
  languageLevels,
  serviceKeys,
  studyLevels,
  teachingLanguages,
  toPayloadOptions,
} from '@/lib/options'

const L = (en: string, ar: string) => ({ en, ar })
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const generateReference = () => {
  const year = new Date().getFullYear().toString().slice(-2)
  let code = ''
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)]
  return `SIM-${year}-${code}`
}

const trackChanges: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  const now = new Date().toISOString()
  if (operation === 'create') {
    data.reference = data.reference || generateReference()
    data.status = data.status || 'new'
    data.statusHistory = [{ status: data.status, changedAt: now }]
  }
  if (operation === 'update' && originalDoc && data.status && data.status !== originalDoc.status) {
    data.statusHistory = [
      ...(originalDoc.statusHistory ?? []).map((h: Record<string, unknown>) => ({ ...h })),
      { status: data.status, changedAt: now, changedBy: req.user?.id },
    ]
  }
  if (Array.isArray(data.notes)) {
    data.notes = data.notes.map((note: Record<string, unknown>) => ({
      ...note,
      author: note.author ?? req.user?.id,
      addedAt: note.addedAt ?? now,
    }))
  }
  return data
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: L('Application', 'طلب'), plural: L('Applications', 'الطلبات') },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'fullName', 'nationality', 'level', 'status', 'assignedTo', 'createdAt'],
    listSearchableFields: ['reference', 'fullName', 'email', 'phone'],
    group: L('CRM', 'إدارة العلاقات'),
    description: L(
      'Student applications from the website. Change the status to update the student’s tracking page.',
      'طلبات الطلبة من الموقع. غيّر الحالة لتحديث صفحة تتبع الطالب.',
    ),
  },
  defaultSort: '-createdAt',
  access: {
    // Public submissions go through validated server actions, never the REST API.
    create: nobody,
    read: isCRMStaff,
    update: isCRMStaff,
    delete: isAdmin,
  },
  hooks: { beforeChange: [trackChanges] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('Applicant', 'المتقدم'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'fullName', type: 'text', required: true, label: L('Full name', 'الاسم الكامل'), admin: { width: '50%' } },
                { name: 'email', type: 'email', required: true, index: true, label: L('Email', 'البريد الإلكتروني'), admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true, label: L('Phone / WhatsApp', 'الهاتف / واتساب'), admin: { width: '50%' } },
                { name: 'dateOfBirth', type: 'date', label: L('Date of birth', 'تاريخ الميلاد'), admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'nationality', type: 'select', options: toPayloadOptions(countries), index: true, label: L('Nationality', 'الجنسية'), admin: { width: '50%' } },
                { name: 'residence', type: 'select', options: toPayloadOptions(countries), label: L('Country of residence', 'بلد الإقامة'), admin: { width: '50%' } },
              ],
            },
            {
              name: 'applicantType',
              type: 'select',
              defaultValue: 'student',
              label: L('Applying as', 'صفة المتقدم'),
              options: [
                { value: 'student', label: L('Student', 'طالب') },
                { value: 'parent', label: L('Parent / guardian', 'ولي أمر') },
                { value: 'family', label: L('Family relocating', 'أسرة تنتقل') },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'guardianName', type: 'text', label: L('Parent / guardian name', 'اسم ولي الأمر'), admin: { width: '50%' } },
                { name: 'children', type: 'number', min: 0, label: L('School-age children', 'أطفال في سن الدراسة'), admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: L('Study plan', 'الخطة الدراسية'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'level', type: 'select', options: toPayloadOptions(studyLevels), index: true, label: L('Level', 'المستوى'), admin: { width: '33%' } },
                { name: 'discipline', type: 'relationship', relationTo: 'disciplines', label: L('Field of study', 'المجال'), admin: { width: '33%' } },
                { name: 'intake', type: 'text', label: L('Preferred start', 'موعد البدء المفضل'), admin: { width: '33%' } },
              ],
            },
            { name: 'program', type: 'relationship', relationTo: 'programs', label: L('Programme of interest', 'البرنامج المطلوب') },
            { name: 'universities', type: 'relationship', relationTo: 'universities', hasMany: true, label: L('Preferred universities', 'الجامعات المفضلة') },
            { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, label: L('Preferred cities', 'المدن المفضلة') },
            {
              type: 'row',
              fields: [
                { name: 'teachingLanguage', type: 'select', options: toPayloadOptions(teachingLanguages), label: L('Preferred teaching language', 'لغة الدراسة المفضلة'), admin: { width: '33%' } },
                { name: 'frenchLevel', type: 'select', options: toPayloadOptions(languageLevels), label: L('French level', 'مستوى الفرنسية'), admin: { width: '33%' } },
                { name: 'englishLevel', type: 'select', options: toPayloadOptions(languageLevels), label: L('English level', 'مستوى الإنجليزية'), admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'currentEducation', type: 'text', label: L('Current / last qualification', 'آخر مؤهل دراسي'), admin: { width: '50%' } },
                { name: 'grade', type: 'text', label: L('Grade / GPA', 'المعدل'), admin: { width: '50%' } },
              ],
            },
            { name: 'budget', type: 'select', options: toPayloadOptions(budgetRanges), label: L('Budget', 'الميزانية') },
            { name: 'services', type: 'select', hasMany: true, options: toPayloadOptions(serviceKeys), label: L('Services requested', 'الخدمات المطلوبة') },
            { name: 'message', type: 'textarea', label: L('Message from applicant', 'رسالة المتقدم') },
          ],
        },
        {
          label: L('Follow-up', 'المتابعة'),
          fields: [
            {
              name: 'notes',
              type: 'array',
              label: L('Internal notes', 'ملاحظات داخلية'),
              labels: { singular: L('Note', 'ملاحظة'), plural: L('Notes', 'ملاحظات') },
              fields: [
                { name: 'note', type: 'textarea', required: true, label: L('Note', 'الملاحظة') },
                {
                  type: 'row',
                  fields: [
                    { name: 'author', type: 'relationship', relationTo: 'users', label: L('By', 'بواسطة'), admin: { readOnly: true, width: '50%' } },
                    { name: 'addedAt', type: 'date', label: L('Date', 'التاريخ'), admin: { readOnly: true, width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
                  ],
                },
              ],
            },
            {
              name: 'statusHistory',
              type: 'array',
              label: L('Status history', 'سجل الحالات'),
              admin: { readOnly: true, initCollapsed: true },
              fields: [
                { name: 'status', type: 'select', options: toPayloadOptions(applicationStatuses), label: L('Status', 'الحالة') },
                { name: 'changedAt', type: 'date', label: L('Date', 'التاريخ'), admin: { date: { pickerAppearance: 'dayAndTime' } } },
                { name: 'changedBy', type: 'relationship', relationTo: 'users', label: L('By', 'بواسطة') },
              ],
            },
          ],
        },
        {
          label: L('Source', 'المصدر'),
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'locale', type: 'select', options: [{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }], label: L('Site language', 'لغة الموقع'), admin: { width: '33%' } },
                { name: 'landingPage', type: 'text', label: L('Submitted from', 'أُرسل من صفحة'), admin: { width: '66%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'utmSource', type: 'text', label: 'utm_source', admin: { width: '33%' } },
                { name: 'utmMedium', type: 'text', label: 'utm_medium', admin: { width: '33%' } },
                { name: 'utmCampaign', type: 'text', label: 'utm_campaign', admin: { width: '33%' } },
              ],
            },
            { name: 'referrer', type: 'text', label: L('Referrer', 'المُحيل') },
            {
              type: 'row',
              fields: [
                { name: 'consent', type: 'checkbox', label: L('Privacy consent given', 'تمت الموافقة على الخصوصية'), admin: { readOnly: true, width: '50%' } },
                { name: 'consentAt', type: 'date', label: L('Consent date', 'تاريخ الموافقة'), admin: { readOnly: true, width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      label: L('Reference', 'المرجع'),
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: toPayloadOptions(applicationStatuses),
      label: L('Status', 'الحالة'),
      admin: { position: 'sidebar' },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: L('Priority', 'الأولوية'),
      options: [
        { value: 'low', label: L('Low', 'منخفضة') },
        { value: 'normal', label: L('Normal', 'عادية') },
        { value: 'high', label: L('High', 'عالية') },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users', label: L('Counselor', 'المستشار'), admin: { position: 'sidebar' } },
    {
      name: 'publicMessage',
      type: 'textarea',
      localized: false,
      label: L('Message shown on tracking page', 'رسالة تظهر في صفحة التتبع'),
      admin: { position: 'sidebar', description: L('Visible to the applicant. Keep it short.', 'يراها المتقدم. اجعلها قصيرة.') },
    },
  ],
}
