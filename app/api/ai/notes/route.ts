import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_NOTES } from "@/lib/constants";
import { getAccess } from "@/lib/auth/access";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { isPremium } = await getAccess();
  if (!isPremium) {
    return NextResponse.json({ error: "Premium feature", message: "Study notes require a Premium subscription.", upgrade: true }, { status: 403 });
  }

  const { topic } = await request.json();
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5', max_tokens: 4000, system: SYS_NOTES, messages: [{ role: "user", content: `Generate comprehensive study notes for: "${topic}". Self-contained for exam prep.` }] }),
  });
  const data = await response.json();
  return NextResponse.json({ content: data.content?.[0]?.text || "Error." });
}
