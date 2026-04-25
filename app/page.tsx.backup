import Link from "next/link";
import { cookies } from "next/headers";
import LandingLanguageSelector from "@/components/LandingLanguageSelector";

const copy = {
  en: {
    nav: {
      pricing: "Pricing",
      login: "Sign In",
      cta: "Get Started Free",
    },
    hero: {
      eyebrow: "Trusted by PMP Candidates Across the GCC & MENA",
      h1: "The PMP Certification,\nMastered Differently.",
      sub: "Built for experienced project managers who have no time to waste. Every lesson, question, and insight is drawn directly from PMBOK 7th Edition and PMP ECO 2021 — nothing more, nothing less.",
      cta1: "Start Free — No Credit Card",
      cta2: "View Pricing",
      trust: ["Aligned with PMBOK® 7th Ed.", "PMI ECO 2021 Weighted", "Predictive + Agile + Hybrid"],
    },
    stats: [
      { value: "180", label: "Exam-Style Questions" },
      { value: "8", label: "Performance Domains" },
      { value: "35", label: "ECO Task Areas" },
      { value: "3", label: "Approach Types" },
    ],
    features: {
      eyebrow: "What Makes the Difference",
      title: "Structure. Depth. Precision.",
      sub: "Stop collecting resources. Start preparing with intent.",
      items: [
        {
          icon: "📐",
          title: "Structured Domain Mastery",
          desc: "Eight performance domains, sequenced from first principle to exam-day application. No scattered content — every lesson builds on the last."
        },
        {
          icon: "🎯",
          title: "Exam-Calibrated Questions",
          desc: "Scenario-based questions engineered to the real PMP exam style. Predictive, agile, and hybrid scenarios — because the real exam doesn't pick sides."
        },
        {
          icon: "🧠",
          title: "AI-Powered Deep Dives",
          desc: "Go deeper on any concept in seconds. Case studies, analogies, and exam-angle breakdowns — grounded exclusively in PMI-approved sources."
        },
        {
          icon: "🗺️",
          title: "Visual Mind Mapping",
          desc: "See the entire PMBOK 7 framework at a glance. Connect concepts, trace relationships, and anchor knowledge — before it disappears after the exam."
        },
        {
          icon: "🎧",
          title: "Audio-First Learning",
          desc: "Commuting. Travelling. In between meetings. Studio-quality narration of every lesson — because preparation shouldn't stop when you close your laptop."
        },
        {
          icon: "📊",
          title: "Performance Tracking",
          desc: "Know where you stand before you sit the exam. Domain-by-domain progress, weak area detection, and exam readiness signals — all in one dashboard."
        },
        {
          icon: "📚",
          title: "Official Source Lock",
          desc: "Every answer, every insight, every tip — traceable to PMBOK 7 or ECO 2021. No opinion. No guesswork. Just PMI-verified content."
        },
        {
          icon: "🔄",
          title: "Predictive, Agile & Hybrid",
          desc: "The PMP exam no longer favors one methodology. Neither do we. Full coverage across all three approaches, examined from the lens of the ECO domain weightings."
        },
      ]
    },
    cta: {
      title: "Your Next Step Is Clear.",
      sub: "Join project management professionals who chose precision over pressure. Structured preparation. Official sources. Real results.",
      btn: "Begin Your PMP Preparation",
    },
    footer: {
      line1: "© 2026 PMP Expert Tutor by AiTuTorZ. Content sourced exclusively from PMBOK® Guide 7th Edition (2021) and PMP Examination Content Outline — January 2021.",
      line2: "PMP® is a registered mark of Project Management Institute, Inc. This platform is not affiliated with or endorsed by PMI.",
    }
  },
  ar: {
    nav: {
      pricing: "الأسعار",
      login: "تسجيل الدخول",
      cta: "ابدأ مجانًا",
    },
    hero: {
      eyebrow: "موثوق به من قبل المرشحين لشهادة PMP في دول الخليج والشرق الأوسط",
      h1: "شهادة PMP،\nبمنهجية مختلفة.",
      sub: "صُمِّمت لمديري المشاريع ذوي الخبرة الذين لا يملكون وقتًا للمراجعة المطوّلة. كل درس وسؤال ورؤية مستمدة مباشرة من دليل PMBOK الإصدار السابع و PMP ECO 2021 — لا أكثر ولا أقل.",
      cta1: "ابدأ مجانًا — بدون بطاقة ائتمانية",
      cta2: "عرض الأسعار",
      trust: ["متوافق مع PMBOK® الإصدار السابع", "موزون وفق PMP ECO 2021", "تنبؤي + رشيق + هجين"],
    },
    stats: [
      { value: "180", label: "سؤال بأسلوب الاختبار الحقيقي" },
      { value: "8", label: "مجالات أداء المشروع" },
      { value: "35", label: "مجال مهمة ECO" },
      { value: "3", label: "مناهج تطوير" },
    ],
    features: {
      eyebrow: "ما الذي يصنع الفارق",
      title: "هيكل. عمق. دقة.",
      sub: "توقف عن جمع المصادر. ابدأ التحضير بنيّة واضحة.",
      items: [
        {
          icon: "📐",
          title: "إتقان المجالات بمنهجية",
          desc: "ثمانية مجالات للأداء، مرتّبة من المبدأ الأساسي حتى تطبيق يوم الاختبار. لا محتوى متشتّت — كل درس يبني على سابقه."
        },
        {
          icon: "🎯",
          title: "أسئلة محكّمة وفق معايير الاختبار",
          desc: "أسئلة قائمة على السيناريو مصمَّمة وفق أسلوب اختبار PMP الحقيقي. سيناريوهات تنبؤية ورشيقة وهجينة — لأن الاختبار الحقيقي لا يأخذ بمنهجية واحدة."
        },
        {
          icon: "🧠",
          title: "تعمّق فوري بالذكاء الاصطناعي",
          desc: "تعمّق في أي مفهوم خلال ثوانٍ. دراسات حالة وتشبيهات وتحليلات من زاوية الاختبار — مرتكزة حصريًا على مصادر PMI المعتمدة."
        },
        {
          icon: "🗺️",
          title: "رسم خرائط ذهنية مرئية",
          desc: "استوعب إطار PMBOK 7 بالكامل دفعةً واحدة. ارسم الروابط بين المفاهيم، وتتبّع العلاقات، ورسّخ المعرفة — قبل أن تتلاشى بعد الاختبار."
        },
        {
          icon: "🎧",
          title: "التعلّم الصوتي أولًا",
          desc: "في التنقل. في السفر. بين الاجتماعات. سرد صوتي احترافي لكل درس — لأن التحضير يجب ألّا يتوقف حين تُغلق جهازك."
        },
        {
          icon: "📊",
          title: "تتبّع الأداء",
          desc: "اعرف مستواك قبل دخول الاختبار. تقدّم مجال بمجال، وكشف نقاط الضعف، ومؤشرات الاستعداد للاختبار — كلها في لوحة تحكم واحدة."
        },
        {
          icon: "📚",
          title: "ربط المصادر الرسمية",
          desc: "كل إجابة، كل رؤية، كل نصيحة — قابلة للتتبّع إلى PMBOK 7 أو ECO 2021. لا رأي. لا تخمين. محتوى معتمد من PMI فقط."
        },
        {
          icon: "🔄",
          title: "تنبؤي + رشيق + هجين",
          desc: "لم يعد اختبار PMP يفضّل منهجية واحدة. ونحن كذلك. تغطية كاملة للمناهج الثلاثة، من منظور أوزان مجالات ECO."
        },
      ]
    },
    cta: {
      title: "خطوتك التالية واضحة.",
      sub: "انضم إلى محترفي إدارة المشاريع الذين اختاروا الدقة على الضغط. تحضير منظّم. مصادر رسمية. نتائج حقيقية.",
      btn: "ابدأ تحضيرك لشهادة PMP",
    },
    footer: {
      line1: "© 2026 PMP Expert Tutor بواسطة AiTuTorZ. المحتوى مستمد حصريًا من دليل PMBOK® الإصدار السابع (2021) ومحتوى اختبار PMP — يناير 2021.",
      line2: "PMP® علامة تجارية مسجلة لمعهد إدارة المشاريع (PMI). هذه المنصة غير تابعة لـ PMI ولا معتمدة منه.",
    }
  }
}

