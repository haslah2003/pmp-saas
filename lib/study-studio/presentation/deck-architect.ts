import 'server-only';
import { SYS_DECK_ARCHITECT } from '@/lib/constants';
import {
  retrieveResourceEvidence,
  formatResourceEvidenceForPrompt,
} from '@/lib/rag/resource-retrieval';
import { EXAM_PATHS } from '@/lib/pmp/exam-paths';
import type { ExamPathId, AppLocale } from '@/lib/pmp/exam-paths';
import type { DeckSpec, DeckTemplateId } from './types';
import { validateDeckSpec } from './validation';

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

/**
 * Extract the JSON object from a model reply that may be wrapped in prose or
 * fences. Falls back to the fence-stripped text if no braces are found.
 */
function extractJsonObject(text: string): string {
  const stripped = stripJsonFences(text);
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return stripped.slice(start, end + 1);
  }
  return stripped;
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
  pathway: ExamPathId;
  locale: AppLocale;
  slideCount: number;
  templateId: DeckTemplateId;
}

export async function buildDeckSpec(input: DeckArchitectInput): Promise<DeckSpec> {
  const pathway = input.pathway;
  const locale = input.locale;
  const topic = input.topic.trim();

  const evidenceLimit = Math.min(12, Math.max(6, Math.ceil(input.slideCount / 2)));
  const evidence = await retrieveResourceEvidence({ framework: pathway, query: topic, limit: evidenceLimit });
  if (!evidence.length) {
    throw new Error('The resource library does not contain enough evidence for this topic. Add or activate relevant resources before generating the deck.');
  }
  const evidenceBlock = formatResourceEvidenceForPrompt(evidence);

  const userMessage = [
    canonicalPathwayFacts(pathway, locale),
    '',
    evidenceBlock,
    '',
    `TOPIC: "${topic}"`,
    `LOCALE: ${locale}`,
    `REQUESTED SLIDE COUNT: ${input.slideCount}`,
    'Design the deck spec now. Return ONLY the JSON object.',
  ].join('\n');

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
  const citations = evidence.map((chunk, index) => ({
    ref: index + 1,
    source_title: chunk.source_title,
    chunk_title: chunk.chunk_title,
    framework: chunk.framework,
  }));
  const maxTokens = Math.min(24_000, Math.max(6_000, input.slideCount * 850));
  let retryReason = '';

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const correctivePrompt = retryReason
      ? `\n\nCORRECTION REQUIRED: The previous response failed because: ${retryReason}. Return a complete, valid JSON object with exactly ${input.slideCount} slides.`
      : '';
    let res: Response;
    try {
      res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: SYS_DECK_ARCHITECT,
          messages: [{ role: 'user', content: userMessage + correctivePrompt }],
        }),
        signal: AbortSignal.timeout(110_000),
      });
    } catch (error) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new Error(`Deck architect timed out after 110 seconds on attempt ${attempt}. Please try again.`);
      }
      throw error;
    }

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

    const raw: string | undefined =
      (Array.isArray(data?.content)
        ? data.content.find((b: any) => b?.type === 'text')?.text
        : undefined) ?? data?.content?.[0]?.text;

    try {
      if (!raw) {
        throw new Error(
          `Deck architect returned no content (stop_reason=${data?.stop_reason ?? 'n/a'}).`
        );
      }
      const parsed = JSON.parse(extractJsonObject(raw));
      const candidate = {
        ...(typeof parsed === 'object' && parsed !== null ? parsed : {}),
        meta: {
          topic,
          pathway,
          locale,
          pathwayLabel: EXAM_PATHS[pathway].copy[locale].shortLabel,
          generatedAt: new Date().toISOString(),
          requestedSlideCount: input.slideCount,
          templateId: input.templateId,
          grounded: false,
        },
        citations,
      };
      const validated = validateDeckSpec(candidate, input.slideCount);
      const usedRefs = new Set(validated.slides.flatMap((slide) => slide.citationRefs));
      validated.citations = validated.citations.filter((citation) => usedRefs.has(citation.ref));
      return validated;
    } catch (error) {
      const truncated = data?.stop_reason === 'max_tokens';
      retryReason = truncated
        ? `output was truncated at ${maxTokens} tokens`
        : error instanceof Error ? error.message : 'invalid deck JSON';
      console.error(
        `[deck-architect] attempt ${attempt} rejected (model="${model}", stop_reason=${data?.stop_reason ?? 'n/a'}, len=${raw?.length ?? 0}): ${retryReason}`,
        raw?.slice(0, 2000) ?? ''
      );
      if (attempt === 2) {
        throw new Error(`Deck architect failed validation after one retry: ${retryReason}`);
      }
    }
  }

  throw new Error('Deck architect failed unexpectedly.');
}
