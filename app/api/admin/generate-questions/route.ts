import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const DOMAINS = {
  people: 'People Domain (42%) — leadership, teamwork, stakeholders, conflict, servant leadership',
  process: 'Process Domain (50%) — planning, scheduling, risk, procurement, quality, change control',
  business: 'Business Environment Domain (8%) — strategy, compliance, benefits, organizational change',
}

const DIFFICULTIES = ['entry', 'intermediate', 'advanced', 'expert']

const SYSTEM_PROMPT = `You are a PMP exam question writer. You must respond with ONLY a valid JSON array. No text before or after. No markdown. No code blocks. Just the raw JSON array starting with [ and ending with ].`
function buildPrompt(domain: string, difficulty: string, count: number, variantSeed: string): string {
  const domainDesc = DOMAINS[domain as keyof typeof DOMAINS] || DOMAINS.people
  return `Generate ${count} unique PMP exam questions for:
- Domain: ${domainDesc}
- Difficulty: ${difficulty}
- Variant seed (for uniqueness): ${variantSeed}

Return a JSON array of objects with this exact structure:
[
  {
    "domain": "${domain}",
    "difficulty": "${difficulty}",
    "task": "brief task category (e.g. 'Conflict Resolution', 'Risk Response')",
    "scenario": "2-3 sentence realistic project scenario",
    "question": "the exam question",
    "options": {
      "A": "option A text",
      "B": "option B text", 
      "C": "option C text",
      "D": "option D text"
    },
    "correct": "A",
    "rationale": "Explanation of why the correct answer is right and why the others are wrong. Ground in PMBOK 7 / ECO 2021 principles."
  }
]

Respond with ONLY the JSON array. Start your response with [ and end with ]. No other text.`}

export async function POST(req: NextRequest) {
  try {
    // Auth check — admin only
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const { domain, difficulty, count, variants = 3 } = await req.json()

    if (!domain || !difficulty || !count) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!DOMAINS[domain as keyof typeof DOMAINS]) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 })
    }

    if (!DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 })
    }

    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const allGenerated: unknown[] = []
    const errors: string[] = []

    // Generate `variants` batches for variety
    for (let v = 1; v <= variants; v++) {
      const variantSeed = `variant-${v}-${Date.now()}`
      const prompt = buildPrompt(domain, difficulty, count, variantSeed)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) {
        errors.push(`Variant ${v}: API error ${response.status}`)
        continue
      }

      const data = await response.json()
      const raw = data.content?.[0]?.text || ''

      try {
        // Extract JSON array from response
        let cleaned = raw
          .replace(/```json\n?/gi, '')
          .replace(/```\n?/g, '')
          .trim()

        // Find the JSON array boundaries
        const startIdx = cleaned.indexOf('[')
        const endIdx = cleaned.lastIndexOf(']')
        if (startIdx === -1 || endIdx === -1) {
          errors.push(`Variant ${v}: No JSON array found`)
          continue
        }
        cleaned = cleaned.slice(startIdx, endIdx + 1)
        const questions = JSON.parse(cleaned)

        if (!Array.isArray(questions)) {
          errors.push(`Variant ${v}: Response was not an array`)
          continue
        }

        // Store to Supabase
        const toInsert = questions.map((q: Record<string, unknown>) => ({
          domain: q.domain || domain,
          difficulty: q.difficulty || difficulty,
          task: q.task || '',
          scenario: q.scenario || '',
          question: q.question || '',
          options: q.options || {},
          correct: q.correct || 'A',
          rationale: q.rationale || '',
          framework: 'pmbok7',
          is_active: true,
          variant_group: variantSeed,
          created_by: user.id,
        }))

        const { data: inserted, error: insertError } = await adminSupabase
          .from('questions')
          .insert(toInsert)
          .select('id')

        if (insertError) {
          errors.push(`Variant ${v}: DB error — ${insertError.message}`)
        } else {
          allGenerated.push(...(inserted || []))
        }
      } catch {
        errors.push(`Variant ${v}: JSON parse failed`)
      }
    }

    return NextResponse.json({
      success: true,
      generated: allGenerated.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('Generate questions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}