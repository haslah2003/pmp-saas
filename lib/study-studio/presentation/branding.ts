import 'server-only';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import type { DeckBranding } from './types';

/**
 * Resolves the deck theme. Identity (site name + logo) comes from the app's
 * single source of truth — the branding_config row (id=1). The visual system
 * (palette + fonts) is the APPROVED PMPeco presentation theme, extracted from
 * the branded template and held constant so every generated deck matches it,
 * independent of the app UI palette.
 */

// Approved presentation theme (from Presentation_Template_pmpeco_2026).
const THEME = {
  navy: '0A4065',
  teal: '00BFB7',
  violet: '5955EB',
  purple: 'A003BA',
  cardBg: 'EAE8F3',
  cardBorder: 'D7D6F5',
  bodyInk: '49495A',
  fontHeading: 'Poppins',
  fontBody: 'Open Sans',
  fontSerif: 'Libre Baskerville',
};

const IDENTITY_DEFAULTS = {
  site_name: 'PMPeco',
  logo_url: '/logo.png',
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createSupabaseAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Fetch an image URL (absolute, or app-relative like /logo.png) as a data URI. */
export async function loadImageDataUri(logoUrl: string): Promise<string | null> {
  try {
    let url = logoUrl;
    if (url.startsWith('/')) {
      const base =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
      if (!base) return null; // can't resolve a relative asset server-side without a base
      url = base.replace(/\/$/, '') + url;
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/png';
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function getDeckBranding(): Promise<DeckBranding> {
  const supabase = adminClient();
  let row: Record<string, any> = {};
  if (supabase) {
    const { data } = await supabase
      .from('branding_config')
      .select('site_name, logo_url')
      .eq('id', 1)
      .single();
    if (data) row = data;
  }

  return {
    siteName: row.site_name || IDENTITY_DEFAULTS.site_name,
    logoDataUri: await loadImageDataUri(row.logo_url || IDENTITY_DEFAULTS.logo_url),
    ...THEME,
  };
}
