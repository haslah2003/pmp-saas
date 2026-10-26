import type { CollectionConfig } from 'payload'

import { isAdmin, nobody } from '@/access'

/**
 * Privacy-friendly, cookieless analytics. Each row is one page view or event.
 * `visitor` is a salted daily hash (IP + user agent + day), so no personal data
 * or cross-day tracking is stored. Aggregated on the admin dashboard.
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: { en: 'Analytics event', ar: 'حدث تحليلي' }, plural: { en: 'Analytics events', ar: 'الأحداث التحليلية' } },
  admin: { hidden: true },
  access: { create: nobody, read: isAdmin, update: nobody, delete: isAdmin },
  timestamps: true,
  indexes: [{ fields: ['createdAt', 'type'] }],
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'pageview',
      options: [
        { value: 'pageview', label: 'Page view' },
        { value: 'event', label: 'Event' },
      ],
    },
    { name: 'name', type: 'text', index: true },
    { name: 'path', type: 'text', index: true },
    { name: 'locale', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'utmSource', type: 'text' },
    { name: 'utmMedium', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'device', type: 'text' },
    { name: 'browser', type: 'text' },
    { name: 'visitor', type: 'text', index: true },
  ],
}
