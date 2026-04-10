import Link from "next/link";
import { cookies } from "next/headers";
import LandingLanguageSelector from "@/components/LandingLanguageSelector";

const content = {
  en: {
    badge: "PMBOK 7th Edition + ECO 2021 — Source-Locked",
    h1a: "Pass the PMP Exam",
    h1b: "With AI Precision",
    subtitle: "The only AI-powered PMP prep platform grounded exclusively in official PMI sources. Study notes, audio narration, flashcards, mock exams, and an expert AiTuTorZ — all from PMBOK Guide 7th Edition and PMP ECO 2021.",
    cta1: "Start Free — No Credit Card",
    cta2: "View Plans",
    pricing: "Pricing",
    login: "Log In",
    startFree: "Start Free",
    featuresTitle: "Everything You Need to Pass",
    featuresSubtitle: "Every feature powered by AI, every answer sourced from official PMI publications.",
    ctaTitle: "Ready to Ace the PMP?",
    ctaSubtitle: "Join thousands of professionals preparing for the PMP certification with AI-powered precision.",
    ctaBtn: "Start Your Free Account",
    footer1: "© 2026 PMP Expert Tutor. Sources: PMBOK® Guide 7th Edition (2021) + PMP ECO January 2021 — PMI.",
    footer2: "PMP® is a registered mark of Project Management Institute, Inc.",
    stats: [
      { value: "42%", label: "People Domain" },
      { value: "50%", label: "Process Domain" },
      { value: "8%", label: "Business Environment" },
      { value: "180", label: "Exam Questions" },
    ],
    features: [
      { icon: "🗺️", title: "Interactive Mind Map", desc: "Visual overview of PMBOK 7th Edition and all 35 ECO tasks" },
      { icon: "📝", title: "AI Study Notes", desc: "Comprehensive, self-contained notes for every concept with PMI citations" },
      { icon: "🎧", title: "Audio Narration", desc: "Studio-quality AI voice explanations powered by ElevenLabs" },
      { icon: "🃏", title: "Smart Flashcards", desc: "AI-generated flashcards with questions, answers, and PMI sources" },
      { icon: "✅", title: "Scenario Quizzes", desc: "Multi-level exam questions with rationale and PMI Mindset guidance" },
      { icon: "🤖", title: "AI Expert Tutor", desc: "Ask anything — answers grounded exclusively in PMBOK 7 + ECO 2021" },
      { icon: "🎓", title: "Mock Exams", desc: "Timed exam simulations with ECO domain weightings and detailed review" },
      { icon: "📚", title: "Structured Course", desc: "Module-by-module learning path covering all exam domains" },
    ],
  },
  ar: {
    badge: "الدليل المعرفي لإدارة المشاريع — الإصدار السابع + ECO 2021 — مرجع رسمي معتمد",
    h1a: "اجتز امتحان PMP",
    h1b: "بدقة الذكاء الاصطناعي",
    subtitle: "المنصة الوحيدة للتحضير لاختبار PMP المدعومة بالذكاء الاصطناعي، المرتكزة حصريًا على المصادر الرسمية لـ PMI. ملاحظات دراسية، شرح صوتي، بطاقات تعليمية، اختبارات محاكاة، ومعلّم خبير AiTuTorZ — كل ذلك من دليل PMBOK الإصدار السابع و PMP ECO 2021.",
    cta1: "ابدأ مجانًا — بدون بطاقة ائتمانية",
    cta2: "عرض الخطط",
    pricing: "الأسعار",
    login: "تسجيل الدخول",
    startFree: "ابدأ مجانًا",
    featuresTitle: "كل ما تحتاجه للنجاح",
    featuresSubtitle: "كل ميزة مدعومة بالذكاء الاصطناعي، وكل إجابة مستمدة من المنشورات الرسمية لـ PMI.",
    ctaTitle: "هل أنت مستعد للنجاح في PMP؟",
    ctaSubtitle: "انضم إلى آلاف المحترفين الذين يستعدون لشهادة PMP بدقة الذكاء الاصطناعي.",
    ctaBtn: "أنشئ حسابك المجاني",
    footer1: "© 2026 PMP Expert Tutor. المصادر: دليل PMBOK® الإصدار السابع (2021) + PMP ECO يناير 2021 — PMI.",
    footer2: "PMP® علامة تجارية مسجلة لمعهد إدارة المشاريع (PMI).",
    stats: [
      { value: "42%", label: "مجال الأفراد" },
      { value: "50%", label: "مجال العمليات" },
      { value: "8%", label: "بيئة الأعمال" },
      { value: "180", label: "سؤال اختبار" },
    ],
    features: [
      { icon: "🗺️", title: "خريطة ذهنية تفاعلية", desc: "نظرة عامة مرئية على الدليل المعرفي لإدارة المشاريع الإصدار السابع وجميع مهام ECO الـ35" },
      { icon: "📝", title: "ملاحظات دراسية بالذكاء الاصطناعي", desc: "ملاحظات شاملة وقائمة بذاتها لكل مفهوم مع مراجع PMI" },
      { icon: "🎧", title: "السرد الصوتي", desc: "شروحات صوتية احترافية بتقنية الذكاء الاصطناعي مدعومة بـ ElevenLabs" },
      { icon: "🃏", title: "بطاقات تعليمية ذكية", desc: "بطاقات تعليمية مولّدة بالذكاء الاصطناعي مع الأسئلة والإجابات ومصادر PMI" },
      { icon: "✅", title: "اختبارات السيناريو", desc: "أسئلة اختبار متعددة المستويات مع التوضيح والتوجيه المهني لـ PMI" },
      { icon: "🤖", title: "المعلّم الخبير بالذكاء الاصطناعي", desc: "اسأل عن أي شيء — إجابات مرتكزة حصريًا على PMBOK 7 + ECO 2021" },
      { icon: "🎓", title: "اختبارات محاكاة", desc: "محاكاة اختبار بتوقيت حقيقي مع أوزان مجالات ECO ومراجعة تفصيلية" },
      { icon: "📚", title: "دورة منظمة", desc: "مسار تعلّم وحدة تلو الأخرى يغطي جميع مجالات الاختبار" },
    ],
  },
}

export default async function LandingPage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value === 'ar' ? 'ar' : 'en'
  const t = content[lang]
  const isAr = lang === 'ar'

  return (
    <div className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span className="text-xl font-bold text-brand-800">PMP Expert Tutor</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-500">
            {t.pricing}
          </Link>
          <LandingLanguageSelector />
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-500">
            {t.login}
          </Link>
          <Link
            href="/signup"
            className="bg-brand-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-600 transition"
          >
            {t.startFree}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          {t.badge}
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-brand-800 leading-tight mb-6">
          {t.h1a}
          <br />
          <span className="text-brand-500">{t.h1b}</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-brand-500 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-500/25"
          >
            {t.cta1}
          </Link>
          <Link
            href="/dashboard/pricing"
            className="border-2 border-brand-200 text-brand-600 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-50 transition"
          >
            {t.cta2}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-800 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {t.stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm text-brand-200 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-800 mb-4">
          {t.featuresTitle}
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          {t.featuresSubtitle}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-lg transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-brand-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t.ctaTitle}
        </h2>
        <p className="text-brand-100 mb-8 max-w-lg mx-auto">
          {t.ctaSubtitle}
        </p>
        <Link
          href="/signup"
          className="inline-block bg-white text-brand-600 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-50 transition shadow-lg"
        >
          {t.ctaBtn}
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-400">
        <p>{t.footer1}</p>
        <p className="mt-1">{t.footer2}</p>
      </footer>
    </div>
  );
}
