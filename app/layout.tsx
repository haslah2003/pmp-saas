import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MarketingAnalytics from "@/components/analytics/MarketingAnalytics";

const SITE_URL = "https://pmpeco.com";
const TITLE = "PMPeco — AI-Powered PMP Exam Prep";
const DESCRIPTION =
  "Master the new PMP exam with AI-powered tutoring grounded in PMBOK Guide 8th Edition and PMP ECO 2026 — with bilingual English & Arabic content. Study notes, mock exams, practice questions, mind maps, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "PMPeco",
  keywords:
    "PMP, PMP exam, PMBOK 8, ECO 2026, project management certification, PMP prep, PMP practice questions, PMP Arabic, PMP بالعربية",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PMPeco",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
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
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
        <MarketingAnalytics />
      </body>
    </html>
  );
}
