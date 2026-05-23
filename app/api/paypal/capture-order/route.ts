import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal'
import { getPlanById, getPlanDays, getPlanPrice } from '@/lib/plans'
import type { Period, PlanId } from '@/lib/plans'

const VALID_PLAN_IDS: PlanId[] = ['basic', 'standard', 'professional']

function normalisePlanId(value: unknown): PlanId | null {
  return typeof value === 'string' && VALID_PLAN_IDS.includes(value as PlanId)
    ? (value as PlanId)
    : null
}

function normalisePeriod(value: unknown): Period | null {
  if (value === 'sprint90') return 'annual'
  if (value === 'annual' || value === 'monthly') return value
  return null
}

function publicPeriod(period: Period): 'monthly' | 'sprint90' {
  return period === 'annual' ? 'sprint90' : 'monthly'
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    orderId?: string
    planId?: string
    period?: string
  }

  const { orderId } = body

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  try {
    const capture = await capturePayPalOrder(orderId)

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Payment not completed: ${capture.status}` },
        { status: 400 }
      )
    }

    let planId = normalisePlanId(body.planId)
    let period = normalisePeriod(body.period)

    const customId = capture.purchase_units?.[0]?.custom_id
    if ((!planId || !period) && customId) {
      try {
        const parsed = JSON.parse(customId)
        planId = planId ?? normalisePlanId(parsed.planId)
        period = period ?? normalisePeriod(parsed.period)
      } catch {
        // Do not silently default to Basic. We validate below.
      }
    }

    if (!planId || !period || !getPlanById(planId)) {
      console.error('Missing or invalid PayPal plan attribution', {
        orderId,
        bodyPlanId: body.planId,
        bodyPeriod: body.period,
        customId,
      })

      return NextResponse.json(
        { error: 'Payment captured but plan attribution was invalid. Contact support.' },
        { status: 400 }
      )
    }

    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
    const amountText = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
    const capturedAmount = Number(amountText)
    const expectedAmount = getPlanPrice(planId, period)

    if (!Number.isFinite(capturedAmount) || Math.abs(capturedAmount - expectedAmount) > 0.01) {
      console.error('PayPal amount/plan mismatch', {
        orderId,
        captureId,
        planId,
        period,
        capturedAmount,
        expectedAmount,
      })

      return NextResponse.json(
        { error: 'Payment amount does not match the selected plan. Contact support.' },
        { status: 400 }
      )
    }

    const days = getPlanDays(period)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({
        plan: planId,
        plan_period: period,
        plan_expires_at: expiresAt.toISOString(),
        paypal_order_id: orderId,
        paypal_capture_id: captureId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Supabase update error:', JSON.stringify(updateError))
      console.error('User ID:', user.id)
      return NextResponse.json(
        { error: 'Payment captured but failed to activate plan. Contact support.' },
        { status: 500 }
      )
    }

    const { data: seqResult } = await adminSupabase
      .rpc('nextval', { seq_name: 'receipt_number_seq' })
      .single()

    const receiptNum = 'RCP-' + String(seqResult || Date.now()).padStart(6, '0')

    const { data: savedReceipt, error: receiptError } = await adminSupabase
      .from('payment_receipts')
      .insert({
        user_id: user.id,
        receipt_number: receiptNum,
        plan: planId,
        plan_period: period,
        amount: capturedAmount,
        currency: 'USD',
        paypal_order_id: orderId,
        paypal_capture_id: captureId,
        payer_email: (capture as any).payer?.email_address || '',
        payer_name: (capture as any).payer?.name?.given_name
          ? (capture as any).payer.name.given_name + ' ' + ((capture as any).payer.name.surname || '')
          : '',
        status: 'paid',
      })
      .select('id')
      .single()

    if (receiptError) {
      console.error('Receipt insert error:', JSON.stringify(receiptError))
    }

    return NextResponse.json({
      success: true,
      plan: planId,
      period: publicPeriod(period),
      internalPeriod: period,
      expiresAt: expiresAt.toISOString(),
      amount: capturedAmount.toFixed(2),
      captureId,
      receiptId: savedReceipt?.id || null,
    })
  } catch (err) {
    console.error('PayPal capture error:', err)
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment' },
      { status: 500 }
    )
  }
}
