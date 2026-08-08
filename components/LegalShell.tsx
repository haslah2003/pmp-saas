import Link from "next/link";
import type { ReactNode } from "react";

// Simple, self-contained shell for legal/policy pages.
export default function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-gray-900">
            PMP Expert Tutor
          </Link>
          <Link href="/" className="text-sm font-medium text-teal-700 hover:underline">
            ← Home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>

        <div
          className="mt-8 space-y-4 text-[15px] leading-relaxed text-gray-700 [&_a]:text-teal-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_strong]:text-gray-900"
        >
          {children}
        </div>

        <nav className="mt-12 flex flex-wrap gap-5 border-t border-gray-200 pt-6 text-sm">
          <Link href="/terms" className="font-medium text-teal-700 hover:underline">Terms of Service</Link>
          <Link href="/privacy" className="font-medium text-teal-700 hover:underline">Privacy Policy</Link>
          <Link href="/refund" className="font-medium text-teal-700 hover:underline">Refund Policy</Link>
          <a href="mailto:support@pmpeco.com" className="font-medium text-teal-700 hover:underline">Contact</a>
        </nav>
      </article>
    </main>
  );
}
