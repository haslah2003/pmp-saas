import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded bilingual (EN + AR) social share card. Generated at build time.
// Uses Tajawal (Latin + Arabic) so Arabic script shapes correctly.
export const alt =
  "PMP Expert Tutor — AI-powered PMP exam prep for PMBOK 8 + ECO 2026, in English and Arabic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(file: string) {
  return readFile(join(process.cwd(), "assets", "fonts", file));
}

export default async function OpengraphImage() {
  const [regular, bold, extrabold] = await Promise.all([
    loadFont("Tajawal-Regular.ttf"),
    loadFont("Tajawal-Bold.ttf"),
    loadFont("Tajawal-ExtraBold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 76px",
          background:
            "linear-gradient(135deg, #0d9488 0%, #4f46e5 52%, #7c3aed 100%)",
          color: "white",
          fontFamily: "Tajawal",
        }}
      >
        {/* Brand row: EN left, AR right */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>
              PMP EXPERT TUTOR
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, direction: "rtl" }}>
            معلّم PMP الذكي
          </div>
        </div>

        {/* Headline + bilingual taglines */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 90,
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            PMBOK 8 · ECO 2026
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 400,
              color: "rgba(255,255,255,0.92)",
              marginTop: 24,
            }}
          >
            Pass the new PMP exam — in English or Arabic
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              marginTop: 10,
              direction: "rtl",
            }}
          >
اجتَز اختبار PMP الجديد
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              1,200+ bilingual questions
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontSize: 24,
                fontWeight: 700,
                direction: "rtl",
              }}
            >
أسئلة ثنائية اللغة
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>pmpeco.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tajawal", data: regular, weight: 400, style: "normal" },
        { name: "Tajawal", data: bold, weight: 700, style: "normal" },
        { name: "Tajawal", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
