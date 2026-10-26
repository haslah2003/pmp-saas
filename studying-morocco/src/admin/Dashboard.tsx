import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest, ServerProps } from 'payload'

import { applicationStatuses, countries, optionLabel, type Locale } from '@/lib/options'

import { TrafficChart } from './TrafficChart'

type Row = Record<string, unknown>
type Lang = 'ar' | 'en'

const copy = {
  en: {
    welcome: 'Welcome back',
    subtitle: 'Website performance, admissions pipeline and content health at a glance.',
    range: (d: number) => `Last ${d} days`,
    visitors: 'Visitors',
    views: 'Page views',
    applications: 'Applications',
    conversion: 'Visitor → application',
    enquiries: 'Enquiries & bookings',
    whatsapp: 'WhatsApp clicks',
    subscribers: 'New subscribers',
    vsPrev: 'vs previous period',
    traffic: 'Traffic',
    noTraffic: 'No visits recorded yet. Data appears as soon as people browse the site.',
    pipeline: 'Admissions pipeline (all open applications)',
    countries: 'Applicants by nationality',
    pages: 'Top pages',
    sources: 'Traffic sources',
    devices: 'Devices',
    languages: 'Site language',
    recent: 'Latest applications',
    seo: 'Content & SEO health',
    seoOk: 'All published content has titles and meta descriptions in both languages.',
    missingEn: 'missing English title',
    missingAr: 'missing Arabic title',
    missingMeta: 'missing meta description',
    quick: 'Quick actions',
    newArticle: 'Write an article',
    newUniversity: 'Add a university',
    viewSite: 'View the website',
    settings: 'Site settings',
    none: 'No data yet',
    viewAll: 'View all',
  },
  ar: {
    welcome: 'مرحبًا بعودتك',
    subtitle: 'أداء الموقع ومسار القبول وصحة المحتوى في لمحة واحدة.',
    range: (d: number) => `آخر ${d} يومًا`,
    visitors: 'الزوار',
    views: 'مشاهدات الصفحات',
    applications: 'الطلبات',
    conversion: 'نسبة التحويل إلى طلب',
    enquiries: 'الاستفسارات والحجوزات',
    whatsapp: 'نقرات واتساب',
    subscribers: 'مشتركون جدد',
    vsPrev: 'مقارنة بالفترة السابقة',
    traffic: 'الزيارات',
    noTraffic: 'لم تُسجل زيارات بعد. تظهر البيانات فور تصفح الزوار للموقع.',
    pipeline: 'مسار القبول (كل الطلبات المفتوحة)',
    countries: 'المتقدمون حسب الجنسية',
    pages: 'الصفحات الأكثر زيارة',
    sources: 'مصادر الزيارات',
    devices: 'الأجهزة',
    languages: 'لغة الموقع',
    recent: 'أحدث الطلبات',
    seo: 'صحة المحتوى وتحسين البحث',
    seoOk: 'كل المحتوى المنشور له عناوين وأوصاف بحث باللغتين.',
    missingEn: 'بلا عنوان إنجليزي',
    missingAr: 'بلا عنوان عربي',
    missingMeta: 'بلا وصف لمحركات البحث',
    quick: 'إجراءات سريعة',
    newArticle: 'اكتب مقالًا',
    newUniversity: 'أضف جامعة',
    viewSite: 'اعرض الموقع',
    settings: 'إعدادات الموقع',
    none: 'لا توجد بيانات بعد',
    viewAll: 'عرض الكل',
  },
}

const num = (v: unknown) => Number(v ?? 0)
const fmt = (n: number, lang: Lang, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', opts).format(n)

function Delta({ now, prev, lang, label }: { now: number; prev: number; lang: Lang; label: string }) {
  if (!prev && !now) return null
  if (!prev) return <span className="sim-delta sim-delta--up">▲ {label}</span>
  const change = (now - prev) / prev
  const up = change >= 0
  return (
    <span className={`sim-delta ${up ? 'sim-delta--up' : 'sim-delta--down'}`} title={label}>
      {up ? '▲' : '▼'} {fmt(Math.abs(change), lang, { style: 'percent', maximumFractionDigits: 0 })}
    </span>
  )
}

function Bars({ rows, lang, empty }: { rows: { label: string; value: number; href?: string }[]; lang: Lang; empty: string }) {
  if (!rows.length) return <p className="sim-empty">{empty}</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <ul className="sim-bars">
      {rows.map((r) => (
        <li key={r.label}>
          <span className="sim-bars__label" title={r.label}>
            {r.href ? <a href={r.href}>{r.label}</a> : r.label}
          </span>
          <span className="sim-bars__track">
            <span className="sim-bars__fill" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </span>
          <span className="sim-bars__value">{fmt(r.value, lang)}</span>
        </li>
      ))}
    </ul>
  )
}

