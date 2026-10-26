import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { CollectionSlug, Payload } from 'payload'

/**
 * Seed data is written once with both languages side by side:
 *   L('عربي', 'English')     → a localized text value
 *   MD('# عربي', '# English') → localized rich text, authored in Markdown
 * `pick(data, locale)` turns the tree into plain data for one locale.
 */
export type LText = { __l: true; ar: string; en: string }
export type LMarkdown = { __md: true; ar: string; en: string }

export const L = (ar: string, en: string): LText => ({ __l: true, ar, en })
export const MD = (ar: string, en: string): LMarkdown => ({ __md: true, ar, en })

type Locale = 'ar' | 'en'
type EditorConfig = Awaited<ReturnType<typeof editorConfigFactory.default>>

let editorConfig: EditorConfig | null = null
export const initEditor = async (payload: Payload) => {
  editorConfig = await editorConfigFactory.default({ config: payload.config })
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

export const pick = (value: unknown, locale: Locale): unknown => {
  if (Array.isArray(value)) return value.map((v) => pick(v, locale))
  if (isObject(value)) {
    if (value.__l) return (value as LText)[locale]
    if (value.__md) {
      if (!editorConfig) throw new Error('initEditor() must run before seeding rich text')
      return convertMarkdownToLexical({ editorConfig, markdown: (value as LMarkdown)[locale] })
    }
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pick(v, locale)]))
  }
  return value
}

/** Copies array-row / block ids from the saved Arabic doc onto the English data, so both locales share rows. */
const attachIds = (data: unknown, saved: unknown): unknown => {
  if (Array.isArray(data) && Array.isArray(saved)) {
    return data.map((item, i) => {
      const twin = saved[i]
      const merged = attachIds(item, twin)
      return isObject(merged) && isObject(twin) && twin.id ? { ...merged, id: twin.id } : merged
    })
  }
  if (isObject(data) && isObject(saved)) {
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, attachIds(v, saved[k])]))
  }
  return data
}

/** Has any localized value somewhere in the tree? (Then a second, English save is needed.) */
const hasLocalized = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasLocalized)
  if (isObject(value)) return Boolean(value.__l || value.__md) || Object.values(value).some(hasLocalized)
  return false
}

const ctx = { disableRevalidate: true }

/** Creates or updates a document identified by `key` (default: slug), in Arabic then English. */
export async function upsert<T extends CollectionSlug>(
  payload: Payload,
  collection: T,
  data: Record<string, unknown>,
  key: string = 'slug',
): Promise<{ id: number }> {
  const arData = pick(data, 'ar') as Record<string, unknown>
  const where = { [key]: { equals: arData[key] } }
  const existing = await payload.find({ collection, where, limit: 1, depth: 0, locale: 'ar', overrideAccess: true, draft: true } as never)
  const found = (existing as { docs: { id: number }[] }).docs[0]

  const saved = (
    found
      ? await payload.update({ collection, id: found.id, data: arData, locale: 'ar', overrideAccess: true, context: ctx, depth: 0 } as never)
      : await payload.create({ collection, data: arData, locale: 'ar', overrideAccess: true, context: ctx, depth: 0 } as never)
  ) as unknown as Record<string, unknown> & { id: number }

  if (hasLocalized(data)) {
    const enData = attachIds(pick(data, 'en'), saved) as Record<string, unknown>
    await payload.update({ collection, id: saved.id, data: enData, locale: 'en', overrideAccess: true, context: ctx, depth: 0 } as never)
  }
  return { id: saved.id }
}

export async function updateGlobal(payload: Payload, slug: 'site-settings' | 'navigation' | 'calculator', data: Record<string, unknown>) {
  const saved = (await payload.updateGlobal({ slug, data: pick(data, 'ar') as never, locale: 'ar', overrideAccess: true, context: ctx, depth: 0 })) as unknown
  if (hasLocalized(data)) {
    await payload.updateGlobal({ slug, data: attachIds(pick(data, 'en'), saved) as never, locale: 'en', overrideAccess: true, context: ctx, depth: 0 })
  }
}
