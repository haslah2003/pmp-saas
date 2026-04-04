#!/usr/bin/env node

/**
 * PMP Expert Tutor — Bulk Question Generator
 * 
 * Runs locally on your Mac. No Vercel timeouts.
 * Generates questions across all domains × difficulties in one run.
 * 
 * Usage:
 *   node generate-all-questions.js              (all 12 combos, 20 each = 240 questions)
 *   node generate-all-questions.js --count 10   (all 12 combos, 10 each = 120 questions)
 *   node generate-all-questions.js --domain People --difficulty intermediate --count 20
 */

require('dotenv').config({ path: '.env.local' })

// ─── Configuration ──────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
  console.error('❌ Missing environment variables. Make sure .env.local has:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY')
  process.exit(1)
}

const DOMAINS = ['People', 'Process', 'Business Environment']

const DIFFICULTIES = [
  { ui: 'entry',        db: 'entry' },
  { ui: 'intermediate', db: 'paced' },
  { ui: 'advanced',     db: 'challenging' },
  { ui: 'expert',       db: 'difficult' },
]

// ─── Parse CLI arguments ────────────────────────────────────────
const args = process.argv.slice(2)
function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const filterDomain = getArg('domain')
const filterDifficulty = getArg('difficulty')
const questionsPerBatch = parseInt(getArg('count') || '20', 10)

// ─── Prompts ────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a PMP exam question writer. You must respond with ONLY a valid JSON array. No text before or after. No markdown. No code blocks. Just the raw JSON array starting with [ and ending with ].`

function buildPrompt(domain, difficulty, count) {
  const seed = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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

// ─── API Calls ──────────────────────────────────────────────────
async function generateQuestions(domain, difficultyUi, count) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(domain, difficultyUi, count) }],
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`)
  }

  const data = await response.json()
  const raw = data.content
    ?.filter(block => block.type === 'text')
    ?.map(block => block.text)
    ?.join('') || ''

  if (!raw.length) {
    throw new Error('Empty response from API')
  }

  // Extract JSON array
  let cleaned = raw.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
  const startIdx = cleaned.indexOf('[')
  const endIdx = cleaned.lastIndexOf(']')
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('No JSON array found in response')
  }

  return JSON.parse(cleaned.slice(startIdx, endIdx + 1))
}

async function insertToSupabase(questions, domain, difficultyDb) {
  const rows = questions.map(q => ({
    framework: 'pmbok7',
    domain: q.domain || domain,
    subdomain: q.subdomain || '',
    difficulty: difficultyDb,
    question_text: q.question_text || '',
    option_a: q.option_a || '',
    option_b: q.option_b || '',
    option_c: q.option_c || '',
    option_d: q.option_d || '',
    correct_answer: (q.correct_answer || 'a').trim().charAt(0).toLowerCase(),
    explanation: q.explanation || '',
    rita_tip: q.rita_tip || '',
    pmbok_reference: q.pmbok_reference || '',
    eco_reference: q.eco_reference || '',
    is_active: true,
  }))

  const response = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(rows),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Supabase error ${response.status}: ${errText.substring(0, 300)}`)
  }

  const inserted = await response.json()
  return inserted.length
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  // Build the list of combos to generate
  const combos = []
  for (const domain of DOMAINS) {
    if (filterDomain && domain.toLowerCase() !== filterDomain.toLowerCase()) continue
    for (const diff of DIFFICULTIES) {
      if (filterDifficulty && diff.ui !== filterDifficulty.toLowerCase()) continue
      combos.push({ domain, ...diff })
    }
  }

  if (combos.length === 0) {
    console.error('❌ No matching domain/difficulty combinations found.')
    console.error('   Domains: People, Process, "Business Environment"')
    console.error('   Difficulties: entry, intermediate, advanced, expert')
    process.exit(1)
  }

  const totalExpected = combos.length * questionsPerBatch
  console.log(`\n🧠 PMP Expert Tutor — Bulk Question Generator`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📋 Combos: ${combos.length} (${combos.map(c => `${c.domain}/${c.ui}`).join(', ')})`)
  console.log(`📝 Questions per combo: ${questionsPerBatch}`)
  console.log(`🎯 Total expected: ${totalExpected} questions`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  let totalGenerated = 0
  let totalErrors = 0

  for (let i = 0; i < combos.length; i++) {
    const { domain, ui, db } = combos[i]
    const label = `[${i + 1}/${combos.length}] ${domain} / ${ui}`

    process.stdout.write(`${label} — generating ${questionsPerBatch} questions... `)

    try {
      const questions = await generateQuestions(domain, ui, questionsPerBatch)
      const inserted = await insertToSupabase(questions, domain, db)
      totalGenerated += inserted
      console.log(`✅ ${inserted} questions inserted`)
    } catch (err) {
      totalErrors++
      console.log(`❌ Error: ${err.message}`)
    }

    // Small delay between API calls to avoid rate limiting
    if (i < combos.length - 1) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Done! Generated ${totalGenerated} questions total.`)
  if (totalErrors > 0) {
    console.log(`⚠️  ${totalErrors} combo(s) had errors.`)
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message)
  process.exit(1)
})
