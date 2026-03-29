import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/paypal'
import { getPlanPrice, getPlanById } from '@/lib/plans'
import type { PlanId, Period } from '@/lib/plans'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { planId, period } = await req.json() as { planId: PlanId; period: Period }

  const plan = getPlanById(planId)
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const amount = getPlanPrice(planId, period)

  try {
    const order = await createPayPalOrder(amount, planId, period, user.id)
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('PayPal create order error:', err)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}