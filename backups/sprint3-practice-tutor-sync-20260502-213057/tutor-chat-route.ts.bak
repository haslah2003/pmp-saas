import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, framework = 'pmbok7' } = body;
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
    }
    const system = framework === 'pmbok8'
      ? 'You are an expert PMP exam tutor grounded in PMBOK 8, ECO 2026, and Rita Mulcahy. Help students pass with clear explanations and exam tips.'
      : 'You are an expert PMP exam tutor grounded in PMBOK 7, ECO 2021, and Rita Mulcahy. PMBOK 7 has 12 principles: Stewardship, Team, Stakeholders, Value, Systems Thinking, Leadership, Tailoring, Quality, Complexity, Risk, Adaptability, Change. 8 domains: Stakeholders, Team, Development Approach, Planning, Project Work, Delivery, Measurement, Uncertainty. ECO 2021: People 42%, Process 50%, Business Environment 8%. Rita: PM is proactive, always plan first. Exam: 180 questions, 230 minutes.';
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