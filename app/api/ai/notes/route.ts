import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_NOTES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions").select("plan, status").eq("user_id", user.id).single();
  const isPremium = sub && sub.plan !== "free" && sub.status === "active";
  if (!isPremium) {
    return NextResponse.json({ error: "Premium feature", message: "Study notes require a Premium subscription.", upgrade: true }, { status: 403 });
  }

  const { topic } = await request.json();
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system: SYS_NOTES, messages: [{ role: "user", content: `Generate comprehensive study notes for: "${topic}". Self-contained for exam prep.` }] }),
  });
  const data = await response.json();
  return NextResponse.json({ content: data.content?.[0]?.text || "Error." });
}
