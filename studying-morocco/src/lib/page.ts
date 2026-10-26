import 'server-only'

import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { getDictionary } from '@/i18n'

import { isLocale, type Locale } from './options'
import { getRedirect } from './queries'
import { documentPath } from './routes'

export type LocaleParams = Promise<{ locale: string }>
export type SlugParams = Promise<{ locale: string; slug: string }>
export type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return { locale, t: getDictionary(locale) }
}

export const param = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || undefined

/** Before a 404, honour any redirect configured in Admin → Redirects. */
export async function redirectOrNotFound(path: string, locale: Locale): Promise<never> {
  const candidates = [path, path.replace(/^\/(ar|en)(?=\/|$)/, '') || '/']
  for (const from of candidates) {
    const r = await getRedirect(from)
    if (!r) continue
    let target: string | null = null
    if (r.to?.type === 'reference' && r.to.reference && typeof r.to.reference.value === 'object') {
      const value = r.to.reference.value as { slug?: string }
      target = documentPath(r.to.reference.relationTo, value.slug ?? '', locale)
    } else if (r.to?.url) target = r.to.url
    if (target) {
      if (r.type === '302') redirect(target)
      permanentRedirect(target)
    }
  }
  notFound()
}
