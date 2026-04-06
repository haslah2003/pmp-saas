import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal'
import { getPlanDays } from '@/lib/plans'
import type { Period } from '@/lib/plans'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId } = await req.json()

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  try {
    // ── 1. Capture the PayPal payment ───────────────────────────────────────
    const capture = await capturePayPalOrder(orderId)

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Payment not completed: ${capture.status}` },
        { status: 400 }
      )
    }

    // ── 2. Extract plan details from custom_id ──────────────────────────────
    const customId = capture.purchase_units?.[0]?.custom_id
    let planId = 'basic'
    let period: Period = 'monthly'

    if (customId) {
      try {
        const parsed = JSON.parse(customId)
        planId = parsed.planId ?? 'basic'
        period = parsed.period ?? 'monthly'
      } catch {
        // fallback to defaults
      }
    }

    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
    const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value

    // ── 3. Calculate plan expiry ────────────────────────────────────────────
    const days = getPlanDays(period)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    // ── 4. Update Supabase profile ──────────────────────────────────────────
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
// ── 5. Save payment receipt ─────────────────────────────────────────────
    const { data: seqResult } = await adminSupabase.rpc('nextval', { seq_name: 'receipt_number_seq' }).single()
    const receiptNum = 'RCP-' + String(seqResult || Date.now()).padStart(6, '0')

    const { data: savedReceipt } = await adminSupabase
      .from('payment_receipts')
      .insert({
        user_id: user.id,
        receipt_number: receiptNum,
        plan: planId,
        plan_period: period,
        amount: parseFloat(amount || '0'),
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
    // ── 6. Return success data ──────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      plan: planId,
      period,
      expiresAt: expiresAt.toISOString(),
      amount,
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