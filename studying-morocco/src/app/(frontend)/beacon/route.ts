import { createHash } from 'node:crypto'

import { sql } from '@payloadcms/db-postgres'
import { after } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios/i
const clean = (v: unknown, max = 200) => (typeof v === 'string' && v ? v.slice(0, max) : undefined)

const device = (ua: string) => (/ipad|tablet/i.test(ua) ? 'tablet' : /mobi|android|iphone/i.test(ua) ? 'mobile' : 'desktop')
const browser = (ua: string) =>
  /edg\//i.test(ua)
    ? 'Edge'
    : /opr\//i.test(ua)
      ? 'Opera'
      : /chrome|crios/i.test(ua)
        ? 'Chrome'
        : /firefox|fxios/i.test(ua)
          ? 'Firefox'
          : /safari/i.test(ua)
            ? 'Safari'
            : 'Other'

/** Keeps only the referring host, and drops internal navigation. */
const refHost = (ref: string | undefined, host: string | null) => {
  if (!ref) return undefined
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '')
    return host && h === host.replace(/^www\./, '').split(':')[0] ? undefined : h
  } catch {
    return undefined
  }
}

/** Cookieless page-view / event collector for the admin dashboard. */
export async function POST(req: Request) {
  const ua = req.headers.get('user-agent') ?? ''
  if (!ua || BOT.test(ua)) return new Response(null, { status: 204 })
  if (!(await rateLimit('beacon', 120, 60 * 1000))) return new Response(null, { status: 204 })
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new Response(null, { status: 204 })
  }
  const path = clean(body.path, 300)
  if (!path || !path.startsWith('/')) return new Response(null, { status: 204 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? ''
  const day = new Date().toISOString().slice(0, 10)
  // Salted daily hash: counts unique visitors per day without storing IPs or cookies.
  const visitor = createHash('sha256').update(`${process.env.PAYLOAD_SECRET}|${day}|${ip}|${ua}`).digest('hex').slice(0, 24)
  const country = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry') ?? undefined

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: body.type === 'event' ? 'event' : 'pageview',
        name: clean(body.name, 60),
        path,
        locale: clean(body.locale, 5),
        referrer: refHost(clean(body.referrer, 300), req.headers.get('host')),
        utmSource: clean(body.utmSource, 100),
        utmMedium: clean(body.utmMedium, 100),
        utmCampaign: clean(body.utmCampaign, 100),
        country: country && country !== 'XX' ? country : undefined,
        device: device(ua),
        browser: browser(ua),
        visitor,
      },
    })
    // Retention: occasionally drop events older than 13 months.
    if (Math.random() < 0.01) {
      after(async () => {
        const db = payload.db.drizzle as unknown as { execute: (q: unknown) => Promise<unknown> }
        await db.execute(sql`delete from analytics_events where created_at < now() - interval '13 months'`)
      })
    }
  } catch (err) {
    console.error('beacon failed', err)
  }
  return new Response(null, { status: 204 })
}
