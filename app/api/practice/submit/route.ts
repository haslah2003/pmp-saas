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

interface StrategicReport {
  report_title: string;
  route_label: string;
  cycle_label: string;
  executive_summary: string;
  readiness_score: number;
  readiness_label: string;
  overall_score: {
    correct: number;
    total: number;
    pct: number;
  };
  domain_proficiency: {
    domain: string;
    correct: number;
    total: number;
    pct: number;
    status: string;
    insight: string;
  }[];
  growth_velocity: {
    value: string;
    insight: string;
  };
  mindset_gap: {
    label: string;
    risk_level: string;
    insight: string;
  };
  tailoring_decisiveness: {
    score: number | null;
    evidence_level: string;
    insight: string;
  };
  badges: {
    name: string;
    description: string;
    icon: string;
  }[];
  route_focus: {
    label: string;
    items: string[];
  };
  evidence: {
    question: string;
    selected: string;
    correct: string;
    domain: string;
    lesson: string;
  }[];
  next_actions: string[];
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


function buildStrategicReport({
  cycleResults,
  route,
  isArabic,
  blockNumber,
}: {
  cycleResults: QuestionResult[];
  route: string;
  isArabic: boolean;
  blockNumber: number;
}): StrategicReport {
  const routeKey = route === 'pmbok8' || route === 'bridge' ? route : 'pmbok7';
  const usableResults = cycleResults.length > 0 ? cycleResults : [];
  const total = usableResults.length;
  const correct = usableResults.filter((r) => r.isCorrect).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const routeLabel =
    routeKey === 'pmbok8'
      ? 'PMBOK 8 + ECO 2026'
      : routeKey === 'bridge'
        ? 'PMBOK 7→8 Bridge / ECO 2021→2026'
        : 'PMBOK 7 + ECO 2021';

  const reportTitle = isArabic
    ? routeKey === 'pmbok8'
      ? 'لوحة التقرير الاستراتيجي السيادي'
      : routeKey === 'bridge'
        ? 'لوحة ذكاء الانتقال بين الإصدارات'
        : 'لوحة المبادئ والأداء'
    : routeKey === 'pmbok8'
      ? 'Sovereign Strategic Dashboard'
      : routeKey === 'bridge'
        ? 'Bridge Intelligence Dashboard'
        : 'Principles & Performance Dashboard';

  const readinessLabel = isArabic
    ? pct >= 80
      ? 'جاهزية قوية للتقدم'
      : pct >= 60
        ? 'جاهزية نامية تحتاج إلى ضبط'
        : 'جاهزية تأسيسية تحتاج إلى تعزيز'
    : pct >= 80
      ? 'Strong readiness to advance'
      : pct >= 60
        ? 'Developing readiness with calibration needed'
        : 'Foundation readiness requires reinforcement';

  const stats: Record<string, { correct: number; total: number }> = {};

  for (const result of usableResults) {
    const domain = result.domain || 'general';

    if (!stats[domain]) {
      stats[domain] = { correct: 0, total: 0 };
    }

    stats[domain].total += 1;

    if (result.isCorrect) {
      stats[domain].correct += 1;
    }
  }

  const domainProficiency = Object.entries(stats)
    .map(([domain, value]) => {
      const domainPct =
        value.total > 0 ? Math.round((value.correct / value.total) * 100) : 0;

      const status = isArabic
        ? domainPct >= 80
          ? 'قوي'
          : domainPct >= 60
            ? 'مستقر'
            : 'يحتاج إلى تدخل'
        : domainPct >= 80
          ? 'Strong'
          : domainPct >= 60
            ? 'Stable'
            : 'Needs intervention';

      const insight = isArabic
        ? `${domainLabel(domain, true)}: ${value.correct}/${value.total}. ${
            domainPct >= 80
              ? 'هذا مجال قوة واضح في هذه الدورة.'
              : domainPct >= 60
                ? 'الأداء مقبول، لكن يحتاج إلى ثبات أعلى في السيناريوهات المركبة.'
                : 'هذا المجال يمثل فجوة تعلم يجب علاجها قبل الانتقال إلى أسئلة أصعب.'
          }`
        : `${domainLabel(domain, false)}: ${value.correct}/${value.total}. ${
            domainPct >= 80
              ? 'This is a clear strength in this cycle.'
              : domainPct >= 60
                ? 'Performance is acceptable, but consistency is still needed in complex scenarios.'
                : 'This is a learning gap that should be treated before moving to harder questions.'
          }`;

      return {
        domain: domainLabel(domain, isArabic),
        correct: value.correct,
        total: value.total,
        pct: domainPct,
        status,
        insight,
      };
    })
    .sort((a, b) => b.total - a.total);

  const wrongResults = usableResults.filter((r) => !r.isCorrect);

  const allText = usableResults
    .map((r) => `${r.questionText} ${r.explanation} ${r.ritaTip}`)
    .join(' ')
    .toLowerCase();

  const tailoringEvidenceFound =
    /agile|scrum|sprint|hybrid|predictive|waterfall|iterative|incremental/.test(allText);

  const strategicKeywordsFound =
    /stakeholder|value|governance|risk|benefit|business|sponsor|priority|change|sustainability|quality/.test(
      allText
    );

  const mindsetGap = isArabic
    ? wrongResults.length === 0
      ? {
          label: 'تفكير قيادي استراتيجي',
          risk_level: 'منخفض',
          insight:
            'عدم وجود أخطاء في هذه الدورة يشير إلى قدرة جيدة على قراءة السيناريوهات واتخاذ القرار المناسب، مع ضرورة تأكيد ذلك في الدورة التالية.',
        }
      : strategicKeywordsFound
        ? {
            label: 'فجوة بين التنفيذ والقيمة',
            risk_level: pct >= 60 ? 'متوسط' : 'مرتفع',
            insight:
              'تظهر بعض الإجابات الخاطئة حاجة إلى تقوية التفكير كقائد مشروع يوازن بين القيمة، أصحاب المصلحة، الحوكمة، والمخاطر، وليس فقط تنفيذ الإجراء الظاهر.',
          }
        : {
            label: 'فجوة في قراءة السيناريو',
            risk_level: pct >= 60 ? 'متوسط' : 'مرتفع',
            insight:
              'الخطأ الأساسي يبدو مرتبطًا بتحليل المطلوب من السؤال واستبعاد الخيارات الأقل مهنية قبل اختيار الإجابة.',
          }
    : wrongResults.length === 0
      ? {
          label: 'Strategic project-leader mindset',
          risk_level: 'Low',
          insight:
            'A clean cycle suggests strong scenario reading and decision discipline; the next cycle should confirm this under higher complexity.',
        }
      : strategicKeywordsFound
        ? {
            label: 'Execution-to-value gap',
            risk_level: pct >= 60 ? 'Medium' : 'High',
            insight:
              'Some wrong answers suggest the learner should think less like a task executor and more like a project leader balancing value, stakeholders, governance, and risk.',
          }
        : {
            label: 'Scenario-reading gap',
            risk_level: pct >= 60 ? 'Medium' : 'High',
            insight:
              'The main risk appears to be interpreting what the question is truly asking and eliminating less professional options before selecting the answer.',
          };

  const tailoringDecisiveness = tailoringEvidenceFound
    ? {
        score: pct,
        evidence_level: isArabic ? 'دليل موجود في أسئلة الدورة' : 'Evidence found in this cycle',
        insight: isArabic
          ? 'تضمنت الدورة مؤشرات على سياقات Agile أو Hybrid أو Predictive؛ لذلك يجب التركيز على اختيار النهج المناسب بدل تطبيق قاعدة واحدة على كل السيناريوهات.'
          : 'This cycle included signals of Agile, Hybrid, or Predictive contexts; the learner should focus on choosing the right delivery logic rather than applying one rule to every scenario.',
      }
    : {
        score: null,
        evidence_level: isArabic ? 'دليل غير كافٍ' : 'Insufficient evidence',
        insight: isArabic
          ? 'لا توجد أدلة كافية في هذه الدورة للحكم بدقة على حسم المتعلم في تكييف النهج بين Agile وPredictive وHybrid.'
          : 'This cycle does not provide enough evidence to judge tailoring decisiveness across Agile, Predictive, and Hybrid contexts.',
      };

  const badge =
    pct >= 80
      ? routeKey === 'pmbok8'
        ? {
            name: isArabic ? 'حامي القيمة الاستراتيجية' : 'Strategic Value Defender',
            description: isArabic
              ? 'أظهرت قدرة قوية على ربط قرارات المشروع بالقيمة والنتائج.'
              : 'You showed strong ability to connect project decisions to value and outcomes.',
            icon: '🛡️',
          }
        : {
            name: isArabic ? 'ممارس أداء قوي' : 'Performance Anchor',
            description: isArabic
              ? 'أظهرت ثباتًا جيدًا في تطبيق منطق اختبار PMP.'
              : 'You showed solid consistency in applying PMP exam logic.',
            icon: '🎯',
          }
      : pct >= 60
        ? {
            name: isArabic ? 'مفكر هجين نامٍ' : 'Developing Hybrid Thinker',
            description: isArabic
              ? 'لديك أساس جيد، والمرحلة التالية هي رفع دقة الحكم في السيناريوهات المركبة.'
              : 'You have a workable base; the next step is sharper judgment in mixed scenarios.',
            icon: '🧭',
          }
        : {
            name: isArabic ? 'باحث عن المسار الصحيح' : 'Pathfinder in Progress',
            description: isArabic
              ? 'هذه الدورة كشفت فجوات مهمة يمكن تحويلها بسرعة إلى تقدم واضح.'
              : 'This cycle exposed important gaps that can be converted into visible progress.',
            icon: '🧩',
          };

  const routeFocus =
    routeKey === 'pmbok8'
      ? {
          label: isArabic ? 'تركيز PMBOK 8 / ECO 2026' : 'PMBOK 8 / ECO 2026 Focus',
          items: isArabic
            ? [
                'اربط كل قرار بقيمة قابلة للقياس.',
                'انتبه للحوكمة والاستدامة وبيئة الأعمال.',
                'ميز بين مجالات الأداء السبعة ومجالات ECO الثلاثة.',
                'تعامل مع الذكاء الرقمي والذكاء الاصطناعي كجزء من نضج مدير المشروع.',
              ]
            : [
                'Connect every decision to measurable value.',
                'Watch governance, sustainability, and business context.',
                'Distinguish the seven performance domains from the three ECO domains.',
                'Treat digital and AI fluency as part of modern PM maturity.',
              ],
        }
      : routeKey === 'bridge'
        ? {
            label: isArabic ? 'تركيز وضع الجسر' : 'Bridge Mode Focus',
            items: isArabic
              ? [
                  'حافظ على منطق PMBOK 7 الذي لا يزال صالحًا.',
                  'تجنب إسقاط هياكل PMBOK 7 القديمة على PMBOK 8 دون تمييز.',
                  'راقب تغير وزن بيئة الأعمال من 8% إلى 26%.',
                  'حوّل التفكير من حفظ الهياكل إلى الحكم السياقي.',
                ]
              : [
                  'Preserve the valid PMBOK 7 reasoning that still applies.',
                  'Avoid forcing old PMBOK 7 structures into PMBOK 8.',
                  'Watch the Business Environment jump from 8% to 26%.',
                  'Shift from structure recall to contextual judgment.',
                ],
          }
        : {
            label: isArabic ? 'تركيز PMBOK 7 / ECO 2021' : 'PMBOK 7 / ECO 2021 Focus',
            items: isArabic
              ? [
                  'ثبّت منطق المجالات الثلاثة في ECO 2021.',
                  'اربط الإجابات بالمبادئ ومجالات الأداء في PMBOK 7.',
                  'استخدم الاستبعاد المنهجي قبل اختيار الإجابة.',
                  'ركز على People وProcess لأنهما يحملان الوزن الأكبر.',
                ]
              : [
                  'Stabilize the three ECO 2021 exam domains.',
                  'Connect answers to PMBOK 7 principles and performance domains.',
                  'Use disciplined elimination before selecting an answer.',
                  'Prioritize People and Process because they carry the highest weight.',
                ],
          };

  const evidence = wrongResults.slice(0, 4).map((r) => ({
    question: r.questionText,
    selected: r.selectedAnswer,
    correct: r.correctAnswer,
    domain: domainLabel(r.domain, isArabic),
    lesson:
      r.explanation ||
      (isArabic
        ? 'راجع سبب الإجابة الصحيحة وحدد لماذا كان الخيار المحدد أقل دقة.'
        : 'Review why the correct answer is stronger and why the selected option was less precise.'),
  }));

  const executiveSummary = isArabic
    ? `أكملت دورة استراتيجية من ${total} سؤالًا بنتيجة ${correct}/${total} (${pct}%). هذا التقرير لا يقيّم الدرجة فقط، بل يحدد نمط التفكير، قوة المجالات، والفجوات التي يجب علاجها في الدورة التالية.`
    : `You completed a strategic ${total}-question cycle with ${correct}/${total} (${pct}%). This report does not only grade the score; it identifies thinking pattern, domain strength, and the next gaps to close.`;

  return {
    report_title: reportTitle,
    route_label: routeLabel,
    cycle_label: isArabic
      ? `الدورة الاستراتيجية رقم ${Math.ceil(blockNumber / 3)}`
      : `Strategic Cycle ${Math.ceil(blockNumber / 3)}`,
    executive_summary: executiveSummary,
    readiness_score: pct,
    readiness_label: readinessLabel,
    overall_score: {
      correct,
      total,
      pct,
    },
    domain_proficiency: domainProficiency,
    growth_velocity: {
      value: isArabic ? 'خط أساس أولي' : 'Baseline cycle',
      insight: isArabic
        ? 'هذه أول دورة استراتيجية من 15 سؤالًا في هذا السياق؛ قياس سرعة النمو بدقة يحتاج إلى دورة استراتيجية ثانية للمقارنة.'
        : 'This is the first 15-question strategic cycle in this context; true growth velocity needs a second strategic cycle for comparison.',
    },
    mindset_gap: mindsetGap,
    tailoring_decisiveness: tailoringDecisiveness,
    badges: [badge],
    route_focus: routeFocus,
    evidence,
    next_actions:
      wrongResults.length > 0
        ? isArabic
          ? [
              'راجع الأسئلة الخاطئة وحدد الكلمة أو الجملة التي غيرت معنى السؤال.',
              'أعد حل 5 أسئلة في أضعف مجال قبل الانتقال إلى مستوى أصعب.',
              'اكتب سبب استبعاد كل خيار خاطئ في سؤالين على الأقل.',
            ]
          : [
              'Review wrong questions and identify the phrase that changed the meaning.',
              'Attempt 5 more questions in the weakest domain before moving harder.',
              'Write why each wrong option is weaker for at least two questions.',
            ]
        : isArabic
          ? [
              'انتقل إلى مستوى صعوبة أعلى مع الحفاظ على نفس منهجية التحليل.',
              'اختبر نفسك في مجال مختلف للتأكد من أن الأداء ليس مرتبطًا بمجال واحد فقط.',
              'ابدأ دورة استراتيجية ثانية لقياس سرعة النمو مقارنة بهذا الخط الأساس.',
            ]
          : [
              'Move to a higher difficulty while keeping the same analysis discipline.',
              'Test a different domain to confirm the performance is not domain-specific.',
              'Start a second strategic cycle to measure growth velocity against this baseline.',
            ],
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
      cycleResults,
    } = body as {
      sessionId: string;
      blockNumber: number;
      results: QuestionResult[];
      framework: string;
      activeFramework?: string;
      language?: string;
      cycleResults?: QuestionResult[];
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

    const strategicCycleResults =
      Array.isArray(cycleResults) && cycleResults.length > 0 ? cycleResults : results;

    const strategicReport =
      blockNumber % 3 === 0
        ? buildStrategicReport({
            cycleResults: strategicCycleResults,
            route: activeRoute,
            isArabic,
            blockNumber,
          })
        : null;

    let strategicReportId: string | null = null;

    if (strategicReport) {
      const { data: savedStrategicReport, error: strategicReportError } = await supabase
        .from('strategic_reports')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          framework,
          active_route: activeRoute,
          cycle_number: Math.ceil(blockNumber / 3),
          block_number: blockNumber,
          report_title: strategicReport.report_title,
          route_label: strategicReport.route_label,
          readiness_score: strategicReport.readiness_score,
          overall_correct: strategicReport.overall_score.correct,
          overall_total: strategicReport.overall_score.total,
          overall_pct: strategicReport.overall_score.pct,
          report_payload: strategicReport,
        })
        .select('id')
        .single();

      if (strategicReportError) {
        console.error('Strategic report save error:', strategicReportError);
      } else {
        strategicReportId = savedStrategicReport?.id || null;
      }
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
      strategicReport,
      strategicReportId,
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