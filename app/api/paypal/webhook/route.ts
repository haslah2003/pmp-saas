import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { verifyPayPalWebhook } from '@/lib/paypal'
import { getPlanDays } from '@/lib/plans'
import type { Period } from '@/lib/plans'

export async function POST(req: NextRequest) {
  // ── 1. Read raw body for signature verification ───────────────────────────
  const rawBody = await req.text()

  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  // ── 2. Verify webhook signature ───────────────────────────────────────────
  const isValid = await verifyPayPalWebhook(headers, rawBody)
  if (!isValid) {
    console.warn('PayPal webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const supabase = await createClient()

  // ── 3. Handle event types ─────────────────────────────────────────────────
  switch (event.event_type) {

    case 'PAYMENT.CAPTURE.COMPLETED': {
      // Payment captured — activate or extend plan
      const resource = event.resource
      const customId = resource?.custom_id

      if (!customId) break

      let userId = ''
      let planId = 'basic'
      let period: Period = 'monthly'

      try {
        const parsed = JSON.parse(customId)
        userId = parsed.userId
        planId = parsed.planId
        period = parsed.period
      } catch {
        break
      }

      if (!userId) break

      const days = getPlanDays(period)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + days)

      await supabase
        .from('profiles')
        .update({
          plan: planId,
          plan_period: period,
          plan_expires_at: expiresAt.toISOString(),
          paypal_capture_id: resource.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      console.log(`Plan activated: user=${userId} plan=${planId} period=${period}`)
      break
    }

    case 'PAYMENT.CAPTURE.REFUNDED': {
      // Payment refunded — downgrade to free
      const resource = event.resource
      const captureId = resource?.id

      if (!captureId) break

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('paypal_capture_id', captureId)
        .single()

      if (profile?.id) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            plan_period: null,
            plan_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id)

        console.log(`Plan revoked (refund): user=${profile.id}`)
      }
      break
    }

    case 'PAYMENT.CAPTURE.DENIED': {
      // Payment denied — ensure plan is not active
      console.log('Payment denied:', event.resource?.id)
      break
    }

    default:
      console.log('Unhandled PayPal webhook event:', event.event_type)
  }

  return NextResponse.json({ received: true })
}