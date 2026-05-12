"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const FRAMEWORK_LABELS: Record<string, { title: string; subtitle: string; color: string }> = {
  pmbok7: { title: "PMP Prep — PMBOK 7", subtitle: "PMBOK 7th Edition + ECO 2021", color: "#1e40af" },
  pmbok8: { title: "PMP Prep — PMBOK 8", subtitle: "PMBOK 8th Edition + ECO 2026", color: "#0f766e" },
};

const PLAN_LABELS: Record<string, { label: string; price: number; period: string }> = {
  monthly_7: { label: "Monthly", price: 29, period: "mo" },
  quarterly_7: { label: "Quarterly", price: 69, period: "3 mo" },
  yearly_7: { label: "Annual", price: 199, period: "yr" },
  monthly_8: { label: "Monthly", price: 29, period: "mo" },
  quarterly_8: { label: "Quarterly", price: 69, period: "3 mo" },
  yearly_8: { label: "Annual", price: 199, period: "yr" },
};

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const framework = searchParams.get("framework") || "pmbok7";
  const plan = searchParams.get("plan") || "monthly_7";
  const fw = FRAMEWORK_LABELS[framework] || FRAMEWORK_LABELS.pmbok7;
  const pl = PLAN_LABELS[plan] || PLAN_LABELS.monthly_7;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Save framework to profile
      await supabase
        .from("profiles")
        .update({ active_framework: framework })
        .eq("id", data.user.id);

      // Save subscription with framework
      await supabase
        .from("subscriptions")
        .update({ framework })
        .eq("user_id", data.user.id);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg mb-3" style={{ backgroundColor: fw.color }}>P</div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start your PMP preparation today</p>
        </div>

        {/* Selected product summary */}
        <div className="rounded-xl border-2 px-4 py-3 mb-6 flex items-center justify-between" style={{ borderColor: fw.color, backgroundColor: fw.color + "08" }}>
          <div>
            <p className="text-sm font-bold text-gray-900">{fw.title}</p>
            <p className="text-xs text-gray-500">{fw.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: fw.color }}>${pl.price}/{pl.period}</p>
            <p className="text-xs text-gray-400">{pl.label}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-gray-900">Account created!</p>
              <p className="text-sm text-gray-500 mt-1">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hussein Al-Hassan"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email Address</label>
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
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition hover:opacity-90"
                style={{ backgroundColor: loading ? "#9ca3af" : fw.color }}
              >
                {loading ? "Creating account..." : `Create Account & Start Learning`}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By signing up you agree to our Terms of Service. Payment will be processed via PayPal after account creation.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: fw.color }}>Sign in</Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-2">
          <Link href="/pricing" className="text-gray-400 hover:text-gray-600">← Back to pricing</Link>
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