import type { CollectionConfig } from 'payload'

import { anyone, isContentManager } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { en: 'Media file', ar: 'ملف وسائط' }, plural: { en: 'Media library', ar: 'مكتبة الوسائط' } },
  admin: {
    group: { en: 'Content', ar: 'المحتوى' },
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isContentManager,
    update: isContentManager,
    delete: isContentManager,
  },
  upload: {
    // No SVG: it can embed scripts and would be served from our own origin.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'application/pdf'],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: { en: 'Alternative text', ar: 'النص البديل' },
      admin: { description: { en: 'Describe the image for screen readers and SEO.', ar: 'صف الصورة لقارئات الشاشة ومحركات البحث.' } },
    },
    { name: 'credit', type: 'text', label: { en: 'Photo credit', ar: 'حقوق الصورة' } },
  ],
}
