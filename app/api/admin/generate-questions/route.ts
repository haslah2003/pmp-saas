import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ExamFramework = 'pmbok7' | 'pmbok8' | 'bridge'
type EcoDomain = 'people' | 'process' | 'business-environment'
type QuestionDifficulty = 'entry' | 'paced' | 'difficult' | 'challenging'

const SYSTEM_PROMPT = `You are a senior PMP exam question writer and PMP/PMI content quality auditor.

You must respond with ONLY a valid JSON array.
No text before or after.
No markdown.
No code blocks.
The response must start with [ and end with ].

Every item must be a JSON object with exactly the requested keys.`

const FRAMEWORKS: ExamFramework[] = ['pmbok7', 'pmbok8', 'bridge']
const DOMAINS: EcoDomain[] = ['people', 'process', 'business-environment']
const DIFFICULTIES: QuestionDifficulty[] = ['entry', 'paced', 'difficult', 'challenging']

function normalizeFramework(value: unknown): ExamFramework {
  return FRAMEWORKS.includes(value as ExamFramework) ? (value as ExamFramework) : 'pmbok7'
}

function normalizeDomain(value: unknown): EcoDomain {
  return DOMAINS.includes(value as EcoDomain) ? (value as EcoDomain) : 'people'
}

function normalizeDifficulty(value: unknown): QuestionDifficulty {
  if (DIFFICULTIES.includes(value as QuestionDifficulty)) return value as QuestionDifficulty

  const legacyMap: Record<string, QuestionDifficulty> = {
    intermediate: 'paced',
    advanced: 'challenging',
    expert: 'difficult',
    moderate: 'paced',
  }

  return legacyMap[String(value || '')] || 'entry'
}

function clampInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

function domainLabel(domain: EcoDomain) {
  if (domain === 'people') return 'People'
  if (domain === 'process') return 'Process'
  return 'Business Environment'
}

function frameworkContext(framework: ExamFramework) {
  if (framework === 'pmbok8') {
    return `Framework: PMBOK 8 + ECO 2026.

SOURCE-OF-TRUTH RULES:
- ECO 2026 exam domain weights: People 33%, Process 41%, Business Environment 26%.
- PMBOK 8 has six principles:
  1. Adopt a Holistic View
  2. Focus on Value
  3. Embed Quality Into Processes and Deliverables
  4. Be an Accountable Leader
  5. Integrate Sustainability Within All Project Areas
  6. Build an Empowered Culture
- PMBOK 8 has five Project Management Focus Areas:
  Initiating, Planning, Executing, Monitoring and Controlling, Closing.
- PMBOK 8 has seven Performance Domains:
  Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk.
- PMBOK 8 includes 40 nonprescriptive processes.

STRICT GUARDRAILS:
- Do NOT use PMBOK 7's 12 principles as PMBOK 8 principles.
- Do NOT use PMBOK 7's eight performance domains as PMBOK 8 performance domains.
- Do NOT say PMBOK 8 Performance Domains are People, Process, and Business Environment. Those are ECO exam domains.
- Do NOT invent section numbers, task numbers, or page numbers.
- pmbok_reference must use careful wording such as:
  "PMBOK 8 - Principle: Focus on Value; Performance Domain: Governance"
  or
  "PMBOK 8 - Focus Area: Planning; Performance Domains: Scope, Schedule, Risk"
- eco_reference must use careful wording such as:
  "ECO 2026 - Process domain: planning, risk management, and integrated delivery"
- rita_tip must be exam-strategy aligned but must not claim Rita 2026 or quote unverifiable text.`
  }

  if (framework === 'bridge') {
    return `Framework: Bridge Mode from PMBOK 7 + ECO 2021 to PMBOK 8 + ECO 2026.

SOURCE-OF-TRUTH RULES:
- Bridge Mode helps learners transition from PMBOK 7/ECO 2021 to PMBOK 8/ECO 2026.
- PMBOK 7: 12 principles and 8 performance domains.
- PMBOK 8: 6 principles, 5 Focus Areas, 7 Performance Domains, and 40 nonprescriptive processes.
- ECO 2021 weights: People 42%, Process 50%, Business Environment 8%.
- ECO 2026 weights: People 33%, Process 41%, Business Environment 26%.

STRICT GUARDRAILS:
- Clearly distinguish ECO exam domains from PMBOK Guide performance domains.
- Do not present PMBOK 7 structures as PMBOK 8 structures.
- Do not invent section numbers, task numbers, or page numbers.
- Questions should test transition judgment, comparison, and updated exam thinking.`
  }

  return `Framework: PMBOK 7 + ECO 2021.

SOURCE-OF-TRUTH RULES:
- ECO 2021 exam domain weights: People 42%, Process 50%, Business Environment 8%.
- PMBOK 7 has 12 principles.
- PMBOK 7 performance domains are:
  Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty.

STRICT GUARDRAILS:
- Do not introduce PMBOK 8/ECO 2026 unless the question explicitly asks for comparison.
- Do not invent section numbers, task numbers, or page numbers.
- pmbok_reference must reference PMBOK 7 concepts carefully without fake page numbers.
- eco_reference must reference ECO 2021 domain/task concept carefully without fake task numbers.`
}

