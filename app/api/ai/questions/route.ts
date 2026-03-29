import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_QUESTIONS, SYS_FLASHCARDS, SYS_CHECK, FREE_LIMITS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions").select("plan, status").eq("user_id", user.id).single();
  const isPremium = sub && sub.plan !== "free" && sub.status === "active";

  const { type, topic, domain } = await request.json();
  // type: "practice" | "exam" | "flashcards" | "check"

  // Rate limit practice questions for free users
  if (!isPremium && (type === "practice" || type === "exam")) {
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await supabase
      .from("usage_limits").select("practice_questions").eq("user_id", user.id).eq("date", today).single();
    const current = usage?.practice_questions || 0;
    if (type === "practice" && current >= FREE_LIMITS.PRACTICE_QUESTIONS_PER_DAY) {
      return NextResponse.json({ error: "Daily limit reached", message: `Free plan: ${FREE_LIMITS.PRACTICE_QUESTIONS_PER_DAY} questions/day.`, upgrade: true }, { status: 429 });
    }
    if (type === "exam") {
      return NextResponse.json({ error: "Premium feature", message: "Mock exams require Premium.", upgrade: true }, { status: 403 });
    }
    await supabase.from("usage_limits").upsert(
      { user_id: user.id, date: today, practice_questions: current + 1 },
      { onConflict: "user_id,date" }
    );
  }

  if (!isPremium && (type === "flashcards" || type === "check")) {
    return NextResponse.json({ error: "Premium feature", message: "This feature requires Premium.", upgrade: true }, { status: 403 });
  }

  let system = SYS_QUESTIONS;
  let prompt = "";

  if (type === "practice") {
    const d = domain === "all" ? "any ECO domain (People 42%, Process 50%, Business Environment 8%)" : domain;
    prompt = `Generate 1 PMP exam question from ${d}. Return JSON: {domain,task,scenario,question,options:{A,B,C,D},correct,rationale}`;
  } else if (type === "exam") {
    prompt = "Generate 10 PMP exam questions reflecting ECO weightings. Return JSON array: [{domain,task,scenario,question,options:{A,B,C,D},correct,rationale}]";
  } else if (type === "flashcards") {
    system = SYS_FLASHCARDS;
    prompt = `Generate 8 flashcards for: "${topic}"`;
  } else if (type === "check") {
    system = SYS_CHECK;
    prompt = `Generate 3 scenario-based PMP exam questions for: "${topic}"`;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system, messages: [{ role: "user", content: prompt }] }),
  });

  const data = await response.json();
  const raw = data.content?.[0]?.text || "";

  // Try to parse JSON
  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json({ data: parsed });
  } catch {
    return NextResponse.json({ data: null, raw });
  }
}
