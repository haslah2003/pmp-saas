import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMP Expert Tutor — AI-Powered PMP Exam Prep",
  description:
    "Master the new PMP exam with AI-powered tutoring grounded in PMBOK Guide 8th Edition and PMP ECO 2026 — with bilingual English & Arabic content. Study notes, mock exams, practice questions, mind maps, and more.",
  keywords: "PMP, PMP exam, PMBOK, project management, certification, AiTuTorZ",
};

// Apply locale (lang + text direction) from the cookie BEFORE first paint, so the
// document can be statically rendered (and served from the global edge CDN) without
// a flash of the wrong direction. Reads pmp_locale first, then the legacy `lang` cookie.
const LOCALE_INIT = `(function(){try{var m=document.cookie.match(/(?:^|; )pmp_locale=(ar|en)/)||document.cookie.match(/(?:^|; )lang=(ar|en)/);var l=m&&m[1]==='ar'?'ar':'en';var e=document.documentElement;e.lang=l;e.dir=l==='ar'?'rtl':'ltr';if(l==='ar'){e.classList.add('rtl');}else{e.classList.remove('rtl');}}catch(_){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_INIT }} />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
