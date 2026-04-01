import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_AUDIO_SCRIPT } from "@/lib/constants";

const VOICES = [
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh",   gender: "male"   },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "female" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", gender: "male"   },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella",  gender: "female" },
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  const { data: sub } = await supabase
    .from("subscriptions").select("plan, status").eq("user_id", user.id).single();
  const isPremium = isAdmin || (sub && sub.plan !== "free" && sub.status === "active");
  if (!isPremium) {
    return NextResponse.json({ error: "Premium feature", message: "Audio narration requires Premium.", upgrade: true }, { status: 403 });
  }

  const { topic, scriptOnly } = await request.json();

  const cacheKey = `tts:${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const { data: cached } = await supabase
    .from("content_cache")
    .select("content")
    .eq("cache_key", cacheKey)
    .single();

  if (cached?.content) {
    try {
      const cachedData = JSON.parse(cached.content);
      console.log(`[TTS] Cache HIT: ${topic}`);
      return NextResponse.json(cachedData);
    } catch { /* regenerate */ }
  }
  console.log(`[TTS] Cache MISS: ${topic}`);

  const scriptRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, system: SYS_AUDIO_SCRIPT, messages: [{ role: "user", content: `Write a narration script for: "${topic}"` }] }),
  });
  const scriptData = await scriptRes.json();
  const script = scriptData.content?.[0]?.text || "";

  if (!script) return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  if (scriptOnly) return NextResponse.json({ script });

  const topicHash = topic.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const voice = VOICES[topicHash % VOICES.length];
  const voiceId = process.env.ELEVENLABS_VOICE_ID || voice.id;

  const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.55, similarity_boost: 0.80, style: 0.45, use_speaker_boost: true },
    }),
  });

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    console.error("ElevenLabs error:", errText);
    return NextResponse.json({ script, error: "Audio generation failed. Script is available." }, { status: 502 });
  }

  const audioBuffer = await ttsRes.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  const responseData = {
    script,
    audio: base64Audio,
    contentType: "audio/mpeg",
    narrator: { name: voice.name, gender: voice.gender },
  };

  try {
    await supabase
      .from("content_cache")
      .upsert({ cache_key: cacheKey, content: JSON.stringify(responseData), content_type: "tts" }, { onConflict: "cache_key" });
    console.log(`[TTS] Cached: ${topic}`);
  } catch { /* non-blocking */ }

  return NextResponse.json(responseData);
}
