import { ImageResponse } from "next/og";

// Branded social share card (Open Graph / Twitter). Rendered at build time.
export const alt =
  "PMP Expert Tutor — AI-powered PMP exam prep for PMBOK 8 + ECO 2026, in English and Arabic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "#ffffff",
            }}
          />
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
            PMP EXPERT TUTOR
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 14,
            }}
          >
            Pass the new PMP exam — in English or Arabic
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            PMBOK 8 · ECO 2026
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              marginTop: 20,
            }}
          >
            AI-powered tutoring, mock exams and readiness tracking
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            1,200+ bilingual questions
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            pmpeco.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
