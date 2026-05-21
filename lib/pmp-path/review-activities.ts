import type { Locale } from '@/lib/pmp-path/types';

export interface RPathReviewPoint {
  title: Record<Locale, string>;
  body: Record<Locale, string>;
}

export interface RPathReadinessCheck {
  id: string;
  label: Record<Locale, string>;
  evidence: Record<Locale, string>;
}

export interface RPathReviewActivity {
  id: string;
  lessonId: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  completionMessage: Record<Locale, string>;
  keyTakeaways: RPathReviewPoint[];
  readinessChecks: RPathReadinessCheck[];
  nextMission: RPathReviewPoint[];
}

const REVIEW_ACTIVITIES: Record<string, RPathReviewActivity> = {
  'pmbok8-eco2026-F1.L1': {
    id: 'pmbok8-eco2026-F1.L1.review.mindset',
    lessonId: 'pmbok8-eco2026-F1.L1',
    title: {
      en: 'Review: PMP Mindset Checkpoint',
      ar: 'مراجعة: نقطة تحقق عقلية PMP',
    },
    intro: {
      en: 'Use this checkpoint to consolidate the full learning loop. Confirm what you understood, identify what still needs reinforcement, and prepare for the next mission.',
      ar: 'استخدم نقطة التحقق هذه لترسيخ دورة التعلم كاملة. أكّد ما فهمته، وحدد ما يحتاج إلى تعزيز، واستعد للمهمة التالية.',
    },
    completionMessage: {
      en: 'You have completed the first full R-Path learning loop for this lesson.',
      ar: 'لقد أكملت أول دورة تعلم كاملة في مسار R-Path لهذا الدرس.',
    },
    keyTakeaways: [
      {
        title: {
          en: 'PMP thinking is disciplined judgment',
          ar: 'تفكير PMP هو حكم مهني منضبط',
        },
        body: {
          en: 'The strongest answer is rarely the fastest reaction. It is usually the response that protects value, evaluates impact, and uses the right process.',
          ar: 'نادراً ما تكون أقوى إجابة هي أسرع رد فعل. غالباً ما تكون الاستجابة التي تحمي القيمة، وتقيّم الأثر، وتستخدم العملية المناسبة.',
        },
      },
      {
        title: {
          en: 'Value comes before comfort',
          ar: 'القيمة تأتي قبل الراحة',
        },
        body: {
          en: 'A professional project manager does not simply satisfy the loudest stakeholder or protect the original plan blindly. The decision must serve value responsibly.',
          ar: 'مدير المشروع المحترف لا يرضي فقط صاحب المصلحة الأعلى صوتاً ولا يحمي الخطة الأصلية بشكل أعمى. يجب أن يخدم القرار القيمة بمسؤولية.',
        },
      },
      {
        title: {
          en: 'Adaptation is controlled, not random',
          ar: 'التكيّف منضبط وليس عشوائياً',
        },
        body: {
          en: 'When uncertainty is high, PMP thinking favors feedback, incremental learning, and responsible adaptation rather than delay, denial, or uncontrolled change.',
          ar: 'عندما يكون عدم اليقين مرتفعاً، تفضّل عقلية PMP التغذية الراجعة والتعلم التدريجي والتكيف المسؤول بدلاً من التأجيل أو الإنكار أو التغيير غير المنضبط.',
        },
      },
    ],
    readinessChecks: [
      {
        id: 'impact-first',
        label: {
          en: 'I can explain why impact assessment comes before commitment.',
          ar: 'أستطيع شرح لماذا يأتي تقييم الأثر قبل الالتزام.',
        },
        evidence: {
          en: 'You should be able to connect scope, schedule, cost, risk, stakeholders, and value before choosing an action.',
          ar: 'ينبغي أن تستطيع الربط بين النطاق والجدول والتكلفة والمخاطر وأصحاب المصلحة والقيمة قبل اختيار الإجراء.',
        },
      },
      {
        id: 'collaborate-first',
        label: {
          en: 'I can recognize when collaboration is better than escalation.',
          ar: 'أستطيع تمييز متى يكون التعاون أفضل من التصعيد.',
        },
        evidence: {
          en: 'You should prefer facilitation, shared understanding, and fact-based alignment when the issue is still manageable.',
          ar: 'ينبغي أن تفضّل التيسير والفهم المشترك والتوافق المبني على الحقائق عندما تكون المشكلة ما زالت قابلة للإدارة.',
        },
      },
      {
        id: 'adapt-responsibly',
        label: {
          en: 'I can choose responsible adaptation in uncertain environments.',
          ar: 'أستطيع اختيار التكيّف المسؤول في البيئات غير المؤكدة.',
        },
        evidence: {
          en: 'You should look for feedback loops, small increments, early validation, and value-focused learning.',
          ar: 'ينبغي أن تبحث عن دورات التغذية الراجعة والدفعات الصغيرة والتحقق المبكر والتعلم الموجه نحو القيمة.',
        },
      },
    ],
    nextMission: [
      {
        title: {
          en: 'Ready to continue',
          ar: 'جاهز للمتابعة',
        },
        body: {
          en: 'Move forward if you can explain the reasoning behind the correct choices without memorizing the letters.',
          ar: 'انتقل للأمام إذا كنت تستطيع شرح منطق الإجابات الصحيحة دون حفظ الحروف.',
        },
      },
      {
        title: {
          en: 'Needs reinforcement',
          ar: 'يحتاج إلى تعزيز',
        },
        body: {
          en: 'Repeat Apply or Practice if you still choose answers because they sound fast, polite, or strict rather than professionally reasoned.',
          ar: 'أعد خطوة التطبيق أو التمرين إذا كنت ما زلت تختار الإجابات لأنها تبدو سريعة أو لطيفة أو صارمة بدلاً من كونها مبنية على حكم مهني.',
        },
      },
    ],
  },
};

export function getReviewActivity(lessonId: string): RPathReviewActivity | null {
  return REVIEW_ACTIVITIES[lessonId] ?? null;
}

export default getReviewActivity;
