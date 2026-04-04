import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── System Prompt ───────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a PMP exam question writer. You must respond with ONLY a valid JSON array. No text before or after. No markdown. No code blocks. Just the raw JSON array starting with [ and ending with ].`

// ─── Build the user prompt ───────────────────────────────────────
function buildPrompt(domain: string, difficulty: string, count: number, seed: string): string {
  return `Generate ${count} PMP exam questions for:
- Domain: ${domain}
- Difficulty: ${difficulty}
- Variation seed: ${seed}

Each question must be a JSON object with these exact keys:
{
  "domain": "${domain}",
  "subdomain": "specific subtopic within ${domain}",
  "difficulty": "${difficulty}",
  "question_text": "the full question scenario and stem",
  "option_a": "first answer choice",
  "option_b": "second answer choice",
  "option_c": "third answer choice",
  "option_d": "fourth answer choice",
  "correct_answer": "A, B, C, or D",
  "explanation": "why the correct answer is right and others are wrong",
  "rita_tip": "a study tip in Rita Mulcahy style",
  "pmbok_reference": "relevant PMBOK 7 section",
  "eco_reference": "relevant ECO 2021 task"
}

Requirements:
- Questions must be scenario-based, realistic, and exam-quality
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Explanations must reference why each wrong answer is incorrect
- Use PMP exam language and terminology

Respond with ONLY the JSON array. Start your response with [ and end with ]. No other text.`
}

// ─── POST handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await req.json()
    const {
      domain = 'People',
      difficulty = 'moderate',
      count = 5,
      variants = 1,
    } = body

    // 3. Validate API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[QUESTION GEN] ANTHROPIC_API_KEY is not set!')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const adminSupabase = createAdminClient()
    const allGenerated: unknown[] = []
    const errors: string[] = []

    // 4. Generate questions in batches
    for (let v = 1; v <= variants; v++) {
      const variantSeed = `variant-${v}-${Date.now()}`
      const prompt = buildPrompt(domain, difficulty, count, variantSeed)

      console.log(`[QUESTION GEN] Variant ${v}: Calling Anthropic API...`)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      // 5. Check HTTP-level errors
      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`[QUESTION GEN] Variant ${v}: API HTTP error ${response.status}:`, errorBody)
        errors.push(`Variant ${v}: API error ${response.status}`)
        continue
      }

      // 6. Parse API response
      const data = await response.json()
      console.log(`[QUESTION GEN] Variant ${v}: Response type:`, data.type)
      console.log(`[QUESTION GEN] Variant ${v}: Content blocks:`, data.content?.length)
      console.log(`[QUESTION GEN] Variant ${v}: Stop reason:`, data.stop_reason)

      // Extract text from content blocks
      const raw = data.content
        ?.filter((block: { type: string }) => block.type === 'text')
        ?.map((block: { text: string }) => block.text)
        ?.join('') || ''

      console.log(`[QUESTION GEN] Variant ${v}: Raw length: ${raw.length}`)
      console.log(`[QUESTION GEN] Variant ${v}: Raw preview:`, raw.substring(0, 300))

      if (raw.length === 0) {
        console.error(`[QUESTION GEN] Variant ${v}: Empty response from API`)
        console.error(`[QUESTION GEN] Variant ${v}: Full data:`, JSON.stringify(data).substring(0, 500))
        errors.push(`Variant ${v}: Empty response from API`)
        continue
      }

      try {
        // 7. Extract JSON array from response
        let cleaned = raw
          .replace(/```json\n?/gi, '')
          .replace(/```\n?/g, '')
          .trim()

        const startIdx = cleaned.indexOf('[')
        const endIdx = cleaned.lastIndexOf(']')

        if (startIdx === -1 || endIdx === -1) {
          console.error(`[QUESTION GEN] Variant ${v}: No JSON array brackets found in response`)
          console.error(`[QUESTION GEN] Variant ${v}: Cleaned preview:`, cleaned.substring(0, 300))
          errors.push(`Variant ${v}: No JSON array found in response`)
          continue
        }

        cleaned = cleaned.slice(startIdx, endIdx + 1)
        const questions = JSON.parse(cleaned)

        if (!Array.isArray(questions)) {
          errors.push(`Variant ${v}: Response was not an array`)
          continue
        }

        console.log(`[QUESTION GEN] Variant ${v}: Parsed ${questions.length} questions`)

        // 8. Map to Supabase columns and insert
        const toInsert = questions.map((q: Record<string, unknown>) => ({
          framework: 'pmbok7',
          domain: (q.domain as string) || domain,
          subdomain: (q.subdomain as string) || '',
          difficulty: (q.difficulty as string) || difficulty,
          question_text: (q.question_text as string) || '',
          option_a: (q.option_a as string) || '',
          option_b: (q.option_b as string) || '',
          option_c: (q.option_c as string) || '',
          option_d: (q.option_d as string) || '',
          correct_answer: (q.correct_answer as string) || 'A',
          explanation: (q.explanation as string) || '',
          rita_tip: (q.rita_tip as string) || '',
          pmbok_reference: (q.pmbok_reference as string) || '',
          eco_reference: (q.eco_reference as string) || '',
          is_active: true,
        }))

        const { data: inserted, error: insertError } = await adminSupabase
          .from('questions')
          .insert(toInsert)
          .select('id')

        if (insertError) {
          console.error(`[QUESTION GEN] Variant ${v}: DB insert error:`, insertError.message)
          errors.push(`Variant ${v}: DB error — ${insertError.message}`)
        } else {
          console.log(`[QUESTION GEN] Variant ${v}: Inserted ${inserted?.length} questions`)
          allGenerated.push(...(inserted || []))
        }
      } catch (parseErr) {
        console.error(`[QUESTION GEN] Variant ${v}: JSON parse error:`, parseErr)
        errors.push(`Variant ${v}: JSON parse failed`)
      }
    }

    return NextResponse.json({
      success: true,
      generated: allGenerated.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('[QUESTION GEN] Fatal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}