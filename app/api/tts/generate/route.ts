import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_AUDIO_SCRIPT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Premium only
  const { data: sub } = await supabase
    .from("subscriptions").select("plan, status").eq("user_id", user.id).single();
  const isPremium = sub && sub.plan !== "free" && sub.status === "active";
  if (!isPremium) {
    return NextResponse.json({ error: "Premium feature", message: "Audio narration requires Premium.", upgrade: true }, { status: 403 });
  }

  const { topic, scriptOnly } = await request.json();

  // Step 1: Generate narration script via Claude
  const scriptRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, system: SYS_AUDIO_SCRIPT, messages: [{ role: "user", content: `Write a narration script for: "${topic}"` }] }),
  });
  const scriptData = await scriptRes.json();
  const script = scriptData.content?.[0]?.text || "";

  if (!script) return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  if (scriptOnly) return NextResponse.json({ script });

  // Step 2: Convert to audio via ElevenLabs
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB";
  const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.65, similarity_boost: 0.78, style: 0.35 },
    }),
  });

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    console.error("ElevenLabs error:", errText);
    return NextResponse.json({ script, error: "Audio generation failed. Script is available." }, { status: 502 });
  }

  const audioBuffer = await ttsRes.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  return NextResponse.json({
    script,
    audio: base64Audio,
    contentType: "audio/mpeg",
  });
}
