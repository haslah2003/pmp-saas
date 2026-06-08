"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getPlanById } from "@/lib/plans";
import type { Period, PlanId } from "@/lib/plans";

const VALID_PLAN_IDS: PlanId[] = ["basic", "standard", "professional"];
const VALID_PERIODS: Period[] = ["monthly", "annual"];

function normalisePlanId(value: string | null): PlanId {
  return VALID_PLAN_IDS.includes(value as PlanId) ? (value as PlanId) : "standard";
}

function normalisePeriod(value: string | null): Period {
  if (value === "sprint90") return "annual";
  return VALID_PERIODS.includes(value as Period) ? (value as Period) : "annual";
}

function toPublicPeriod(value: Period): "monthly" | "sprint90" {
  return value === "annual" ? "sprint90" : "monthly";
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const isAr = lang === "ar";
  const mode = searchParams.get("mode");
  const isDemoMode = mode === "demo";
  const supabase = createClient();

  const planId = normalisePlanId(searchParams.get("plan"));
  const period = normalisePeriod(searchParams.get("period"));
  const selectedPlan = getPlanById(planId) || getPlanById("standard")!;
  const selectedPrice = period === "annual" ? selectedPlan.annual : selectedPlan.monthly;
  const periodLabel = period === "annual" ? "90-Day Sprint" : "Monthly";
  const periodSuffix = period === "annual" ? "90 days" : "month";
  const checkoutPath = `/dashboard/pricing?plan=${planId}&period=${toPublicPeriod(period)}&lang=${lang}`;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          selected_plan: planId,
          selected_period: period,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          active_framework: "pmbok7",
          selected_plan: planId,
          selected_period: period,
        })
        .eq("id", data.user.id);

      setSuccess(true);
      setTimeout(() => router.push(isDemoMode ? "/dashboard/demo" : checkoutPath), 1200);
    }

    setLoading(false);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg mb-3 bg-blue-800">
            P
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? "أنشئ حسابك" : "Create your account"}</h1>
          <p className="text-sm text-gray-500 mt-1">{isAr ? "ابدأ تحضيرك لاختبار PMP اليوم" : "Start your PMP preparation today"}</p>
        </div>

        <div className="rounded-xl border-2 border-blue-800 bg-blue-50/50 px-4 py-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">{selectedPlan.name} Plan</p>
            <p className="text-xs text-gray-500">PMBOK 7 + ECO 2021 final sprint preparation</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-800">
              {isDemoMode ? (isAr ? "لا يلزم الدفع" : "No payment required") : `${selectedPrice.label}/${periodSuffix}`}
            </p>
            <p className="text-xs text-gray-400">{isDemoMode ? (isAr ? "تجربة PMP مجانية" : "Free PMP Demo") : periodLabel}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-gray-900">Account created!</p>
              <p className="text-sm text-gray-500 mt-1">{isDemoMode ? "Opening your free demo..." : "Opening your selected checkout..."}</p>
            </div>
          ) : (
            <>
              {isDemoMode && (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
                  <p className="font-semibold text-slate-950">{isAr ? "تجربة PMP مجانية" : "Free PMP Demo"}</p>
                  <p className="mt-1 text-slate-600">
                    {isAr ? "لا يلزم الدفع. أنشئ حساب التجربة لتجربة 3 أسئلة موقفية من PMP ومعاينة درس واحد قبل اختيار الخطة." : "No payment required. Create your demo account to try 3 PMP scenario questions and preview one lesson before choosing a plan."}
                  </p>
                </div>
              )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">{isAr ? "الاسم الكامل" : "Full Name"}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "حسين الحسن" : "Hussein Al-Hassan"}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">{isAr ? "كلمة المرور" : "Password"}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isAr ? "8 أحرف على الأقل" : "Min. 8 characters"}
                  required
                  minLength={8}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition hover:opacity-90 bg-blue-800 disabled:bg-gray-400"
              >
                {loading
                  ? isAr ? "جاري إنشاء الحساب..." : "Creating account..."
                  : isDemoMode
                    ? isAr ? "أنشئ حساب التجربة المجانية" : "Create Free Demo Account"
                    : isAr ? "أنشئ الحساب وتابع إلى الدفع" : "Create Account & Continue to Checkout"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By signing up you agree to our Terms of Service. Payment will be processed securely through PayPal after account creation.
              </p>
            </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link href="/login" className="font-semibold text-blue-800">{isAr ? "تسجيل الدخول" : "Sign in"}</Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-2">
          <Link href="/#pricing" className="text-gray-400 hover:text-gray-600">{isAr ? "العودة إلى الأسعار" : "← Back to pricing"}</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
