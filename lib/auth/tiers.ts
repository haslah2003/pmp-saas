// Client-safe tier primitives (no server imports). Shared by the server-side
// access helper (lib/auth/access.ts) and client UI (Sidebar).

export type Tier = 'free' | 'basic' | 'standard' | 'professional';

// Higher rank = more access. Gate features by minimum required tier.
export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  basic: 1,
  standard: 2,
  professional: 3,
};

/** True if `tier` meets or exceeds `min`. */
export function hasTier(tier: Tier, min: Tier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[min];
}
