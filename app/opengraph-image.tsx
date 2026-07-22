import { ogCard } from "@/lib/og-card";

// Default site share card (English) — used by crawlers on the single homepage URL.
export const alt =
  "PMP Expert Tutor — AI-powered PMP exam prep for PMBOK 8 + ECO 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogCard();
}
