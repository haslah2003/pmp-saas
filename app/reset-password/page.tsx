"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type Locale } from "@/lib/i18n/translations";

function getCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )pmp_locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "ar" ? "ar" : "en";
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase handles the token exchange automatically via the URL hash
    setLocale(getCookieLocale());
  }, []);

  const isAr = locale === "ar";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(isAr ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل." : "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError(isAr ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 3000);
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
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? "تعيين كلمة مرور جديدة" : "Set New Password"}</h1>
          <p className="text-gray-500 mt-1">{isAr ? "اختر كلمة مرور قوية لحسابك" : "Choose a strong password for your account"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{isAr ? "تم تحديث كلمة المرور!" : "Password Updated!"}</h2>
              <p className="text-sm text-gray-500">
                {isAr
                  ? "تمت إعادة تعيين كلمة المرور بنجاح. جارٍ التوجيه إلى لوحة التحكم..."
                  : "Your password has been reset successfully. Redirecting to dashboard..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "كلمة المرور الجديدة" : "New Password"}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-sm"
                  placeholder="••••••••"
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
                {loading ? (isAr ? "جارٍ التحديث..." : "Updating...") : (isAr ? "تحديث كلمة المرور" : "Update Password")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