function domainGuidance(framework: ExamFramework, domain: EcoDomain) {
  if (framework === 'pmbok8') {
    if (domain === 'people') {
      return `For ECO 2026 People, align questions with leadership, empowered culture, team collaboration, stakeholder engagement, communication, conflict management, coaching, knowledge transfer, accountability, and team performance.`
    }

    if (domain === 'process') {
      return `For ECO 2026 Process, align questions with initiating, planning, executing, monitoring and controlling, closing, tailoring, scope, schedule, finance, risk, resources, quality, value delivery, and predictive/adaptive/hybrid application.`
    }

    return `For ECO 2026 Business Environment, align questions with compliance, external environment, organizational change, strategy, value, benefits, sustainability, market/regulatory/geopolitical/technology change, governance, and operational adoption.`
  }

  if (domain === 'people') {
    return `For People, align questions with leadership, communication, stakeholder engagement, conflict, collaboration, team development, and servant leadership.`
  }

  if (domain === 'process') {
    return `For Process, align questions with planning, execution, monitoring and controlling, risk, scope, schedule, cost, quality, procurement, and delivery approach.`
  }

  return `For Business Environment, align questions with compliance, benefits, business value, organizational change, governance, external environment, and strategic alignment.`
}

function buildPrompt({
  framework,
  domain,
  difficulty,
  count,
  seed,
}: {
  framework: ExamFramework
  domain: EcoDomain
  difficulty: QuestionDifficulty
  count: number
  seed: string
}) {
  return `Generate ${count} PMP exam questions.

${frameworkContext(framework)}

Question target:
- Framework route: ${framework}
- ECO domain DB value: ${domain}
- ECO domain label: ${domainLabel(domain)}
- Difficulty DB value: ${difficulty}
- Variation seed: ${seed}

${domainGuidance(framework, domain)}

Each question must be a JSON object with these exact keys:
{
  "domain": "${domain}",
  "subdomain": "specific subtopic within ${domainLabel(domain)}",
  "difficulty": "${difficulty}",
  "question_text": "the full scenario-based question and stem",
  "option_a": "first answer choice",
  "option_b": "second answer choice",
  "option_c": "third answer choice",
  "option_d": "fourth answer choice",
  "correct_answer": "a, b, c, or d",
  "explanation": "why the correct answer is best and why the other three options are weak",
  "rita_tip": "a concise exam-strategy tip aligned with Rita Mulcahy-style exam thinking but not quoted",
  "pmbok_reference": "careful PMBOK reference without fake page or section numbers",
  "eco_reference": "careful ECO reference without fake task numbers"
}

Quality requirements:
- Use realistic scenario-based PMP exam style.
- Entry questions should still be professional and situational, not trivial recall.
- Use varied assessment techniques across the batch, including a mix of best next action, first action, root-cause diagnosis, prevention, value trade-off, governance judgment, stakeholder response, delivery approach judgment, and ethical/professional responsibility.
- Do not make every question use the same stem such as "What should the project manager do first?"
- Only one option may be clearly best.
- Distractors must be plausible but weaker; avoid cartoonishly wrong distractors such as simply ignoring the issue, firing people, or escalating everything unless the scenario genuinely supports that as a weak option.
- Explanations must explicitly explain why the correct option is best and why the other three options are weak.
- correct_answer must be lowercase only: "a", "b", "c", or "d".
- Distribute correct_answer values as evenly as mathematically possible across a, b, c, and d for this batch.
- Do not cluster the correct answer in one letter.
- The domain field must be exactly "${domain}".
- The difficulty field must be exactly "${difficulty}".
- Avoid duplicated scenarios.
- Avoid answer-pattern obviousness.
- Do not include markdown or commentary outside the JSON array.

Respond with ONLY the JSON array.`
}

