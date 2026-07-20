import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared social-share card generator. One language per card so each audience
// can be targeted separately (English creative vs Arabic creative).
export type OgLang = "en" | "ar";

const SIZE = { width: 1200, height: 630 };

const COPY = {
  en: {
    dir: "ltr" as const,
    font: "sans-serif",
    letter: 3,
    brand: "PMP EXPERT TUTOR",
    tagline: "Pass the new PMP exam — in English or Arabic",
    sub: "AI-powered tutoring, mock exams and readiness tracking",
    badge: "1,200+ bilingual questions",
  },
  ar: {
    dir: "rtl" as const,
    font: "Tajawal",
    letter: 0, // never letter-space Arabic — it breaks the connected script
    brand: "معلّم PMP الذكي",
    tagline: "اجتَز اختبار PMP الجديد",
    sub: "تدريب ذكي واختبارات محاكية وتتبّع الجاهزية",
    badge: "أكثر من 1200 سؤال",
  },
};

async function tajawalFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [regular, bold, extrabold] = await Promise.all([
    readFile(join(dir, "Tajawal-Regular.ttf")),
    readFile(join(dir, "Tajawal-Bold.ttf")),
    readFile(join(dir, "Tajawal-ExtraBold.ttf")),
  ]);
  return [
    { name: "Tajawal", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Tajawal", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Tajawal", data: extrabold, weight: 800 as const, style: "normal" as const },
  ];
}

export async function ogCard(lang: OgLang) {
  const c = COPY[lang];
  const fonts = lang === "ar" ? await tajawalFonts() : undefined;
  // Satori's RTL flex support is partial, so we align blocks explicitly.
  const align = c.dir === "rtl" ? "flex-end" : "flex-start";

  const badge = {
    display: "flex",
    padding: "12px 24px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.25)",
    fontSize: 26,
    fontWeight: 700,
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "linear-gradient(135deg, #0d9488 0%, #4f46e5 52%, #7c3aed 100%)",
          color: "white",
          fontFamily: c.font,
          direction: c.dir,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", justifyContent: align }}>
          <div
            style={{
              display: "flex",
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "#ffffff",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: c.letter,
            }}
          >
            {c.brand}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: align,
              fontSize: 38,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 14,
            }}
          >
            {c.tagline}
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: align,
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: "-3px",
              lineHeight: 1,
              direction: "ltr", // Latin/numbers stay LTR in both cards
            }}
          >
            PMBOK 8 · ECO 2026
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: align,
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              marginTop: 20,
            }}
          >
            {c.sub}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", justifyContent: align }}>
          <div style={badge}>{c.badge}</div>
          <div style={{ ...badge, direction: "ltr" }}>pmpeco.com</div>
        </div>
      </div>
    ),
    { ...SIZE, ...(fonts ? { fonts } : {}) },
  );
}
