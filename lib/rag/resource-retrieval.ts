import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import type { ExamPathId } from '@/lib/pmp/exam-paths';

export type RetrievedResourceChunk = {
  id: string;
  resource_id: string | null;
  framework: string;
  source_title: string;
  source_type: string;
  language: string;
  chunk_title: string;
  chunk_text: string;
  topic_tags: string[];
  priority: number;
  score: number;
};

type ResourceRecord = {
  id: string;
  title: string;
  framework: string | null;
  tier: number | null;
  is_active: boolean | null;
};

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) return null;

  return createSupabaseAdminClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function resourceFrameworksForRoute(framework: ExamPathId) {
  if (framework === 'bridge') return ['pmbok7', 'pmbok8', 'both'];
  return [framework, 'both'];
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[^\p{L}\p{N}\s%]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  const normalized = normalizeText(value);

  const synonymBoosts: Record<string, string[]> = {
    'pmbok8': ['pmbok', '8', 'eighth', 'principles', 'domains', 'governance', 'scope', 'schedule', 'finance', 'resources', 'risk'],
    'pmbok 8': ['pmbok', '8', 'eighth', 'principles', 'domains', 'governance', 'scope', 'schedule', 'finance', 'resources', 'risk'],
    'eco2026': ['eco', '2026', 'people', 'process', 'business', 'environment', '33', '41', '26'],
    'eco 2026': ['eco', '2026', 'people', 'process', 'business', 'environment', '33', '41', '26'],
    'pmbok7': ['pmbok', '7', 'seventh', 'stakeholders', 'team', 'delivery', 'measurement', 'uncertainty'],
    'pmbok 7': ['pmbok', '7', 'seventh', 'stakeholders', 'team', 'delivery', 'measurement', 'uncertainty'],
    'الأفراد': ['people', 'stakeholders', 'resources', 'leadership', 'team', 'communication'],
    'العمليات': ['process', 'planning', 'delivery', 'scope', 'schedule', 'quality', 'risk'],
    'بيئة الأعمال': ['business', 'environment', 'governance', 'compliance', 'change', 'value'],
    'مبادئ': ['principles'],
    'مجالات': ['domains', 'performance', 'focus'],
  };

  const baseTokens = normalized
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  const extraTokens: string[] = [];

  for (const [key, synonyms] of Object.entries(synonymBoosts)) {
    if (normalized.includes(normalizeText(key))) {
      extraTokens.push(...synonyms);
    }
  }

  return Array.from(new Set([...baseTokens, ...extraTokens]));
}

function scoreChunk(chunk: Omit<RetrievedResourceChunk, 'score'>, query: string) {
  const queryTokens = tokenize(query);
  const haystack = normalizeText(
    [
      chunk.source_title,
      chunk.chunk_title,
      chunk.chunk_text,
      ...(chunk.topic_tags || []),
    ].join(' ')
  );

  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 4;
  }

  for (const tag of chunk.topic_tags || []) {
    const normalizedTag = normalizeText(tag);
    if (queryTokens.some((token) => normalizedTag.includes(token) || token.includes(normalizedTag))) {
      score += 8;
    }
  }

  if (haystack.includes(normalizeText(query))) score += 15;

  score += Math.max(0, 100 - (chunk.priority || 100)) / 10;

  return score;
}

export async function retrieveResourceEvidence({
  framework,
  query,
  limit = 5,
}: {
  framework: ExamPathId;
  query: string;
  limit?: number;
}): Promise<RetrievedResourceChunk[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase || !query.trim()) return [];

  try {
    const allowedFrameworks = resourceFrameworksForRoute(framework);

    const { data: resources, error: resourcesError } = await supabase
      .from('resource_library')
      .select('id,title,framework,tier,is_active')
      .eq('is_active', true)
      .in('framework', allowedFrameworks)
      .order('tier', { ascending: true });

    if (resourcesError || !resources?.length) return [];

    const activeResourceIds = (resources as ResourceRecord[]).map((resource) => resource.id);

    const { data: chunks, error: chunksError } = await supabase
      .from('resource_chunks')
      .select('id,resource_id,framework,source_title,source_type,language,chunk_title,chunk_text,topic_tags,priority,is_active')
      .eq('is_active', true)
      .in('resource_id', activeResourceIds)
      .limit(120);

    if (chunksError || !chunks?.length) return [];

    return chunks
      .map((chunk: any) => ({
        id: chunk.id,
        resource_id: chunk.resource_id,
        framework: chunk.framework,
        source_title: chunk.source_title,
        source_type: chunk.source_type,
        language: chunk.language,
        chunk_title: chunk.chunk_title,
        chunk_text: chunk.chunk_text,
        topic_tags: chunk.topic_tags || [],
        priority: chunk.priority || 100,
        score: scoreChunk(chunk, query),
      }))
      .filter((chunk) => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function formatResourceEvidenceForPrompt(chunks: RetrievedResourceChunk[]) {
  if (!chunks.length) {
    return [
      'RESOURCE RETRIEVAL EVIDENCE:',
      'No matching official resource chunks were retrieved for this question.',
      'Use only the canonical route facts already provided. If the learner asks for detailed source-specific information, state that the platform knowledge library does not yet contain enough extracted evidence for that detail.',
    ].join('\n');
  }

  const evidence = chunks.map((chunk, index) => {
    return [
      `[${index + 1}] ${chunk.source_title} — ${chunk.chunk_title}`,
      `Framework: ${chunk.framework}`,
      `Tags: ${(chunk.topic_tags || []).join(', ')}`,
      `Evidence: ${chunk.chunk_text}`,
    ].join('\n');
  });

  return [
    'RESOURCE RETRIEVAL EVIDENCE:',
    'Use the following retrieved official resource chunks as the primary evidence for this answer.',
    'Do not go beyond these chunks for detailed claims unless the canonical route facts explicitly support the point.',
    '',
    ...evidence,
  ].join('\n\n');
}
