import type { CollectionConfig } from 'payload'

import { adminOrSelf, isAdmin, isAdminField } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { en: 'Team member', ar: 'عضو الفريق' }, plural: { en: 'Team', ar: 'الفريق' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles', 'updatedAt'],
    group: { en: 'Settings', ar: 'الإعدادات' },
  },
  // When a user is populated elsewhere (e.g. as an article author), expose only public profile fields.
  defaultPopulate: { name: true, jobTitle: true, photo: true },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: adminOrSelf,
    create: isAdmin,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account becomes an administrator.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) data.roles = ['admin']
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: { en: 'Full name', ar: 'الاسم الكامل' } },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      saveToJWT: true,
      defaultValue: ['editor'],
      label: { en: 'Roles', ar: 'الصلاحيات' },
      access: { create: isAdminField, update: isAdminField },
      admin: {
        description: {
          en: 'Admin: everything. Editor: website content. Counselor: applications & enquiries.',
          ar: 'مدير: كل الصلاحيات. محرر: محتوى الموقع. مستشار: الطلبات والاستفسارات.',
        },
      },
      options: [
        { value: 'admin', label: { en: 'Administrator', ar: 'مدير' } },
        { value: 'editor', label: { en: 'Content editor', ar: 'محرر محتوى' } },
        { value: 'counselor', label: { en: 'Student counselor', ar: 'مستشار طلابي' } },
      ],
    },
    { name: 'jobTitle', type: 'text', localized: true, label: { en: 'Job title', ar: 'المسمى الوظيفي' } },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { en: 'Photo', ar: 'الصورة' } },
  ],
}

