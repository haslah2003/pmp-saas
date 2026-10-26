import 'server-only'

import type { Where } from 'payload'
import { cache } from 'react'

import type { Locale } from './options'
import { getPayloadClient } from './payload'

const published: Where = { published: { equals: true } }
const live: Where = { _status: { equals: 'published' } }

const and = (...clauses: (Where | false | null | undefined | '' | 0)[]): Where => ({
  and: clauses.filter(Boolean) as Where[],
})

export const getSettings = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

export const getNavigation = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 0 })
})

export const getCalculator = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'calculator', locale, depth: 0 })
})

export const getPageBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    depth: 2,
    limit: 1,
    draft: false,
    where: and(live, { slug: { equals: slug } }),
  })
  return docs[0] ?? null
})

export type UniversityFilters = {
  city?: string
  type?: string
  language?: string
  q?: string
  featured?: boolean
  ids?: number[]
  limit?: number
}

export const getUniversities = cache(async (locale: Locale, filters: UniversityFilters = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'universities',
    locale,
    depth: 1,
    limit: filters.limit ?? 100,
    sort: 'order',
    where: and(
      published,
      filters.featured && { featured: { equals: true } },
      filters.ids?.length ? { id: { in: filters.ids } } : null,
      filters.city && { 'city.slug': { equals: filters.city } },
      filters.type && { type: { equals: filters.type } },
      filters.language && { languages: { in: [filters.language] } },
      filters.q && { or: [{ name: { like: filters.q } }, { shortName: { like: filters.q } }] },
    ),
    joins: { programs: false },
  })
  return docs
})

export const getUniversityBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'universities',
    locale,
    depth: 2,
    limit: 1,
    where: and(published, { slug: { equals: slug } }),
    joins: { programs: { limit: 100, sort: 'level', where: published } },
  })
  return docs[0] ?? null
})

export type ProgramFilters = {
  level?: string
  field?: string
  language?: string
  city?: string
  university?: string
  q?: string
  maxTuition?: number
  free?: boolean
  featured?: boolean
  page?: number
  limit?: number
  exclude?: number
}

export const getPrograms = cache(async (locale: Locale, f: ProgramFilters = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'programs',
    locale,
    depth: 2,
    limit: f.limit ?? 24,
    page: f.page ?? 1,
    sort: '-featured',
    where: and(
      published,
      f.featured && { featured: { equals: true } },
      f.exclude ? { id: { not_equals: f.exclude } } : null,
      f.level && { level: { equals: f.level } },
      f.field && { 'discipline.slug': { equals: f.field } },
      f.language && { languages: { in: [f.language] } },
      f.city && { 'university.city.slug': { equals: f.city } },
      f.university && { 'university.slug': { equals: f.university } },
      f.free && { tuitionPerYear: { equals: 0 } },
      typeof f.maxTuition === 'number' && !Number.isNaN(f.maxTuition) && { tuitionPerYear: { less_than_equal: f.maxTuition } },
      f.q && { title: { like: f.q } },
    ),
  })
})

export const getProgramBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'programs',
    locale,
    depth: 2,
    limit: 1,
    where: and(published, { slug: { equals: slug } }),
  })
  return docs[0] ?? null
})

export const getCities = cache(async (locale: Locale, limit = 50) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cities',
    locale,
    depth: 1,
    limit,
    sort: 'order',
    where: published,
    joins: { universities: false },
  })
  return docs
})

export const getCityBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cities',
    locale,
    depth: 2,
    limit: 1,
    where: and(published, { slug: { equals: slug } }),
    joins: { universities: { limit: 50, sort: 'order', where: published } },
  })
  return docs[0] ?? null
})

export const getDisciplines = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'disciplines', locale, depth: 0, limit: 100, sort: 'order' })
  return docs
})

export const getServices = cache(async (locale: Locale, opts: { featured?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    depth: 1,
    limit: 50,
    sort: 'order',
    where: and(published, opts.featured && { featured: { equals: true } }),
  })
  return docs
})

export const getServiceBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    depth: 1,
    limit: 1,
    where: and(published, { slug: { equals: slug } }),
  })
  return docs[0] ?? null
})

export const getPackages = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'packages', locale, depth: 0, limit: 10, sort: 'order', where: published })
  return docs
})

export const getScholarships = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'scholarships', locale, depth: 1, limit: 100, sort: 'order', where: published })
  return docs
})

export const getPosts = cache(async (locale: Locale, opts: { category?: string; limit?: number; page?: number; exclude?: number } = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit: opts.limit ?? 12,
    page: opts.page ?? 1,
    sort: '-publishedAt',
    draft: false,
    where: and(
      live,
      opts.category && { 'category.slug': { equals: opts.category } },
      opts.exclude ? { id: { not_equals: opts.exclude } } : null,
    ),
  })
})

export const getPostBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: 1,
    draft: false,
    where: and(live, { slug: { equals: slug } }),
  })
  return docs[0] ?? null
})

export const getCategories = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', locale, depth: 0, limit: 50 })
  return docs
})

export const getFAQs = cache(async (locale: Locale, opts: { category?: string | null; limit?: number } = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'faqs',
    locale,
    depth: 0,
    limit: opts.limit ?? 100,
    sort: 'order',
    where: and(published, opts.category && { category: { equals: opts.category } }),
  })
  return docs
})

export const getTestimonials = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'testimonials', locale, depth: 1, limit: 12, sort: 'order', where: published })
  return docs
})

export const getCounts = cache(async () => {
  const payload = await getPayloadClient()
  const [universities, programs, cities] = await Promise.all([
    payload.count({ collection: 'universities', where: published }),
    payload.count({ collection: 'programs', where: published }),
    payload.count({ collection: 'cities', where: published }),
  ])
  return { universities: universities.totalDocs, programs: programs.totalDocs, cities: cities.totalDocs }
})

export const searchSite = cache(async (q: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const like = { like: q }
  const [universities, programs, cities, posts, services] = await Promise.all([
    payload.find({ collection: 'universities', locale, depth: 1, limit: 8, where: and(published, { or: [{ name: like }, { shortName: like }, { summary: like }] }), joins: { programs: false } }),
    payload.find({ collection: 'programs', locale, depth: 2, limit: 12, where: and(published, { or: [{ title: like }, { summary: like }] }) }),
    payload.find({ collection: 'cities', locale, depth: 0, limit: 6, where: and(published, { or: [{ name: like }, { summary: like }] }), joins: { universities: false } }),
    payload.find({ collection: 'posts', locale, depth: 0, limit: 6, draft: false, where: and(live, { or: [{ title: like }, { excerpt: like }] }) }),
    payload.find({ collection: 'services', locale, depth: 0, limit: 6, where: and(published, { or: [{ title: like }, { summary: like }] }) }),
  ])
  return {
    universities: universities.docs,
    programs: programs.docs,
    cities: cities.docs,
    posts: posts.docs,
    services: services.docs,
  }
})

export const getRedirect = cache(async (from: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'redirects', depth: 2, limit: 1, where: { from: { equals: from } } })
  return docs[0] ?? null
})
