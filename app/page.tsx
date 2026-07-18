import LandingPageClient from "@/components/LandingPageClient";

// Statically rendered (no cookies() read) so it is served from the global edge CDN,
// fast for every visitor worldwide. Language is resolved client-side from the cookie.
export default function LandingPage() {
  return <LandingPageClient />;
}
