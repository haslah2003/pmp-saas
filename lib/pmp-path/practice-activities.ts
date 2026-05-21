import type { Locale } from '@/lib/pmp-path/types';

export type PracticeOptionId = 'A' | 'B' | 'C' | 'D';

export interface RPathPracticeOption {
  id: PracticeOptionId;
  text: Record<Locale, string>;
}

export interface RPathPracticeQuestion {
  id: string;
  prompt: Record<Locale, string>;
  options: RPathPracticeOption[];
  correctOptionId: PracticeOptionId;
  explanation: Record<Locale, string>;
  examTip: Record<Locale, string>;
}

export interface RPathPracticeActivity {
  id: string;
  lessonId: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  topic: Record<Locale, string>;
  questions: RPathPracticeQuestion[];
}

const PRACTICE_ACTIVITIES: Record<string, RPathPracticeActivity> = {
  'pmbok8-eco2026-F1.L1': {
    id: 'pmbok8-eco2026-F1.L1.practice.mindset',
    lessonId: 'pmbok8-eco2026-F1.L1',
    title: {
      en: 'Mini Practice: PMP Mindset',
      ar: 'تمرين مصغّر: عقلية PMP',
    },
    topic: {
      en: 'Professional judgment, value delivery, and adaptive thinking',
      ar: 'الحكم المهني، تقديم القيمة، والتفكير التكيّفي',
    },
    intro: {
      en: 'Answer three focused questions. Select the best professional response, then check your score and review the reasoning.',
      ar: 'أجب عن ثلاثة أسئلة مركّزة. اختر أفضل تصرف مهني، ثم تحقق من نتيجتك وراجع منطق الإجابة.',
    },
    questions: [
      {
        id: 'q1',
        prompt: {
          en: 'A sponsor asks the project manager to add a valuable feature without changing the deadline. What should the project manager do first?',
          ar: 'طلب الراعي من مدير المشروع إضافة ميزة ذات قيمة دون تغيير الموعد النهائي. ما أول تصرف ينبغي أن يقوم به مدير المشروع؟',
        },
        options: [
          {
            id: 'A',
            text: {
              en: 'Accept the request immediately to maintain sponsor satisfaction.',
              ar: 'قبول الطلب فوراً للحفاظ على رضا الراعي.',
            },
          },
          {
            id: 'B',
            text: {
              en: 'Assess the impact on scope, schedule, cost, risks, and value before committing.',
              ar: 'تقييم الأثر على النطاق والجدول والتكلفة والمخاطر والقيمة قبل الالتزام.',
            },
          },
          {
            id: 'C',
            text: {
              en: 'Reject the request because changes are not allowed after planning.',
              ar: 'رفض الطلب لأن التغييرات غير مسموحة بعد التخطيط.',
            },
          },
          {
            id: 'D',
            text: {
              en: 'Ask the team to work overtime so the deadline remains unchanged.',
              ar: 'مطالبة الفريق بالعمل لساعات إضافية حتى يبقى الموعد النهائي كما هو.',
            },
          },
        ],
        correctOptionId: 'B',
        explanation: {
          en: 'A PMP mindset does not accept or reject change emotionally. It evaluates impact, trade-offs, risks, and value before recommending a decision.',
          ar: 'عقلية PMP لا تقبل التغيير أو ترفضه بشكل عاطفي. بل تقيّم الأثر والمفاضلات والمخاطر والقيمة قبل التوصية بقرار.',
        },
        examTip: {
          en: 'When a change appears, think: assess impact first, then decide through the right process.',
          ar: 'عند ظهور تغيير، فكّر بهذه الطريقة: قيّم الأثر أولاً، ثم اتخذ القرار عبر العملية المناسبة.',
        },
      },
      {
        id: 'q2',
        prompt: {
          en: 'Two experienced team members strongly disagree about the best technical approach. What is the best project manager response?',
          ar: 'اختلف عضوان متمرسان في الفريق بشدة حول أفضل نهج تقني. ما أفضل استجابة من مدير المشروع؟',
        },
        options: [
          {
            id: 'A',
            text: {
              en: 'Choose the option preferred by the most senior team member.',
              ar: 'اختيار الخيار الذي يفضله العضو الأعلى خبرة.',
            },
          },
          {
            id: 'B',
            text: {
              en: 'Escalate the disagreement immediately to the sponsor.',
              ar: 'تصعيد الخلاف فوراً إلى الراعي.',
            },
          },
          {
            id: 'C',
            text: {
              en: 'Facilitate a fact-based discussion focused on project goals, risks, and value.',
              ar: 'تيسير نقاش مبني على الحقائق ويركّز على أهداف المشروع والمخاطر والقيمة.',
            },
          },
          {
            id: 'D',
            text: {
              en: 'Postpone the decision until the conflict disappears naturally.',
              ar: 'تأجيل القرار إلى أن يختفي الخلاف تلقائياً.',
            },
          },
        ],
        correctOptionId: 'C',
        explanation: {
          en: 'The project manager should guide collaboration and decision quality, not impose authority or avoid the conflict.',
          ar: 'ينبغي لمدير المشروع أن يوجّه التعاون وجودة القرار، لا أن يفرض السلطة أو يتجنب الخلاف.',
        },
        examTip: {
          en: 'For conflict questions, prefer collaboration, facilitation, and shared understanding before escalation.',
          ar: 'في أسئلة الخلافات، فضّل التعاون والتيسير وبناء الفهم المشترك قبل التصعيد.',
        },
      },
      {
        id: 'q3',
        prompt: {
          en: 'A team is working in a changing environment where requirements are still emerging. Which mindset is most appropriate?',
          ar: 'يعمل الفريق في بيئة متغيرة وما زالت المتطلبات تظهر تدريجياً. أي عقلية هي الأنسب؟',
        },
        options: [
          {
            id: 'A',
            text: {
              en: 'Freeze all requirements early to prevent uncertainty.',
              ar: 'تجميد جميع المتطلبات مبكراً لمنع عدم اليقين.',
            },
          },
          {
            id: 'B',
            text: {
              en: 'Wait until every requirement is fully known before starting work.',
              ar: 'الانتظار حتى تصبح كل المتطلبات معروفة بالكامل قبل بدء العمل.',
            },
          },
          {
            id: 'C',
            text: {
              en: 'Ignore new feedback to protect the original plan.',
              ar: 'تجاهل التغذية الراجعة الجديدة لحماية الخطة الأصلية.',
            },
          },
          {
            id: 'D',
            text: {
              en: 'Deliver in small increments, validate frequently, and adapt based on feedback.',
              ar: 'التسليم على دفعات صغيرة، والتحقق المتكرر، والتكيّف بناءً على التغذية الراجعة.',
            },
          },
        ],
        correctOptionId: 'D',
        explanation: {
          en: 'In uncertainty, the professional mindset emphasizes learning, feedback, incremental delivery, and adaptation.',
          ar: 'في بيئة عدم اليقين، تركّز العقلية المهنية على التعلم والتغذية الراجعة والتسليم التدريجي والتكيّف.',
        },
        examTip: {
          en: 'When requirements are evolving, look for answers that validate value early and adapt responsibly.',
          ar: 'عندما تكون المتطلبات متغيرة، ابحث عن الإجابات التي تتحقق من القيمة مبكراً وتتكيّف بمسؤولية.',
        },
      },
    ],
  },
};

export function getPracticeActivity(lessonId: string): RPathPracticeActivity | null {
  return PRACTICE_ACTIVITIES[lessonId] ?? null;
}

export default getPracticeActivity;
