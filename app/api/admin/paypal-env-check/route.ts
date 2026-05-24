import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function fingerprint(value: string | undefined) {
  if (!value) {
    return {
      present: false,
      length: 0,
      startsWith: null,
      endsWith: null,
      sha256_12: null,
    }
  }

  return {
    present: true,
    length: value.length,
    startsWith: value.slice(0, 6),
    endsWith: value.slice(-6),
    sha256_12: crypto.createHash('sha256').update(value).digest('hex').slice(0, 12),
  }
}

export async function GET() {
  return NextResponse.json({
    paypalEnv: process.env.PAYPAL_ENV || null,
    nodeEnv: process.env.NODE_ENV || null,
    paypalClientId: fingerprint(process.env.PAYPAL_CLIENT_ID),
    nextPublicPaypalClientId: fingerprint(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
    paypalClientSecret: {
      present: Boolean(process.env.PAYPAL_CLIENT_SECRET),
      length: process.env.PAYPAL_CLIENT_SECRET?.length || 0,
      sha256_12: process.env.PAYPAL_CLIENT_SECRET
        ? crypto.createHash('sha256').update(process.env.PAYPAL_CLIENT_SECRET).digest('hex').slice(0, 12)
        : null,
    },
    paypalWebhookId: fingerprint(process.env.PAYPAL_WEBHOOK_ID),
    checkedAt: new Date().toISOString(),
  })
}
