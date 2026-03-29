import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMP Expert Tutor — AI-Powered PMP Exam Prep",
  description:
    "Master the PMP exam with AI-powered tutoring grounded exclusively in PMBOK Guide 7th Edition and PMP ECO 2021. Study notes, audio narration, flashcards, mock exams, and more.",
  keywords: "PMP, PMP exam, PMBOK, project management, certification, AI tutor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
