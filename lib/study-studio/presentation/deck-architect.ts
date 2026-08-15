import 'server-only';
import { SYS_DECK_ARCHITECT } from '@/lib/constants';
import {
  retrieveResourceEvidence,
  formatResourceEvidenceForPrompt,
} from '@/lib/rag/resource-retrieval';
import { EXAM_PATHS, normalizeExamPath } from '@/lib/pmp/exam-paths';
import type { ExamPathId, AppLocale } from '@/lib/pmp/exam-paths';
import type { DeckSpec, DeckSlide, DeckCitation } from './types';

/**
 * Agent 1 — Deck Architect.
 * Turns { pathway, topic } into a grounded, cited DeckSpec by retrieving evidence
 * from the PMPeco resource library (the same RAG the tutor uses) and asking Claude
 * to lay it out as a structured spec. No content is invented outside the library.
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function stripJsonFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/** Concise canonical framing so the model always has the pathway's identity, even with thin evidence. */
function canonicalPathwayFacts(pathway: ExamPathId, locale: AppLocale): string {
  const copy = EXAM_PATHS[pathway].copy[locale];
  return [
    'CANONICAL PATHWAY FACTS:',
    `Pathway: ${copy.label} (${copy.shortLabel}).`,
    copy.description,
    pathway === 'bridge'
      ? 'This is a comparison pathway: make differences between PMBOK 7/ECO 2021 and PMBOK 8/ECO 2026 explicit.'
      : `Cite only ${copy.shortLabel}. Do not reference the other edition unless the evidence does.`,
  ].join('\n');
}

export interface DeckArchitectInput {
  topic: string;
  pathway: ExamPathId | string;
  locale?: AppLocale;
}

export async function buildDeckSpec(input: DeckArchitectInput): Promise<DeckSpec> {
  const pathway = normalizeExamPath(input.pathway);
  const locale: AppLocale = input.locale || 'en';
  const topic = input.topic.trim();

  const evidence = await retrieveResourceEvidence({ framework: pathway, query: topic, limit: 6 });
  const evidenceBlock = formatResourceEvidenceForPrompt(evidence);

  const userMessage = [
    canonicalPathwayFacts(pathway, locale),
    '',
    evidenceBlock,
    '',
    `TOPIC: "${topic}"`,
    `LOCALE: ${locale}`,
    'Design the deck spec now. Return ONLY the JSON object.',
  ].join('\n');

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: SYS_DECK_ARCHITECT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  // Read the body once as text so we can surface the real cause on any failure.
  const rawBody = await res.text();
  let data: any = {};
  try {
    data = JSON.parse(rawBody);
  } catch {
    /* non-JSON error body (gateway/HTML) — keep rawBody for the message */
  }

  if (!res.ok) {
    console.error('[deck-architect] anthropic error', res.status, rawBody.slice(0, 1000));
    const detail = data?.error?.message || rawBody.slice(0, 200) || 'no body';
    throw new Error(`Model call failed (${res.status}) for "${model}": ${detail}`);
  }

  // Pick the first text block (robust to non-text blocks like thinking/tool_use).
  const raw: string | undefined =
    (Array.isArray(data?.content)
      ? data.content.find((b: any) => b?.type === 'text')?.text
      : undefined) ?? data?.content?.[0]?.text;

  if (!raw) {
    console.error('[deck-architect] no text block', JSON.stringify(data).slice(0, 1000));
    throw new Error(
      `Deck architect returned no content (model="${model}", stop_reason=${data?.stop_reason ?? 'n/a'}, blocks=${
        Array.isArray(data?.content) ? data.content.map((b: any) => b?.type).join(',') || 'empty' : 'none'
      }).`
    );
  }

  let parsed: { title: string; subtitle: string; slides: DeckSlide[]; citations?: DeckCitation[] };
  try {
    parsed = JSON.parse(stripJsonFences(raw));
  } catch {
    throw new Error('Deck architect returned invalid JSON.');
  }

  if (!Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    throw new Error('Deck architect returned no slides.');
  }

  return {
    meta: {
      topic,
      pathway,
      locale,
      pathwayLabel: EXAM_PATHS[pathway].copy[locale].shortLabel,
      generatedAt: new Date().toISOString(),
      grounded: evidence.length > 0,
    },
    title: parsed.title,
    subtitle: parsed.subtitle,
    slides: parsed.slides,
    citations: parsed.citations || [],
  };
}
