"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import LandingLanguageSelector from "@/components/LandingLanguageSelector";

const C = { teal: "#1AB0A2", tealDk: "#148F84", tealLt: "#E6F8F6", purple: "#5B2D91", purpleDk: "#472272", purpleLt: "#F0EAFA", amber: "#F5A623", amberLt: "#FFF7E6", dark: "#1A1430", muted: "#5E6078", bg: "#FAFAF9" };

const copy = {
  en: {
    nav: { pricing: "Pricing", login: "Sign In", cta: "Try a Free Lesson" },
    hero: {
      badge1: "PMBOK 7 + ECO 2021",
      badge2: "Current PMP Exam Sprint",
      h1a: "Pass the current PMP exam",
      h1b: "before ",
      h1c: "it changes",
      h1d: "",
      sub: "A focused PMBOK 7 + ECO 2021 preparation sprint for candidates targeting the current PMP exam before the July 2026 change. Practice with 679 bilingual questions, AI explanations, and readiness tracking — without restarting your preparation.",
      cta1: "Try a Free Lesson",
      cta2: "Watch Demo", cta3: "View Plans",
      s1v: "679",
      s1l: "bilingual questions",
      s2v: "PMBOK 7",
      s2l: "+ ECO 2021",
      s3v: "AR + EN",
      s3l: "Arabic + English",
      upload: "Click to upload hero image",
      uploadHint: "Recommended: 800×600 or 16:9",
    },
    features: {
      label: "Features",
      title: "Focused preparation for the exam version you are actually taking",
      items: [
        { icon: "🤖", title: "AI tutor", desc: "Ask in English or Arabic and get exam-focused explanations aligned with PMBOK 7 + ECO 2021." },
        { icon: "🧠", title: "MindMap explorer", desc: "Review PMP concepts visually so you can connect principles, domains, processes, and exam reasoning faster." },
        { icon: "📝", title: "Practice engine", desc: "Train with 679 bilingual current-exam questions and rationales that explain why the best answer is best." },
        { icon: "🌐", title: "Arabic + English Learning Mode", desc: "Study PMP concepts and practice questions in bilingual mode, supporting both English and Arabic-speaking candidates." },
        { icon: "📊", title: "Progress dashboard", desc: "Track weak areas, readiness signals, and domain performance before you commit to your exam date." },
        { icon: "🔄", title: "Dual framework", desc: "Use PMBOK 7 + ECO 2021 for the current exam, with PMBOK 8 + ECO 2026 early access for the next exam cycle." },
      ],
    },
    how: {
      label: "How it works",
      title: "Four steps to your PMP final sprint",
      steps: [
        { num: "01", title: "Choose your exam path", desc: "Select PMBOK 7 + ECO 2021 if you are targeting the current PMP exam before the change." },
        { num: "02", title: "Practice under exam logic", desc: "Train with scenario-based questions that test judgment, not memorization." },
        { num: "03", title: "Diagnose weak areas", desc: "Use reports and explanations to identify what to fix before your exam date." },
        { num: "04", title: "Finish with focus", desc: "Consolidate weak domains and prepare strategically instead of restarting with a new framework." },
      ],
    },
    pricing: {
      label: "Pricing",
      title: "Choose your PMP final sprint plan",
      sub: "Focused preparation for candidates targeting the current PMP exam before the July change. Upgrade anytime as your preparation needs grow.",
      monthly: "Monthly",
      annual: "90-Day Sprint",
      saveBadge: "Best sprint value",
      perMonth: "/month",
      orYear: "or",
      yearSuffix: "/90 days",
      secured: "Secured by PayPal",
      cards: "Debit or credit card",
      cancel: "Upgrade anytime",
      plans: [
        { name: "Basic", emoji: "🚀", tagline: "Start your current-exam preparation", monthly: 29, annual: 79, annualSave: "Save 9%", features: ["Full Course Library (24 lessons)", "AI Tutor — unlimited sessions", "Practice Engine — focused question sets", "Progress Dashboard", "Interactive Mind Maps", "PMBOK 7 + ECO 2021 framework"], cta: "Get Basic", popular: false },
        { name: "Standard", emoji: "⚡", tagline: "Complete current-exam preparation toolkit", monthly: 49, annual: 129, annualSave: "Save 12%", features: ["Everything in Basic ✅", "679 bilingual practice questions", "Mock Exam (180 questions)", "Guru Report & weak area analysis", "Go Deeper AI expansions", "PMBOK 7 + ECO 2021 framework", "Priority content updates"], cta: "Get Standard", popular: true },
        { name: "Professional", emoji: "💎", tagline: "Maximum support for urgent PMP candidates", monthly: 79, annual: 199, annualSave: "Save 16%", features: ["Everything in Standard ✅", "PMBOK 8 + ECO 2026 early access", "679 bilingual practice questions", "Personalised study plan", "Priority support", "Lifetime content updates", "Exam-readiness toolkit"], cta: "Get Professional", popular: false },
      ],
    },
    compare: {
      label: "Comparison",
      title: "Why AiTutorZ fits the final sprint",
      cols: ["", "PMP Expert Tutor", "Bootcamps", "Video courses"],
      rows: [
        ["Current PMP exam route", "PMBOK 7 + ECO 2021", "Varies", "Varies"],
        ["Bilingual question bank", "679 questions", "Varies", "Varies"],
        ["AI-powered tutoring", "✓", "✗", "✗"],
        ["Adaptive learning", "✓", "✗", "✗"],
        ["Visual MindMaps", "✓", "✗", "Some"],
        ["PMBOK 8 early access", "✓", "Varies", "Rare"],
        ["24/7 availability", "✓", "✗", "✓"],
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently asked questions",
      items: [
        { q: "Is this aligned with the current PMP exam?", a: "Yes. This launch sprint is focused on PMBOK 7 + ECO 2021 for candidates targeting the current PMP exam before the July 2026 change." },
        { q: "Should I switch to PMBOK 8 now?", a: "If your exam is before the change, do not restart. Stay focused on PMBOK 7 + ECO 2021. PMBOK 8 + ECO 2026 is included as early access for the next exam cycle." },
        { q: "How many questions are included?", a: "The current PMBOK 7 + ECO 2021 bank includes 679 bilingual practice questions with rationales and AI-supported explanations." },
        { q: "Is Arabic fully supported?", a: "Yes. The PMBOK 7 + ECO 2021 practice bank is available in Arabic and English, with bilingual explanations designed for exam preparation." },
        { q: "Do you guarantee that I will pass?", a: "No ethical PMP preparation platform should guarantee a pass. AiTutorZ helps you practice, diagnose weak areas, and improve readiness, but final performance depends on your preparation and exam-day execution." },
        { q: "What if I take the exam after 9 July 2026?", a: "Use the PMBOK 8 + ECO 2026 early-access path and bridge materials so your preparation matches the updated exam direction." },
      ],
    },
    finalCta: {
      title: "Ready for your PMP Final Sprint?",
      sub: "Stay focused on the current exam. Practice, diagnose, and prepare before the July change.",
      btn: "Try a Free Lesson",
    },
    footer: {
      by: "by",
      line1: "© 2026 PMP Expert Tutor by AiTuTorZ. Content sourced exclusively from PMBOK® Guide 7th Edition (2021), PMBOK® Guide 8th Edition, PMP Examination Content Outline — January 2021 & 2026.",
      line2: "PMP® is a registered mark of Project Management Institute, Inc. This platform is not affiliated with or endorsed by PMI.",
      product: "Product",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of service",
      contact: "Contact",
    },
  },
  ar: {
    nav: { pricing: "الأسعار", login: "تسجيل الدخول", cta: "جرّب درسًا مجانيًا" },
    hero: {
      badge1: "PMBOK 7 + ECO 2021",
      badge2: "سباق اختبار PMP الحالي",
      h1a: "اجتز اختبار PMP الحالي",
      h1b: "قبل ",
      h1c: "تغيّر الاختبار",
      h1d: "",
      sub: "سباق تحضيري مركز وفق PMBOK 7 + ECO 2021 للمرشحين الذين يستهدفون اختبار PMP الحالي قبل تغيير يوليو 2026. تدرّب على 679 سؤالًا ثنائي اللغة مع شروحات ذكية وتتبع للجاهزية — دون إعادة بدء التحضير من الصفر.",
      cta1: "جرّب درسًا مجانيًا",
      cta2: "شاهد العرض",
      s1v: "679",
      s1l: "سؤال ثنائي اللغة",
      s2v: "PMBOK 7",
      s2l: "+ ECO 2021",
      s3v: "AR + EN",
      s3l: "العربية + الإنجليزية",
      upload: "انقر لتحميل صورة البطل",
      uploadHint: "الحجم الموصى: 800×600 أو 16:9",
    },
    features: {
      label: "المزايا",
      title: "تحضير مركز لإصدار الاختبار الذي ستتقدم له فعليًا",
      items: [
        { icon: "🤖", title: "المعلم الذكي", desc: "اسأل بالعربية أو الإنجليزية واحصل على شروحات مركزة للاختبار ومتوافقة مع PMBOK 7 + ECO 2021." },
        { icon: "🧠", title: "مستكشف الخرائط الذهنية", desc: "راجع مفاهيم PMP بصريًا حتى تربط المبادئ والمجالات والعمليات ومنطق الاختبار بسرعة أكبر." },
        { icon: "📝", title: "محرك التمارين", desc: "تدرّب على 679 سؤالًا ثنائي اللغة للاختبار الحالي مع تفسيرات توضّح لماذا تكون الإجابة الأفضل هي الأفضل." },
        { icon: "🌐", title: "وضع التعلّم بالعربية والإنجليزية", desc: "ادرس مفاهيم PMP وتدرّب على الأسئلة باللغتين العربية والإنجليزية لدعم المرشحين العرب والدوليين." },
        { icon: "📊", title: "لوحة تتبع التقدم", desc: "تابع نقاط الضعف ومؤشرات الجاهزية وأداء المجالات قبل تثبيت موعد الاختبار." },
        { icon: "🔄", title: "إطار مزدوج", desc: "استخدم PMBOK 7 + ECO 2021 للاختبار الحالي، مع وصول مبكر إلى PMBOK 8 + ECO 2026 لدورة الاختبار القادمة." },
      ],
    },
    how: {
      label: "كيف يعمل",
      title: "أربع خطوات لسباقك الأخير نحو PMP",
      steps: [
        { num: "01", title: "اختر مسار اختبارك", desc: "اختر PMBOK 7 + ECO 2021 إذا كنت تستهدف اختبار PMP الحالي قبل التغيير." },
        { num: "02", title: "تدرّب بمنطق الاختبار", desc: "تدرّب على أسئلة قائمة على السيناريو تختبر الحكم المهني لا الحفظ فقط." },
        { num: "03", title: "شخّص نقاط الضعف", desc: "استخدم التقارير والشروحات لتحديد ما يجب إصلاحه قبل موعد الاختبار." },
        { num: "04", title: "اختتم بتركيز", desc: "رسّخ المجالات الضعيفة واستعد استراتيجيًا بدل إعادة البدء بإطار جديد." },
      ],
    },
    pricing: {
      label: "الأسعار",
      title: "اختر خطة سباقك الأخير نحو PMP",
      sub: "تحضير مركز للمرشحين الذين يستهدفون اختبار PMP الحالي قبل تغيير يوليو. يمكنك الترقية في أي وقت حسب احتياجك التحضيري.",
      monthly: "شهري",
      annual: "سباق 90 يومًا",
      saveBadge: "أفضل قيمة للسباق",
      perMonth: "/شهر",
      orYear: "أو",
      yearSuffix: "/90 يومًا",
      secured: "محمي بواسطة PayPal",
      cards: "بطاقة خصم أو ائتمان",
      cancel: "الترقية في أي وقت",
      plans: [
        { name: "أساسي", emoji: "🚀", tagline: "ابدأ تحضيرك للاختبار الحالي", monthly: 29, annual: 79, annualSave: "وفّر 9%", features: ["مكتبة الدورة الكاملة (24 درسًا)", "المعلم الذكي — جلسات غير محدودة", "محرك التمارين — مجموعات أسئلة مركزة", "لوحة تتبع التقدم", "خرائط ذهنية تفاعلية", "إطار PMBOK 7 + ECO 2021"], cta: "احصل على الأساسي", popular: false },
        { name: "قياسي", emoji: "⚡", tagline: "مجموعة أدوات كاملة للتحضير للاختبار الحالي", monthly: 49, annual: 129, annualSave: "وفّر 12%", features: ["كل شيء في الأساسي ✅", "679 سؤال ممارسة ثنائي اللغة", "اختبار محاكاة (180 سؤالًا)", "تقرير خبير وتحليل نقاط الضعف", "توسعات تعمّق بالذكاء الاصطناعي", "إطار PMBOK 7 + ECO 2021", "تحديثات محتوى ذات أولوية"], cta: "احصل على القياسي", popular: true },
        { name: "احترافي", emoji: "💎", tagline: "دعم أقصى للمرشحين المستعجلين", monthly: 79, annual: 199, annualSave: "وفّر 16%", features: ["كل شيء في القياسي ✅", "وصول مبكر إلى PMBOK 8 + ECO 2026", "679 سؤال ممارسة ثنائي اللغة", "خطة دراسة مخصّصة", "دعم ذو أولوية", "تحديثات محتوى مدى الحياة", "مجموعة أدوات جاهزية الاختبار"], cta: "احصل على الاحترافي", popular: false },
      ],
    },
    compare: {
      label: "المقارنة",
      title: "لماذا يناسب AiTutorZ السباق الأخير",
      cols: ["", "PMP Expert Tutor", "معسكرات تدريبية", "دورات فيديو"],
      rows: [
        ["مسار الاختبار الحالي", "PMBOK 7 + ECO 2021", "يختلف", "يختلف"],
        ["بنك أسئلة ثنائي اللغة", "679 سؤالًا", "يختلف", "يختلف"],
        ["تعليم بالذكاء الاصطناعي", "✓", "✗", "✗"],
        ["تعلم تكيفي", "✓", "✗", "✗"],
        ["خرائط ذهنية مرئية", "✓", "✗", "بعض"],
        ["وصول مبكر إلى PMBOK 8", "✓", "يختلف", "نادر"],
        ["متاح 24/7", "✓", "✗", "✓"],
      ],
    },
    faq: {
      label: "أسئلة شائعة",
      title: "الأسئلة الأكثر شيوعًا",
      items: [
        { q: "هل المنصة متوافقة مع اختبار PMP الحالي؟", a: "نعم. يركز سباق الإطلاق على PMBOK 7 + ECO 2021 للمرشحين الذين يستهدفون اختبار PMP الحالي قبل تغيير يوليو 2026." },
        { q: "هل يجب أن أنتقل الآن إلى PMBOK 8؟", a: "إذا كان اختبارك قبل التغيير، فلا تبدأ من جديد. حافظ على تركيزك على PMBOK 7 + ECO 2021. أما PMBOK 8 + ECO 2026 فهو متاح مبكرًا لدورة الاختبار القادمة." },
        { q: "كم عدد الأسئلة المتاحة؟", a: "يتضمن بنك PMBOK 7 + ECO 2021 الحالي 679 سؤال ممارسة ثنائي اللغة مع تفسيرات وشروحات مدعومة بالذكاء الاصطناعي." },
        { q: "هل اللغة العربية مدعومة بالكامل؟", a: "نعم. بنك تمارين PMBOK 7 + ECO 2021 متاح بالعربية والإنجليزية مع شروحات ثنائية اللغة موجهة للتحضير للاختبار." },
        { q: "هل تضمنون اجتياز الاختبار؟", a: "لا. لا ينبغي لأي منصة تحضير أخلاقية أن تضمن النجاح. يساعدك AiTutorZ على التدريب وتشخيص نقاط الضعف ورفع الجاهزية، لكن الأداء النهائي يعتمد على تحضيرك وتنفيذك يوم الاختبار." },
        { q: "ماذا لو كان اختباري بعد 9 يوليو 2026؟", a: "استخدم مسار الوصول المبكر إلى PMBOK 8 + ECO 2026 ومواد الجسر حتى يكون تحضيرك متوافقًا مع اتجاه الاختبار المحدث." },
      ],
    },
    finalCta: {
      title: "هل أنت جاهز لسباق PMP الأخير؟",
      sub: "حافظ على تركيزك على الاختبار الحالي. تدرّب، شخّص، واستعد قبل تغيير يوليو.",
      btn: "جرّب درسًا مجانيًا",
    },
    footer: {
      by: "بواسطة",
      line1: "© 2026 PMP Expert Tutor بواسطة AiTuTorZ. المحتوى مستمد حصريًا من دليل PMBOK® الإصدار السابع (2021)، دليل PMBOK® الإصدار الثامن، ومحتوى اختبار PMP — يناير 2021 و2026.",
      line2: "PMP® علامة تجارية مسجلة لمعهد إدارة المشاريع (PMI). هذه المنصة غير تابعة لـ PMI ولا معتمدة منه.",
      product: "المنتج",
      legal: "قانوني",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      contact: "اتصل بنا",
    },
  },
};

function useInView(threshold = 0.12) { const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold }); obs.observe(el); return () => obs.disconnect(); }, []); return [ref, vis] as const; }
function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) { const [ref, vis] = useInView(); return (<div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>{children}</div>); }