export default async function LandingPage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value === 'ar' ? 'ar' : 'en'
  const t = copy[lang]
  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const bodyFont = isAr ? "'Cairo', sans-serif" : "'Outfit', sans-serif"
  const displayFont = isAr ? "'Cairo', sans-serif" : "'Syne', sans-serif"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: ${bodyFont}; }
        .display-font { font-family: ${displayFont}; }
        .hero-gradient {
          background: linear-gradient(135deg, #0f0a2e 0%, #1a0f4f 40%, #2d1b8a 70%, #1e1065 100%);
        }
        .card-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(109, 40, 217, 0.12);
          border-color: rgba(109, 40, 217, 0.4);
        }
        .trust-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .gradient-text {
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-blur {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(109, 40, 217, 0.08);
        }
        .cta-section {
          background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #6d28d9 100%);
        }
        .eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      <div dir={dir} style={{ fontFamily: bodyFont }} className="min-h-screen bg-white">

        {/* ── Nav ─────────────────────────────────────────────────── */}
        <nav className="nav-blur sticky top-0 z-50 px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎯</span>
              <span style={{ fontFamily: displayFont }} className="text-lg font-bold text-violet-900 tracking-tight">
                PMP Expert Tutor
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard/pricing"
                className="text-sm font-medium text-gray-500 hover:text-violet-700 transition-colors">
                {t.nav.pricing}
              </Link>
              <LandingLanguageSelector />
              <Link href="/login"
                className="text-sm font-medium text-gray-500 hover:text-violet-700 transition-colors">
                {t.nav.login}
              </Link>
              <Link href="/signup"
                className="bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-violet-800 transition shadow-md shadow-violet-700/25">
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="hero-gradient text-white relative overflow-hidden">
          {/* subtle grid overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
            <div className="inline-flex items-center gap-2 trust-badge rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="eyebrow text-white/70">{t.hero.eyebrow}</span>
            </div>

            <h1 style={{ fontFamily: displayFont, lineHeight: 1.1 }}
              className="text-5xl md:text-7xl font-black mb-6 whitespace-pre-line">
              {t.hero.h1.split('\n')[0]}
              <br />
              <span className="gradient-text">{t.hero.h1.split('\n')[1]}</span>
            </h1>

            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {t.hero.sub}
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
              <Link href="/signup"
                className="bg-white text-violet-800 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-violet-50 transition shadow-2xl shadow-black/30">
                {t.hero.cta1}
              </Link>
              <Link href="/dashboard/pricing"
                className="border border-white/20 text-white/80 px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/10 hover:text-white transition">
                {t.hero.cta2}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {t.hero.trust.map((badge: string) => (
                <span key={badge}
                  className="trust-badge text-white/70 text-xs font-medium px-3 py-1.5 rounded-full">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <section className="bg-violet-950 py-12 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.stats.map((s: { value: string; label: string }) => (
              <div key={s.label} className="stat-card rounded-2xl p-6 text-center">
                <div style={{ fontFamily: displayFont }}
                  className="text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-violet-300 font-medium leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="eyebrow text-violet-600 mb-3">{t.features.eyebrow}</p>
              <h2 style={{ fontFamily: displayFont }}
                className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                {t.features.title}
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-base">{t.features.sub}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.features.items.map((f: { icon: string; title: string; desc: string }) => (
                <div key={f.title}
                  className="card-hover bg-white border border-gray-100 rounded-2xl p-6">
                  <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center text-xl mb-4">
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: displayFont }}
                    className="font-bold text-gray-900 mb-2 text-base leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="cta-section py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 style={{ fontFamily: displayFont }}
              className="text-4xl md:text-5xl font-black text-white mb-5">
              {t.cta.title}
            </h2>
            <p className="text-violet-200 mb-10 text-base leading-relaxed">
              {t.cta.sub}
            </p>
            <Link href="/signup"
              className="inline-block bg-white text-violet-800 px-10 py-4 rounded-xl text-sm font-bold hover:bg-violet-50 transition shadow-2xl shadow-black/20">
              {t.cta.btn}
            </Link>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="py-10 px-6 bg-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <span style={{ fontFamily: displayFont }} className="text-white font-bold">PMP Expert Tutor</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-1">{t.footer.line1}</p>
            <p className="text-xs text-gray-600">{t.footer.line2}</p>
          </div>
        </footer>

      </div>
    </>
  );
}
