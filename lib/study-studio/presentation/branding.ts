import 'server-only';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import type { DeckBranding } from './types';

/**
 * Resolves PMPeco branding from the SAME source of truth the rest of the app
 * uses — the branding_config row (id=1) that the admin edits at /admin/branding.
 * No palette is redefined here; the deck inherits whatever the platform is
 * currently branded as. Defaults mirror app/admin/branding/page.tsx so a deck
 * still renders before an admin has ever saved branding.
 */

const DEFAULTS = {
  site_name: 'PMPeco',
  logo_url: '/logo.png',
  primary_color: '#0F172A',
  secondary_color: '#1E40AF',
  accent_color: '#F59E0B',
  font_heading: 'Plus Jakarta Sans',
  font_body: 'DM Sans',
};

/** pptxgenjs rejects '#'-prefixed and 8-digit hex — normalise to 6 digits bare. */
function bareHex(value: string | null | undefined, fallback: string): string {
  const v = (value || '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase();
  if (/^[0-9a-fA-F]{3}$/.test(v)) {
    return v.split('').map((c) => c + c).join('').toUpperCase();
  }
  return fallback;
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createSupabaseAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Fetch an image URL (absolute, or app-relative like /logo.png) as a data URI. */
async function loadImageDataUri(logoUrl: string): Promise<string | null> {
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
      .select('*')
      .eq('id', 1)
      .single();
    if (data) row = data;
  }

  const primary = bareHex(row.primary_color, bareHex(DEFAULTS.primary_color, '0F172A'));
  const secondary = bareHex(row.secondary_color, bareHex(DEFAULTS.secondary_color, '1E40AF'));
  const accent = bareHex(row.accent_color, bareHex(DEFAULTS.accent_color, 'F59E0B'));

  return {
    siteName: row.site_name || DEFAULTS.site_name,
    logoDataUri: await loadImageDataUri(row.logo_url || DEFAULTS.logo_url),
    primary,
    secondary,
    accent,
    // Deep ink for dark title/closing slides — reuse primary (brand tokens keep it coherent).
    ink: primary,
    fontHeading: row.font_heading || DEFAULTS.font_heading,
    fontBody: row.font_body || DEFAULTS.font_body,
  };
}
