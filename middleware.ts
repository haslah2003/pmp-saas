import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type DashboardLocale = 'en' | 'ar'

function normalizeExplicitLocale(value: string | null): DashboardLocale | null {
  return value === 'ar' || value === 'en' ? value : null
}

export async function middleware(request: NextRequest) {
  const explicitLocale =
    normalizeExplicitLocale(request.nextUrl.searchParams.get('lang')) ??
    normalizeExplicitLocale(request.nextUrl.searchParams.get('locale'))

  const requestHeaders = new Headers(request.headers)

  if (explicitLocale) {
    requestHeaders.set('x-pmp-explicit-locale', explicitLocale)
  }

  const nextOptions = {
    request: {
      headers: requestHeaders,
    },
  }

  let supabaseResponse = NextResponse.next(nextOptions)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next(nextOptions)

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
