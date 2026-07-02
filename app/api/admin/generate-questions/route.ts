import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const maxDuration = 60

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

type AnswerKey = 'a' | 'b' | 'c' | 'd'

const ANSWER_KEYS: AnswerKey[] = ['a', 'b', 'c', 'd']
const MAX_VARIANT_ATTEMPTS = 2

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


const ASSESSMENT_METHODS = [
  {
    label: 'first-action',
    instruction: 'Use a first-action stem such as: "What should the project manager do first?"',
  },
  {
    label: 'next-step',
    instruction: 'Use a next-step stem such as: "What is the best next step?"',
  },
  {
    label: 'root-cause-diagnosis',
    instruction: 'Use a diagnosis stem such as: "What is the most likely root cause?"',
  },
  {
    label: 'prevention',
    instruction: 'Use a prevention stem such as: "What should be done to prevent recurrence?"',
  },
  {
    label: 'value-tradeoff',
    instruction: 'Use a value-focused stem such as: "Which action best supports value delivery?"',
  },
  {
    label: 'governance-judgment',
    instruction: 'Use a governance/compliance stem involving decision rights, oversight, escalation, or compliance judgment.',
  },
  {
    label: 'response-strategy',
    instruction: 'Use a response-strategy stem such as: "How should the project manager respond?"',
  },
  {
    label: 'avoidance-judgment',
    instruction: 'Use an avoidance stem such as: "What should the project manager avoid?"',
  },
  {
    label: 'delivery-approach-judgment',
    instruction: 'Use a delivery approach stem involving predictive, adaptive, or hybrid context judgment.',
  },
  {
    label: 'ethical-professional-judgment',
    instruction: 'Use an ethics/professional responsibility stem involving transparency, accountability, fairness, or integrity.',
  },
]

const DOMAIN_ANGLE_PLANS: Record<EcoDomain, Array<{ label: string; instruction: string }>> = {
  people: [
    {
      label: 'accountable-leadership',
      instruction: 'Test accountable leadership, ownership, transparency, and decision-making under uncertainty.',
    },
    {
      label: 'team-collaboration-psychological-safety',
      instruction: 'Test team collaboration, trust, psychological safety, and constructive participation.',
    },
    {
      label: 'stakeholder-communication-engagement',
      instruction: 'Test stakeholder communication, engagement, expectation management, and active listening.',
    },
    {
      label: 'conflict-management-negotiation',
      instruction: 'Test conflict management, negotiation, facilitation, and resolution of competing interests.',
    },
    {
      label: 'coaching-mentoring-knowledge-transfer',
      instruction: 'Test coaching, mentoring, knowledge transfer, learning culture, and capability building.',
    },
    {
      label: 'empowerment-motivation-delegation',
      instruction: 'Test empowerment, motivation, delegation, autonomy, and servant-leadership behaviors.',
    },
    {
      label: 'virtual-cross-cultural-communication',
      instruction: 'Test virtual, distributed, cross-cultural, or hybrid team communication and inclusion.',
    },
    {
      label: 'ethics-transparency-professional-responsibility',
      instruction: 'Test ethics, transparency, fairness, professional responsibility, and respectful conduct.',
    },
  ],
  process: [
    {
      label: 'initiating-planning-judgment',
      instruction: 'Test initiating and planning judgment, including objectives, assumptions, constraints, and stakeholder alignment.',
    },
    {
      label: 'scope-schedule-finance-tradeoffs',
      instruction: 'Test scope, schedule, finance, resource, and value trade-offs in realistic delivery decisions.',
    },
    {
      label: 'risk-issue-response',
      instruction: 'Test risk and issue response, escalation, ownership, contingency, and proactive decision-making.',
    },
    {
      label: 'quality-delivery-performance',
      instruction: 'Test quality, delivery performance, acceptance criteria, defects, and outcome-focused control.',
    },
    {
      label: 'monitoring-controlling-decisions',
      instruction: 'Test monitoring and controlling decisions using performance evidence, corrective action, and governance judgment.',
    },
    {
      label: 'predictive-adaptive-hybrid-tailoring',
      instruction: 'Test predictive, adaptive, and hybrid tailoring decisions based on project context and uncertainty.',
    },
    {
      label: 'governance-change-control',
      instruction: 'Test governance, decision rights, change control, compliance, escalation, and integrated control.',
    },
    {
      label: 'closing-acceptance-lessons-value-handover',
      instruction: 'Test closing, formal acceptance, lessons learned, benefits transition, and value handover.',
    },
  ],
  'business-environment': [
    {
      label: 'compliance-regulatory-change',
      instruction: 'Test compliance, regulatory change, legal constraints, policy shifts, and required project response.',
    },
    {
      label: 'strategy-alignment-business-value',
      instruction: 'Test strategy alignment, business value, portfolio fit, and prioritization of outcomes.',
    },
    {
      label: 'benefits-realization',
      instruction: 'Test benefits realization, benefits ownership, measurement, tracking, and value sustainability.',
    },
    {
      label: 'organizational-change-adoption',
      instruction: 'Test organizational change, adoption, readiness, resistance, and transition planning.',
    },
    {
      label: 'sustainability-external-impact',
      instruction: 'Test sustainability, environmental or social impact, and responsible long-term project decisions.',
    },
    {
      label: 'market-technology-geopolitical-economic-change',
      instruction: 'Test market, technology, geopolitical, or economic change and its impact on project direction.',
    },
    {
      label: 'governance-operational-transition',
      instruction: 'Test governance alignment, operational transition, business ownership, and post-project accountability.',
    },
    {
      label: 'stakeholder-business-readiness',
      instruction: 'Test stakeholder readiness, business readiness, operational acceptance, and organizational capability to absorb change.',
    },
  ],
}

