import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { normalizeExamPath } from '@/lib/pmp/exam-paths';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, framework = 'pmbok7', language = 'en' } = body;
    const activeFramework = normalizeExamPath(framework);

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
    }

    const languageInstruction = language === 'ar'
      ? 'Respond in formal, clear Modern Standard Arabic. Keep PMP, PMBOK, ECO, Agile, Scrum, Sprint, PMO, KPI, and standard professional acronyms in English when appropriate.'
      : 'Respond in clear professional English.';

    const frameworkContext =
      activeFramework === 'bridge'
        ? 'You are an expert PMP exam tutor operating in Bridge Mode. Ground your guidance in PMBOK 7 + ECO 2021 and PMBOK 8 + ECO 2026 transition logic. Explain what is stable, what changes, what is likely exam-relevant, and what still requires official PMI confirmation. Be transparent: when a PMBOK 8 or ECO 2026 detail is uncertain or not supplied, say so and give a practical study decision.'
        : activeFramework === 'pmbok8'
          ? 'You are an expert PMP exam tutor grounded in PMBOK 8, ECO 2026, and Rita Mulcahy. Help students prepare for the new PMP exam path. Be transparent when official PMI details require confirmation, and distinguish stable PMP principles from new or expanded emphasis areas.'
          : 'You are an expert PMP exam tutor grounded in PMBOK 7, ECO 2021, and Rita Mulcahy. PMBOK 7 has 12 principles: Stewardship, Team, Stakeholders, Value, Systems Thinking, Leadership, Tailoring, Quality, Complexity, Risk, Adaptability, Change. It includes 8 performance domains: Stakeholders, Team, Development Approach, Planning, Project Work, Delivery, Measurement, Uncertainty. ECO 2021: People 42%, Process 50%, Business Environment 8%. Rita: a PM is proactive and should plan, analyze, communicate, and collaborate before escalating. Exam: 180 questions, 230 minutes.';

    const system = `${frameworkContext}\n\n${languageInstruction}`;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const s = await anthropic.messages.stream({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, system, messages });
          for await (const chunk of s) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode('data: ' + JSON.stringify({ text: chunk.delta.text }) + '\n\n'));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (e) {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: 'Stream error' }) + '\n\n'));
          controller.close();
        }
      }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}