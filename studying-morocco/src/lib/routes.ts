import type { Locale } from './options'

/** Public URL path of a CMS document, used by SEO, sitemap and search. */
export const documentPath = (collection: string, slug: string, locale: Locale): string => {
  switch (collection) {
    case 'universities':
      return `/${locale}/universities/${slug}`
    case 'programs':
      return `/${locale}/programs/${slug}`
    case 'cities':
      return `/${locale}/cities/${slug}`
    case 'services':
      return `/${locale}/services/${slug}`
    case 'scholarships':
      return `/${locale}/scholarships#${slug}`
    case 'posts':
      return `/${locale}/blog/${slug}`
    case 'pages':
      return slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
    default:
      return `/${locale}`
  }
}

const EXTERNAL = /^(https?:|mailto:|tel:|whatsapp:|#)/i

/** Prefixes internal links from the CMS with the active language. */
export const localizeHref = (href: string | null | undefined, locale: Locale): string => {
  if (!href) return `/${locale}`
  if (EXTERNAL.test(href)) return href
  if (!href.startsWith('/')) return `/${locale}/${href}`
  if (/^\/(ar|en)(\/|$|\?|#)/.test(href)) return href
  return href === '/' ? `/${locale}` : `/${locale}${href}`
}

/** Same path in the other language (used by the language switcher and hreflang). */
export const swapLocale = (pathname: string, target: Locale): string => {
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, '')
  return `/${target}${rest}`
}
