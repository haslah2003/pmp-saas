import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for webhooks (no user context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function verifyWebhook(request: NextRequest, body: string): Promise<boolean> {
  // In production, verify the webhook signature with PayPal
  // For now, accept all (TODO: implement full verification)
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return true; // Skip verification in dev

  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo"),
        cert_url: request.headers.get("paypal-cert-url"),
        transmission_id: request.headers.get("paypal-transmission-id"),
        transmission_sig: request.headers.get("paypal-transmission-sig"),
        transmission_time: request.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });
    const result = await verifyRes.json();
    return result.verification_status === "SUCCESS";
  } catch (err) {
    console.error("Webhook verification error:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const verified = await verifyWebhook(request, body);
  if (!verified) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const event = JSON.parse(body);
  const eventType = event.event_type;
  const resource = event.resource;
  const paypalSubId = resource?.id;

  console.log(`PayPal webhook: ${eventType}`, paypalSubId);

  if (!paypalSubId) return NextResponse.json({ received: true });

  // Map PayPal events to our subscription status
  const statusMap: Record<string, { status: string; plan?: string }> = {
    "BILLING.SUBSCRIPTION.ACTIVATED": { status: "active" },
    "BILLING.SUBSCRIPTION.CANCELLED": { status: "cancelled" },
    "BILLING.SUBSCRIPTION.SUSPENDED": { status: "past_due" },
    "BILLING.SUBSCRIPTION.EXPIRED": { status: "inactive" },
    "BILLING.SUBSCRIPTION.PAYMENT.FAILED": { status: "past_due" },
    "BILLING.SUBSCRIPTION.RE-ACTIVATED": { status: "active" },
  };

  const mapping = statusMap[eventType];
  if (!mapping) return NextResponse.json({ received: true, skipped: eventType });

  // Update subscription in database
  const updateData: any = {
    status: mapping.status,
    updated_at: new Date().toISOString(),
  };

  // For activation, also set period dates
  if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
    updateData.current_period_start = resource.start_time;
    updateData.current_period_end = resource.billing_info?.next_billing_time;
    // Determine plan from billing amount
    const amount = parseFloat(resource.billing_info?.last_payment?.amount?.value || "0");
    if (amount >= 150) updateData.plan = "annual";
    else if (amount >= 50) updateData.plan = "quarterly";
    else updateData.plan = "monthly";
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update(updateData)
    .eq("paypal_subscription_id", paypalSubId);

  if (error) console.error("DB update error:", error);

  return NextResponse.json({ received: true, status: mapping.status });
}
