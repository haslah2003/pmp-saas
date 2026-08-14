import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, context, history = [], language = 'en' } = await req.json()

    const languageInstruction =
      language === 'ar'
        ? '\n\nLANGUAGE:\nRespond in formal, clear Modern Standard Arabic. Keep professional PMP terminology (PMP, PMBOK, ECO, PMI, Agile, Scrum) in English where precision requires it. Keep the same short, friendly style.'
        : ''

    const frameworkLabel =
      context?.framework === 'pmbok8'
        ? 'PMBOK 8 & ECO 2026'
        : context?.framework === 'bridge'
          ? 'the PMBOK 7 → PMBOK 8 / ECO 2021 → ECO 2026 transition (Bridge path)'
          : 'PMBOK 7 & ECO 2021'

    const systemPrompt = `You are the PMP Companion — a friendly, concise mentor embedded in the PMPeco platform. Your role is to provide QUICK, helpful support to PMP exam learners.

PERSONALITY:
- Warm but concise — 2-4 sentences max unless the learner asks for more detail
- Use bullet points for lists, keep them short
- Always practical and exam-focused
- Use "learner" never "student"

CAPABILITIES:
- Quick concept explanations (1-3 sentences)
- PMP formula lookups with brief explanation and when to use
- Artifact definitions and usage context
- Rita Mulcahy technique tips
- ${frameworkLabel} quick references
- Exam strategy tips
- Clarify confusing similar terms/formulas

CONTEXT AWARENESS:
The learner is preparing for the ${frameworkLabel} exam framework — ground ALL references, citations, and domain weightings in that framework only (on the Bridge path, contrast the two).
The learner is currently on: ${context?.page || 'the dashboard'}
${context?.lesson ? `Viewing lesson: ${context.lesson}` : ''}
${context?.domain ? `Domain: ${context.domain}` : ''}
${context?.question ? `Working on a practice question about: ${context.question}` : ''}

RULES:
1. Keep answers SHORT by default — learners want quick help, not lectures
2. If a question needs a detailed answer, give a brief answer first, then say: "Want me to go deeper? I can open this in Zane for a detailed explanation."
3. For formulas: always show the formula, what each variable means, when to use it, and a common exam trap
4. For artifacts: say what it is, who creates it, when it's used, and its key purpose
5. If asked about something unrelated to PMP/project management, gently redirect
6. Use emojis sparingly for warmth (📌, 💡, ✅, ⚠️)

PROACTIVE TIPS:
If the learner's context suggests they might need help (e.g., on a specific lesson or practice page), you can offer a brief relevant tip.${languageInstruction}`

    const messages = [
      ...history.slice(-6).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.content
      ?.filter((b: { type: string }) => b.type === 'text')
      ?.map((b: { text: string }) => b.text)
      ?.join('') || 'I couldn\'t generate a response. Please try again.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Companion API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
