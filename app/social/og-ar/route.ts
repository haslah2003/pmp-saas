import { ogCard } from "@/lib/og-card";

// Stable Arabic share/ad creative: https://pmpeco.com/social/og-ar
export const dynamic = "force-static";

export function GET() {
  return ogCard("ar");
}
