'use server'

import { after } from 'next/server'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'
import {
  applicationStatuses,
  budgetRanges,
  contactChannels,
  countries,
  inquiryTypes,
  languageLevels,
  serviceKeys,
  studyLevels,
  teachingLanguages,
  timeSlots,
  trackableStatuses,
  type Locale,
} from '@/lib/options'
import { rateLimit } from '@/lib/rate-limit'

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: 'invalid' | 'rate' | 'generic' | 'spam'; fields?: Record<string, string> }

const values = <T extends readonly { value: string }[]>(options: T) => options.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]

const email = z.string().trim().toLowerCase().max(160).pipe(z.email())
const phone = z
  .string()
  .trim()
  .max(32)
  .regex(/^\+?[\d\s().-]{7,}$/)
const text = (max: number) => z.string().trim().max(max)
/** Blank form fields become undefined rather than "" (which e.g. a date column rejects). */
const blankToUndefined = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v)
const optionalText = (max: number) => z.preprocess(blankToUndefined, text(max).optional())
const locale = z.enum(['ar', 'en'])
const ids = z.array(z.number().int().positive()).max(10).optional()

/** Bot checks shared by every public form: an invisible honeypot and a minimum fill time. */
const antiSpam = z.object({ website: z.string().max(0).optional(), startedAt: z.number().int() })
const looksLikeBot = (input: z.infer<typeof antiSpam>) => Boolean(input.website) || Date.now() - input.startedAt < 2500

const fieldErrors = (error: z.ZodError) =>
  Object.fromEntries(Object.entries(z.flattenError(error).fieldErrors).map(([k, v]) => [k, (v as string[] | undefined)?.[0] ?? 'invalid']))

const notify = (subject: string, lines: (string | number | undefined | null | false)[]) => {
  after(async () => {
    try {
      const payload = await getPayloadClient()
      if (!process.env.SMTP_HOST) return
      const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      const to = settings.notificationEmails?.split(',').map((e) => e.trim()).filter(Boolean)
      if (!to?.length) return
      await payload.sendEmail({ to, subject, text: lines.filter(Boolean).join('\n') })
    } catch (err) {
      console.error('Notification email failed', err)
    }
  })
}

const sendConfirmation = (to: string, lang: Locale, reference: string, name: string) => {
  after(async () => {
    try {
      if (!process.env.SMTP_HOST) return
      const payload = await getPayloadClient()
      const site = process.env.NEXT_PUBLIC_SITE_URL || ''
      const first = name.split(' ')[0]
      const subject = lang === 'ar' ? `تم استلام طلبك — ${reference}` : `We received your application — ${reference}`
      const body =
        lang === 'ar'
          ? `مرحبًا ${first}،\n\nشكرًا لتقديمك عبر «الدراسة في المغرب». رقمك المرجعي: ${reference}\nسيتواصل معك مستشار خلال يوم عمل واحد.\n\nتتبع طلبك: ${site}/ar/track\n\nفريق الدراسة في المغرب — أكاديمية KNO`
          : `Hello ${first},\n\nThank you for applying with Studying in Morocco. Your reference is ${reference}.\nA counselor will contact you within one working day.\n\nTrack your application: ${site}/en/track\n\nThe Studying in Morocco team — KNO Academy`
      await payload.sendEmail({ to, subject, text: body })
    } catch (err) {
      console.error('Confirmation email failed', err)
    }
  })
}

/* ── Applications ─────────────────────────────────────────────────────── */

const applicationSchema = antiSpam.extend({
  applicantType: z.enum(['student', 'parent', 'family']),
  fullName: text(120).min(3),
  email,
  phone,
  nationality: z.enum(values(countries)).optional(),
  residence: z.enum(values(countries)).optional(),
  dateOfBirth: optionalText(10).refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'invalid'),
  guardianName: optionalText(120),
  children: z.number().int().min(0).max(12).optional(),
  level: z.enum(values(studyLevels)).optional(),
  discipline: z.number().int().positive().optional(),
  program: z.number().int().positive().optional(),
  universities: ids,
  cities: ids,
  teachingLanguage: z.enum(values(teachingLanguages)).optional(),
  frenchLevel: z.enum(values(languageLevels)).optional(),
  englishLevel: z.enum(values(languageLevels)).optional(),
  currentEducation: optionalText(160),
  grade: optionalText(40),
  intake: optionalText(60),
  budget: z.enum(values(budgetRanges)).optional(),
  services: z.array(z.enum(values(serviceKeys))).max(12).optional(),
  message: optionalText(2000),
  consent: z.literal(true),
  locale,
  landingPage: optionalText(300),
  referrer: optionalText(300),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
})

export type ApplicationInput = z.input<typeof applicationSchema>

