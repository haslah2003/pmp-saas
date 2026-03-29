import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getPayPalToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await request.json();
  // planId = PayPal Plan ID (you create these in PayPal dashboard or via API)

  if (!planId) return NextResponse.json({ error: "Plan ID required" }, { status: 400 });

  const token = await getPayPalToken();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        email_address: user.email,
      },
      application_context: {
        brand_name: "PMP Expert Tutor",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${appUrl}/dashboard?subscription=success`,
        cancel_url: `${appUrl}/pricing?subscription=cancelled`,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("PayPal error:", data);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }

  // Find the approval URL
  const approvalLink = data.links?.find((l: any) => l.rel === "approve");

  // Store pending subscription
  await supabase.from("subscriptions").update({
    paypal_subscription_id: data.id,
    status: "inactive",
    updated_at: new Date().toISOString(),
  }).eq("user_id", user.id);

  return NextResponse.json({
    subscriptionId: data.id,
    approvalUrl: approvalLink?.href,
  });
}
