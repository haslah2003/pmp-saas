"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChoiceKey = "A" | "B" | "C" | "D";

type LocalizedText = {
  en: string;
  ar: string;
};

type DemoQuestion = {
  id: string;
  domain: LocalizedText;
  prompt: LocalizedText;
  choices: Array<{
    key: ChoiceKey;
    text: LocalizedText;
  }>;
  correctAnswer: ChoiceKey;
  explanation: LocalizedText;
  aiTip: LocalizedText;
};

const demoQuestions: DemoQuestion[] = [
  {
    id: "demo-people-1",
    domain: {
      en: "People · Conflict & Collaboration",
      ar: "الأفراد · النزاع والتعاون",
    },
    prompt: {
      en: "A senior stakeholder is repeatedly bypassing the product owner and asking developers to add urgent items directly into the sprint. What should the project manager do first?",
      ar: "يتجاوز أحد أصحاب المصلحة الكبار مالك المنتج بشكل متكرر، ويطلب من المطورين إضافة عناصر عاجلة مباشرة داخل السبرنت. ماذا ينبغي على مدير المشروع أن يفعل أولًا؟",
    },
    choices: [
      {
        key: "A",
        text: {
          en: "Accept the requests because the stakeholder is senior and business value is urgent.",
          ar: "قبول الطلبات لأن صاحب المصلحة كبير ولأن القيمة التجارية عاجلة.",
        },
      },
      {
        key: "B",
        text: {
          en: "Coach the stakeholder on the agreed change and prioritization process, then protect the team’s focus.",
          ar: "توجيه صاحب المصلحة حول آلية التغيير وترتيب الأولويات المتفق عليها، ثم حماية تركيز الفريق.",
        },
      },
      {
        key: "C",
        text: {
          en: "Escalate immediately to the sponsor and request formal disciplinary action.",
          ar: "التصعيد فورًا إلى الراعي وطلب إجراء تأديبي رسمي.",
        },
      },
      {
        key: "D",
        text: {
          en: "Ask the developers to work overtime so the sprint goal and new requests are both completed.",
          ar: "مطالبة المطورين بالعمل لساعات إضافية حتى يتم إنجاز هدف السبرنت والطلبات الجديدة معًا.",
        },
      },
    ],
    correctAnswer: "B",
    explanation: {
      en: "The PMP mindset favors servant leadership, collaboration, and protecting agreed ways of working. The project manager should address the behavior, reinforce the process, and keep the team aligned before escalating.",
      ar: "تعتمد عقلية PMP على القيادة الخادمة، والتعاون، وحماية طرق العمل المتفق عليها. ينبغي على مدير المشروع معالجة السلوك، وتعزيز العملية، والحفاظ على اتساق الفريق قبل التصعيد.",
    },
    aiTip: {
      en: "Exam signal: when a stakeholder disrupts agile flow, first coach, align, and facilitate. Avoid immediate escalation unless there is a serious unresolved blocker.",
      ar: "إشارة اختبارية: عندما يعطل صاحب مصلحة تدفق العمل الرشيق، ابدأ بالتوجيه والمواءمة والتيسير. تجنب التصعيد الفوري ما لم توجد عرقلة خطيرة غير محلولة.",
    },
  },
  {
    id: "demo-process-1",
    domain: {
      en: "Process · Change Control",
      ar: "العملية · ضبط التغيير",
    },
    prompt: {
      en: "During execution, a client requests a feature that will increase scope and cost but may improve customer satisfaction. What is the best next step?",
      ar: "أثناء التنفيذ، يطلب العميل خاصية ستزيد النطاق والتكلفة، لكنها قد تحسن رضا العميل. ما أفضل خطوة تالية؟",
    },
    choices: [
      {
        key: "A",
        text: {
          en: "Approve it because customer satisfaction is a key project success factor.",
          ar: "الموافقة عليها لأن رضا العميل عامل رئيسي في نجاح المشروع.",
        },
      },
      {
        key: "B",
        text: {
          en: "Reject it because the project baseline has already been approved.",
          ar: "رفضها لأن خط الأساس للمشروع قد تمت الموافقة عليه بالفعل.",
        },
      },
      {
        key: "C",
        text: {
          en: "Assess the impact and follow the project’s change control process before approval.",
          ar: "تقييم الأثر واتباع عملية ضبط التغيير في المشروع قبل الموافقة.",
        },
      },
      {
        key: "D",
        text: {
          en: "Ask the team to include it only if they can finish without changing the schedule.",
          ar: "مطالبة الفريق بإضافتها فقط إذا استطاعوا إنجازها دون تغيير الجدول الزمني.",
        },
      },
    ],
    correctAnswer: "C",
    explanation: {
      en: "A requested scope change should be evaluated for impact on scope, schedule, cost, risks, quality, and stakeholders. Approval should follow the defined change control approach.",
      ar: "ينبغي تقييم طلب تغيير النطاق من حيث أثره على النطاق والجدول والتكلفة والمخاطر والجودة وأصحاب المصلحة. ويجب أن تتم الموافقة وفق نهج ضبط التغيير المعتمد.",
    },
    aiTip: {
      en: "Exam signal: do not approve or reject meaningful changes emotionally. Analyze impact, follow governance, then decide.",
      ar: "إشارة اختبارية: لا توافق على التغييرات المهمة أو ترفضها بشكل عاطفي. حلّل الأثر، واتبع الحوكمة، ثم اتخذ القرار.",
    },
  },
  {
    id: "demo-business-1",
    domain: {
      en: "Business Environment · Value & Compliance",
      ar: "بيئة الأعمال · القيمة والامتثال",
    },
    prompt: {
      en: "A new regulation may affect one project deliverable. The team is unsure whether the requirement applies. What should the project manager do?",
      ar: "قد تؤثر لائحة تنظيمية جديدة على أحد مخرجات المشروع. والفريق غير متأكد مما إذا كان المتطلب ينطبق. ماذا ينبغي على مدير المشروع أن يفعل؟",
    },
    choices: [
      {
        key: "A",
        text: {
          en: "Consult appropriate compliance expertise, assess impact, and update the project approach if required.",
          ar: "استشارة خبرة مختصة في الامتثال، وتقييم الأثر، وتحديث نهج المشروع إذا لزم الأمر.",
        },
      },
      {
        key: "B",
        text: {
          en: "Continue as planned until the regulator formally contacts the organization.",
          ar: "الاستمرار كما هو مخطط حتى تتواصل الجهة التنظيمية رسميًا مع المؤسسة.",
        },
      },
      {
        key: "C",
        text: {
          en: "Remove the deliverable from scope to avoid compliance exposure.",
          ar: "إزالة المخرج من النطاق لتجنب التعرض لمخاطر الامتثال.",
        },
      },
      {
        key: "D",
        text: {
          en: "Ask the sponsor to accept the risk without further investigation.",
          ar: "مطالبة الراعي بقبول المخاطر دون مزيد من التحقق.",
        },
      },
    ],
    correctAnswer: "A",
    explanation: {
      en: "The project manager must ensure the project remains aligned with regulatory and business requirements. The right move is to verify with qualified expertise, assess impact, and adapt the plan.",
      ar: "يجب على مدير المشروع ضمان بقاء المشروع متوافقًا مع المتطلبات التنظيمية ومتطلبات الأعمال. الإجراء الصحيح هو التحقق مع خبرة مؤهلة، وتقييم الأثر، وتكييف الخطة.",
    },
    aiTip: {
      en: "Exam signal: compliance uncertainty requires proactive verification. Ignoring, deleting scope, or transferring responsibility without analysis is weak governance.",
      ar: "إشارة اختبارية: عدم اليقين في الامتثال يتطلب تحققًا استباقيًا. التجاهل أو حذف النطاق أو نقل المسؤولية دون تحليل يمثل حوكمة ضعيفة.",
    },
  },
];

