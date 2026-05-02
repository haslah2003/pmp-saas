import { createClient } from "@/lib/supabase/server";
import { t, type Locale } from '@/lib/i18n/translations';
import { redirect } from "next/navigation";
import PracticeClient from "./PracticeClient";
import { normalizeExamPath } from "@/lib/pmp/exam-paths";
import Link from "next/link";

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, language, active_framework")
    .eq("id", user.id)
    .single();

  const language = (profile?.language || 'en') as Locale;
  const activeFramework = normalizeExamPath(profile?.active_framework);

  const isAdmin = profile?.role === "admin";
  const isPremium = isAdmin || (sub && sub.plan !== "free" && sub.status === "active");

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t(language, 'practice.locked_title')}</h2>
        <p className="text-gray-500 max-w-md mb-6">
          {t(language, 'practice.locked_desc')}
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"
        >
          ⭐ {t(language, 'practice.upgrade')}
        </Link>
      </div>
    );
  }

  return <PracticeClient initialFramework={activeFramework} />;
}
