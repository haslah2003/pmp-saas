import type { Locale } from '@/lib/pmp-path/types';

export interface RPathExplainPoint {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

export interface RPathExplainTrap {
  temptingAnswer: Record<Locale, string>;
  whyItFails: Record<Locale, string>;
}

export interface RPathExplainActivity {
  id: string;
  lessonId: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  mindsetRule: Record<Locale, string>;
  reasoningSteps: RPathExplainPoint[];
  commonTraps: RPathExplainTrap[];
  examTransfer: RPathExplainPoint[];
  reflectionPrompt: Record<Locale, string>;
}

const EXPLAIN_ACTIVITIES: Record<string, RPathExplainActivity> = {
  'pmbok8-eco2026-F1.L1': {
    id: 'pmbok8-eco2026-F1.L1.explain.mindset',
    lessonId: 'pmbok8-eco2026-F1.L1',
    title: {
      en: 'Explain: How PMP Thinks',
      ar: 'توضيح: كيف تفكّر عقلية PMP',
    },
    intro: {
      en: 'This step converts the lesson, scenario, and mini practice into a clear decision model. The goal is not memorization; the goal is to understand how a professional project manager reasons under pressure.',
      ar: 'تحوّل هذه الخطوة الدرس والسيناريو والتمرين المصغّر إلى نموذج قرار واضح. الهدف ليس الحفظ، بل فهم كيف يفكر مدير المشروع المحترف تحت الضغط.',
    },
    mindsetRule: {
      en: 'A PMP answer is usually the option that protects value, uses evidence, engages the right people, and follows a responsible process before acting.',
      ar: 'غالباً ما تكون إجابة PMP الصحيحة هي الخيار الذي يحمي القيمة، ويستخدم الأدلة، ويشرك الأشخاص المناسبين، ويتبع عملية مسؤولة قبل التصرف.',
    },
    reasoningSteps: [
      {
        title: {
          en: '1. Pause before reacting',
          ar: '1. توقّف قبل رد الفعل',
        },
        body: {
          en: 'The PMP mindset avoids emotional reactions such as immediately accepting, rejecting, escalating, or forcing the team. First, understand what changed and why it matters.',
          ar: 'تتجنب عقلية PMP ردود الفعل العاطفية مثل القبول الفوري أو الرفض الفوري أو التصعيد أو الضغط على الفريق. ابدأ بفهم ما الذي تغيّر ولماذا هو مهم.',
        },
      },
      {
        title: {
          en: '2. Assess impact and value',
          ar: '2. قيّم الأثر والقيمة',
        },
        body: {
          en: 'Professional judgment checks scope, schedule, cost, risk, stakeholder impact, and value. This is why “assess first” is often stronger than “act immediately.”',
          ar: 'يقيس الحكم المهني أثر القرار على النطاق والجدول والتكلفة والمخاطر وأصحاب المصلحة والقيمة. لذلك يكون خيار “التقييم أولاً” أقوى غالباً من “التصرف فوراً”.',
        },
      },
      {
        title: {
          en: '3. Collaborate before escalating',
          ar: '3. تعاون قبل التصعيد',
        },
        body: {
          en: 'When people disagree, the project manager should facilitate shared understanding and evidence-based decision-making before escalating the issue.',
          ar: 'عندما يختلف الأشخاص، ينبغي لمدير المشروع تيسير الفهم المشترك واتخاذ القرار بناءً على الأدلة قبل تصعيد المشكلة.',
        },
      },
      {
        title: {
          en: '4. Adapt responsibly',
          ar: '4. تكيّف بمسؤولية',
        },
        body: {
          en: 'In uncertain environments, PMP thinking favors short feedback cycles, incremental delivery, and validated learning instead of freezing the plan or ignoring change.',
          ar: 'في البيئات غير المؤكدة، تفضّل عقلية PMP دورات تغذية راجعة قصيرة، وتسليماً تدريجياً، وتعلماً قائماً على التحقق بدلاً من تجميد الخطة أو تجاهل التغيير.',
        },
      },
    ],
    commonTraps: [
      {
        temptingAnswer: {
          en: '“Accept the request to satisfy the sponsor.”',
          ar: '“اقبل الطلب لإرضاء الراعي.”',
        },
        whyItFails: {
          en: 'It sounds customer-focused, but it bypasses impact analysis and may damage schedule, cost, risk, or team sustainability.',
          ar: 'يبدو هذا الخيار مركزاً على العميل، لكنه يتجاوز تحليل الأثر وقد يضر بالجدول أو التكلفة أو المخاطر أو استدامة الفريق.',
        },
      },
      {
        temptingAnswer: {
          en: '“Escalate immediately.”',
          ar: '“صعّد فوراً.”',
        },
        whyItFails: {
          en: 'Escalation is sometimes necessary, but PMP questions usually expect the project manager to facilitate and analyze first when the issue is still manageable.',
          ar: 'قد يكون التصعيد ضرورياً أحياناً، لكن أسئلة PMP تتوقع غالباً أن يقوم مدير المشروع بالتيسير والتحليل أولاً عندما تكون المشكلة قابلة للإدارة.',
        },
      },
      {
        temptingAnswer: {
          en: '“Protect the original plan at all costs.”',
          ar: '“احمِ الخطة الأصلية مهما كان الثمن.”',
        },
        whyItFails: {
          en: 'The plan is important, but value delivery is more important. A professional manager adapts through control, feedback, and governance.',
          ar: 'الخطة مهمة، لكن تقديم القيمة أهم. المدير المحترف يتكيف من خلال الضبط والتغذية الراجعة والحوكمة.',
        },
      },
    ],
    examTransfer: [
      {
        title: {
          en: 'When the question shows change',
          ar: 'عندما يعرض السؤال تغييراً',
        },
        body: {
          en: 'Look for an answer that evaluates impact before committing to action.',
          ar: 'ابحث عن إجابة تقيّم الأثر قبل الالتزام بأي إجراء.',
        },
      },
      {
        title: {
          en: 'When the question shows conflict',
          ar: 'عندما يعرض السؤال خلافاً',
        },
        body: {
          en: 'Look for collaboration, facilitation, and fact-based alignment before escalation.',
          ar: 'ابحث عن التعاون والتيسير وبناء التوافق بناءً على الحقائق قبل التصعيد.',
        },
      },
      {
        title: {
          en: 'When the question shows uncertainty',
          ar: 'عندما يعرض السؤال حالة عدم يقين',
        },
        body: {
          en: 'Look for feedback, incremental learning, responsible adaptation, and early validation of value.',
          ar: 'ابحث عن التغذية الراجعة والتعلم التدريجي والتكيف المسؤول والتحقق المبكر من القيمة.',
        },
      },
    ],
    reflectionPrompt: {
      en: 'Before moving to Review, ask yourself: Did I choose the answer because it sounded fast, or because it protected value through professional judgment?',
      ar: 'قبل الانتقال إلى المراجعة، اسأل نفسك: هل اخترت الإجابة لأنها بدت سريعة، أم لأنها تحمي القيمة من خلال الحكم المهني؟',
    },
  },
};

export function getExplainActivity(lessonId: string): RPathExplainActivity | null {
  return EXPLAIN_ACTIVITIES[lessonId] ?? null;
}

export default getExplainActivity;
