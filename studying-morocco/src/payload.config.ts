import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { isContentManager } from './access'
import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { Applications } from './collections/Applications'
import { Categories } from './collections/Categories'
import { Cities } from './collections/Cities'
import { Disciplines } from './collections/Disciplines'
import { FAQs } from './collections/FAQs'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Programs } from './collections/Programs'
import { Scholarships } from './collections/Scholarships'
import { Services } from './collections/Services'
import { Subscribers } from './collections/Subscribers'
import { Testimonials } from './collections/Testimonials'
import { Universities } from './collections/Universities'
import { Users } from './collections/Users'
import { Calculator } from './globals/Calculator'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { documentPath } from './lib/routes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type SEODoc = { title?: string; name?: string; summary?: string; excerpt?: string; slug?: string }

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Studying in Morocco',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    components: {
      graphics: {
        Logo: '@/admin/Logo#Logo',
        Icon: '@/admin/Logo#Icon',
      },
      beforeDashboard: ['@/admin/Dashboard#Dashboard'],
    },
    dateFormat: 'd MMM yyyy',
  },
  i18n: {
    supportedLanguages: { ar, en },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: [
      { code: 'ar', label: 'العربية', rtl: true },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
  collections: [
    Universities,
    Programs,
    Cities,
    Disciplines,
    Scholarships,
    Services,
    Packages,
    Pages,
    Posts,
    Categories,
    FAQs,
    Testimonials,
    Media,
    Applications,
    Inquiries,
    Subscribers,
    AnalyticsEvents,
    Users,
  ],
  globals: [SiteSettings, Navigation, Calculator],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  cors: [serverURL],
  csrf: [serverURL],
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'hello@example.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Studying in Morocco',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  plugins: [
    seoPlugin({
      collections: ['pages', 'posts', 'universities', 'programs', 'cities', 'services', 'scholarships'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const d = doc as SEODoc
        return `${d.title || d.name || ''} | Studying in Morocco`
      },
      generateDescription: ({ doc }) => {
        const d = doc as SEODoc
        return (d.summary || d.excerpt || '').slice(0, 160)
      },
      generateURL: ({ doc, collectionConfig, locale }) =>
        `${serverURL}${documentPath(collectionConfig?.slug ?? '', (doc as SEODoc).slug ?? '', locale === 'en' ? 'en' : 'ar')}`,
    }),
    redirectsPlugin({
      collections: ['pages', 'posts', 'universities', 'programs', 'services', 'cities'],
      redirectTypes: ['301', '302'],
      overrides: {
        admin: { group: { en: 'Settings', ar: 'الإعدادات' } },
        access: { read: () => true, create: isContentManager, update: isContentManager, delete: isContentManager },
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
