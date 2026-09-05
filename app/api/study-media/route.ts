import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccess } from "@/lib/auth/access";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";

// Learner playback resolver for Study Studio media.
// Reads the (framework, topic, language) mapping and returns a playable URL:
//   * audio/video in private storage -> a reusable signed URL
// Premium-gated, mirroring the old live-audio feature.

// Supabase CDN caches each unique signed token independently. Reusing one URL
// for 24h lets subsequent learners hit the edge cache instead of forcing every
// play through the storage origin. Access to the URL remains Premium-gated here.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;
const SIGNED_URL_REFRESH_MARGIN_MS = 60 * 60 * 1000;

type CachedSignedUrl = { url: string; expiresAt: number };

async function getReusableSignedUrl(bucket: string, path: string, version: string) {
  const admin = createAdminClient();
  const cacheKey = `study-media-url:v1:${bucket}:${path}:${version}`;
  const { data: cached } = await admin
    .from("content_cache")
    .select("content")
    .eq("cache_key", cacheKey)
    .maybeSingle();

  if (cached?.content) {
    try {
      const parsed = JSON.parse(cached.content) as CachedSignedUrl;
      if (parsed.url && parsed.expiresAt > Date.now() + SIGNED_URL_REFRESH_MARGIN_MS) return parsed.url;
    } catch {
      // Replace malformed or expired cache data below.
    }
  }

  const { data: signed, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error || !signed?.signedUrl) throw error ?? new Error("Signed URL was not created");

  const value: CachedSignedUrl = {
    url: signed.signedUrl,
    expiresAt: Date.now() + SIGNED_URL_TTL_SECONDS * 1000,
  };
  const { error: cacheError } = await admin.from("content_cache").upsert(
    { cache_key: cacheKey, content: JSON.stringify(value), content_type: "study-media-url" },
    { onConflict: "cache_key" }
  );
  if (cacheError) console.error("[study-media] URL cache save error:", cacheError.message);
  return value.url;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const framework = normalizeExamPath(searchParams.get("framework") || undefined);
  const topicId = (searchParams.get("topicId") || "").trim();
  const language = searchParams.get("language") === "ar" ? "ar" : "en";

  if (!topicId) {
    return NextResponse.json({ error: "topicId is required" }, { status: 400 });
  }

  const access = await getAccess();
  if (!access.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!access.isPremium) {
    return NextResponse.json(
      { error: "Premium feature", message: "Study Studio media requires Premium.", upgrade: true },
      { status: 403 }
    );
  }

  const supabase = await createClient();
  const { data: availability, error: availabilityError } = await supabase
    .from("study_media_availability")
    .select("enabled")
    .eq("framework", framework)
    .maybeSingle();

  if (availabilityError) {
    console.error("[study-media] availability lookup error:", availabilityError.message);
    return NextResponse.json({ error: "Media availability check failed" }, { status: 503 });
  }
  if (!availability?.enabled) {
    return NextResponse.json({ found: false, enabled: false }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("topic_media")
    .select("media_type, storage_bucket, storage_path, public_url, poster_url, title, duration_seconds, updated_at")
    .eq("framework", framework)
    .eq("topic_id", topicId)
    .eq("language", language)
    .maybeSingle();

  if (error) {
    console.error("[study-media] lookup error:", error.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ found: false });
  }

  // public_url is retained only for backward compatibility with legacy rows.
  // All new Study Studio uploads use private storage.
  let url = data.public_url ?? null;

  // Private bucket: reuse a gated signed URL so Supabase CDN can cache
  // the object across plays instead of receiving a new token on every click.
  if (!url && data.storage_bucket && data.storage_path) {
    try {
      url = await getReusableSignedUrl(data.storage_bucket, data.storage_path, data.updated_at);
    } catch (signError) {
      console.error("[study-media] signed URL error:", signError);
      return NextResponse.json({ found: false, error: "Media temporarily unavailable" }, { status: 502 });
    }
  }

  if (!url) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json(
    {
      found: true,
      mediaType: data.media_type,
      url,
      posterUrl: data.poster_url ?? null,
      title: data.title ?? null,
      durationSeconds: data.duration_seconds ?? null,
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