export async function Dashboard({ payload, i18n, user, searchParams }: ServerProps) {
  const lang: Lang = i18n?.language === 'ar' ? 'ar' : 'en'
  const c = copy[lang]
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const crm = roles.includes('admin') || roles.includes('counselor')
  const isAdmin = roles.includes('admin')
  const firstName = String((user as { name?: string } | null)?.name ?? '').split(' ')[0]
  const rangeParam = Number((searchParams as Record<string, string> | undefined)?.range)
  const days = [7, 30, 90].includes(rangeParam) ? rangeParam : 30
  const now = new Date()
  const start = new Date(now.getTime() - days * 86400000)
  const prevStart = new Date(start.getTime() - days * 86400000)
  const db = payload.db.drizzle as unknown as { execute: (q: unknown) => Promise<{ rows: Row[] }> }
  const q = async (query: unknown): Promise<Row[]> => {
    try {
      return (await db.execute(query)).rows
    } catch (err) {
      payload.logger.error({ err, msg: 'dashboard query failed' })
      return []
    }
  }
  const s = start.toISOString()
  const ps = prevStart.toISOString()

  const [traffic, totals, prevTotals, pages, sources, devices, locales, apps, pipeline, nationalities] = await Promise.all([
    isAdmin
      ? q(sql`select to_char(d, 'YYYY-MM-DD') as day,
              coalesce(sum(case when e.type = 'pageview' then 1 else 0 end), 0) as views,
              count(distinct case when e.type = 'pageview' then e.visitor end) as visitors
            from generate_series(${s}::timestamptz::date, now()::date, interval '1 day') d
            left join analytics_events e on e.created_at::date = d::date
            group by d order by d`)
      : Promise.resolve([]),
    q(sql`select
        (select count(*) from analytics_events where type = 'pageview' and created_at >= ${s}) as views,
        (select count(distinct (visitor, created_at::date)) from analytics_events where type = 'pageview' and created_at >= ${s}) as visitors,
        (select count(*) from analytics_events where type = 'event' and name = 'whatsapp_click' and created_at >= ${s}) as whatsapp,
        (select count(*) from applications where created_at >= ${s}) as applications,
        (select count(*) from inquiries where created_at >= ${s}) as inquiries,
        (select count(*) from subscribers where created_at >= ${s}) as subscribers`),
    q(sql`select
        (select count(*) from analytics_events where type = 'pageview' and created_at >= ${ps} and created_at < ${s}) as views,
        (select count(distinct (visitor, created_at::date)) from analytics_events where type = 'pageview' and created_at >= ${ps} and created_at < ${s}) as visitors,
        (select count(*) from analytics_events where type = 'event' and name = 'whatsapp_click' and created_at >= ${ps} and created_at < ${s}) as whatsapp,
        (select count(*) from applications where created_at >= ${ps} and created_at < ${s}) as applications,
        (select count(*) from inquiries where created_at >= ${ps} and created_at < ${s}) as inquiries,
        (select count(*) from subscribers where created_at >= ${ps} and created_at < ${s}) as subscribers`),
    isAdmin ? q(sql`select path, count(*) as n from analytics_events where type = 'pageview' and created_at >= ${s} group by path order by n desc limit 8`) : [],
    isAdmin
      ? q(sql`select coalesce(utm_source, referrer) as source, count(*) as n from analytics_events
            where type = 'pageview' and created_at >= ${s} and coalesce(utm_source, referrer) is not null
            group by 1 order by n desc limit 8`)
      : [],
    isAdmin ? q(sql`select device, count(distinct (visitor, created_at::date)) as n from analytics_events where type = 'pageview' and created_at >= ${s} group by device order by n desc`) : [],
    isAdmin ? q(sql`select locale, count(*) as n from analytics_events where type = 'pageview' and created_at >= ${s} group by locale order by n desc`) : [],
    crm
      ? payload.find({
          collection: 'applications',
          user,
          overrideAccess: false,
          depth: 0,
          limit: 6,
          sort: '-createdAt',
          select: { reference: true, fullName: true, nationality: true, status: true, createdAt: true },
        })
      : Promise.resolve(null),
    crm ? q(sql`select status, count(*) as n from applications where status not in ('lost') group by status`) : [],
    crm ? q(sql`select nationality, count(*) as n from applications where created_at >= ${s} and nationality is not null group by nationality order by n desc limit 8`) : [],
  ])

  const seo = await contentHealth(payload, lang)
  const t0 = totals[0] ?? {}
  const p0 = prevTotals[0] ?? {}
  const visitors = num(t0.visitors)
  const applications = num(t0.applications)
  const conv = visitors ? applications / visitors : 0
  const prevConv = num(p0.visitors) ? num(p0.applications) / num(p0.visitors) : 0

  const tiles = [
    ...(isAdmin
      ? [
          { label: c.visitors, value: fmt(visitors, lang), now: visitors, prev: num(p0.visitors) },
          { label: c.views, value: fmt(num(t0.views), lang), now: num(t0.views), prev: num(p0.views) },
        ]
      : []),
    { label: c.applications, value: fmt(applications, lang), now: applications, prev: num(p0.applications) },
    ...(isAdmin ? [{ label: c.conversion, value: fmt(conv, lang, { style: 'percent', maximumFractionDigits: 1 }), now: conv, prev: prevConv }] : []),
    { label: c.enquiries, value: fmt(num(t0.inquiries), lang), now: num(t0.inquiries), prev: num(p0.inquiries) },
    ...(isAdmin ? [{ label: c.whatsapp, value: fmt(num(t0.whatsapp), lang), now: num(t0.whatsapp), prev: num(p0.whatsapp) }] : []),
    { label: c.subscribers, value: fmt(num(t0.subscribers), lang), now: num(t0.subscribers), prev: num(p0.subscribers) },
  ]

  const statusOrder = applicationStatuses.map((st) => st.value as string)
  const pipelineRows = statusOrder
    .map((st) => ({ st, n: num(pipeline.find((r) => r.status === st)?.n) }))
    .filter((r) => r.n > 0 || ['new', 'contacted', 'documents', 'submitted', 'offer', 'enrolled'].includes(r.st))
    .map((r) => ({
      label: optionLabel(applicationStatuses, r.st, lang as Locale),
      value: r.n,
      href: `/admin/collections/applications?where[status][equals]=${r.st}`,
    }))
  const share = (rows: Row[], key: string) => {
    const total = rows.reduce((acc, r) => acc + num(r.n), 0) || 1
    return rows.map((r) => ({ label: String(r[key] ?? '—'), pct: num(r.n) / total }))
  }

  return (
    <div className="sim-dash">
      <header className="sim-dash__head">
        <div>
          <h1>
            {c.welcome}
            {firstName ? `${lang === 'ar' ? '، ' : ', '}${firstName}` : ''}
          </h1>
          <p>{c.subtitle}</p>
        </div>
        <nav className="sim-range" aria-label="Range">
          {[7, 30, 90].map((d) => (
            <a key={d} href={`/admin?range=${d}`} aria-current={d === days ? 'true' : undefined}>
              {c.range(d)}
            </a>
          ))}
        </nav>
      </header>

      <section className="sim-tiles">
        {tiles.map((tile) => (
          <div key={tile.label} className="sim-tile">
            <p className="sim-tile__label">{tile.label}</p>
            <p className="sim-tile__value">{tile.value}</p>
            <Delta now={tile.now} prev={tile.prev} lang={lang} label={c.vsPrev} />
          </div>
        ))}
      </section>

      {isAdmin && (
        <section className="sim-card sim-card--wide">
          <h2>{c.traffic}</h2>
          <TrafficChart
            locale={lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB'}
            labels={{ views: c.views, visitors: c.visitors, empty: c.noTraffic }}
            data={traffic.map((r) => ({ date: String(r.day), views: num(r.views), visitors: num(r.visitors) }))}
          />
        </section>
      )}

      <div className="sim-grid">
        {crm && (
          <section className="sim-card">
            <h2>{c.pipeline}</h2>
            <Bars rows={pipelineRows} lang={lang} empty={c.none} />
          </section>
        )}
        {crm && (
          <section className="sim-card">
            <h2>{c.countries}</h2>
            <Bars
              rows={nationalities.map((r) => ({ label: optionLabel(countries, String(r.nationality), lang as Locale), value: num(r.n) }))}
              lang={lang}
              empty={c.none}
            />
          </section>
        )}
        {crm && apps && (
          <section className="sim-card">
            <h2>
              {c.recent} <a href="/admin/collections/applications">{c.viewAll}</a>
            </h2>
            {apps.docs.length ? (
              <table className="sim-table">
                <tbody>
                  {apps.docs.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <a href={`/admin/collections/applications/${a.id}`} dir="ltr">
                          {a.reference}
                        </a>
                      </td>
                      <td>{a.fullName}</td>
                      <td>{optionLabel(countries, a.nationality, lang as Locale)}</td>
                      <td>
                        <span className={`sim-status sim-status--${a.status}`}>{optionLabel(applicationStatuses, a.status, lang as Locale)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="sim-empty">{c.none}</p>
            )}
          </section>
        )}
        {isAdmin && (
          <section className="sim-card">
            <h2>{c.pages}</h2>
            <Bars rows={pages.map((r) => ({ label: String(r.path), value: num(r.n), href: String(r.path) }))} lang={lang} empty={c.none} />
          </section>
        )}
        {isAdmin && (
          <section className="sim-card">
            <h2>{c.sources}</h2>
            <Bars rows={sources.map((r) => ({ label: String(r.source), value: num(r.n) }))} lang={lang} empty={c.none} />
          </section>
        )}
        {isAdmin && (
          <section className="sim-card">
            <h2>
              {c.devices} · {c.languages}
            </h2>
            {devices.length || locales.length ? (
              <div className="sim-split">
                <ul>
                  {share(devices, 'device').map((d) => (
                    <li key={d.label}>
                      <span>{d.label}</span>
                      <strong>{fmt(d.pct, lang, { style: 'percent', maximumFractionDigits: 0 })}</strong>
                    </li>
                  ))}
                </ul>
                <ul>
                  {share(locales, 'locale').map((d) => (
                    <li key={d.label}>
                      <span>{d.label === 'ar' ? 'العربية' : d.label === 'en' ? 'English' : d.label}</span>
                      <strong>{fmt(d.pct, lang, { style: 'percent', maximumFractionDigits: 0 })}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="sim-empty">{c.none}</p>
            )}
          </section>
        )}
        <section className="sim-card">
          <h2>{c.seo}</h2>
          {seo.length ? (
            <ul className="sim-issues">
              {seo.map((issue) => (
                <li key={issue.key}>
                  <a href={issue.href}>
                    <strong>{fmt(issue.count, lang)}</strong> {issue.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sim-ok">✓ {c.seoOk}</p>
          )}
        </section>
        <section className="sim-card">
          <h2>{c.quick}</h2>
          <div className="sim-actions">
            <a href="/admin/collections/posts/create">{c.newArticle}</a>
            <a href="/admin/collections/universities/create">{c.newUniversity}</a>
            <a href={`/${lang}`} target="_blank" rel="noopener noreferrer">
              {c.viewSite} ↗
            </a>
            {isAdmin && <a href="/admin/globals/site-settings">{c.settings}</a>}
          </div>
        </section>
      </div>
    </div>
  )
}

type Issue = { key: string; label: string; count: number; href: string }

/** Published content missing a translation or a meta description, per collection. */
async function contentHealth(payload: PayloadRequest['payload'], lang: Lang): Promise<Issue[]> {
  const c = copy[lang]
  const targets = [
    { slug: 'universities', title: 'name', live: { published: { equals: true } } },
    { slug: 'programs', title: 'title', live: { published: { equals: true } } },
    { slug: 'cities', title: 'name', live: { published: { equals: true } } },
    { slug: 'services', title: 'title', live: { published: { equals: true } } },
    { slug: 'posts', title: 'title', live: { _status: { equals: 'published' } } },
    { slug: 'pages', title: 'title', live: { _status: { equals: 'published' } } },
  ] as const
  const issues: Issue[] = []
  await Promise.all(
    targets.map(async (target) => {
      const label = payload.collections[target.slug]?.config.labels?.plural
      const name = typeof label === 'object' ? ((label as Record<string, string>)[lang] ?? target.slug) : String(label ?? target.slug)
      const checks = [
        { key: 'en', where: { [target.title]: { exists: false } }, locale: 'en' as const, text: c.missingEn },
        { key: 'ar', where: { [target.title]: { exists: false } }, locale: 'ar' as const, text: c.missingAr },
        { key: 'meta-ar', where: { 'meta.description': { exists: false } }, locale: 'ar' as const, text: `${c.missingMeta} (AR)` },
        { key: 'meta-en', where: { 'meta.description': { exists: false } }, locale: 'en' as const, text: `${c.missingMeta} (EN)` },
      ]
      for (const check of checks) {
        try {
          const { totalDocs } = await payload.count({
            collection: target.slug,
            locale: check.locale,
            where: { and: [target.live, check.where] } as never,
          })
          if (totalDocs > 0)
            issues.push({
              key: `${target.slug}-${check.key}`,
              label: `${name} — ${check.text}`,
              count: totalDocs,
              href: `/admin/collections/${target.slug}?locale=${check.locale}`,
            })
        } catch {
          // Collection without that field (or locale) — nothing to report.
        }
      }
    }),
  )
  return issues.sort((a, b) => b.count - a.count).slice(0, 10)
}
