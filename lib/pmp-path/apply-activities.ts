import type { BiLingual } from '@/lib/pmp-path/types';

export interface ApplyOption {
  id: 'a' | 'b' | 'c' | 'd';
  label: BiLingual;
  feedback: BiLingual;
}

export interface ApplyActivity {
  lessonId: string;
  title: BiLingual;
  scenario: BiLingual;
  prompt: BiLingual;
  options: ApplyOption[];
  correctOptionId: ApplyOption['id'];
  principle: BiLingual;
  examTakeaway: BiLingual;
}

const APPLY_ACTIVITIES: Record<string, ApplyActivity> = {
  'pmbok8-eco2026-F1.L1': {
    lessonId: 'pmbok8-eco2026-F1.L1',
    title: {
      en: 'Apply the PMP mindset',
      ar: 'طبّق عقلية مدير المشروع المحترف',
    },
    scenario: {
      en:
        'You have just joined a project that is already under pressure. A senior stakeholder asks one of your team members to add a new feature immediately because “the customer will love it.” The team member is unsure whether to start the work now or wait for your direction.',
      ar:
        'انضممت حديثاً إلى مشروع يتعرض لضغط كبير. طلب أحد أصحاب المصلحة الكبار من أحد أعضاء فريقك إضافة ميزة جديدة فوراً لأن “العميل سيحبها”. عضو الفريق غير متأكد هل يبدأ العمل الآن أم ينتظر توجيهك.',
    },
    prompt: {
      en: 'What should the project manager do first?',
      ar: 'ما أول إجراء ينبغي أن يقوم به مدير المشروع؟',
    },
    options: [
      {
        id: 'a',
        label: {
          en: 'Tell the team member to start immediately because stakeholder satisfaction is a priority.',
          ar: 'إخبار عضو الفريق أن يبدأ فوراً لأن رضا أصحاب المصلحة أولوية.',
        },
        feedback: {
          en:
            'Not the best answer. Stakeholder satisfaction matters, but the PMP mindset does not mean accepting uncontrolled work. The project manager must protect value, alignment, and change discipline.',
          ar:
            'ليست أفضل إجابة. رضا أصحاب المصلحة مهم، لكن عقلية PMP لا تعني قبول العمل غير المنضبط. يجب على مدير المشروع حماية القيمة والمواءمة وانضباط التغيير.',
        },
      },
      {
        id: 'b',
        label: {
          en: 'Reject the request because it was not part of the original scope.',
          ar: 'رفض الطلب لأنه لم يكن ضمن النطاق الأصلي.',
        },
        feedback: {
          en:
            'Too rigid. PMP judgment is not simply saying no to change. The project manager should understand the request, assess impact, and guide it through the right decision path.',
          ar:
            'هذا موقف جامد أكثر من اللازم. الحكم المهني في PMP لا يعني رفض التغيير مباشرة. ينبغي فهم الطلب وتقييم أثره وتوجيهه عبر مسار القرار الصحيح.',
        },
      },
      {
        id: 'c',
        label: {
          en: 'Clarify the request, assess its impact on value, scope, schedule, cost, risk, and then guide it through the agreed change approach.',
          ar:
            'توضيح الطلب وتقييم أثره على القيمة والنطاق والجدول والتكلفة والمخاطر، ثم توجيهه عبر آلية التغيير المتفق عليها.',
        },
        feedback: {
          en:
            'Correct. This reflects PMP mindset: listen to stakeholders, protect value, avoid uncontrolled scope, and use the appropriate change or tailoring process before work begins.',
          ar:
            'صحيح. هذه هي عقلية PMP: الإصغاء لأصحاب المصلحة، حماية القيمة، تجنب تضخم النطاق غير المنضبط، واستخدام آلية التغيير أو التكييف المناسبة قبل بدء العمل.',
        },
      },
      {
        id: 'd',
        label: {
          en: 'Escalate the stakeholder request to the sponsor without discussing it with the team.',
          ar: 'تصعيد طلب صاحب المصلحة إلى الراعي دون مناقشته مع الفريق.',
        },
        feedback: {
          en:
            'Premature escalation. Escalation may be needed later, but the project manager should first clarify, analyze, and use the agreed governance path.',
          ar:
            'هذا تصعيد مبكر. قد يكون التصعيد مطلوباً لاحقاً، لكن على مدير المشروع أولاً التوضيح والتحليل واستخدام مسار الحوكمة المتفق عليه.',
        },
      },
    ],
    correctOptionId: 'c',
    principle: {
      en:
        'The PMP mindset balances stakeholder responsiveness with disciplined value delivery. The best answer usually protects the project system before taking action.',
      ar:
        'عقلية PMP توازن بين الاستجابة لأصحاب المصلحة وتسليم القيمة بانضباط. غالباً ما تحمي الإجابة الأفضل نظام المشروع قبل اتخاذ الإجراء.',
    },
    examTakeaway: {
      en:
        'In situational PMP questions, avoid extreme answers: do not act immediately, do not reject automatically, and do not escalate too early. First understand, assess, and follow the appropriate decision process.',
      ar:
        'في أسئلة PMP الموقفية، تجنب الإجابات المتطرفة: لا تبدأ فوراً، لا ترفض تلقائياً، ولا تصعّد مبكراً. افهم أولاً، قيّم، ثم اتبع مسار القرار المناسب.',
    },
  },
};

export function getApplyActivity(lessonId: string): ApplyActivity | null {
  return APPLY_ACTIVITIES[lessonId] ?? null;
}
