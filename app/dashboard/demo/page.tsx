"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ChoiceKey = "A" | "B" | "C" | "D";

type DemoQuestion = {
  id: string;
  domain: string;
  prompt: string;
  choices: Array<{
    key: ChoiceKey;
    text: string;
  }>;
  correctAnswer: ChoiceKey;
  explanation: string;
  aiTip: string;
};

const demoQuestions: DemoQuestion[] = [
  {
    id: "demo-people-1",
    domain: "People · Conflict & Collaboration",
    prompt:
      "A senior stakeholder is repeatedly bypassing the product owner and asking developers to add urgent items directly into the sprint. What should the project manager do first?",
    choices: [
      {
        key: "A",
        text: "Accept the requests because the stakeholder is senior and business value is urgent.",
      },
      {
        key: "B",
        text: "Coach the stakeholder on the agreed change and prioritization process, then protect the team’s focus.",
      },
      {
        key: "C",
        text: "Escalate immediately to the sponsor and request formal disciplinary action.",
      },
      {
        key: "D",
        text: "Ask the developers to work overtime so the sprint goal and new requests are both completed.",
      },
    ],
    correctAnswer: "B",
    explanation:
      "The PMP mindset favors servant leadership, collaboration, and protecting agreed ways of working. The project manager should address the behavior, reinforce the process, and keep the team aligned before escalating.",
    aiTip:
      "Exam signal: when a stakeholder disrupts agile flow, first coach, align, and facilitate. Avoid immediate escalation unless there is a serious unresolved blocker.",
  },
  {
    id: "demo-process-1",
    domain: "Process · Change Control",
    prompt:
      "During execution, a client requests a feature that will increase scope and cost but may improve customer satisfaction. What is the best next step?",
    choices: [
      {
        key: "A",
        text: "Approve it because customer satisfaction is a key project success factor.",
      },
      {
        key: "B",
        text: "Reject it because the project baseline has already been approved.",
      },
      {
        key: "C",
        text: "Assess the impact and follow the project’s change control process before approval.",
      },
      {
        key: "D",
        text: "Ask the team to include it only if they can finish without changing the schedule.",
      },
    ],
    correctAnswer: "C",
    explanation:
      "A requested scope change should be evaluated for impact on scope, schedule, cost, risks, quality, and stakeholders. Approval should follow the defined change control approach.",
    aiTip:
      "Exam signal: do not approve or reject meaningful changes emotionally. Analyze impact, follow governance, then decide.",
  },
  {
    id: "demo-business-1",
    domain: "Business Environment · Value & Compliance",
    prompt:
      "A new regulation may affect one project deliverable. The team is unsure whether the requirement applies. What should the project manager do?",
    choices: [
      {
        key: "A",
        text: "Consult appropriate compliance expertise, assess impact, and update the project approach if required.",
      },
      {
        key: "B",
        text: "Continue as planned until the regulator formally contacts the organization.",
      },
      {
        key: "C",
        text: "Remove the deliverable from scope to avoid compliance exposure.",
      },
      {
        key: "D",
        text: "Ask the sponsor to accept the risk without further investigation.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "The project manager must ensure the project remains aligned with regulatory and business requirements. The right move is to verify with qualified expertise, assess impact, and adapt the plan.",
    aiTip:
      "Exam signal: compliance uncertainty requires proactive verification. Ignoring, deleting scope, or transferring responsibility without analysis is weak governance.",
  },
];

export default function DemoPage() {
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
      ? "Strong starting point"
      : percentage >= 50
        ? "Promising foundation"
        : "Needs guided reinforcement";

  const resultMessage =
    percentage >= 80
      ? "You are already reading PMP scenarios with solid judgment. The full sprint will help you convert that into exam-ready consistency."
      : percentage >= 50
        ? "You have useful project intuition, but the full sprint should strengthen your decision logic across People, Process, and Business Environment scenarios."
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

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-[#2b2238] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
                Free PMP Demo
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#2b2238] md:text-4xl">
                Test your PMP scenario judgment in 3 minutes
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                Answer three realistic PMP questions, receive a mini diagnostic,
                and preview how the full PMP AiTutorZ sprint guides your exam
                readiness.
              </p>
            </div>

            <Link
              href="/dashboard/path/pmbok8-eco2026-F1/pmbok8-eco2026-F1.L1/preview?lang=en"
              className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-center text-sm font-bold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Preview One Lesson
            </Link>
          </div>

          {submitted && (
            <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Mini Diagnostic Result
              </p>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#2b2238]">
                    {score}/{demoQuestions.length} correct · {percentage}%
                  </h2>
                  <p className="mt-1 text-base font-bold text-amber-800">
                    {resultLabel}
                  </p>
                </div>
                <Link
                  href="/dashboard/pricing"
                  className="rounded-2xl bg-[#6d28d9] px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#5b21b6]"
                >
                  Choose My PMP Sprint Plan
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
                    Question {index + 1}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    {question.domain}
                  </p>
                </div>

                <h2 className="mt-4 text-[19px] font-extrabold leading-8 tracking-[-0.01em] text-[#2b2238]">
                  {question.prompt}
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
                          "rounded-2xl border p-4 text-left text-sm leading-6 transition",
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
                        <span className="mr-2 font-extrabold text-emerald-800">
                          {choice.key}.
                        </span>
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-extrabold text-[#2b2238]">
                      {isCorrect ? "Correct PMP judgment" : "Better PMP answer"}:{" "}
                      {question.correctAnswer}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {question.explanation}
                    </p>
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm leading-7 text-slate-700 shadow-sm">
                      <span className="font-bold text-emerald-800">
                        AI Tutor note:
                      </span>{" "}
                      {question.aiTip}
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
              {completedCount}/{demoQuestions.length} questions answered
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {completedCount === demoQuestions.length
                ? "You are ready to generate your free mini diagnostic."
                : "Complete all questions to unlock your free mini diagnostic."}
            </p>
          </div>

          <button
            type="button"
            onClick={submitDemo}
            disabled={completedCount !== demoQuestions.length}
            className="rounded-2xl bg-amber-300 px-6 py-3 text-sm font-extrabold text-[#2b2238] shadow-sm transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitted ? "Result Generated" : "Submit / Get My Demo Result"}
          </button>
        </div>
      </section>
    </main>
  );
}
