import { createClient } from "@/lib/supabase/server";
import { getAccess } from "@/lib/auth/access";
import { NextRequest, NextResponse } from "next/server";
import { buildAudioScript } from "@/lib/constants";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";

// Audio generation (Anthropic script + ElevenLabs TTS + cache write) can take 20-40s.
// Without a raised maxDuration the function hits Vercel's short default timeout and the
// client sees "Network error". 120s returns as soon as generation completes.
export const maxDuration = 120;

const VOICES = [
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", gender: "male" as const },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "female" as const },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", gender: "male" as const },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "female" as const },
];

// Gender per known voice id, including the production ELEVENLABS_VOICE_ID override.
const VOICE_GENDER: Record<string, "male" | "female"> = {
  TxGEqnHWrfWFTfGW9XjX: "male", // Josh
  "21m00Tcm4TlvDq8ikWAM": "female", // Rachel
  ErXwobaYiN019PkySvjV: "male", // Antoni
  EXAVITQu4vr4xnSDxMaL: "female", // Bella
  pNInz6obpgDQGcFmaJgB: "male", // Adam (default ELEVENLABS_VOICE_ID in production)
};

// Persona intros, grouped by gender so the narrator persona ALWAYS matches the voice.
const PERSONAS: Record<"male" | "female", string[]> = {
  female: [
    "Hi, I am Sarah Mitchell, a senior program manager with 15 years leading global teams",
    "Hey there, I am Amira Hassan, an enterprise PMO director focused on performance analytics",
  ],
  male: [
    "Hello, I am David Chen, a PMP-certified portfolio manager specializing in delivery frameworks",
    "Welcome, I am James Rodriguez, a chief project officer and your PMP prep coach",
  ],
};

function frameworkTagOf(framework: string): string {
  return framework === "pmbok8" ? "pmbok8-eco2026" : framework === "bridge" ? "bridge-7to8" : "pmbok7-eco2021";
}

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

  const { isPremium, isAdmin } = await getAccess();

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
  const framework = normalizeExamPath(body.framework);
  const frameworkTag = frameworkTagOf(framework);

  if (!topic) {
    return NextResponse.json({ error: "Audio lesson topic is required." }, { status: 400 });
  }

  const stableTopicKey = safeKeyPart(topicId || topic);
  // pmbok7 tag = "pmbok7-eco2021", so pmbok7 keys stay byte-identical to the existing
  // cache (no regression); pmbok8/bridge get their own keys (admin pre-generates them).
  const cacheKey = `tts:v1:${frameworkTag}:${language}:${stableTopicKey}`;
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

  // Legacy audio predates the framework split and is all PMBOK 7 — only reuse it for pmbok7.
  const legacyCached =
    framework === "pmbok7" && legacyCacheKey !== cacheKey ? await readCachedAudio(legacyCacheKey) : null;

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

  // Resolve voice first, then pick a persona whose gender matches the voice —
  // guarantees the narrator persona (e.g. "Sarah Mitchell") is never voiced by the
  // opposite gender. Respects the ELEVENLABS_VOICE_ID production override.
  const topicHash = topic.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const rotationVoice = VOICES[topicHash % VOICES.length];
  const voiceId = process.env.ELEVENLABS_VOICE_ID || rotationVoice.id;
  const voiceGender = VOICE_GENDER[voiceId] ?? rotationVoice.gender;
  const personaPool = PERSONAS[voiceGender];
  const personaIntro = personaPool[topicHash % personaPool.length];
  const personaName = personaIntro.match(/I am ([^,]+),/)?.[1]?.trim() || "your PMP coach";

  const fwLabelEn =
    framework === "pmbok8"
      ? "PMBOK 8 and ECO 2026"
      : framework === "bridge"
        ? "the shift from PMBOK 7 / ECO 2021 to PMBOK 8 / ECO 2026"
        : "PMBOK 7 and ECO 2021";
  const fwLabelAr =
    framework === "pmbok8"
      ? "دليل PMBOK 8 و ECO 2026"
      : framework === "bridge"
        ? "الانتقال من PMBOK 7 / ECO 2021 إلى PMBOK 8 / ECO 2026"
        : "PMBOK 7 و ECO 2021";

  const userPrompt =
    language === "ar"
      ? `اكتب نص سرد صوتي احترافي ومختصر باللغة العربية لدرس PMP التالي: "${topic}". اجعل النص عمليًا، واضحًا، ومناسبًا لمرشحي اختبار PMP وفق ${fwLabelAr}. يجب ألا يتجاوز النص ${maxTtsChars} حرفًا.`
      : `Write a concise professional English PMP audio narration script for this lesson: "${topic}". Make it practical, clear, and aligned with PMP exam preparation using ${fwLabelEn}. Keep the script under ${maxTtsChars} characters.`;

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
      system: buildAudioScript({ framework, personaIntro }),
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
    narrator: { name: personaName, gender: voiceGender },
    track: frameworkTag,
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
