import type { Locale } from './options'

/** BCP-47 tag for number/date formatting (Latin digits in Arabic for readability). */
export const intlLocale = (locale: Locale) => (locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB')

export const formatNumber = (value: number, locale: Locale, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits }).format(value)

/** Arabic currency labels as Gulf and Maghreb readers write them. */
const arCurrency: Record<string, string> = {
  MAD: 'درهم',
  USD: 'دولار',
  EUR: 'يورو',
  GBP: 'جنيه إسترليني',
  OMR: 'ر.ع.',
  AED: 'د.إ.',
  SAR: 'ر.س.',
  QAR: 'ر.ق.',
  KWD: 'د.ك.',
  BHD: 'د.ب.',
  JOD: 'د.أ.',
  IQD: 'د.ع.',
  XOF: 'فرنك CFA',
}

/** Formats money: "$8,220" / "MAD 8,220" in English, "8,220 دولار" in Arabic. */
export const formatMoney = (value: number, currency: string, locale: Locale, compact = false) => {
  const digits = value >= 100 || compact ? 0 : 2
  if (locale === 'ar') {
    const n = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: digits, notation: compact ? 'compact' : 'standard' }).format(value)
    return `${n} ${arCurrency[currency] ?? currency}`
  }
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency,
      currencyDisplay: currency === 'MAD' ? 'code' : 'narrowSymbol',
      maximumFractionDigits: digits,
      notation: compact ? 'compact' : 'standard',
    }).format(value)
  } catch {
    return `${formatNumber(value, locale)} ${currency}`
  }
}

export const formatDate = (iso: string | null | undefined, locale: Locale, style: 'long' | 'medium' = 'long') => {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    dateStyle: style,
    timeZone: 'Africa/Casablanca',
  }).format(new Date(iso))
}

/** "5 min read" / "5 دقائق قراءة", with correct Arabic plural forms. */
export const readingTimeLabel = (minutes: number, locale: Locale) => {
  if (locale === 'en') return `${minutes} min read`
  const n = formatNumber(minutes, locale)
  if (minutes === 1) return 'دقيقة قراءة واحدة'
  if (minutes === 2) return 'دقيقتا قراءة'
  if (minutes <= 10) return `${n} دقائق قراءة`
  return `${n} دقيقة قراءة`
}

export const convert = (amountMAD: number, madPerUnit: number) => (madPerUnit > 0 ? amountMAD / madPerUnit : amountMAD)
