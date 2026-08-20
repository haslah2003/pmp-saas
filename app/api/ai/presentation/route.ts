import { NextRequest, NextResponse } from 'next/server';
import { getAccess } from '@/lib/auth/access';
import { buildDeckSpec } from '@/lib/study-studio/presentation/deck-architect';
import { buildDeckPptx } from '@/lib/study-studio/presentation/deck-builder';
import { buildCleanTemplateDeck } from '@/lib/study-studio/presentation/deck-builder-clean';
import { buildMediumTemplateDeck } from '@/lib/study-studio/presentation/deck-builder-medium';
import { getDeckBranding } from '@/lib/study-studio/presentation/branding';
import { resolveDeckIllustrations } from '@/lib/study-studio/presentation/illustrations';
import {
  readDeckLocale,
  readDeckTemplate,
  readPathway,
  readSlideCount,
  readTopic,
  validateDeckSpec,
} from '@/lib/study-studio/presentation/validation';

// pptxgenjs builds a zip in memory; keep it on the Node runtime, not edge.
export const runtime = 'nodejs';
// Longer Arabic and high-slide-count specs can need more than two minutes,
// especially when the architect uses its one validation retry.
export const maxDuration = 300;

/**
 * Multi-agent presentation pipeline.
 *   Agent 1 (deck-architect): { pathway, topic } -> grounded DeckSpec
 *   Agent 2 (deck-builder):   DeckSpec + branding_config -> branded .pptx
 *
 * Admin-only: an admin picks a Pathway (PMBOK 7 / PMBOK 8 / Bridge) so the deck
 * draws from the same resource library as every other PMPeco tool.
 *
 * Body: { topic: string, pathway: 'pmbok7'|'pmbok8'|'bridge', locale?, mode?: 'spec'|'pptx' }
 *   mode 'spec' -> returns the DeckSpec JSON (preview / editing before rendering)
 *   mode 'pptx' -> returns the .pptx as a download (default)
 */
const activeArchitects = new Set<string>();

function streamJsonTask(task: () => Promise<unknown>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send headers and a harmless JSON whitespace heartbeat immediately, then
      // often enough to keep reverse proxies from treating long AI work as idle.
      controller.enqueue(encoder.encode('\n'));
      const heartbeat = setInterval(() => controller.enqueue(encoder.encode(' \n')), 15_000);

      void task()
        .then((payload) => controller.enqueue(encoder.encode(JSON.stringify(payload))))
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Deck generation failed.';
          controller.enqueue(encoder.encode(JSON.stringify({ error: message })));
        })
        .finally(() => {
          clearInterval(heartbeat);
          controller.close();
        });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      // Event-stream responses are forwarded incrementally by Cloudflare/Vercel
      // instead of being buffered until the AI task finishes. The payload remains
      // whitespace followed by one JSON object, which requestSpec parses as text.
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}

function safeFilePart(value: string, fallback: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || fallback;
}

export async function POST(request: NextRequest) {
  const { isAdmin, userId } = await getAccess();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid');
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const mode = body.mode;
    if (mode !== 'spec' && mode !== 'render') {
      return NextResponse.json({ error: 'Mode must be spec or render.' }, { status: 400 });
    }

    if (mode === 'spec') {
      const topic = readTopic(body.topic);
      const pathway = readPathway(body.pathway);
      const locale = readDeckLocale(body.locale);
      const slideCount = readSlideCount(body.slideCount);
      const templateId = readDeckTemplate(body.templateId);
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: 'AI is not configured.' }, { status: 503 });
      }
      const lockKey = userId || 'admin';
      if (activeArchitects.has(lockKey)) {
        return NextResponse.json({ error: 'A presentation outline is already being generated. Please wait for it to finish.' }, { status: 429 });
      }
      activeArchitects.add(lockKey);
      return streamJsonTask(async () => {
        try {
          const spec = await buildDeckSpec({ topic, pathway, locale, slideCount, templateId });
          return { spec };
        } finally {
          activeArchitects.delete(lockKey);
        }
      });
    }

    const spec = validateDeckSpec(body.spec);

    const branding = await getDeckBranding();
    const pptx = spec.meta.templateId === 'pmpeco-clean'
      ? await buildCleanTemplateDeck(spec)
      : spec.meta.templateId === 'pmpeco-medium'
        ? await buildMediumTemplateDeck(spec)
        : await buildDeckPptx(spec, branding, await resolveDeckIllustrations(spec));

    const fileName = `${safeFilePart(branding.siteName, 'PMPeco')}_${safeFilePart(spec.meta.topic, 'deck')}.pptx`;
    const encodedName = encodeURIComponent(fileName);

    return new NextResponse(new Uint8Array(pptx), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="presentation.pptx"; filename*=UTF-8''${encodedName}`,
        'X-Deck-Grounded': String(spec.meta.grounded),
        'X-Deck-Slides': String(spec.slides.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Deck generation failed.';
    const isValidation = /must|required|invalid|unsupported|missing|too long|does not match|contain|begin|evidence/i.test(message);
    return NextResponse.json({ error: message }, { status: isValidation ? 400 : 500 });
  }
}