function cleanGeneratedQuestions({
  questions,
  framework,
  domain,
  difficulty,
}: {
  questions: unknown[]
  framework: ExamFramework
  domain: EcoDomain
  difficulty: QuestionDifficulty
}) {
  return questions
    .filter((q): q is Record<string, unknown> => q !== null && typeof q === 'object')
    .map((q) => {
      const correct = String(q.correct_answer || 'a').trim().toLowerCase().charAt(0)
      return {
        framework,
        domain,
        subdomain: String(q.subdomain || '').trim(),
        difficulty,
        question_text: String(q.question_text || '').trim(),
        option_a: String(q.option_a || '').trim(),
        option_b: String(q.option_b || '').trim(),
        option_c: String(q.option_c || '').trim(),
        option_d: String(q.option_d || '').trim(),
        correct_answer: ['a', 'b', 'c', 'd'].includes(correct) ? correct : 'a',
        explanation: String(q.explanation || '').trim(),
        rita_tip: String(q.rita_tip || '').trim(),
        pmbok_reference: String(q.pmbok_reference || '').trim(),
        eco_reference: String(q.eco_reference || '').trim(),
        is_active: true,
      }
    })
    .filter(
      (q) =>
        q.question_text &&
        q.option_a &&
        q.option_b &&
        q.option_c &&
        q.option_d &&
        q.explanation
    )
}

type AnswerKey = 'a' | 'b' | 'c' | 'd'

const ANSWER_KEYS: AnswerKey[] = ['a', 'b', 'c', 'd']

type CleanQuestion = ReturnType<typeof cleanGeneratedQuestions>[number]

function normalizeQuestionForComparison(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an|and|or|but|to|of|in|on|for|with|by|as|is|are|be|been|being)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenSet(value: string) {
  return new Set(normalizeQuestionForComparison(value).split(' ').filter(Boolean))
}

function tokenSimilarity(a: string, b: string) {
  const aTokens = tokenSet(a)
  const bTokens = tokenSet(b)

  if (aTokens.size === 0 || bTokens.size === 0) return 0

  let intersection = 0
  for (const token of aTokens) {
    if (bTokens.has(token)) intersection += 1
  }

  const union = new Set([...aTokens, ...bTokens]).size
  return union === 0 ? 0 : intersection / union
}

function isNearDuplicateQuestion(a: string, b: string) {
  const normalizedA = normalizeQuestionForComparison(a)
  const normalizedB = normalizeQuestionForComparison(b)

  if (!normalizedA || !normalizedB) return false
  if (normalizedA === normalizedB) return true

  const shorterLength = Math.min(normalizedA.length, normalizedB.length)
  if (shorterLength < 90) return false

  return tokenSimilarity(normalizedA, normalizedB) >= 0.82
}

function hasUniqueOptions(q: CleanQuestion) {
  const options = [q.option_a, q.option_b, q.option_c, q.option_d].map(normalizeQuestionForComparison)
  return new Set(options).size === 4
}

function removeDuplicateQuestions({
  questions,
  knownNormalizedQuestions,
  knownQuestionTexts,
}: {
  questions: CleanQuestion[]
  knownNormalizedQuestions: Set<string>
  knownQuestionTexts: string[]
}) {
  const accepted: CleanQuestion[] = []
  let skippedExactDuplicates = 0
  let skippedNearDuplicates = 0
  let skippedWeakOptions = 0

  for (const question of questions) {
    const normalized = normalizeQuestionForComparison(question.question_text)

    if (!normalized) continue

    if (!hasUniqueOptions(question)) {
      skippedWeakOptions += 1
      continue
    }

    if (knownNormalizedQuestions.has(normalized)) {
      skippedExactDuplicates += 1
      continue
    }

    const isNearDuplicate = knownQuestionTexts.some((existing) =>
      isNearDuplicateQuestion(normalized, existing)
    )

    if (isNearDuplicate) {
      skippedNearDuplicates += 1
      continue
    }

    accepted.push(question)
    knownNormalizedQuestions.add(normalized)
    knownQuestionTexts.push(normalized)
  }

  return {
    questions: accepted,
    skippedExactDuplicates,
    skippedNearDuplicates,
    skippedWeakOptions,
  }
}

