import { NextRequest, NextResponse } from 'next/server';
import { getAccess } from '@/lib/auth/access';
import { buildDeckSpec } from '@/lib/study-studio/presentation/deck-architect';
import { buildDeckPptx } from '@/lib/study-studio/presentation/deck-builder';
import { getDeckBranding } from '@/lib/study-studio/presentation/branding';
import { normalizeExamPath } from '@/lib/pmp/exam-paths';
import type { AppLocale } from '@/lib/pmp/exam-paths';

// pptxgenjs builds a zip in memory; keep it on the Node runtime, not edge.
export const runtime = 'nodejs';
export const maxDuration = 120;

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
export async function POST(request: NextRequest) {
  const { isAdmin } = await getAccess();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  let body: { topic?: string; pathway?: string; locale?: string; mode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const topic = (body.topic || '').trim();
  if (!topic) {
    return NextResponse.json({ error: 'A topic is required.' }, { status: 400 });
  }
  const pathway = normalizeExamPath(body.pathway);
  const locale = (body.locale as AppLocale) || 'en';
  const mode = body.mode === 'spec' ? 'spec' : 'pptx';

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI is not configured.' }, { status: 503 });
  }

  try {
    const spec = await buildDeckSpec({ topic, pathway, locale });

    if (mode === 'spec') {
      return NextResponse.json({ spec });
    }

    const branding = await getDeckBranding();
    const pptx = await buildDeckPptx(spec, branding);

    const safeName = topic.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'deck';
    const fileName = `${branding.siteName}_${safeName}.pptx`;

    return new NextResponse(new Uint8Array(pptx), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Deck-Grounded': String(spec.meta.grounded),
        'X-Deck-Slides': String(spec.slides.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Deck generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
