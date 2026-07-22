import { ogCard } from "@/lib/og-card";

// Stable English share/ad creative: https://pmpeco.com/social/og-en
export const dynamic = "force-static";

export function GET() {
  return ogCard();
}