const featureColors = [{ bg: C.tealLt, accent: C.teal },{ bg: C.purpleLt, accent: C.purple },{ bg: C.amberLt, accent: C.amber },{ bg: C.purpleLt, accent: C.purple },{ bg: C.tealLt, accent: C.teal },{ bg: C.amberLt, accent: C.amber }];
const planGradients = [`linear-gradient(135deg, ${C.teal}, ${C.tealDk})`,`linear-gradient(135deg, ${C.purple}, ${C.tealDk})`,`linear-gradient(135deg, ${C.purpleDk}, ${C.purple})`];
const planBtnColors = [C.teal, C.purple, C.purpleDk];


export default function LandingPageClient({ lang }: { lang: "en" | "ar" }) {
  const t = copy[lang];
  const defaultSignupHref = "/signup?mode=demo";
  const pricingPlanIds = ["basic", "standard", "professional"] as const; const isAr = lang === "ar"; const dir = isAr ? "rtl" : "ltr";
  const bodyFont = isAr ? "'Cairo', sans-serif" : "'DM Sans', sans-serif";
  const displayFont = isAr ? "'Cairo', sans-serif" : "'DM Sans', sans-serif";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [heroImg, setHeroImg] = useState<string>("/hero.png");
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => {
    fetch("/api/branding", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data?.landing_hero_image_url) setHeroImg(data.landing_hero_image_url);
      })
      .catch(() => {});
  }, []);

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cairo:wght@400;600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{font-family:${bodyFont};-webkit-font-smoothing:antialiased}
      .lp-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
      .lp-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
      .lp-steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;position:relative}
      .lp-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
      .lp-steps-line{position:absolute;top:26px;left:12.5%;right:12.5%;height:2px;z-index:0}
      .lp-nav-desktop{display:flex;align-items:center;gap:${isAr?"20px":"28px"}}
      .lp-nav-hamburger{display:none;cursor:pointer;padding:8px}
      .lp-mobile-menu{display:none}
      .lp-compare-scroll{border-radius:16px;overflow:hidden;border:1px solid #E8E8E4;background:#fff}
      .lp-hero-stats{display:flex;gap:28px;margin-top:36px;font-size:13px}
      .lp-trust-row{display:flex;justify-content:center;gap:24px;font-size:12px;flex-wrap:wrap}
      @media(max-width:900px){
        .lp-hero-grid{grid-template-columns:1fr;gap:32px}
        .lp-hero-image{max-width:480px;margin:0 auto}
        .lp-features-grid{grid-template-columns:repeat(2,1fr)}
        .lp-steps-grid{grid-template-columns:repeat(2,1fr);gap:32px}
        .lp-steps-line{display:none}
        .lp-pricing-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto}
      }
      @media(max-width:640px){
        .lp-nav-desktop{display:none}
        .lp-nav-hamburger{display:block}
        .lp-mobile-menu.open{display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(255,255,255,0.98);backdrop-filter:blur(16px);border-bottom:1px solid #E8E8E4;padding:8px 0;z-index:99}
        .lp-mobile-menu.open a,.lp-mobile-menu.open .lp-mob-item{display:block;padding:14px 24px;font-size:15px;font-weight:500;color:${C.muted};text-decoration:none;border-bottom:1px solid #F0F0EC}
        .lp-mobile-menu.open a:last-child,.lp-mobile-menu.open .lp-mob-item:last-child{border-bottom:none}
        .lp-features-grid{grid-template-columns:1fr}
        .lp-steps-grid{grid-template-columns:1fr;gap:28px}
        .lp-hero-stats{flex-wrap:wrap;gap:16px}
        .lp-compare-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .lp-compare-scroll table{min-width:520px}
        .lp-trust-row{flex-direction:column;align-items:center;gap:8px}
      }
    `}</style>
    <div dir={dir} style={{fontFamily:bodyFont}}>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:scrolled||mobileMenu?"rgba(255,255,255,0.96)":"transparent",backdropFilter:scrolled||mobileMenu?"blur(14px)":"none",borderBottom:scrolled?"1px solid #E8E8E4":"1px solid transparent",transition:"all 0.3s ease",padding:"0 clamp(1rem,4vw,3rem)"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"relative"}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <Image src="/logo.png" alt="AiTutorZ" width={34} height={34} style={{borderRadius:8,objectFit:"contain"}} />
            <span style={{fontSize:17,fontWeight:700,color:C.dark,letterSpacing:"-0.02em"}}>PMP Expert Tutor</span>
          </Link>
          <div className="lp-nav-desktop">
            <a href="#features" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.pricing==="Pricing"?"Features":"\u0627\u0644\u0645\u0632\u0627\u064a\u0627"}</a>
            <a href="#pricing" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.pricing}</a>
            <a href="#faq" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>FAQ</a>
            <LandingLanguageSelector />
            <Link href="/login" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.login}</Link>
            <Link href={defaultSignupHref} style={{fontSize:13,fontWeight:600,color:"#fff",background:`linear-gradient(135deg,${C.teal},${C.tealDk})`,padding:"8px 22px",borderRadius:8,textDecoration:"none"}}>{t.nav.cta}</Link>
          </div>
          <div className="lp-nav-hamburger" onClick={()=>setMobileMenu(!mobileMenu)}>
            <div style={{width:22,display:"flex",flexDirection:"column",gap:5}}>
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",transform:mobileMenu?"rotate(45deg) translate(5px,5px)":"none"}} />
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",opacity:mobileMenu?0:1}} />
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",transform:mobileMenu?"rotate(-45deg) translate(5px,-5px)":"none"}} />
            </div>
          </div>
          <div className={`lp-mobile-menu ${mobileMenu?"open":""}`}>
            <a href="#features" onClick={()=>setMobileMenu(false)}>{t.nav.pricing==="Pricing"?"Features":"\u0627\u0644\u0645\u0632\u0627\u064a\u0627"}</a>
            <a href="#pricing" onClick={()=>setMobileMenu(false)}>{t.nav.pricing}</a>
            <a href="#faq" onClick={()=>setMobileMenu(false)}>FAQ</a>
            <div className="lp-mob-item"><LandingLanguageSelector /></div>
            <Link href="/login" onClick={()=>setMobileMenu(false)}>{t.nav.login}</Link>
            <Link href={defaultSignupHref} onClick={()=>setMobileMenu(false)} style={{color:C.teal,fontWeight:700}}>{t.nav.cta}</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem) clamp(2rem,5vw,4rem)",background:`linear-gradient(170deg,${C.tealLt} 0%,#FFFFFF 40%,${C.purpleLt} 100%)`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-120,[isAr?"left":"right"]:-120,width:340,height:340,borderRadius:"50%",background:`${C.teal}08`,pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:-80,[isAr?"right":"left"]:-80,width:260,height:260,borderRadius:"50%",background:`${C.purple}06`,pointerEvents:"none"}} />
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative"}} className="lp-hero-grid">
          <FadeIn>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              <span style={{fontSize:12,fontWeight:600,color:C.tealDk,background:C.tealLt,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.teal}22`}}>{t.hero.badge1}</span>
              <span style={{fontSize:12,fontWeight:600,color:C.purple,background:C.purpleLt,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.purple}22`}}>{t.hero.badge2}</span>
            </div>
            <h1 style={{fontSize:"clamp(28px,5vw,46px)",fontWeight:800,lineHeight:1.15,color:C.dark,letterSpacing:"-0.03em",marginBottom:18,fontFamily:displayFont}}>
              {t.hero.h1a}<br />{t.hero.h1b}<span style={{background:`linear-gradient(135deg,${C.teal},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.hero.h1c}</span>{t.hero.h1d}
            </h1>
            <p style={{fontSize:"clamp(15px,2vw,17px)",lineHeight:1.7,color:C.muted,marginBottom:28,maxWidth:440}}>{t.hero.sub}</p>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <Link href={defaultSignupHref} style={{fontSize:15,fontWeight:600,color:"#fff",background:`linear-gradient(135deg,${C.teal},${C.tealDk})`,padding:"14px 28px",borderRadius:10,textDecoration:"none"}}>{t.hero.cta1}</Link>
              <a href="#promo-demo" style={{fontSize:14,fontWeight:600,color:C.muted,textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:36,height:36,borderRadius:"50%",border:`1.5px solid ${C.purple}33`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.purple}}>▶</span>
                {t.hero.cta2}
              </a>
            </div>
            <div className="lp-hero-stats" style={{color:C.muted}}>
              <span><strong style={{color:C.tealDk,fontSize:16}}>{t.hero.s1v}</strong> {t.hero.s1l}</span>
              <span><strong style={{color:C.purple,fontSize:16}}>{t.hero.s2v}</strong> {t.hero.s2l}</span>
              <span><strong style={{color:C.amber,fontSize:16}}>{t.hero.s3v}</strong> {t.hero.s3l}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="lp-hero-image">
            <div
              aria-label="PMP final sprint hero image"
              style={{
                width:"100%",
                aspectRatio:"4/3",
                borderRadius:0,
                background:"transparent",
                border:"none",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                overflow:"visible",
                boxShadow:"none"
              }}
            >
              <img
                src={heroImg || "/hero.png"}
                alt="AiTutorZ PMP final sprint hero"
                style={{
                  width:"100%",
                  height:"100%",
                  objectFit:"contain",
                  display:"block",
                  background:"transparent"
                }}
              />
            </div>
          </FadeIn>
        </div>
      </section>
      {/* PROMO DEMO VIDEO PLACEHOLDER */}
      <section id="promo-demo" className="scroll-mt-24 px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div
            className="grid overflow-hidden rounded-[2rem] border bg-white shadow-[0_24px_80px_rgba(26,20,48,0.10)] md:grid-cols-[1.08fr_0.92fr]"
            style={{ borderColor: C.tealLt }}
          >
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ color: C.dark }}>
                {isAr ? "شاهد PMP AiTutorZ أثناء العمل" : "See PMP AiTutorZ in Action"}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 sm:text-lg" style={{ color: C.muted }}>
                {isAr ? "شاهد عرضًا مركزًا يوضح رحلة المتعلم داخل المنصة: معاينة درس، استكشاف الشروحات ثنائية اللغة، فهم كيف تدعم التمارين منطق الاختبار، ومقارنة الخطط قبل اختيار سباقك التحضيري." : "Watch a focused walkthrough of the PMP AiTutorZ learner journey: preview a lesson, explore bilingual explanations, understand how practice supports exam reasoning, and compare plans before choosing your preparation sprint."}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#demo-video-card"
                  className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{ backgroundColor: C.teal }}
                >
                  {isAr ? "شاهد العرض" : "Watch Demo"}
                </a>

                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-2xl border px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5"
                  style={{ borderColor: C.purpleLt, color: C.purple }}
                >
                  {isAr ? "استعرض الخطط" : "View Plans"}
                </a>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div
                id="demo-video-card"
                className="relative aspect-video overflow-hidden rounded-[1.5rem] border bg-gradient-to-br from-white to-[#E6F8F6] shadow-inner"
                style={{ borderColor: C.tealLt }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,166,35,0.20),transparent_34%),radial-gradient(circle_at_75%_70%,rgba(91,45,145,0.16),transparent_32%)]" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_18px_45px_rgba(26,20,48,0.16)]"
                    style={{ border: `1px solid ${C.tealLt}` }}
                    aria-hidden="true"
                  >
                    <span
                      className="ml-1 block h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent"
                      style={{ borderLeftColor: C.teal }}
                    />
                  </div>

                  <p className="mt-5 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: C.purple }}>
                    {isAr ? "عرض PMP AiTutorZ" : "PMP AiTutorZ Demo"}
                  </p>

                  <p className="mt-2 max-w-sm px-6 text-sm leading-6" style={{ color: C.muted }}>
                    {isAr ? "استكشف رحلة المتعلم، وضع الدراسة ثنائي اللغة، مسار التمارين، وخيارات الخطط قبل أن تبدأ." : "Explore the learner journey, bilingual study mode, practice flow, and plan options before you start."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FEATURES */}
      <section id="features" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:48}}><span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.features.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.features.title}</h2></div></FadeIn>
          <div className="lp-features-grid">
            {t.features.items.map((f,i)=>(<FadeIn key={i} delay={i*0.08}><div style={{padding:"28px 24px",borderRadius:16,border:"1px solid #F0F0EC",background:"#fff",height:"100%"}}><div style={{width:46,height:46,borderRadius:12,background:featureColors[i].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,marginBottom:16}}>{f.icon}</div><div style={{fontSize:16,fontWeight:700,color:C.dark,marginBottom:8,fontFamily:displayFont}}>{f.title}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.65}}>{f.desc}</div></div></FadeIn>))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:C.bg}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:48}}><span style={{fontSize:12,fontWeight:700,color:C.purple,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.how.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.how.title}</h2></div></FadeIn>
          <div className="lp-steps-grid">
            <div className="lp-steps-line" style={{background:`linear-gradient(90deg,${C.teal}44,${C.purple}44)`}} />
            {t.how.steps.map((s,i)=>(<FadeIn key={i} delay={i*0.1}><div style={{textAlign:"center",position:"relative",zIndex:1}}><div style={{width:52,height:52,borderRadius:"50%",margin:"0 auto 16px",background:i%2===0?`linear-gradient(135deg,${C.teal},${C.tealDk})`:`linear-gradient(135deg,${C.purple},${C.purpleDk})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,boxShadow:i%2===0?`0 4px 14px ${C.teal}33`:`0 4px 14px ${C.purple}33`}}>{s.num}</div><div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:6,fontFamily:displayFont}}>{s.title}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{s.desc}</div></div></FadeIn>))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:40}}>
            <span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.pricing.label}</span>
            <h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.pricing.title}</h2>
            <p style={{fontSize:15,color:C.muted,marginTop:8,padding:"0 1rem"}}>{t.pricing.sub}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginTop:24,flexWrap:"wrap"}}>
              {annual&&<span style={{fontSize:12,fontWeight:600,color:C.teal,background:C.tealLt,padding:"4px 12px",borderRadius:12}}>{t.pricing.saveBadge}</span>}
              <span style={{fontSize:14,color:annual?C.muted:C.dark,fontWeight:annual?400:600}}>{t.pricing.monthly}</span>
              <div onClick={()=>setAnnual(!annual)} style={{width:48,height:26,borderRadius:13,padding:3,background:annual?`linear-gradient(135deg,${C.teal},${C.purple})`:"#D1D5DB",cursor:"pointer",transition:"background 0.3s",display:"flex",alignItems:"center"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",transition:"transform 0.2s",transform:annual?(isAr?"translateX(-22px)":"translateX(22px)"):"translateX(0)",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}} />
              </div>
              <span style={{fontSize:14,color:annual?C.dark:C.muted,fontWeight:annual?600:400}}>{t.pricing.annual}</span>
            </div>
          </div></FadeIn>
          <div className="lp-pricing-grid">
            {t.pricing.plans.map((p,i)=>(<FadeIn key={i} delay={i*0.1}><div style={{borderRadius:20,padding:p.popular?"3px":"0",background:p.popular?`linear-gradient(135deg,${C.purple},${C.teal})`:"transparent"}}>
              {p.popular&&<div style={{textAlign:"center",padding:"9px 0 5px",color:"#fff",fontSize:12,fontWeight:700,letterSpacing:"0.04em"}}>{"\u2b50"} {isAr?"\u0627\u0644\u0623\u0643\u062b\u0631 \u0634\u0639\u0628\u064a\u0629":"Most popular"}</div>}
              <div style={{background:"#fff",borderRadius:p.popular?17:20,padding:"32px 24px",border:p.popular?"none":"1px solid #E8E8E4"}}>
                <div style={{fontSize:20,fontWeight:800,color:planBtnColors[i],marginBottom:4}}>{p.name} {p.emoji}</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.5}}>{p.tagline}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                  <span style={{fontSize:42,fontWeight:800,color:C.dark}}>${annual?p.annual:p.monthly}</span>
                  <span style={{fontSize:13,color:C.muted}}>{annual?t.pricing.yearSuffix:t.pricing.perMonth}</span>
                </div>
                {annual?<div style={{fontSize:12,color:C.teal,fontWeight:600,marginBottom:16}}>{p.annualSave}</div>:<div style={{height:16}} />}
                <div style={{borderTop:"1px solid #F0F0EC",paddingTop:20,marginTop:4}}>
                  {p.features.map((f,j)=>(<div key={j} style={{fontSize:13,color:"#475569",padding:"5px 0",display:"flex",alignItems:"center",gap:8}}><span style={{color:C.teal,fontSize:14,flexShrink:0}}>{"\u2713"}</span> {f}</div>))}
                </div>
                <Link href={`/signup?plan=${pricingPlanIds[i]}&period=${annual ? "sprint90" : "monthly"}`} style={{display:"block",width:"100%",marginTop:24,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:700,textAlign:"center",textDecoration:"none",background:p.popular?`linear-gradient(135deg,${C.purple},${C.tealDk})`:planGradients[i],color:"#fff"}}>{p.cta}</Link>
              </div>
            </div></FadeIn>))}
          </div>
          <FadeIn delay={0.3}><div className="lp-trust-row" style={{textAlign:"center",marginTop:28,color:C.muted}}>
            <span>{"\ud83d\udd12"} {t.pricing.secured}</span><span>{"\ud83d\udcb3"} {t.pricing.cards}</span><span style={{display:"inline-flex",alignItems:"center",gap:5}}><img src="/icons/upgrade-anytime.svg" alt="" aria-hidden="true" style={{width:16,height:16}} /> {t.pricing.cancel}</span>
          </div></FadeIn>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:C.bg}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:36}}><span style={{fontSize:12,fontWeight:700,color:C.purple,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.compare.label}</span><h2 style={{fontSize:"clamp(22px,3.5vw,28px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.compare.title}</h2></div></FadeIn>
          <FadeIn delay={0.1}><div className="lp-compare-scroll">
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{background:`linear-gradient(135deg,${C.tealLt},${C.purpleLt})`}}>{t.compare.cols.map((col,ci)=>(<th key={ci} style={{textAlign:ci===0?(isAr?"right":"left"):"center",padding:"14px 16px",fontWeight:ci===1?700:500,color:ci===1?C.purple:C.muted,whiteSpace:"nowrap"}}>{col}</th>))}</tr></thead>
              <tbody>{t.compare.rows.map((row,ri)=>(<tr key={ri} style={{borderTop:"1px solid #F0F0EC"}}>{row.map((cell,ci)=>(<td key={ci} style={{padding:"12px 16px",textAlign:ci===0?(isAr?"right":"left"):"center",color:ci===1?C.teal:(ci===0?"#475569":C.muted),fontWeight:ci===1?700:400,whiteSpace:"nowrap"}}>{cell}</td>))}</tr>))}</tbody>
            </table>
          </div></FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:40}}><span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.faq.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.faq.title}</h2></div></FadeIn>
          <div>{t.faq.items.map((f,i)=>(<FadeIn key={i} delay={i*0.05}><div style={{borderBottom:"1px solid #F0F0EC",cursor:"pointer",padding:"18px 0"}} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,fontWeight:600,color:C.dark}}>{f.q}</span>
              <span style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:faqOpen===i?`linear-gradient(135deg,${C.teal},${C.purple})`:"#F1F1EF",color:faqOpen===i?"#fff":C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:500,transition:"all 0.25s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)",marginInlineStart:12}}>+</span>
            </div>
            <div style={{maxHeight:faqOpen===i?200:0,overflow:"hidden",transition:"max-height 0.35s ease,opacity 0.25s ease",opacity:faqOpen===i?1:0}}>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.7,marginTop:10}}>{f.a}</p>
            </div>
          </div></FadeIn>))}</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:`linear-gradient(135deg,${C.dark} 0%,${C.purpleDk} 50%,${C.dark} 100%)`,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,[isAr?"left":"right"]:-60,width:300,height:300,borderRadius:"50%",background:`${C.teal}10`,pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:-60,[isAr?"right":"left"]:-40,width:220,height:220,borderRadius:"50%",background:`${C.purple}10`,pointerEvents:"none"}} />
        <FadeIn><div style={{maxWidth:560,margin:"0 auto",position:"relative"}}>
          <h2 style={{fontSize:"clamp(26px,4vw,34px)",fontWeight:800,color:"#fff",letterSpacing:"-0.02em",marginBottom:12,fontFamily:displayFont}}>{t.finalCta.title}</h2>
          <p style={{fontSize:"clamp(14px,2vw,16px)",color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:28}}>{t.finalCta.sub}</p>
          <Link href={defaultSignupHref} style={{display:"inline-block",fontSize:15,fontWeight:700,color:C.dark,background:`linear-gradient(135deg,${C.tealLt},#fff)`,padding:"14px 36px",borderRadius:10,textDecoration:"none"}}>{t.finalCta.btn}</Link>
        </div></FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"2.5rem clamp(1rem,4vw,3rem)",background:C.bg,borderTop:"1px solid #E8E8E4"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:24}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <Image src="/logo.png" alt="AiTutorZ" width={28} height={28} style={{borderRadius:6,objectFit:"contain"}} />
              <span style={{fontSize:15,fontWeight:700,color:C.dark}}>PMP Expert Tutor</span>
            </div>
            <div style={{fontSize:13,color:C.muted}}>{t.footer.by} <span style={{color:C.teal,fontWeight:600}}>AiTutorZ</span> {"\u00b7"} {"\u00a9"} 2026</div>
          </div>
          <div style={{display:"flex",gap:40}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.footer.product}</div>
              <a href="#features" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.features.label}</a>
              <a href="#pricing" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.pricing.label}</a>
              <a href="#faq" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>FAQ</a>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.footer.legal}</div>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.privacy}</a>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.terms}</a>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.contact}</a>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1140,margin:"20px auto 0",borderTop:"1px solid #E8E8E4",paddingTop:16}}>
          <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,textAlign:"center"}}>{t.footer.line1}</p>
          <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,textAlign:"center",marginTop:4}}>{t.footer.line2}</p>
        </div>
      </footer>

    </div>
  </>);
}
