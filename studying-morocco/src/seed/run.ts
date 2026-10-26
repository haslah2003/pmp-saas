/**
 * Seeds the bilingual starter content. Safe to re-run: documents are matched
 * by slug (or another key) and updated in place.
 *
 *   npm run seed
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='…' npm run seed   # also creates an admin
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { cities, disciplines } from './data/catalogue'
import { calculator, categories, navigation, posts, sampleTestimonials, siteSettings } from './data/content'
import { faqs, packages, scholarships, services } from './data/offer'
import { audiencePages, corePages, homePage } from './data/pages'
import { programs, universities } from './data/universities'
import { initEditor, L, type LText, updateGlobal, upsert } from './helpers'

process.env.PAYLOAD_SEEDING = 'true'

const payload = await getPayload({ config })
await initEditor(payload)

const log = (msg: string) => payload.logger.info(`🌱 ${msg}`)
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text)
/** SEO meta from a document's own title and summary (editable later in the SEO tab). */
const metaFrom = (title: LText, summary?: LText) => ({
  title: L(clip(`${title.ar} | الدراسة في المغرب`, 70), clip(`${title.en} | Studying in Morocco`, 70)),
  ...(summary ? { description: L(clip(summary.ar, 155), clip(summary.en, 155)) } : {}),
})
const ids = (map: Map<string, number>, key: string) => {
  const id = map.get(key)
  if (!id) throw new Error(`Seed reference not found: ${key}`)
  return id
}

const disciplineIds = new Map<string, number>()
for (const d of disciplines) disciplineIds.set(d.slug, (await upsert(payload, 'disciplines', d)).id)
log(`${disciplines.length} fields of study`)

const cityIds = new Map<string, number>()
for (const c of cities) cityIds.set(c.slug, (await upsert(payload, 'cities', { published: true, ...c, meta: metaFrom(c.name, c.summary) })).id)
log(`${cities.length} cities`)

const universityIds = new Map<string, number>()
for (const { city, ...u } of universities) {
  universityIds.set(
    u.slug,
    (await upsert(payload, 'universities', { published: true, ...u, city: ids(cityIds, city), meta: metaFrom(u.name, u.summary) })).id,
  )
}
log(`${universities.length} universities`)

for (const p of programs) {
  await upsert(payload, 'programs', {
    slug: p.slug,
    published: true,
    featured: p.featured ?? false,
    title: p.title,
    summary: p.summary,
    meta: metaFrom(p.title, p.summary),
    university: ids(universityIds, p.university),
    discipline: ids(disciplineIds, p.discipline),
    level: p.level,
    languages: p.languages,
    durationYears: p.years,
    tuitionPerYear: p.tuition,
    tuitionNote: p.tuitionNote,
    intakes: p.intakes,
    studyMode: p.mode ?? 'full-time',
    scholarshipAvailable: p.scholarship ?? false,
    requirements: p.requirements?.map((text) => ({ text })),
    careerOutcomes: p.careers?.map((text) => ({ text })),
  })
}
log(`${programs.length} programmes`)

for (const s of scholarships) await upsert(payload, 'scholarships', { published: true, ...s, meta: metaFrom(s.name, s.coverage) })
log(`${scholarships.length} scholarships`)

for (const s of services) await upsert(payload, 'services', { published: true, ...s, meta: metaFrom(s.title, s.summary) })
log(`${services.length} services`)

for (const { slug: _slug, ...p } of packages) await upsert(payload, 'packages', { published: true, ...p }, 'name')
log(`${packages.length} packages`)

for (const f of faqs) await upsert(payload, 'faqs', { published: true, ...f }, 'question')
log(`${faqs.length} FAQs`)

const categoryIds = new Map<string, number>()
for (const c of categories) categoryIds.set(c.slug, (await upsert(payload, 'categories', c)).id)
for (const { category, ...p } of posts) {
  await upsert(payload, 'posts', { ...p, _status: 'published', category: ids(categoryIds, category) })
}
log(`${posts.length} guides`)

for (const page of [homePage, ...audiencePages, ...corePages]) await upsert(payload, 'pages', page)
log(`${1 + audiencePages.length + corePages.length} pages`)

for (const t of sampleTestimonials) await upsert(payload, 'testimonials', t, 'name')

await updateGlobal(payload, 'site-settings', siteSettings)
await updateGlobal(payload, 'navigation', navigation)
await updateGlobal(payload, 'calculator', calculator)
log('site settings, menus and calculator')

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (email && password) {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (!existing.docs[0]) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrator', roles: ['admin'] }, overrideAccess: true })
    log(`admin user ${email}`)
  }
}

log('done ✓')
process.exit(0)
