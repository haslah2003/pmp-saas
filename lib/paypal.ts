const PAYPAL_BASE =
  process.env.PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

// ── Get OAuth access token ────────────────────────────────────────────────────
export async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal auth failed: ${err}`)
  }

  const data = await res.json()
  return data.access_token
}

// ── Create a one-time payment order ──────────────────────────────────────────
export async function createPayPalOrder(
  amount: number,
  planId: string,
  period: string,
  userId: string
): Promise<{ id: string }> {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `${userId}-${planId}-${Date.now()}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `${planId}-${period}`,
          description: `PMP Expert Tutor — ${planId} plan (${period})`,
          custom_id: JSON.stringify({ userId, planId, period }),
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'PMP Expert Tutor',
        locale: 'en-US',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing`,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal create order failed: ${err}`)
  }

  return res.json()
}

// ── Capture an approved order ─────────────────────────────────────────────────
export async function capturePayPalOrder(orderId: string): Promise<{
  status: string
  id: string
  payer: { email_address: string; payer_id: string }
  purchase_units: Array<{
    custom_id: string
    payments: { captures: Array<{ id: string; status: string; amount: { value: string } }> }
  }>
}> {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal capture failed: ${err}`)
  }

  return res.json()
}

// ── Verify webhook signature ──────────────────────────────────────────────────
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  try {
    const token = await getPayPalAccessToken()

    const res = await fetch(
      `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: JSON.parse(body),
        }),
      }
    )

    const data = await res.json()
    return data.verification_status === 'SUCCESS'
  } catch {
    return false
  }
}