function stableHash(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0
  }

  return Math.abs(hash)
}

function buildMandatoryAnswerKeySequence(count: number, seed: string) {
  const offset = stableHash(seed) % ANSWER_KEYS.length

  return Array.from({ length: count }, (_, index) => ANSWER_KEYS[(index + offset) % ANSWER_KEYS.length])
}

function buildMandatoryAnswerKeyPlan(count: number, seed: string) {
  return buildMandatoryAnswerKeySequence(count, seed)
    .map((answer, index) => `- Question ${index + 1}: correct_answer must be "${answer}"`)
    .join('\n')
}

function buildMandatoryTechniquePlan(count: number, seed: string) {
  const offset = stableHash(`${seed}-technique`) % ASSESSMENT_METHODS.length

  return Array.from({ length: count }, (_, index) => {
    const method = ASSESSMENT_METHODS[(index + offset) % ASSESSMENT_METHODS.length]
    return `- Question ${index + 1}: ${method.label}. ${method.instruction}`
  }).join('\n')
}

function buildMandatoryDomainAnglePlan(domain: EcoDomain, count: number, seed: string) {
  const angles = DOMAIN_ANGLE_PLANS[domain]
  const offset = stableHash(`${seed}-${domain}-domain-angle`) % angles.length

  return Array.from({ length: count }, (_, index) => {
    const angle = angles[(index + offset) % angles.length]
    return `- Question ${index + 1}: ${angle.label}. ${angle.instruction}`
  }).join('\n')
}

