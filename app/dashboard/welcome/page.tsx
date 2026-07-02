import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Locale = "en" | "ar";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, language")
    .eq("id", user.id)
    .single();

  const locale: Locale =
    params.lang === "ar" || profile?.language === "ar" || cookieStore.get("pmp_locale")?.value === "ar"
      ? "ar"
      : "en";

  const isAr = locale === "ar";
  const firstName = profile?.full_name?.split(" ")?.[0] || (isAr ? "مرحباً" : "there");

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl p-10 text-center">
        <div className="text-6xl mb-6">👋</div>

        <h1 className="text-4xl font-bold mb-4 text-slate-950">
          {isAr ? `مرحباً ${firstName}` : `Hello ${firstName}`}
        </h1>

        <p className="text-lg text-slate-600 mb-8 leading-8">
          {isAr ? (
            <>
              أنا مدربك الذكي لاختبار PMP.
              <br />
              سنبني معاً رحلة تعلم شخصية تناسب مستوى استعدادك الحالي.
            </>
          ) : (
            <>
              I&apos;m your AI PMP Coach.
              <br />
              Together we&apos;ll build a personalized PMP learning journey based on your current preparation.
            </>
          )}
        </p>

        <Link
          href={`/dashboard?lang=${locale}`}
          className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-white font-semibold transition shadow-lg hover:opacity-95" style={{ background: "linear-gradient(135deg, #1AB0A2 0%, #6D3DF5 100%)" }}
        >
          {isAr ? "لنبدأ" : "Let’s Begin"}
        </Link>

        <p className="mt-6 text-sm text-slate-500">
          {isAr
            ? "شاشة تأسيسية — سيتم إضافة تجربة التهيئة الذكية في الخطوة التالية."
            : "Foundation screen — the AI Coach onboarding questions will be added next."}
        </p>
      </div>
    </main>
  );
}
