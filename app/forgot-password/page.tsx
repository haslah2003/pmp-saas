"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { type Locale } from "@/lib/i18n/translations";

function getCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )pmp_locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "ar" ? "ar" : "en";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const supabase = createClient();

  useEffect(() => {
    setLocale(getCookieLocale());
  }, []);

  const isAr = locale === "ar";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🎯</span>
            <span className="text-2xl font-bold text-gray-800">PMP Expert Tutor</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? "إعادة تعيين كلمة المرور" : "Reset Password"}</h1>
          <p className="text-gray-500 mt-1">
            {isAr ? "سنرسل لك رابطًا لإعادة تعيين كلمة المرور" : "We'll send you a link to reset your password"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{isAr ? "تفقد بريدك الإلكتروني" : "Check your email"}</h2>
              <p className="text-sm text-gray-500">
                {isAr ? (
                  <>أرسلنا رابط إعادة تعيين كلمة المرور إلى <strong dir="ltr">{email}</strong>. اضغط على الرابط في الرسالة لتعيين كلمة مرور جديدة.</>
                ) : (
                  <>We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.</>
                )}
              </p>
              <Link href="/login" className="inline-block text-sm text-violet-600 font-semibold hover:underline mt-2">
                {isAr ? "→ العودة لتسجيل الدخول" : "← Back to Sign In"}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? "البريد الإلكتروني" : "Email address"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm"
                  placeholder="you@example.com"
                  required
                  dir="ltr"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition disabled:opacity-50"
              >
                {loading ? (isAr ? "جارٍ الإرسال..." : "Sending...") : (isAr ? "إرسال رابط إعادة التعيين" : "Send Reset Link")}
              </button>
            </form>
          )}
        </div>

        {!sent && (
          <p className="text-center text-sm text-gray-500 mt-6">
            {isAr ? "تذكرت كلمة المرور؟" : "Remember your password?"}{" "}
            <Link href="/login" className="text-violet-600 font-semibold hover:underline">
              {isAr ? "تسجيل الدخول" : "Sign in"}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
