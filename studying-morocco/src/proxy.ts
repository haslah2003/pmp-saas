import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = ['ar', 'en'] as const
const DEFAULT_LOCALE = 'ar'

const preferredLocale = (req: NextRequest): string => {
  const cookie = req.cookies.get('NEXT_LOCALE')?.value
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie
  const header = req.headers.get('accept-language') ?? ''
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: (tag ?? '').slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  const match = ranked.find((r) => (LOCALES as readonly string[]).includes(r.lang))
  return match?.lang ?? DEFAULT_LOCALE
}

/** Adds the language prefix to any un-prefixed public URL (/universities → /ar/universities). */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1] ?? ''
  if ((LOCALES as readonly string[]).includes(first)) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${preferredLocale(req)}${pathname === '/' ? '' : pathname}`
  const res = NextResponse.redirect(url, pathname === '/' ? 307 : 308)
  res.headers.set('Vary', 'Accept-Language, Cookie')
  return res
}

export const config = {
  // Skip the admin, API, analytics beacon, Next internals and any file with an extension.
  matcher: ['/((?!admin|api|beacon|_next|.*\\..*).*)'],
}
