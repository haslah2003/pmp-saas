import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl =
    process.env.PAYPAL_ENV === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'

  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'env',
        error: 'Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET',
        paypalEnv: process.env.PAYPAL_ENV || null,
      },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          stage: 'paypal-auth',
          status: res.status,
          paypalEnv: process.env.PAYPAL_ENV || null,
          baseUrl,
          error: data.error || null,
          error_description: data.error_description || null,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      stage: 'paypal-auth',
      paypalEnv: process.env.PAYPAL_ENV || null,
      baseUrl,
      tokenReceived: Boolean(data.access_token),
      tokenType: data.token_type || null,
      expiresIn: data.expires_in || null,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'network',
        paypalEnv: process.env.PAYPAL_ENV || null,
        baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