function buildPrompt({
  framework,
  domain,
  difficulty,
  count,
  seed,
  retryReason,
}: {
  framework: ExamFramework
  domain: EcoDomain
  difficulty: QuestionDifficulty
  count: number
  seed: string
  retryReason?: string
}) {
  const mandatoryAnswerKeyPlan = buildMandatoryAnswerKeyPlan(count, seed)
  const mandatoryTechniquePlan = buildMandatoryTechniquePlan(count, seed)
  const mandatoryDomainAnglePlan = buildMandatoryDomainAnglePlan(domain, count, seed)
  const retryInstruction = retryReason
    ? `\nRetry correction requirement:\nThe previous generation attempt failed quality audit because: ${retryReason}\nRegenerate the full JSON array from scratch. Do not reuse the failed questions. Strictly obey the mandatory answer-key plan, assessment-method plan, and domain-angle plan.\n`
    : ''

  return `Generate ${count} PMP exam questions.

${frameworkContext(framework)}

Question target:
- Framework route: ${framework}
- ECO domain DB value: ${domain}
- ECO domain label: ${domainLabel(domain)}
- Difficulty DB value: ${difficulty}
- Variation seed: ${seed}
${retryInstruction}
Mandatory answer-key plan:
The generated JSON array must follow this exact answer-key distribution by object order:
${mandatoryAnswerKeyPlan}

Mandatory assessment-method plan:
The generated JSON array must use these varied assessment methods by object order:
${mandatoryTechniquePlan}

Mandatory domain-angle plan:
The generated JSON array must use these balanced ${domainLabel(domain)} domain angles by object order:
${mandatoryDomainAnglePlan}

The first object in the JSON array is Question 1, the second object is Question 2, and so on.

Use the mandatory domain-angle plan so each generated variant behaves like a balanced mini-exam within the selected domain, not a narrow topic drill.

${domainGuidance(framework, domain)}

Each question must be a JSON object with these exact keys:

{
  "domain": "${domain}",
  "subdomain": "specific subtopic within ${domainLabel(domain)}",
  "difficulty": "${difficulty}",
  "question_text": "the full scenario-based question",
  "option_a": "...",
  "option_b": "...",
  "option_c": "...",
  "option_d": "...",
  "correct_answer": "a",
  "explanation": "...",
  "rita_tip": "...",
  "pmbok_reference": "...",
  "eco_reference": "...",

  "asf_profile": {
      "version":"1.0.0",
      "blueprintId":"auto-generate",

      "primaryCompetency":"Select ONE value from PrimaryCompetencies.",
      "secondaryCompetency":"Select ONE value from PrimaryCompetencies.",

      "decisionArchitecture":"Select ONE value from DecisionArchitectures.",

      "ambiguityLevel":1,

      "distractorStrength":"basic|moderate|advanced|expert",

      "decisionHorizon":"immediate|short_term|medium_term|long_term|enterprise",

      "principleAlignment":"Select ONE PMBOK 8 Principle.",

      "leadershipDimension":"Select ONE Leadership Dimension.",

      "systemsThinkingDimension":"Low|Medium|High",

      "cognitiveLoad":8.5,

      "estimatedPMIDifficulty":9.0,

      "qualityScore":90,

      "generationVersion":"2.0.0",

      "promptVersion":"ASF-1.0"
  }
}

Quality requirements:
- Use realistic scenario-based PMP exam style.
- Entry questions should still be professional and situational, not trivial recall.
- Use varied assessment techniques across the batch, including a mix of best next action, first action, root-cause diagnosis, prevention, value trade-off, governance judgment, stakeholder response, delivery approach judgment, and ethical/professional responsibility.
- Do not make every question use the same stem such as "What should the project manager do first?"
- Only one option may be clearly best.
- Distractors must be plausible but weaker; avoid cartoonishly wrong distractors such as simply ignoring the issue, firing people, or escalating everything unless the scenario genuinely supports that as a weak option.
- Explanations must be letter-neutral: do not mention "option A", "choice B", "answer C", or similar letter labels.
- Explain answer choices by their content/reasoning, not by their letter, so server-side answer-key alignment remains safe.
- Explanations must explicitly explain why the correct answer choice is best and why the other three answer choices are weak.
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
  asf_profile:
    q.asf_profile && typeof q.asf_profile === "object"
      ? q.asf_profile
      : undefined,
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

type CleanQuestion = ReturnType<typeof cleanGeneratedQuestions>[number]

function readAnswerOption(question: CleanQuestion, answer: string) {
  switch (answer) {
    case 'a':
      return question.option_a
    case 'b':
      return question.option_b
    case 'c':
      return question.option_c
    case 'd':
      return question.option_d
    default:
      return ''
  }
}

function writeAnswerOption(question: CleanQuestion, answer: string, value: string) {
  switch (answer) {
    case 'a':
      question.option_a = value
      break
    case 'b':
      question.option_b = value
      break
    case 'c':
      question.option_c = value
      break
    case 'd':
      question.option_d = value
      break
  }
}

function alignQuestionsToMandatoryAnswerKey({
  questions,
  seed,
}: {
  questions: CleanQuestion[]
  seed: string
}) {
  const plannedAnswerKeys = buildMandatoryAnswerKeySequence(questions.length, seed)

  return questions.map((question, index) => {
    const plannedAnswer = plannedAnswerKeys[index]

    if (!plannedAnswer || question.correct_answer === plannedAnswer) {
      return question
    }

    const currentAnswerText = readAnswerOption(question, question.correct_answer)
    const plannedAnswerText = readAnswerOption(question, plannedAnswer)

    if (!currentAnswerText || !plannedAnswerText) {
      return question
    }

    const alignedQuestion = { ...question }

    writeAnswerOption(alignedQuestion, question.correct_answer, plannedAnswerText)
    writeAnswerOption(alignedQuestion, plannedAnswer, currentAnswerText)
    alignedQuestion.correct_answer = plannedAnswer

    return alignedQuestion
  })
}

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
    const variants = clampInteger(body.variants, 1, 1, 6)

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
      let variantSucceeded = false
      let retryReason: string | undefined

      for (let attempt = 1; attempt <= MAX_VARIANT_ATTEMPTS; attempt += 1) {
        const variantSeed = `${framework}-${domain}-${difficulty}-variant-${v}-attempt-${attempt}-${Date.now()}`
        const prompt = buildPrompt({
          framework,
          domain,
          difficulty,
          count,
          seed: variantSeed,
          retryReason,
        })

        console.log(
          `[QUESTION GEN] ${framework}/${domain}/${difficulty} variant ${v}, attempt ${attempt}: Calling Anthropic API`
        )
const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5'
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
           model: anthropicModel,
            max_tokens: 10000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: prompt }],
          }),
        })

        if (!response.ok) {
          const errorBody = await response.text()
          console.error(
            `[QUESTION GEN] Variant ${v}, attempt ${attempt}: API HTTP error ${response.status}:`,
            errorBody
          )
          retryReason = `API error ${response.status}`
          if (attempt === MAX_VARIANT_ATTEMPTS) {
            errors.push(`Variant ${v}: API error ${response.status}`)
          }
          continue
        }

        const data = await response.json()

        const raw =
          data.content
            ?.filter((block: { type: string }) => block.type === 'text')
            ?.map((block: { text: string }) => block.text)
            ?.join('') || ''

        if (raw.length === 0) {
          retryReason = 'Empty response from API'
          if (attempt === MAX_VARIANT_ATTEMPTS) {
            errors.push(`Variant ${v}: Empty response from API`)
          }
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
            retryReason = 'No JSON array found in response'
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              errors.push(`Variant ${v}: No JSON array found in response`)
            }
            continue
          }

          cleaned = cleaned.slice(startIdx, endIdx + 1)
          const parsed = JSON.parse(cleaned)

          if (!Array.isArray(parsed)) {
            retryReason = 'Response was not an array'
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              errors.push(`Variant ${v}: Response was not an array`)
            }
            continue
          }

          const cleanedQuestions = cleanGeneratedQuestions({
            questions: parsed,
            framework,
            domain,
            difficulty,
          })

          if (cleanedQuestions.length === 0) {
            retryReason = 'No valid questions after validation'
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              errors.push(`Variant ${v}: No valid questions after validation`)
            }
            continue
          }

          const alignedQuestions = alignQuestionsToMandatoryAnswerKey({
            questions: cleanedQuestions,
            seed: variantSeed,
          })

          const attemptKnownNormalizedQuestions = new Set(knownNormalizedQuestions)
          const attemptKnownQuestionTexts = [...knownQuestionTexts]

          const duplicateAudit = removeDuplicateQuestions({
            questions: alignedQuestions,
            knownNormalizedQuestions: attemptKnownNormalizedQuestions,
            knownQuestionTexts: attemptKnownQuestionTexts,
          })

          const toInsert = duplicateAudit.questions.map((q: any) => {
            const rawAsf = q.asf_profile && typeof q.asf_profile === "object" ? q.asf_profile : {}

            return {
              ...q,
              asf_profile: {
                version: "1.0.0",
                blueprintId: String(rawAsf.blueprintId || "AUTO"),
                primaryCompetency: String(rawAsf.primaryCompetency || "Leadership"),
                secondaryCompetency: String(rawAsf.secondaryCompetency || "Stakeholder Influence"),
                decisionArchitecture: String(rawAsf.decisionArchitecture || "Best Action"),
                ambiguityLevel: Number(rawAsf.ambiguityLevel || 2),
                distractorStrength: String(rawAsf.distractorStrength || "advanced"),
                decisionHorizon: String(rawAsf.decisionHorizon || "short_term"),
                principleAlignment: String(rawAsf.principleAlignment || "Be an Accountable Leader"),
                leadershipDimension: String(rawAsf.leadershipDimension || "Accountability"),
                systemsThinkingDimension: String(rawAsf.systemsThinkingDimension || "Medium"),
                cognitiveLoad: Number(rawAsf.cognitiveLoad || 8),
                estimatedPMIDifficulty: Number(rawAsf.estimatedPMIDifficulty || 8),
                qualityScore: Number(rawAsf.qualityScore || 85),
                generationVersion: "2.0.0",
                promptVersion: "ASF-1.0",
              },
            }
          })

          if (toInsert.length === 0) {
            retryReason = 'Duplicate/quality filters removed all generated questions'
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              skippedExactDuplicates += duplicateAudit.skippedExactDuplicates
              skippedNearDuplicates += duplicateAudit.skippedNearDuplicates
              skippedWeakOptions += duplicateAudit.skippedWeakOptions
              errors.push(`Variant ${v}: Duplicate/quality filters removed all generated questions`)
            }
            continue
          }

          const qualityAudit = auditGeneratedQuestionBatch(toInsert)

          if (qualityAudit.errors.length > 0) {
            retryReason = qualityAudit.errors.join('; ')
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              skippedExactDuplicates += duplicateAudit.skippedExactDuplicates
              skippedNearDuplicates += duplicateAudit.skippedNearDuplicates
              skippedWeakOptions += duplicateAudit.skippedWeakOptions
              warnings.push(...qualityAudit.warnings.map((warning) => `Variant ${v}: ${warning}`))
              errors.push(...qualityAudit.errors.map((error) => `Variant ${v}: ${error}`))
            }
            continue
          }

          skippedExactDuplicates += duplicateAudit.skippedExactDuplicates
          skippedNearDuplicates += duplicateAudit.skippedNearDuplicates
          skippedWeakOptions += duplicateAudit.skippedWeakOptions
          warnings.push(...qualityAudit.warnings.map((warning) => `Variant ${v}: ${warning}`))

          for (const key of ANSWER_KEYS) {
            totalAnswerDistribution[key] += qualityAudit.answerDistribution[key]
          }

          const { data: inserted, error: insertError } = await adminSupabase
            .from('questions')
            .insert(toInsert)
            .select('id, framework, domain, difficulty')

          if (insertError) {
            console.error(`[QUESTION GEN] Variant ${v}: DB insert error:`, insertError.message)
            retryReason = `DB error — ${insertError.message}`
            if (attempt === MAX_VARIANT_ATTEMPTS) {
              errors.push(`Variant ${v}: DB error — ${insertError.message}`)
            }
            continue
          }

          for (const question of toInsert) {
            const normalized = normalizeQuestionForComparison(question.question_text)
            if (!normalized) continue
            knownNormalizedQuestions.add(normalized)
            knownQuestionTexts.push(normalized)
          }

          console.log(
            `[QUESTION GEN] Variant ${v}, attempt ${attempt}: Inserted ${inserted?.length || 0} questions`
          )
          allGenerated.push(...(inserted || []))
          variantSucceeded = true
          break
        } catch (parseErr) {
          console.error(`[QUESTION GEN] Variant ${v}, attempt ${attempt}: JSON parse error:`, parseErr)
          retryReason = 'JSON parse failed'
          if (attempt === MAX_VARIANT_ATTEMPTS) {
            errors.push(`Variant ${v}: JSON parse failed`)
          }
        }
      }

      if (!variantSucceeded) {
        console.warn(`[QUESTION GEN] Variant ${v}: Failed after ${MAX_VARIANT_ATTEMPTS} attempts`)
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
