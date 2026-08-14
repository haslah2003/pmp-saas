"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AUDIO_TOPICS_BY_FRAMEWORK,
  getAudioDomainLabel,
  FRAMEWORK_LABELS,
} from "@/lib/study-studio/audio-topics";
import { compressMedia, type CompressPhase } from "@/lib/study-studio/media-compress";

type Row = {
  framework: string;
  topic_id: string;
  language: string;
  media_type: "audio" | "video";
  storage_bucket: string;
  storage_path: string;
  public_url: string | null;
  duration_seconds: number | null;
  title: string | null;
};

const FRAMEWORKS = ["pmbok8", "bridge", "pmbok7"] as const;
const LANGS = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
] as const;

const TEAL = "#1AB0A2";
const PURPLE = "#5B2D91";

const PHASE_LABEL: Record<CompressPhase | "upload", string> = {
  analyze: "Analyzing file…",
  "load-engine": "Loading compressor…",
  transcode: "Compressing…",
  done: "Finalizing…",
  upload: "Uploading to Supabase…",
};

function slotKey(topicId: string, lang: string) {
  return `${topicId}:${lang}`;
}
function fmtDuration(s: number | null) {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

export default function StudyMediaAdminPage() {
  const supabase = createClient();
  const [framework, setFramework] = useState<string>("pmbok8");
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ phase: CompressPhase | "upload"; ratio: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef<{ topicId: string; lang: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const topics = AUDIO_TOPICS_BY_FRAMEWORK[framework] ?? [];
  const fwLabel = FRAMEWORK_LABELS[framework]?.en ?? framework;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("topic_media").select("*").eq("framework", framework);
      if (cancelled) return;
      const map: Record<string, Row> = {};
      (data as Row[] | null)?.forEach((r) => {
        map[slotKey(r.topic_id, r.language)] = r;
      });
      setRows(map);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [framework, supabase]);

  async function reload() {
    const { data } = await supabase.from("topic_media").select("*").eq("framework", framework);
    const map: Record<string, Row> = {};
    (data as Row[] | null)?.forEach((r) => {
      map[slotKey(r.topic_id, r.language)] = r;
    });
    setRows(map);
  }

  function pickFile(topicId: string, lang: string) {
    setError(null);
    pendingRef.current = { topicId, lang };
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const pending = pendingRef.current;
    if (!file || !pending) return;
    const { topicId, lang } = pending;
    const key = slotKey(topicId, lang);

    setBusyKey(key);
    setError(null);
    setProgress({ phase: "analyze", ratio: 0 });

    try {
      const result = await compressMedia(file, (p) => setProgress(p));
      const bucket = result.mediaType === "video" ? "course-videos" : "media";
      const path = `study-media/${framework}/${topicId}/${lang}.${result.ext}`;

      setProgress({ phase: "upload", ratio: 0 });
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, result.blob, { upsert: true, contentType: result.contentType });
      if (upErr) throw new Error(`Upload failed — ${upErr.message}`);

      const public_url =
        result.mediaType === "audio" ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl : null;

      const { error: dbErr } = await supabase.from("topic_media").upsert(
        {
          framework,
          topic_id: topicId,
          language: lang,
          media_type: result.mediaType,
          storage_bucket: bucket,
          storage_path: path,
          public_url,
          duration_seconds: result.durationSeconds,
          title: file.name,
        },
        { onConflict: "framework,topic_id,language" }
      );
      if (dbErr) throw new Error(`Save failed — ${dbErr.message}`);

      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyKey(null);
      setProgress(null);
      pendingRef.current = null;
    }
  }

  async function clearSlot(row: Row) {
    if (!window.confirm("Remove this media mapping? The uploaded file will be deleted.")) return;
    await supabase.storage.from(row.storage_bucket).remove([row.storage_path]).catch(() => {});
    await supabase
      .from("topic_media")
      .delete()
      .eq("framework", row.framework)
      .eq("topic_id", row.topic_id)
      .eq("language", row.language);
    await reload();
  }

  async function preview(row: Row) {
    if (row.public_url) {
      window.open(row.public_url, "_blank");
      return;
    }
    const res = await fetch(
      `/api/study-media?framework=${row.framework}&topicId=${row.topic_id}&language=${row.language}`
    );
    const data = await res.json();
    if (data?.url) window.open(data.url, "_blank");
    else setError("Could not load a preview URL");
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileRef}
        type="file"
        accept="audio/*,video/*"
        onChange={onFileChosen}
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Study Studio Media</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Upload pre-produced audio &amp; video (e.g. from NotebookLM) and map each file to a topic. Files
          are compressed in your browser before upload — video to 720p H.264 (~40&nbsp;MB), audio to AAC —
          then stored in Supabase. Learners stream the mapped file; nothing is generated live.
        </p>
      </div>

      {/* Framework tabs */}
      <div className="flex gap-2 flex-wrap">
        {FRAMEWORKS.map((fw) => {
          const active = framework === fw;
          return (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                active ? "text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={active ? { background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})` } : {}}
            >
              {FRAMEWORK_LABELS[fw]?.en ?? fw}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Topics */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading mappings…</div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${TEAL}18` }}
                >
                  {topic.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    <span className="text-gray-400 font-mono mr-1.5">{topic.id}.</span>
                    {topic.title_en}
                  </p>
                  <p className="text-xs text-gray-400 truncate" dir="rtl">
                    {topic.title_ar}
                  </p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {getAudioDomainLabel(topic.domain, false)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LANGS.map((lang) => {
                  const key = slotKey(topic.id, lang.code);
                  const row = rows[key];
                  const busy = busyKey === key;
                  return (
                    <div
                      key={lang.code}
                      className="rounded-xl border border-gray-200 p-3"
                      style={row ? { borderColor: `${PURPLE}40`, background: `${PURPLE}08` } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">{lang.label}</span>
                        {row && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ background: row.media_type === "video" ? PURPLE : TEAL }}
                          >
                            {row.media_type === "video" ? "🎬 Video" : "🎧 Audio"}
                            {row.duration_seconds ? ` · ${fmtDuration(row.duration_seconds)}` : ""}
                          </span>
                        )}
                      </div>

                      {busy ? (
                        <div className="py-2">
                          <p className="text-xs text-gray-600 mb-1.5">
                            {progress ? PHASE_LABEL[progress.phase] : "Working…"}
                          </p>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width:
                                  progress && progress.phase === "transcode"
                                    ? `${Math.round(progress.ratio * 100)}%`
                                    : "40%",
                                background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})`,
                              }}
                            />
                          </div>
                        </div>
                      ) : row ? (
                        <div>
                          <p className="text-xs text-gray-500 truncate mb-2" title={row.title ?? row.storage_path}>
                            {row.title ?? row.storage_path.split("/").pop()}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => preview(row)}
                              className="flex-1 text-[11px] py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                            >
                              ▶ Preview
                            </button>
                            <button
                              onClick={() => pickFile(topic.id, lang.code)}
                              className="flex-1 text-[11px] py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                            >
                              ↻ Replace
                            </button>
                            <button
                              onClick={() => clearSlot(row)}
                              className="text-[11px] py-1.5 px-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 font-medium"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => pickFile(topic.id, lang.code)}
                          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-4 text-center hover:border-gray-300 hover:bg-gray-50 transition"
                        >
                          <div className="text-xl mb-0.5">📤</div>
                          <p className="text-[11px] font-medium text-gray-500">Upload audio / video</p>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Mapping <span className="font-semibold">{fwLabel}</span> · videos → private{" "}
        <code className="font-mono">course-videos</code> (signed URLs) · audio → public{" "}
        <code className="font-mono">media</code>. Large in-browser compression may take a few minutes;
        keep this tab open.
      </p>
    </div>
  );
}
