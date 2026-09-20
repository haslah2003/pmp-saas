import LandingPageClient from "@/components/LandingPageClient";

type LandingHeroBranding = {
  landing_hero_image_url: string;
  landing_hero_image_visible: boolean;
};

async function getLandingHeroBranding(): Promise<LandingHeroBranding> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail closed: an unavailable branding response must never resurrect the
  // bundled placeholder image while an administrator intends it to be hidden.
  const fallback = {
    landing_hero_image_url: "/hero.png",
    landing_hero_image_visible: false,
  };

  if (!supabaseUrl || !anonKey) return fallback;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/branding_config?id=eq.1&select=landing_hero_image_url,landing_hero_image_visible`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        next: { revalidate: 3600, tags: ["landing-branding"] },
      }
    );

    if (!response.ok) return fallback;
    const rows = (await response.json()) as Partial<LandingHeroBranding>[];
    const config = rows[0];

    return {
      landing_hero_image_url:
        typeof config?.landing_hero_image_url === "string"
          ? config.landing_hero_image_url
          : fallback.landing_hero_image_url,
      landing_hero_image_visible:
        typeof config?.landing_hero_image_visible === "boolean"
          ? config.landing_hero_image_visible
          : fallback.landing_hero_image_visible,
    };
  } catch {
    return fallback;
  }
}

// Branding is included in the cached server render, preventing a stale hero
// image from flashing before the browser loads the live branding configuration.
export default async function LandingPage() {
  const heroBranding = await getLandingHeroBranding();

  return (
    <LandingPageClient
      initialHeroImageUrl={heroBranding.landing_hero_image_url}
      initialHeroImageVisible={heroBranding.landing_hero_image_visible}
    />
  );
}