export async function submitApplication(input: ApplicationInput): Promise<ActionResult<{ reference: string }>> {
  const parsed = applicationSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fields: fieldErrors(parsed.error) }
  if (looksLikeBot(parsed.data)) return { ok: false, error: 'spam' }
  if (!(await rateLimit('application', 5, 10 * 60 * 1000))) return { ok: false, error: 'rate' }

  const { website: _w, startedAt: _s, ...data } = parsed.data
  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'applications',
      overrideAccess: true,
      data: { ...data, status: 'new', consentAt: new Date().toISOString() },
    })
    notify(`New application ${doc.reference} — ${data.fullName}`, [
      `Reference: ${doc.reference}`,
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      data.nationality && `Nationality: ${data.nationality}`,
      data.level && `Level: ${data.level}`,
      data.services?.length && `Services: ${data.services.join(', ')}`,
      data.message && `Message: ${data.message}`,
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/applications/${doc.id}`,
    ])
    sendConfirmation(data.email, data.locale, doc.reference ?? '', data.fullName)
    return { ok: true, data: { reference: doc.reference ?? '' } }
  } catch (err) {
    console.error('submitApplication failed', err)
    return { ok: false, error: 'generic' }
  }
}

/* ── Enquiries & consultation bookings ────────────────────────────────── */

const inquirySchema = antiSpam.extend({
  type: z.enum(values(inquiryTypes)),
  name: text(120).min(2),
  email,
  phone: z.preprocess(blankToUndefined, phone.optional()),
  country: z.enum(values(countries)).optional(),
  preferredChannel: z.enum(values(contactChannels)).optional(),
  preferredDate: optionalText(10).refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'invalid'),
  preferredTime: z.enum(values(timeSlots)).optional(),
  subject: optionalText(160),
  message: optionalText(3000),
  locale,
  sourcePage: optionalText(300),
})

export type InquiryInput = z.input<typeof inquirySchema>

export async function submitInquiry(input: InquiryInput): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fields: fieldErrors(parsed.error) }
  if (looksLikeBot(parsed.data)) return { ok: false, error: 'spam' }
  if (!(await rateLimit('inquiry', 6, 10 * 60 * 1000))) return { ok: false, error: 'rate' }
  const { website: _w, startedAt: _s, ...data } = parsed.data
  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'inquiries', overrideAccess: true, data: { ...data, status: 'new' } })
    notify(`New ${data.type} request — ${data.name}`, [
      `Type: ${data.type}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone && `Phone: ${data.phone}`,
      data.preferredChannel && `Channel: ${data.preferredChannel}`,
      data.preferredDate && `Date: ${data.preferredDate} ${data.preferredTime ?? ''}`,
      data.message && `Message: ${data.message}`,
    ])
    return { ok: true }
  } catch (err) {
    console.error('submitInquiry failed', err)
    return { ok: false, error: 'generic' }
  }
}

/* ── Newsletter ───────────────────────────────────────────────────────── */

export async function subscribe(input: { email: string; locale: Locale; source?: string; website?: string }): Promise<ActionResult> {
  const parsed = z.object({ email, locale, source: optionalText(300), website: z.string().max(0).optional() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  if (parsed.data.website) return { ok: false, error: 'spam' }
  if (!(await rateLimit('subscribe', 5, 10 * 60 * 1000))) return { ok: false, error: 'rate' }
  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: parsed.data.email } }, limit: 1, overrideAccess: true })
    if (existing.docs[0]) {
      await payload.update({ collection: 'subscribers', id: existing.docs[0].id, data: { status: 'active' }, overrideAccess: true })
    } else {
      await payload.create({
        collection: 'subscribers',
        overrideAccess: true,
        data: { email: parsed.data.email, locale: parsed.data.locale, source: parsed.data.source, status: 'active' },
      })
    }
    return { ok: true }
  } catch (err) {
    console.error('subscribe failed', err)
    return { ok: false, error: 'generic' }
  }
}

/* ── Application tracking ─────────────────────────────────────────────── */

export type TrackResult = {
  reference: string
  firstName: string
  status: (typeof applicationStatuses)[number]['value']
  createdAt: string
  publicMessage?: string | null
  history: { status: string; at: string }[]
  steps: readonly string[]
}

export async function trackApplication(input: { reference: string; email: string }): Promise<ActionResult<TrackResult> | { ok: false; error: 'notFound' }> {
  const parsed = z.object({ reference: z.string().trim().toUpperCase().regex(/^SIM-\d{2}-[A-Z0-9]{6}$/), email }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'notFound' }
  if (!(await rateLimit('track', 10, 10 * 60 * 1000))) return { ok: false, error: 'rate' }
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'applications',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { and: [{ reference: { equals: parsed.data.reference } }, { email: { equals: parsed.data.email } }] },
      select: { reference: true, fullName: true, status: true, createdAt: true, publicMessage: true, statusHistory: true },
    })
    const doc = docs[0]
    if (!doc) return { ok: false, error: 'notFound' }
    return {
      ok: true,
      data: {
        reference: doc.reference ?? parsed.data.reference,
        firstName: (doc.fullName ?? '').split(' ')[0] ?? '',
        status: doc.status,
        createdAt: doc.createdAt,
        publicMessage: doc.publicMessage,
        history: (doc.statusHistory ?? []).map((h) => ({ status: h.status ?? '', at: h.changedAt ?? '' })),
        steps: trackableStatuses,
      },
    }
  } catch (err) {
    console.error('trackApplication failed', err)
    return { ok: false, error: 'generic' }
  }
}
