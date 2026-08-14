// Client-side media compression for Study Studio uploads.
//
// Compression runs in the browser (ffmpeg.wasm) BEFORE upload, because Vercel API
// routes reject bodies > 4.5 MB — so large NotebookLM exports can never pass
// through a server route. The compressed Blob is then uploaded directly to
// Supabase Storage from the admin page.
//
// Uses the single-threaded ffmpeg core (no SharedArrayBuffer) so it needs no
// cross-origin-isolation headers and can't affect the rest of the app. The core
// is lazy-loaded from a CDN only when a file actually needs transcoding.

// Version-matched trio (ffmpeg 0.12.10 ↔ util 0.12.1 ↔ core 0.12.6).
const FFMPEG_CORE_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

// Already small + web-friendly => upload as-is (no needless re-encode / quality loss).
const VIDEO_PASSTHROUGH_BYTES = 40 * 1024 * 1024;
const AUDIO_PASSTHROUGH_BYTES = 20 * 1024 * 1024;
// Guard browser memory — ffmpeg.wasm holds input + output in RAM.
const MAX_INPUT_BYTES = 800 * 1024 * 1024;

export type CompressPhase = 'analyze' | 'load-engine' | 'transcode' | 'done';

export type CompressProgress = (info: { phase: CompressPhase; ratio: number }) => void;

export type CompressResult = {
  blob: Blob;
  ext: string;
  mediaType: 'audio' | 'video';
  contentType: string;
  durationSeconds: number | null;
  /** false when the original was already small enough and passed through untouched. */
  compressed: boolean;
};

function isVideoFile(file: File) {
  return file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);
}
function isAudioFile(file: File) {
  return file.type.startsWith('audio/') || /\.(mp3|m4a|aac|wav|ogg|opus|flac)$/i.test(file.name);
}

function readDuration(blob: Blob, kind: 'audio' | 'video'): Promise<number | null> {
  return new Promise((resolve) => {
    const el = document.createElement(kind === 'video' ? 'video' : 'audio');
    el.preload = 'metadata';
    const url = URL.createObjectURL(blob);
    const cleanup = () => URL.revokeObjectURL(url);
    el.onloadedmetadata = () => {
      const d = el.duration;
      cleanup();
      resolve(Number.isFinite(d) && d > 0 ? Math.round(d) : null);
    };
    el.onerror = () => {
      cleanup();
      resolve(null);
    };
    el.src = url;
  });
}

// ffmpeg.wasm engine — loaded once, reused across uploads.
let ffmpegPromise: Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null = null;
let activeProgress: CompressProgress | null = null;

async function getEngine() {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ff = new FFmpeg();
      ff.on('progress', ({ progress }: { progress: number }) => {
        activeProgress?.({ phase: 'transcode', ratio: Math.max(0, Math.min(1, progress)) });
      });
      await ff.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ff;
    })();
  }
  return ffmpegPromise;
}

/**
 * Compress an uploaded audio/video file to a Supabase-friendly size at high
 * (near-visually-lossless) quality. Video -> 720p H.264 MP4; audio -> AAC M4A.
 * Files already small + web-friendly are passed through untouched.
 */
export async function compressMedia(file: File, onProgress?: CompressProgress): Promise<CompressResult> {
  onProgress?.({ phase: 'analyze', ratio: 0 });

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      'This file is too large to process in the browser (max ~800 MB). Please export a smaller/shorter file from NotebookLM.'
    );
  }

  const video = isVideoFile(file);
  const audio = isAudioFile(file);
  if (!video && !audio) {
    throw new Error('Unsupported file type — upload an audio or video file.');
  }
  const mediaType: 'audio' | 'video' = video ? 'video' : 'audio';

  // Smart pass-through.
  const passthroughLimit = video ? VIDEO_PASSTHROUGH_BYTES : AUDIO_PASSTHROUGH_BYTES;
  const webFriendly = video
    ? /mp4|webm/i.test(file.type) || /\.(mp4|webm)$/i.test(file.name)
    : /mpeg|mp3|mp4|m4a|aac/i.test(file.type) || /\.(mp3|m4a|aac)$/i.test(file.name);
  if (file.size <= passthroughLimit && webFriendly) {
    const durationSeconds = await readDuration(file, mediaType);
    onProgress?.({ phase: 'done', ratio: 1 });
    return {
      blob: file,
      ext: (file.name.split('.').pop() || (video ? 'mp4' : 'm4a')).toLowerCase(),
      mediaType,
      contentType: file.type || (video ? 'video/mp4' : 'audio/mp4'),
      durationSeconds,
      compressed: false,
    };
  }

  onProgress?.({ phase: 'load-engine', ratio: 0 });
  const ff = await getEngine();
  const { fetchFile } = await import('@ffmpeg/util');

  activeProgress = onProgress ?? null;
  const inName = 'input';
  const outName = video ? 'out.mp4' : 'out.m4a';
  const ext = video ? 'mp4' : 'm4a';
  const contentType = video ? 'video/mp4' : 'audio/mp4';

  try {
    await ff.writeFile(inName, await fetchFile(file));

    const args = video
      ? [
          '-i', inName,
          // Cap height at 720p (keep aspect, even width) — plenty for slide content.
          '-vf', "scale='trunc(oh*a/2)*2':'min(720,ih)'",
          '-c:v', 'libx264', '-crf', '25', '-preset', 'medium', '-pix_fmt', 'yuv420p',
          '-c:a', 'aac', '-b:a', '128k',
          '-movflags', '+faststart',
          outName,
        ]
      : ['-i', inName, '-vn', '-c:a', 'aac', '-b:a', '128k', outName];

    await ff.exec(args);
    const data = await ff.readFile(outName);
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : (data as Uint8Array);
    // Copy into a fresh ArrayBuffer-backed array — ffmpeg's output may be
    // SharedArrayBuffer-backed, which isn't a valid BlobPart under strict TS.
    const buf = new Uint8Array(bytes.byteLength);
    buf.set(bytes);
    const blob = new Blob([buf.buffer], { type: contentType });

    const durationSeconds = await readDuration(blob, mediaType);
    onProgress?.({ phase: 'done', ratio: 1 });
    return { blob, ext, mediaType, contentType, durationSeconds, compressed: true };
  } finally {
    activeProgress = null;
    await ff.deleteFile(inName).catch(() => {});
    await ff.deleteFile(outName).catch(() => {});
  }
}
