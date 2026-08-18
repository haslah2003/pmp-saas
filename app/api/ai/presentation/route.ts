import { NextRequest, NextResponse } from 'next/server';
import { getAccess } from '@/lib/auth/access';
import { buildDeckSpec } from '@/lib/study-studio/presentation/deck-architect';
import { buildDeckPptx } from '@/lib/study-studio/presentation/deck-builder';
import { getDeckBranding } from '@/lib/study-studio/presentation/branding';
import { resolveDeckIllustrations } from '@/lib/study-studio/presentation/illustrations';
import {
  readDeckLocale,
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
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: 'AI is not configured.' }, { status: 503 });
      }
      const lockKey = userId || 'admin';
      if (activeArchitects.has(lockKey)) {
        return NextResponse.json({ error: 'A presentation outline is already being generated. Please wait for it to finish.' }, { status: 429 });
      }
      activeArchitects.add(lockKey);
      try {
        const spec = await buildDeckSpec({ topic, pathway, locale, slideCount });
        return NextResponse.json({ spec });
      } finally {
        activeArchitects.delete(lockKey);
      }
    }

    const spec = validateDeckSpec(body.spec);

    const [branding, illustrations] = await Promise.all([
      getDeckBranding(),
      resolveDeckIllustrations(spec),
    ]);
    const pptx = await buildDeckPptx(spec, branding, illustrations);

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