function textOf(value: LocalizedText, isAr: boolean) {
  return isAr ? value.ar : value.en;
}

export default function DemoPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const isAr = lang === "ar";

  const [answers, setAnswers] = useState<Partial<Record<string, ChoiceKey>>>({});
  const [submitted, setSubmitted] = useState(false);

  const completedCount = useMemo(
    () => demoQuestions.filter((question) => answers[question.id]).length,
    [answers]
  );

  const score = useMemo(
    () =>
      demoQuestions.reduce(
        (total, question) =>
          total + (answers[question.id] === question.correctAnswer ? 1 : 0),
        0
      ),
    [answers]
  );

  const percentage = Math.round((score / demoQuestions.length) * 100);

  const resultLabel =
    percentage >= 80
      ? isAr
        ? "نقطة بداية قوية"
        : "Strong starting point"
      : percentage >= 50
        ? isAr
          ? "أساس واعد"
          : "Promising foundation"
        : isAr
          ? "تحتاج إلى تعزيز موجه"
          : "Needs guided reinforcement";

  const resultMessage =
    percentage >= 80
      ? isAr
        ? "أنت تقرأ سيناريوهات PMP بحكم مهني جيد. سيساعدك السباق الكامل على تحويل ذلك إلى ثبات وجاهزية للاختبار."
        : "You are already reading PMP scenarios with solid judgment. The full sprint will help you convert that into exam-ready consistency."
      : percentage >= 50
        ? isAr
          ? "لديك حدس عملي مفيد، لكن السباق الكامل سيقوي منطق القرار لديك عبر سيناريوهات الأفراد والعملية وبيئة الأعمال."
          : "You have useful project intuition, but the full sprint should strengthen your decision logic across People, Process, and Business Environment scenarios."
        : isAr
          ? "هذه بالضبط النقطة التي يخلق فيها التحضير الموجه قيمة حقيقية. سيساعدك السباق الكامل على بناء عقلية PMP والانضباط في قراءة السيناريوهات والثقة خطوة بخطوة."
          : "This is exactly where guided preparation creates value. The full sprint will help you build PMP mindset, scenario discipline, and confidence step by step.";

  function selectAnswer(questionId: string, key: ChoiceKey) {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionId]: key,
    }));
  }

  function submitDemo() {
    if (completedCount !== demoQuestions.length) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const lessonHref = `/dashboard/path/pmbok7-eco2021-F1/pmbok7-eco2021-F1.L1/preview?lang=${lang}`;
  const pricingHref = `/dashboard/pricing?lang=${lang}`;

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-[#2b2238] sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
                {isAr ? "تجربة PMP مجانية" : "Free PMP Demo"}
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#2b2238] md:text-4xl">
                {isAr
                  ? "اختبر حكمك في سيناريوهات PMP خلال 3 دقائق"
                  : "Test your PMP scenario judgment in 3 minutes"}
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                {isAr
                  ? "أجب عن ثلاثة أسئلة PMP واقعية، واحصل على نتيجة تشخيصية مصغرة، وعاين كيف يرشدك سباق PMP AiTutorZ الكامل نحو جاهزية الاختبار."
                  : "Answer three realistic PMP questions, receive a mini diagnostic, and preview how the full PMP AiTutorZ sprint guides your exam readiness."}
              </p>
            </div>

            <Link
              href={lessonHref}
              className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-center text-sm font-bold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              {isAr ? "عاين درسًا واحدًا" : "Preview One Lesson"}
            </Link>
          </div>

          {submitted && (
            <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                {isAr ? "نتيجة تشخيصية مصغرة" : "Mini Diagnostic Result"}
              </p>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#2b2238]">
                    {score}/{demoQuestions.length} {isAr ? "صحيحة" : "correct"} · {percentage}%
                  </h2>
                  <p className="mt-1 text-base font-bold text-amber-800">
                    {resultLabel}
                  </p>
                </div>
                <Link
                  href={pricingHref}
                  className="rounded-2xl bg-[#6d28d9] px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#5b21b6]"
                >
                  {isAr ? "اختر خطة سباق PMP" : "Choose My PMP Sprint Plan"}
                </Link>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
                {resultMessage}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-5">
          {demoQuestions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correctAnswer;

            return (
              <article
                key={question.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm font-bold text-emerald-800">
                    {isAr ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    {textOf(question.domain, isAr)}
                  </p>
                </div>

                <h2 className="mt-4 text-[19px] font-extrabold leading-8 tracking-[-0.01em] text-[#2b2238]">
                  {textOf(question.prompt, isAr)}
                </h2>

                <div className="mt-5 grid gap-3">
                  {question.choices.map((choice) => {
                    const isSelected = selectedAnswer === choice.key;
                    const showCorrect =
                      submitted && choice.key === question.correctAnswer;
                    const showWrong =
                      submitted &&
                      isSelected &&
                      choice.key !== question.correctAnswer;

                    return (
                      <button
                        key={choice.key}
                        type="button"
                        onClick={() => selectAnswer(question.id, choice.key)}
                        className={[
                          "rounded-2xl border p-4 text-sm leading-6 transition",
                          isAr ? "text-right" : "text-left",
                          "bg-white text-slate-700 shadow-sm",
                          isSelected
                            ? "border-amber-300 bg-amber-50 text-[#2b2238]"
                            : "border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/60",
                          showCorrect
                            ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                            : "",
                          showWrong
                            ? "border-rose-300 bg-rose-50 text-rose-950"
                            : "",
                        ].join(" ")}
                        aria-pressed={isSelected}
                      >
                        <span
                          dir="ltr"
                          className={isAr ? "ml-2 font-extrabold text-emerald-800" : "mr-2 font-extrabold text-emerald-800"}
                        >
                          {choice.key}.
                        </span>
                        {textOf(choice.text, isAr)}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-extrabold text-[#2b2238]">
                      {isCorrect
                        ? isAr
                          ? "حكم PMP صحيح"
                          : "Correct PMP judgment"
                        : isAr
                          ? "الإجابة الأفضل في PMP"
                          : "Better PMP answer"}
                      :{" "}
                      <span dir="ltr">{question.correctAnswer}</span>
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {textOf(question.explanation, isAr)}
                    </p>
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm leading-7 text-slate-700 shadow-sm">
                      <span className="font-bold text-emerald-800">
                        {isAr ? "ملاحظة المدرب الذكي:" : "AI Tutor note:"}
                      </span>{" "}
                      {textOf(question.aiTip, isAr)}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="font-extrabold text-[#2b2238]">
              {completedCount}/{demoQuestions.length}{" "}
              {isAr ? "أسئلة تمت الإجابة عنها" : "questions answered"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {completedCount === demoQuestions.length
                ? isAr
                  ? "أنت جاهز الآن للحصول على نتيجتك التشخيصية المجانية."
                  : "You are ready to generate your free mini diagnostic."
                : isAr
                  ? "أكمل جميع الأسئلة لفتح نتيجتك التشخيصية المجانية."
                  : "Complete all questions to unlock your free mini diagnostic."}
            </p>
          </div>

          <button
            type="button"
            onClick={submitDemo}
            disabled={completedCount !== demoQuestions.length}
            className="rounded-2xl bg-amber-300 px-6 py-3 text-sm font-extrabold text-[#2b2238] shadow-sm transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitted
              ? isAr
                ? "تم إنشاء النتيجة"
                : "Result Generated"
              : isAr
                ? "إرسال / الحصول على نتيجة التجربة"
                : "Submit / Get My Demo Result"}
          </button>
        </div>
      </section>
    </main>
  );
}
