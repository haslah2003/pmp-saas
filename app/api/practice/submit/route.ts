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
      language,
    } = body as {
      sessionId: string;
      blockNumber: number;
      results: QuestionResult[];
      framework: string;
      language?: string;
    };

    const isArabic = language === 'ar';

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

    const wrapUpPrompt = `You are an expert PMP exam tutor. A learner just completed a 5-question practice block.

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

Generate a wrap-up with EXACTLY this JSON structure. Return only valid JSON. Do not include markdown.

{
  "score_message": "A warm, encouraging 1-sentence message about their score",
  "key_learnings": [
    {
      "concept": "concept name",
      "insight": "1-2 sentence learning point",
      "source": "PMBOK 7 / ECO 2021 / Rita"
    }
  ],
  "rita_technique": "1 specific Rita Mulcahy exam technique relevant to the questions they struggled with",
  "mindmap_center": "The central concept for the radial mind map (1-3 words)",
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
  "next_focus": "1 sentence on what they should focus on next"
}

Keep key_learnings to max 3 items. Keep mindmap_branches to 3-4 branches. Make it encouraging and practical.`;

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