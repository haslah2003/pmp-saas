import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_TUTOR, FREE_LIMITS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPremium = sub && sub.plan !== "free" && sub.status === "active";

  // Check rate limits for free users
  if (!isPremium) {
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await supabase
      .from("usage_limits")
      .select("ai_messages")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const currentUsage = usage?.ai_messages || 0;

    if (currentUsage >= FREE_LIMITS.AI_MESSAGES_PER_DAY) {
      return NextResponse.json({
        error: "Daily limit reached",
        message: `Free plan allows ${FREE_LIMITS.AI_MESSAGES_PER_DAY} AI messages per day. Upgrade to Premium for unlimited access.`,
        upgrade: true,
      }, { status: 429 });
    }

    // Increment usage
    await supabase.from("usage_limits").upsert(
      { user_id: user.id, date: today, ai_messages: currentUsage + 1 },
      { onConflict: "user_id,date" }
    );
  }

  // Call Claude API
  const { message, history } = await request.json();

  const messages = (history || []).concat([{ role: "user", content: message }]);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYS_TUTOR,
      messages,
    }),
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text || "Error generating response.";

  return NextResponse.json({ reply });
}
