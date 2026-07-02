import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SYS_AUDIO_SCRIPT } from "@/lib/constants";

const VOICES = [
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", gender: "male" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "female" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", gender: "male" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "female" },
];

function safeKeyPart(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "audio-lesson";
}

function getLanguage(value: unknown) {
  return value === "ar" ? "ar" : "en";
}

function learnerFallback(status = 503) {
  return NextResponse.json(
    { error: "Audio is temporarily unavailable. Please continue with notes or flashcards." },
    { status }
  );
}

function getMaxTtsChars() {
  const raw = Number(process.env.TTS_MAX_CHARS || "900");
  if (!Number.isFinite(raw)) return 900;
  return Math.min(Math.max(Math.floor(raw), 450), 1600);
}

function limitTextForTts(text: string, maxChars: number) {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxChars) return clean;

  const slice = clean.slice(0, maxChars);
  const lastSentence = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
    slice.lastIndexOf("۔"),
    slice.lastIndexOf("؟")
  );

  if (lastSentence > Math.floor(maxChars * 0.65)) {
    return slice.slice(0, lastSentence + 1).trim();
  }

  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim()}...`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPremium = isAdmin || (sub && sub.plan !== "free" && sub.status === "active");

  if (!isPremium) {
    return NextResponse.json(
      {
        error: "Premium feature",
        message: "Audio narration requires Premium.",
        upgrade: true,
      },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));

  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const topicId = typeof body.topicId === "string" ? body.topicId.trim() : "";
  const language = getLanguage(body.language);
  const scriptOnly = Boolean(body.scriptOnly);

  if (!topic) {
    return NextResponse.json({ error: "Audio lesson topic is required." }, { status: 400 });
  }

  const stableTopicKey = safeKeyPart(topicId || topic);
  const cacheKey = `tts:v1:pmbok7-eco2021:${language}:${stableTopicKey}`;
  const legacyCacheKey = `tts:${topic.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  async function readCachedAudio(key: string) {
    const { data } = await supabase
      .from("content_cache")
      .select("content")
      .eq("cache_key", key)
      .maybeSingle();

    if (!data?.content) return null;

    try {
      return JSON.parse(data.content);
    } catch {
      return null;
    }
  }

  const cached = await readCachedAudio(cacheKey);

  if (cached) {
    console.log(`[TTS] Cache HIT: ${cacheKey}`);
    return NextResponse.json(cached);
  }

  const legacyCached = legacyCacheKey !== cacheKey ? await readCachedAudio(legacyCacheKey) : null;

  if (legacyCached) {
    console.log(`[TTS] Legacy cache HIT: ${legacyCacheKey}`);

    try {
      await supabase.from("content_cache").upsert(
        {
          cache_key: cacheKey,
          content: JSON.stringify(legacyCached),
          content_type: "tts",
        },
        { onConflict: "cache_key" }
      );

      console.log(`[TTS] Migrated legacy cache to: ${cacheKey}`);
    } catch {
      // Non-blocking migration.
    }

    return NextResponse.json(legacyCached);
  }

  console.log(`[TTS] Cache MISS: ${cacheKey}`);

  if (!isAdmin) {
    console.warn(`[TTS] Blocked learner live generation on cache miss: ${cacheKey}`);
    return learnerFallback(503);
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

  if (!anthropicKey || !elevenLabsKey) {
    console.error("[TTS] Missing provider API configuration.");
    return learnerFallback(503);
  }

  const maxTtsChars = getMaxTtsChars();

  const userPrompt =
    language === "ar"
      ? `اكتب نص سرد صوتي احترافي ومختصر باللغة العربية لدرس PMP التالي: "${topic}". اجعل النص عمليًا، واضحًا، ومناسبًا لمرشحي اختبار PMP الحالي وفق PMBOK 7 و ECO 2021. يجب ألا يتجاوز النص ${maxTtsChars} حرفًا.`
      : `Write a concise professional English PMP audio narration script for this lesson: "${topic}". Make it practical, clear, and aligned with current PMP exam preparation using PMBOK 7 and ECO 2021. Keep the script under ${maxTtsChars} characters.`;

  const scriptRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
      max_tokens: 2000,
      system: SYS_AUDIO_SCRIPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const scriptData = await scriptRes.json();

  if (!scriptRes.ok) {
    console.error("[TTS] Script generation API error:", JSON.stringify(scriptData).slice(0, 1000));
    return learnerFallback(502);
  }

  const script =
    scriptData.content
      ?.map((block: { text?: string }) => block?.text || "")
      .join("\n\n")
      .trim() || "";

  if (!script) {
    console.error("[TTS] Empty narration script response:", JSON.stringify(scriptData).slice(0, 1000));
    return learnerFallback(502);
  }

  const ttsText = limitTextForTts(script, maxTtsChars);

  if (ttsText.length < script.length) {
    console.log(`[TTS] Script shortened from ${script.length} to ${ttsText.length} characters.`);
  }

  if (scriptOnly) {
    return NextResponse.json({ script: ttsText });
  }

  const topicHash = topic.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const voice = VOICES[topicHash % VOICES.length];
  const voiceId = process.env.ELEVENLABS_VOICE_ID || voice.id;

  const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": elevenLabsKey,
    },
    body: JSON.stringify({
      text: ttsText,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.45,
        use_speaker_boost: true,
      },
    }),
  });

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    console.error("[TTS] Audio generation provider error:", errText);

    return NextResponse.json(
      { script: ttsText, error: "Audio is temporarily unavailable. The narration script is available." },
      { status: 502 }
    );
  }

  const audioBuffer = await ttsRes.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  const responseData = {
    script: ttsText,
    audio: base64Audio,
    contentType: "audio/mpeg",
    narrator: { name: voice.name, gender: voice.gender },
    track: "pmbok7-eco2021",
    language,
    topicId: stableTopicKey,
  };

  try {
    await supabase.from("content_cache").upsert(
      {
        cache_key: cacheKey,
        content: JSON.stringify(responseData),
        content_type: "tts",
      },
      { onConflict: "cache_key" }
    );

    console.log(`[TTS] Cached: ${cacheKey}`);
  } catch (error) {
    console.error("[TTS] Cache save failed:", error);
  }

  return NextResponse.json(responseData);
}
