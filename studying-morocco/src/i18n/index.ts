import type { Locale } from '@/lib/options'

import { ar } from './ar'
import { en, type Dictionary } from './en'

const dictionaries: Record<Locale, Dictionary> = { ar, en }

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]

export type { Dictionary }

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr')

export { intlLocale } from '@/lib/format'

export const ogLocale = (locale: Locale) => (locale === 'ar' ? 'ar_AR' : 'en_GB')
