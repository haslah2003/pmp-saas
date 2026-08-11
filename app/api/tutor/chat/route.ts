import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { normalizeExamPath, type ExamPathId } from '@/lib/pmp/exam-paths';
import { formatResourceEvidenceForPrompt, retrieveResourceEvidence, type RetrievedResourceChunk } from '@/lib/rag/resource-retrieval';
import { getAccess } from '@/lib/auth/access';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type ResourceRecord = {
  id: string;
  title: string;
  description: string | null;
  framework: string | null;
  tier: number | null;
  type: string | null;
  file_path: string | null;
  is_active: boolean | null;
};

type SourceGate = {
  status: 'passed' | 'failed' | 'unavailable';
  activeTitles: string[];
  missing: string[];
  note: string;
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

async function loadActiveResourceLibrary(): Promise<ResourceRecord[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('resource_library')
    .select('id,title,description,framework,tier,type,file_path,is_active')
    .eq('is_active', true)
    .order('tier', { ascending: true })
    .order('framework', { ascending: true });

  if (error) return [];

  return (data || []) as ResourceRecord[];
}

function textIncludesAny(value: string | null | undefined, terms: string[]) {
  const normalized = (value || '').toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function hasSource(resources: ResourceRecord[], terms: string[]) {
  return resources.some((resource) => {
    const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`;
    return textIncludesAny(combined, terms);
  });
}

function evaluateSourceGate(resources: ResourceRecord[], framework: ExamPathId): SourceGate {
  if (!resources.length) {
    return {
      status: 'unavailable',
      activeTitles: [],
      missing: [],
      note:
        'Admin Resource Library could not be read by the Tutor route. The Tutor must answer only from embedded canonical official facts and must not extrapolate beyond them.',
    };
  }

  const required: { label: string; terms: string[] }[] =
    framework === 'pmbok7'
      ? [
          { label: 'PMBOK 7', terms: ['pmbok 7', 'pmbok7', 'seventh'] },
          { label: 'ECO 2021', terms: ['eco 2021', 'examination content outline 2021', 'content outline 2021'] },
          { label: 'Rita Mulcahy', terms: ['rita'] },
        ]
      : framework === 'pmbok8'
        ? [
            { label: 'PMBOK 8', terms: ['pmbok 8', 'pmbok8', 'eighth'] },
            { label: 'ECO 2026', terms: ['eco 2026', 'examination content outline 2026', 'content outline 2026', 'new-pmp'] },
            { label: 'Rita Mulcahy', terms: ['rita'] },
          ]
        : [
            { label: 'PMBOK 7', terms: ['pmbok 7', 'pmbok7', 'seventh'] },
            { label: 'ECO 2021', terms: ['eco 2021', 'examination content outline 2021', 'content outline 2021'] },
            { label: 'PMBOK 8', terms: ['pmbok 8', 'pmbok8', 'eighth'] },
            { label: 'ECO 2026', terms: ['eco 2026', 'examination content outline 2026', 'content outline 2026', 'new-pmp'] },
            { label: 'Rita Mulcahy', terms: ['rita'] },
          ];

  const missing = required
    .filter((item) => !hasSource(resources, item.terms))
    .map((item) => item.label);

  return {
    status: missing.length ? 'failed' : 'passed',
    activeTitles: resources.map((resource) => resource.title),
    missing,
    note: missing.length
      ? `Required official resources are inactive or missing for this route: ${missing.join(', ')}. The Tutor must not invent from memory.`
      : 'Required official Admin Resource Library sources are active for this route.',
  };
}

function sourceGateInstruction(gate: SourceGate) {
  if (gate.status === 'passed') {
    return [
      'ADMIN RESOURCE LIBRARY GATE: PASSED.',
      gate.note,
      `Active source titles: ${gate.activeTitles.join(' | ')}`,
      'Use the active Resource Library metadata as the source-control gate. The canonical facts below are allowed because the corresponding official resources are active.',
    ].join('\n');
  }

  if (gate.status === 'failed') {
    return [
      'ADMIN RESOURCE LIBRARY GATE: FAILED.',
      gate.note,
      'If the learner asks about a missing official source area, say that the relevant official source is not active in the Resource Library and avoid answering from memory.',
      'For basic canonical facts already listed below, you may answer, but do not go beyond them.',
    ].join('\n');
  }

  return [
    'ADMIN RESOURCE LIBRARY GATE: UNAVAILABLE.',
    gate.note,
    'Answer only from the embedded canonical official facts below. If the learner asks for detail beyond these facts, say the current source library connection is not sufficient to verify the answer.',
  ].join('\n');
}

function canonicalOfficialContext() {
  return [
    'CANONICAL PMBOK 8 / ECO 2026 KNOWLEDGE — SOURCE OF TRUTH:',
    '',
    'Official PMP ECO 2026 facts:',
    '- Domain weights: People 33%, Process 41%, Business Environment 26%.',
    '- Exam size: 180 total questions, including 170 scored and 10 pretest/unscored questions.',
    '- Exam time: 240 minutes.',
    '- Delivery approaches: approximately 40% predictive and 60% adaptive/agile and hybrid.',
    '- Question formats include case/scenario and graphic-based questions, in addition to multiple-choice single response, multiple-response, matching, point-and-click, and pull-down list formats where applicable.',
    '',
    'Official PMBOK 8 structure:',
    '- PMBOK 8 has SIX project management principles:',
    '  1. Adopt a Holistic View.',
    '  2. Focus on Value.',
    '  3. Embed Quality Into Processes and Deliverables.',
    '  4. Be an Accountable Leader.',
    '  5. Integrate Sustainability Within All Project Areas.',
    '  6. Build an Empowered Culture.',
    '- PMBOK 8 has FIVE Project Management Focus Areas:',
    '  1. Initiating.',
    '  2. Planning.',
    '  3. Executing.',
    '  4. Monitoring and Controlling.',
    '  5. Closing.',
    '- PMBOK 8 has SEVEN Performance Domains:',
    '  1. Governance.',
    '  2. Scope.',
    '  3. Schedule.',
    '  4. Finance.',
    '  5. Stakeholders.',
    '  6. Resources.',
    '  7. Risk.',
    '- PMBOK 8 includes 40 nonprescriptive processes.',
    '',
    'Official PMBOK 7 / ECO 2021 route facts:',
    '- ECO 2021 domain weights: People 42%, Process 50%, Business Environment 8%.',
    '- PMBOK 7 uses 12 project management principles and 8 performance domains.',
    '- PMBOK 7 performance domains: Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty.',
    '',
    'FORBIDDEN LEGACY LEAKAGE UNDER PMBOK 8:',
    '- Do NOT present PMBOK 7 twelve principles as PMBOK 8 principles.',
    '- Do NOT present PMBOK 7 eight performance domains as PMBOK 8 performance domains.',
    '- Do NOT list Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, and Uncertainty as PMBOK 8 performance domains.',
    '- Do NOT use outdated or guessed ECO 2026 weights such as People 40%, Process 45%, Business Environment 15%.',
    '- Do NOT say PMI has not issued ECO 2026 details.',
    '',
    'PMBOK/ECO crosswalk precision rule:',
    '- ECO domains are exam-content domains. PMBOK Guide domains are knowledge/performance structure domains. They are related but not one-to-one equivalents.',
    '- Never imply that ECO People maps only to one PMBOK 8 performance domain.',
    '- ECO People topics should be explained across Stakeholders, Resources, accountable leadership, empowered culture, communication, conflict management, collaboration, coaching, team performance, and knowledge transfer.',
    '- ECO Process topics should be explained across planning, delivery, governance, scope, schedule, finance, resources, quality, risk, change control, and closure.',
    '- ECO Business Environment topics should be explained across governance, compliance, organizational change, strategic alignment, benefits/value, risk, external change, and continuous improvement.',
  ].join('\n');
}

function routeInstruction(framework: ExamPathId) {
  if (framework === 'bridge') {
    return [
      'You are an expert PMP exam tutor operating in Bridge Mode.',
      'Ground your guidance in PMBOK 7 + ECO 2021 and PMBOK 8 + ECO 2026 transition logic.',
      'Always distinguish current-route content from new-route content.',
      'When comparing, explain what remains stable, what changes, and what the learner should do next.',
    ].join(' ');
  }

  if (framework === 'pmbok8') {
    return [
      'You are an expert PMP exam tutor grounded in PMBOK 8, ECO 2026, and Rita Mulcahy.',
      'When asked to explain PMBOK 8, use this exact structure:',
      'overview; six PMBOK 8 principles; five Focus Areas; seven PMBOK 8 Performance Domains; 40 nonprescriptive processes; ECO 2026 alignment.',
      'Never answer PMBOK 8 questions using PMBOK 7 principles or PMBOK 7 domains unless explicitly comparing PMBOK 7 with PMBOK 8.',
    ].join(' ');
  }

  return [
    'You are an expert PMP exam tutor grounded in PMBOK 7, ECO 2021, and Rita Mulcahy.',
    'Use PMBOK 7 principles, PMBOK 7 performance domains, and ECO 2021 weights for this route.',
    'Do not introduce PMBOK 8/ECO 2026 unless the learner explicitly asks for comparison or transition guidance.',
  ].join(' ');
}

function scopeLimitingInstruction(userText: string) {
  const normalized = (userText || '').toLowerCase();

  const hasScopeLimiter =
    normalized.includes('only') ||
    normalized.includes('list only') ||
    normalized.includes('just') ||
    normalized.includes('فقط') ||
    normalized.includes('اذكر فقط');

  if (!hasScopeLimiter) return '';

  return [
    'STRICT USER SCOPE LIMIT:',
    'The latest learner message contains scope-limiting wording.',
    'Answer exactly the requested scope only.',
    'Do not add final comparison sentences, background explanations, extra caveats, related lists, or “key difference” paragraphs unless the learner explicitly asks for them.',
  ].join('\n');
}

function shouldIncludeDebugEvidence(req: NextRequest, debugEvidence: unknown) {
  const configuredToken = process.env.TUTOR_DEBUG_TOKEN;
  if (debugEvidence !== true || !configuredToken) return false;

  const providedToken = req.headers.get('x-tutor-debug-token');
  return providedToken === configuredToken;
}

function buildDebugEvidencePayload({
  activeFramework,
  gate,
  chunks,
}: {
  activeFramework: ExamPathId;
  gate: SourceGate;
  chunks: RetrievedResourceChunk[];
}) {
  return {
    framework: activeFramework,
    sourceGate: {
      status: gate.status,
      missing: gate.missing,
      activeTitles: gate.activeTitles,
    },
    retrievedChunks: chunks.map((chunk, index) => ({
      rank: index + 1,
      id: chunk.id,
      framework: chunk.framework,
      source_title: chunk.source_title,
      source_type: chunk.source_type,
      language: chunk.language,
      chunk_title: chunk.chunk_title,
      topic_tags: chunk.topic_tags,
      priority: chunk.priority,
      score: chunk.score,
      text_preview: chunk.chunk_text.slice(0, 260),
    })),
  };
}

function answerQualityRules() {
  return [
    'ANSWER QUALITY RULES:',
    '- Be precise, exam-focused, and conservative.',
    '- Do not invent section numbers, page numbers, PMI terminology, domain weights, or process names.',
    '- If the answer requires details beyond the active official source gate and canonical facts, say the source evidence is not currently available in the platform knowledge library.',
    '- Obey scope-limiting wording strictly. If the learner asks for only, list only, just, فقط, اذكر فقط, or similar, answer only that requested scope and do not add comparisons, background, extra caveats, or additional lists unless explicitly requested.',
    '- In Arabic, use clear formal Arabic and keep PMP, PMBOK, ECO, Agile, Scrum, Sprint, Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk, Initiating, Planning, Executing, Monitoring and Controlling, and Closing in English when clarity requires it.',
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    // Zane is a premium feature — block free users hitting the API directly.
    const { isPremium } = await getAccess();
    if (!isPremium) {
      return new Response(
        JSON.stringify({ error: 'Premium feature', message: 'Zane requires a plan.', upgrade: true }),
        { status: 403 },
      );
    }

    const body = await req.json();
    const { messages, framework = 'pmbok7', language = 'en', debugEvidence = false } = body;
    const activeFramework = normalizeExamPath(framework);

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
    }

    const activeResources = await loadActiveResourceLibrary();
    const gate = evaluateSourceGate(activeResources, activeFramework);
    const lastUserMessage = [...messages].reverse().find((message: any) => message.role === 'user')?.content || '';
    const retrievedEvidence = await retrieveResourceEvidence({
      framework: activeFramework,
      query: String(lastUserMessage),
      limit: 5,
    });
    const resourceEvidencePrompt = formatResourceEvidenceForPrompt(retrievedEvidence);
    const scopeInstruction = scopeLimitingInstruction(String(lastUserMessage));
    const includeDebugEvidence = shouldIncludeDebugEvidence(req, debugEvidence);
    const debugEvidencePayload = includeDebugEvidence
      ? buildDebugEvidencePayload({
          activeFramework,
          gate,
          chunks: retrievedEvidence,
        })
      : null;

    const languageInstruction =
      language === 'ar'
        ? 'Respond in formal, clear Modern Standard Arabic. Keep professional PMP terminology in English where precision requires it.'
        : 'Respond in clear professional English.';

    const system = [
      routeInstruction(activeFramework),
      sourceGateInstruction(gate),
      resourceEvidencePrompt,
      scopeInstruction,
      canonicalOfficialContext(),
      answerQualityRules(),
      languageInstruction,
    ].join('\n\n');

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (debugEvidencePayload) {
            controller.enqueue(
              encoder.encode('data: ' + JSON.stringify({ debugEvidence: debugEvidencePayload }) + '\n\n')
            );
          }

          const s = await anthropic.messages.stream({
            model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
            max_tokens: 1800,
            system,
            messages,
          });

          for await (const chunk of s) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(
                encoder.encode('data: ' + JSON.stringify({ text: chunk.delta.text }) + '\n\n')
              );
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode('data: ' + JSON.stringify({ error: 'Stream error' }) + '\n\n')
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