function answerDistribution(questions: CleanQuestion[]) {
  const distribution: Record<AnswerKey, number> = { a: 0, b: 0, c: 0, d: 0 }

  for (const question of questions) {
    const answer = question.correct_answer as AnswerKey
    if (ANSWER_KEYS.includes(answer)) {
      distribution[answer] += 1
    }
  }

  return distribution
}

function classifyQuestionTechnique(questionText: string) {
  const q = questionText.toLowerCase()

  if (q.includes('avoid') || q.includes('should not')) return 'avoidance-judgment'
  if (q.includes('root cause') || q.includes('most likely cause')) return 'root-cause-diagnosis'
  if (q.includes('prevent recurrence') || q.includes('prevent this') || q.includes('prevent a similar')) return 'prevention'
  if (q.includes('do first') || q.includes('first action') || q.includes('immediate priority')) return 'first-action'
  if (q.includes('best next') || q.includes('next step')) return 'next-step'
  if (q.includes('value') || q.includes('benefit')) return 'value-tradeoff'
  if (q.includes('governance') || q.includes('compliance')) return 'governance-judgment'
  if (q.includes('how should')) return 'response-strategy'
  if (q.includes('what should')) return 'best-action'

  return 'scenario-judgment'
}

function techniqueDistribution(questions: CleanQuestion[]) {
  return questions.reduce<Record<string, number>>((acc, question) => {
    const technique = classifyQuestionTechnique(question.question_text)
    acc[technique] = (acc[technique] || 0) + 1
    return acc
  }, {})
}

