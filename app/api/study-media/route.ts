import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccess } from "@/lib/auth/access";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";

// Learner playback resolver for Study Studio media.
// Reads the (framework, topic, language) mapping and returns a playable URL:
//   * audio in the public `media` bucket -> its stored public URL
//   * video in the private `course-videos` bucket -> a short-lived signed URL
// Premium-gated, mirroring the old live-audio feature.

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 2; // 2h — comfortably longer than any clip

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
    .select("media_type, storage_bucket, storage_path, public_url, poster_url, title, duration_seconds")
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

  let url = data.public_url ?? null;

  // Private bucket (video): mint a signed URL via the authed server client,
  // matching the proven course_videos pattern.
  if (!url && data.storage_bucket && data.storage_path) {
    const { data: signed, error: signErr } = await supabase.storage
      .from(data.storage_bucket)
      .createSignedUrl(data.storage_path, SIGNED_URL_TTL_SECONDS);

    if (signErr) {
      console.error("[study-media] signed URL error:", signErr.message);
      return NextResponse.json({ found: false, error: "Media temporarily unavailable" }, { status: 502 });
    }
    url = signed?.signedUrl ?? null;
  }

  if (!url) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    mediaType: data.media_type,
    url,
    posterUrl: data.poster_url ?? null,
    title: data.title ?? null,
    durationSeconds: data.duration_seconds ?? null,
  });
}
