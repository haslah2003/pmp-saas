import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type DashboardLocale = 'en' | 'ar'

function normalizeExplicitLocale(value: string | null): DashboardLocale | null {
  return value === 'ar' || value === 'en' ? value : null
}

// API paths that require an authenticated user (protects paid AI features from
// anonymous/scripted abuse — middleware only guarded /dashboard pages before).
const AUTH_API_PREFIXES = [
  '/api/tutor',
  '/api/companion',
  '/api/deeper',
  '/api/ai',
  '/api/tts',
  '/api/practice',
]

// Subset that costs money per call (Anthropic / ElevenLabs) — apply a per-user
// daily usage cap on top of auth. Precise prefixes so non-LLM routes
// (e.g. /api/practice/questions) are auth-gated but NOT counted.
const LLM_API_PREFIXES = [
  '/api/tutor/chat',
  '/api/companion',
  '/api/deeper',
  '/api/ai/tutor',
  '/api/ai/notes',
  '/api/ai/questions',
  '/api/tts/generate',
]

const AI_DAILY_CAP = Number(process.env.AI_DAILY_CAP || 200)

async function withinDailyCap(userId: string): Promise<boolean> {
  // Returns true if allowed (and records the usage). Fails OPEN if the ai_usage
  // table does not exist yet or Supabase is unreachable, so auth still applies.
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!base || !key) return true
    const day = new Date().toISOString().slice(0, 10)
    const H = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
    const readRes = await fetch(
      `${base}/rest/v1/ai_usage?user_id=eq.${userId}&usage_date=eq.${day}&select=count`,
      { headers: H, cache: 'no-store' }
    )
    if (!readRes.ok) return true // table missing / not set up yet → skip cap
    const rows = (await readRes.json()) as Array<{ count: number }>
    const count = rows[0]?.count ?? 0
    if (count >= AI_DAILY_CAP) return false
    await fetch(`${base}/rest/v1/ai_usage`, {
      method: 'POST',
      headers: { ...H, Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ user_id: userId, usage_date: day, count: count + 1 }),
    })
    return true
  } catch {
    return true
  }
}

export async function middleware(request: NextRequest) {
  const explicitLocale =
    normalizeExplicitLocale(request.nextUrl.searchParams.get('lang')) ??
    normalizeExplicitLocale(request.nextUrl.searchParams.get('locale'))

  const requestHeaders = new Headers(request.headers)
  if (explicitLocale) {
    requestHeaders.set('x-pmp-explicit-locale', explicitLocale)
  }

  const nextOptions = { request: { headers: requestHeaders } }
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

  const path = request.nextUrl.pathname

  // Protect dashboard pages (redirect to login).
  if (!user && path.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Protect AI/cost API routes (401 for anonymous callers).
  if (AUTH_API_PREFIXES.some((p) => path.startsWith(p))) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Per-user daily cap on the paid LLM/audio endpoints.
    if (LLM_API_PREFIXES.some((p) => path.startsWith(p))) {
      const allowed = await withinDailyCap(user.id)
      if (!allowed) {
        return NextResponse.json(
          { error: 'Daily AI usage limit reached. Please try again tomorrow.' },
          { status: 429 }
        )
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/tutor/:path*',
    '/api/companion/:path*',
    '/api/deeper/:path*',
    '/api/ai/:path*',
    '/api/tts/:path*',
    '/api/practice/:path*',
  ],
}