function auditGeneratedQuestionBatch(questions: CleanQuestion[]) {
  const errors: string[] = []
  const warnings: string[] = []

  const answers = answerDistribution(questions)
  const answerCounts = ANSWER_KEYS.map((key) => answers[key])
  const maxAnswerCount = Math.max(...answerCounts)
  const minAnswerCount = Math.min(...answerCounts)

  if (questions.length >= 4 && maxAnswerCount - minAnswerCount > 1) {
    errors.push(
      `Answer key distribution is biased: a=${answers.a}, b=${answers.b}, c=${answers.c}, d=${answers.d}`
    )
  }

  const techniques = techniqueDistribution(questions)
  const dominantTechnique = Object.entries(techniques).sort((a, b) => b[1] - a[1])[0]

  if (questions.length >= 8 && dominantTechnique && dominantTechnique[1] / questions.length > 0.6) {
    errors.push(
      `Question technique mix is too repetitive: ${dominantTechnique[0]} appears ${dominantTechnique[1]} of ${questions.length} times`
    )
  } else if (questions.length >= 8 && dominantTechnique && dominantTechnique[1] / questions.length > 0.45) {
    warnings.push(
      `Question technique mix may be repetitive: ${dominantTechnique[0]} appears ${dominantTechnique[1]} of ${questions.length} times`
    )
  }

  return {
    errors,
    warnings,
    answerDistribution: answers,
    techniqueDistribution: techniques,
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const framework = normalizeFramework(body.framework)
    const domain = normalizeDomain(body.domain)
    const difficulty = normalizeDifficulty(body.difficulty)
    const count = clampInteger(body.count, 5, 1, 20)
    const variants = clampInteger(body.variants, 1, 1, 3)

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[QUESTION GEN] ANTHROPIC_API_KEY is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const adminSupabase = createAdminClient()
    const allGenerated: unknown[] = []
    const errors: string[] = []
    const warnings: string[] = []
    let skippedExactDuplicates = 0
    let skippedNearDuplicates = 0
    let skippedWeakOptions = 0
    const totalAnswerDistribution: Record<AnswerKey, number> = { a: 0, b: 0, c: 0, d: 0 }

    const { data: existingQuestions, error: existingQuestionsError } = await adminSupabase
      .from('questions')
      .select('id, framework, domain, difficulty, question_text')
      .eq('is_active', true)

    if (existingQuestionsError) {
      console.error('[QUESTION GEN] Could not load existing questions:', existingQuestionsError.message)
      return NextResponse.json(
        { error: 'Could not audit existing question bank before generation' },
        { status: 500 }
      )
    }

    const knownNormalizedQuestions = new Set<string>()
    const knownQuestionTexts: string[] = []

    for (const existing of existingQuestions || []) {
      const normalized = normalizeQuestionForComparison(String(existing.question_text || ''))
      if (!normalized) continue

      knownNormalizedQuestions.add(normalized)
      knownQuestionTexts.push(normalized)
    }

    for (let v = 1; v <= variants; v++) {
      const variantSeed = `${framework}-${domain}-${difficulty}-variant-${v}-${Date.now()}`
      const prompt = buildPrompt({ framework, domain, difficulty, count, seed: variantSeed })

      console.log(`[QUESTION GEN] ${framework}/${domain}/${difficulty} variant ${v}: Calling Anthropic API`)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`[QUESTION GEN] Variant ${v}: API HTTP error ${response.status}:`, errorBody)
        errors.push(`Variant ${v}: API error ${response.status}`)
        continue
      }

      const data = await response.json()

      const raw =
        data.content
          ?.filter((block: { type: string }) => block.type === 'text')
          ?.map((block: { text: string }) => block.text)
          ?.join('') || ''

      if (raw.length === 0) {
        errors.push(`Variant ${v}: Empty response from API`)
        continue
      }

      try {
        let cleaned = raw
          .replace(/```json\n?/gi, '')
          .replace(/```\n?/g, '')
          .trim()

        const startIdx = cleaned.indexOf('[')
        const endIdx = cleaned.lastIndexOf(']')

        if (startIdx === -1 || endIdx === -1) {
          errors.push(`Variant ${v}: No JSON array found in response`)
          continue
        }

        cleaned = cleaned.slice(startIdx, endIdx + 1)
        const parsed = JSON.parse(cleaned)

        if (!Array.isArray(parsed)) {
          errors.push(`Variant ${v}: Response was not an array`)
          continue
        }

        const cleanedQuestions = cleanGeneratedQuestions({
          questions: parsed,
          framework,
          domain,
          difficulty,
        })

        if (cleanedQuestions.length === 0) {
          errors.push(`Variant ${v}: No valid questions after validation`)
          continue
        }

        const duplicateAudit = removeDuplicateQuestions({
          questions: cleanedQuestions,
          knownNormalizedQuestions,
          knownQuestionTexts,
        })

        skippedExactDuplicates += duplicateAudit.skippedExactDuplicates
        skippedNearDuplicates += duplicateAudit.skippedNearDuplicates
        skippedWeakOptions += duplicateAudit.skippedWeakOptions

        const toInsert = duplicateAudit.questions

        if (toInsert.length === 0) {
          errors.push(`Variant ${v}: Duplicate/quality filters removed all generated questions`)
          continue
        }

        const qualityAudit = auditGeneratedQuestionBatch(toInsert)

        warnings.push(...qualityAudit.warnings.map((warning) => `Variant ${v}: ${warning}`))

        if (qualityAudit.errors.length > 0) {
          errors.push(...qualityAudit.errors.map((error) => `Variant ${v}: ${error}`))
          continue
        }

        for (const key of ANSWER_KEYS) {
          totalAnswerDistribution[key] += qualityAudit.answerDistribution[key]
        }

        const { data: inserted, error: insertError } = await adminSupabase
          .from('questions')
          .insert(toInsert)
          .select('id, framework, domain, difficulty')

        if (insertError) {
          console.error(`[QUESTION GEN] Variant ${v}: DB insert error:`, insertError.message)
          errors.push(`Variant ${v}: DB error — ${insertError.message}`)
        } else {
          console.log(`[QUESTION GEN] Variant ${v}: Inserted ${inserted?.length || 0} questions`)
          allGenerated.push(...(inserted || []))
        }
      } catch (parseErr) {
        console.error(`[QUESTION GEN] Variant ${v}: JSON parse error:`, parseErr)
        errors.push(`Variant ${v}: JSON parse failed`)
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      framework,
      domain,
      difficulty,
      generated: allGenerated.length,
      skipped_exact_duplicates: skippedExactDuplicates,
      skipped_near_duplicates: skippedNearDuplicates,
      skipped_weak_options: skippedWeakOptions,
      answer_distribution: totalAnswerDistribution,
      warnings: warnings.length > 0 ? warnings : undefined,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('[QUESTION GEN] Fatal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
