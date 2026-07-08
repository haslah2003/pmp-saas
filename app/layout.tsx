import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMP Expert Tutor — AI-Powered PMP Exam Prep",
  description:
    "Master the new PMP exam with AI-powered tutoring grounded in PMBOK Guide 8th Edition and PMP ECO 2026 — with bilingual English & Arabic content. Study notes, mock exams, practice questions, mind maps, and more.",
  keywords: "PMP, PMP exam, PMBOK, project management, certification, AiTuTorZ",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("pmp_locale")?.value === "ar" ? "ar" : "en";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
