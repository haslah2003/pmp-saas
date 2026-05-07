import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  ritaTip: string;
  domain: string;
  difficulty: string;
}

interface WrapUp {
  score_message: string;
  key_learnings: {
    concept: string;
    insight: string;
    source: string;
  }[];
  rita_technique: string;
  mindmap_center: string;
  mindmap_branches: {
    label: string;
    color: string;
    children: {
      label: string;
      explanation: string;
    }[];
  }[];
  next_focus: string;
}

function domainLabel(domain: string, isArabic: boolean): string {
  const labels: Record<string, { en: string; ar: string }> = {
    people: { en: 'People', ar: 'مجال الأفراد' },
    process: { en: 'Process', ar: 'مجال العمليات' },
    'business-environment': { en: 'Business Environment', ar: 'بيئة الأعمال' },
  };

  const label = labels[domain];

  if (label) {
    return isArabic ? label.ar : label.en;
  }

  return domain;
}

function extractJson(text: string): string {
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return cleaned;
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function buildFallbackWrapUp({
  score,
  wrongQuestions,
  domainsInBlock,
  isArabic,
}: {
  score: number;
  wrongQuestions: QuestionResult[];
  domainsInBlock: string[];
  isArabic: boolean;
}): WrapUp {
  if (isArabic) {
    return {
      score_message:
        score >= 80
          ? `أداء ممتاز. أنت تسير بثبات نحو إتقان مفاهيم اختبار PMP.`
          : `جهد جيد. لنراجع أهم المفاهيم التي تحتاج إلى تعزيز قبل الانتقال إلى البلوك التالي.`,
      key_learnings:
        wrongQuestions.length > 0
          ? wrongQuestions.slice(0, 3).map((q) => ({
              concept: domainLabel(q.domain, true),
              insight:
                q.explanation ||
                'راجع شرح السؤال لفهم سبب الإجابة الصحيحة وكيفية استبعاد الخيارات الأقل دقة.',
              source: domainLabel(q.domain, true),
            }))
          : domainsInBlock.slice(0, 3).map((domain) => ({
              concept: domainLabel(domain, true),
              insight:
                'أظهرت أداءً قويًا في هذا المجال. حافظ على نفس منهجية التحليل عند التعامل مع السيناريوهات الأطول والأكثر تعقيدًا.',
              source: domainLabel(domain, true),
            })),
      rita_technique:
        'اقرأ الجملة الأخيرة من السؤال أولًا لتحديد المطلوب بدقة، ثم استبعد الخيارات المتطرفة أو غير التعاونية أو التي تتجاوز إجراءات إدارة المشروع.',
      mindmap_center: 'إدارة المشاريع',
      mindmap_branches: [
        {
          label: 'تحليل السؤال',
          color: '#8b5cf6',
          children: [
            {
              label: 'المطلوب',
              explanation:
                'ابدأ بتحديد ما يطلبه السؤال: الإجراء التالي، الإجراء الأفضل، أو السبب الجذري.',
            },
          ],
        },
        {
          label: 'استبعاد الخيارات',
          color: '#06b6d4',
          children: [
            {
              label: 'الخيارات الضعيفة',
              explanation:
                'استبعد الإجابات التي تتجاهل التواصل، أو تتجاوز الحوكمة، أو تقفز إلى التصعيد دون تحليل.',
            },
          ],
        },
        {
          label: 'تفكير PMP',
          color: '#f59e0b',
          children: [
            {
              label: 'أفضل ممارسة',
              explanation:
                'اختر الإجابة التي تعكس قيادة استباقية، تعاونًا، وتحليلًا متوازنًا للسياق.',
            },
          ],
        },
      ],
      next_focus:
        score >= 80
          ? 'انتقل إلى أسئلة أكثر تعقيدًا تجمع بين أكثر من مجال معرفي، وركّز على تحليل السيناريو قبل اختيار الإجابة.'
          : 'راجع تفسيرات الإجابات غير الصحيحة، وركّز على فهم منطق اختيار أفضل إجراء وفق سياق السؤال.',
    };
  }

  return {
    score_message:
      score >= 80
        ? "Excellent work! You're on track for exam success."
        : "Good effort! Let's review the key concepts together.",
    key_learnings:
      wrongQuestions.length > 0
        ? wrongQuestions.slice(0, 3).map((q) => ({
            concept: domainLabel(q.domain, false),
            insight:
              q.explanation ||
              'Review the explanation carefully to understand why the correct answer is stronger than the distractors.',
            source: domainLabel(q.domain, false),
          }))
        : domainsInBlock.slice(0, 3).map((domain) => ({
            concept: domainLabel(domain, false),
            insight:
              'You performed strongly in this area. Continue applying the same reasoning to longer scenario-based questions.',
            source: domainLabel(domain, false),
          })),
    rita_technique:
      'Read the last sentence of each question first to identify exactly what is being asked before reading the options.',
    mindmap_center: domainsInBlock[0] || 'Project Management',
    mindmap_branches: [
      {
        label: 'Question Analysis',
        color: '#8b5cf6',
        children: [
          {
            label: 'Ask',
            explanation:
              'Identify exactly what the question is asking before choosing an answer.',
          },
        ],
      },
      {
        label: 'Elimination',
        color: '#06b6d4',
        children: [
          {
            label: 'Weak Options',
            explanation:
              'Remove options that ignore communication, governance, or stakeholder engagement.',
          },
        ],
      },
      {
        label: 'PMP Mindset',
        color: '#f59e0b',
        children: [
          {
            label: 'Best Action',
            explanation:
              'Choose the answer that is proactive, collaborative, ethical, and value-driven.',
          },
        ],
      },
    ],
    next_focus:
      'Review the explanations for any incorrect answers before moving to the next block.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const {
      sessionId,
      blockNumber,
      results,
      framework,
      activeFramework,
      language,
    } = body as {
      sessionId: string;
      blockNumber: number;
      results: QuestionResult[];
      framework: string;
      activeFramework?: string;
      language?: string;
    };

    const isArabic = language === 'ar';
    const activeRoute = activeFramework || framework || 'pmbok7';

    if (!sessionId || !Array.isArray(results)) {
      return NextResponse.json(
        { error: 'Missing sessionId or results' },
        { status: 400 }
      );
    }

    const correct = results.filter((r) => r.isCorrect).length;
    const total = results.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const responses = results.map((r) => ({
      user_id: user.id,
      session_id: sessionId,
      question_id: r.questionId,
      selected_answer: r.selectedAnswer,
      is_correct: r.isCorrect,
      block_number: blockNumber,
    }));

    if (responses.length > 0) {
      await supabase.from('practice_responses').insert(responses);
    }

    const { data: existingProfile } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const domainScores = existingProfile?.domain_scores || {};

    for (const result of results) {
      const domain = result.domain || 'unknown';

      if (!domainScores[domain]) {
        domainScores[domain] = {
          correct: 0,
          total: 0,
        };
      }

      domainScores[domain].total += 1;

      if (result.isCorrect) {
        domainScores[domain].correct += 1;
      }
    }

    const weakAreas = Object.entries(domainScores)
      .filter(([, value]) => {
        const scoreValue = value as { correct: number; total: number };
        if (!scoreValue.total) return false;
        return scoreValue.correct / scoreValue.total < 0.7;
      })
      .map(([domain]) => domain);

    const blocksCompleted = (existingProfile?.blocks_completed || 0) + 1;

    const profileUpdate = {
      user_id: user.id,
      framework,
      total_questions_answered:
        (existingProfile?.total_questions_answered || 0) + total,
      total_correct: (existingProfile?.total_correct || 0) + correct,
      domain_scores: domainScores,
      weak_areas: weakAreas,
      blocks_completed: blocksCompleted,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('learning_profiles')
      .upsert(profileUpdate, { onConflict: 'user_id' });

    const wrongQuestions = results.filter((r) => !r.isCorrect);
    const domainsInBlock = [...new Set(results.map((r) => r.domain).filter(Boolean))];

    const languageInstruction = isArabic
      ? `Generate the full wrap-up report in formal professional Modern Standard Arabic.
Do not use English except for PMP, PMBOK, ECO, Agile, Scrum, Sprint, PMO, KPI, or standard professional acronyms when appropriate.
All fields in the JSON response must be Arabic:
- score_message
- key_learnings.concept
- key_learnings.insight
- rita_technique
- mindmap_center
- mindmap_branches.label
- mindmap_branches.children.label
- mindmap_branches.children.explanation
- next_focus

Keep the tone encouraging, executive, exam-focused, concise, and suitable for PMP learners.`
      : `Generate the full wrap-up report in English.`;

    const normalizedRoute =
      activeRoute === 'pmbok8' || activeRoute === 'bridge' ? activeRoute : 'pmbok7';

    const sourceExample =
      normalizedRoute === 'pmbok8'
        ? 'PMBOK 8 / ECO 2026'
        : normalizedRoute === 'bridge'
          ? 'PMBOK 7→8 Bridge / ECO 2021→2026'
          : 'PMBOK 7 / ECO 2021 / Rita';

    const reportIdentity =
      normalizedRoute === 'pmbok8'
        ? {
            name: 'Sovereign Strategic Dashboard',
            frameworkLabel: 'PMBOK 8 + ECO 2026',
            domainWeights: 'People 33%, Process 41%, Business Environment 26%',
            analyticalFocus:
              'PMBOK 8 six principles, five Focus Areas, seven Performance Domains, value delivery, governance, sustainability, and strategic business context',
          }
        : normalizedRoute === 'bridge'
          ? {
              name: 'Bridge Intelligence Dashboard',
              frameworkLabel: 'PMBOK 7 + ECO 2021 → PMBOK 8 + ECO 2026',
              domainWeights:
                'ECO 2021: People 42%, Process 50%, Business Environment 8%; ECO 2026: People 33%, Process 41%, Business Environment 26%',
              analyticalFocus:
                'what the learner should preserve from PMBOK 7, unlearn from legacy habits, and upgrade for PMBOK 8',
            }
          : {
              name: 'Principles & Performance Dashboard',
              frameworkLabel: 'PMBOK 7 + ECO 2021',
              domainWeights: 'People 42%, Process 50%, Business Environment 8%',
              analyticalFocus:
                'PMBOK 7 principles, PMBOK 7 performance domains, ECO 2021 exam domains, and Rita-style exam discipline',
            };

    const routeInstruction =
      normalizedRoute === 'pmbok8'
        ? `Learner selected route: PMBOK 8 + ECO 2026. Current practice question source: ${framework}.
Treat this wrap-up as native PMBOK 8 + ECO 2026 practice.
Use these PMBOK 8 route facts only: six principles; five Focus Areas (Initiating, Planning, Executing, Monitoring and Controlling, Closing); seven Performance Domains (Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk); and ECO 2026 weights: People 33%, Process 41%, Business Environment 26%.
Do NOT describe PMBOK 8 practice as temporary, legacy-based, provisional, or waiting for a future bank.
Do NOT label PMBOK 8 learning points as PMBOK 7.
Do NOT use PMBOK 7's 12 principles or PMBOK 7's eight performance domains unless explicitly comparing frameworks; this 5-question PMBOK 8 wrap-up should not compare frameworks.
Emphasize value delivery, governance, sustainability, strategic judgment, AI/digital fluency when relevant, and Business Environment as a stronger strategic exam area.`
        : normalizedRoute === 'bridge'
          ? `Learner selected route: Bridge Mode from PMBOK 7 + ECO 2021 to PMBOK 8 + ECO 2026. Current practice question source: ${framework}.
Treat this wrap-up as transition-aware bridge practice.
Clearly distinguish ECO exam domains from PMBOK Guide performance domains.
Use Bridge source labels that reflect transition learning, such as PMBOK 7→8 Bridge / ECO 2021→2026.
Show what the learner should preserve from PMBOK 7, what must be upgraded for PMBOK 8, and where legacy thinking may create exam risk.`
          : `Learner selected route: PMBOK 7 + ECO 2021. Current practice question source: ${framework}.
Treat this wrap-up as PMBOK 7 + ECO 2021 practice.
Use PMBOK 7 principles, PMBOK 7 performance domains, ECO 2021 exam domains, and Rita-style PMP exam strategy.`;

    const wrapUpPrompt = `You are a senior PMP exam tutor, PMBOK framework expert, and learner-diagnostics coach.

A learner just completed a 5-question practice block. Generate a compact but high-value progress report, not a generic congratulatory summary.

REPORT IDENTITY:
- Report name: ${reportIdentity.name}
- Framework: ${reportIdentity.frameworkLabel}
- Domain weights: ${reportIdentity.domainWeights}
- Analytical focus: ${reportIdentity.analyticalFocus}

${routeInstruction}

${languageInstruction}

RESULTS:
- Score: ${correct}/${total} (${score}%)
- Domains covered: ${domainsInBlock.join(', ') || 'General PMP'}
- Questions they got WRONG: ${
      wrongQuestions.length > 0
        ? wrongQuestions
            .map(
              (q) =>
                `"${q.questionText}" (correct: ${q.correctAnswer}, selected: ${q.selectedAnswer})`
            )
            .join('; ')
        : 'None — perfect score!'
    }

DIAGNOSTIC REQUIREMENTS:
1. Domain Proficiency:
   - Infer the strongest and weakest ECO domain only from the actual block evidence.
2. Growth Velocity:
   - If no previous-cycle data is available in the prompt, say historical trend data is not yet sufficient.
   - Do not invent previous scores or progress trends.
3. Mindset Gap:
   - Identify whether the learner is thinking like a task manager or like a strategic project leader.
4. Tailoring Decisiveness:
   - Comment on predictive, agile, or hybrid judgment only when supported by the questions shown.
5. Gamification:
   - Award one meaningful badge based on observed strength.
   - Suitable badge examples: Conflict Resolver, Governance Architect, Strategic Value Defender, Hybrid Thinker, Stakeholder Diplomat, Risk Pathfinder, Sustainability Integrator, AI-Fluent PM.

OUTPUT RULES:
- Return only valid JSON.
- Do not include markdown.
- Do not include commentary outside JSON.
- Keep the existing JSON structure exactly so the current frontend does not break.
- Keep key_learnings to max 3 items.
- Keep mindmap_branches to 3-4 branches.
- Use specific coaching based on the learner's wrong answers and selected route.
- Do not invent page numbers, section numbers, quotes, or references not supplied in the prompt.

Generate EXACTLY this JSON structure:

{
  "score_message": "A motivational executive-coaching style message with a readiness insight, not generic praise",
  "key_learnings": [
    {
      "concept": "short diagnostic concept name, e.g. Mindset Gap, Domain Proficiency, Tailoring Decisiveness, Governance Judgment, Strategic Value",
      "insight": "specific 1-2 sentence diagnostic insight based on the learner's answers and selected route",
      "source": "${sourceExample}"
    }
  ],
  "rita_technique": "one exam technique phrased as strategic coaching; Rita-style is acceptable for PMBOK 7, but do not invent book quotes or edition-specific claims",
  "mindmap_center": "1-3 word strategic center concept",
  "mindmap_branches": [
    {
      "label": "branch name",
      "color": "#hexcolor",
      "children": [
        {
          "label": "sub-concept",
          "explanation": "brief explanation for the leaf node"
        }
      ]
    }
  ],
  "next_focus": "one specific next action that helps the learner improve strategically"
}

Route-specific expectations:
- For PMBOK 7: reflect Principles & Performance thinking, including PMBOK 7 principles, PMBOK 7 performance domains, ECO 2021 weights, and stable exam discipline.
- For PMBOK 8: reflect Sovereign Strategic thinking, including value delivery heatmap logic, governance, sustainability, AI/digital fluency when relevant, and the Business Environment strategic jump to 26%.
- For Bridge: reflect transition logic from PMBOK 7/ECO 2021 to PMBOK 8/ECO 2026.`;

    let wrapUp: WrapUp;

    try {
      const wrapUpResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: wrapUpPrompt }],
      });

      const firstContent = wrapUpResponse.content[0];
      const responseText =
        firstContent && firstContent.type === 'text' ? firstContent.text : '';

      wrapUp = JSON.parse(extractJson(responseText)) as WrapUp;
    } catch {
      wrapUp = buildFallbackWrapUp({
        score,
        wrongQuestions,
        domainsInBlock,
        isArabic,
      });
    }

    const { data: videos } = await supabase
      .from('video_recommendations')
      .select('*')
      .in('domain', domainsInBlock.length > 0 ? domainsInBlock : ['people', 'process'])
      .limit(3);

    return NextResponse.json({
      correct,
      total,
      score,
      blocksCompleted,
      wrapUp,
      videos: videos || [],
    });
  } catch (error) {
    console.error('Practice submit error:', error);

    return NextResponse.json(
      { error: 'Failed to submit practice block' },
      { status: 500 }
    );
  }
}