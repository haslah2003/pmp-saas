import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TIER_RANK, hasTier, type Tier } from './tiers';

export { TIER_RANK, hasTier };
export type { Tier };

const PAID_TIERS: Tier[] = ['basic', 'standard', 'professional'];

export interface Access {
  userId: string | null;
  isAdmin: boolean;
  tier: Tier;
  /** Convenience: any paid tier (basic or above). */
  isPremium: boolean;
}

/**
 * Resolves the current user's tier. Wrapped in React cache() so it runs at most
 * once per request even if called from several layouts/pages/routes.
 *
 * Source of truth = profiles.plan (basic|standard|professional|free) +
 * profiles.plan_expires_at — that's what PayPal capture/webhook write. The
 * subscriptions table is NOT kept in sync; never gate on it. Admins get full
 * (professional) access.
 */
export const getAccess = cache(async (): Promise<Access> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, isAdmin: false, tier: 'free', isPremium: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, plan, plan_expires_at')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const notExpired = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at) > new Date()
    : false;
  const paidTier: Tier =
    profile?.plan && PAID_TIERS.includes(profile.plan as Tier) && notExpired
      ? (profile.plan as Tier)
      : 'free';

  const tier: Tier = isAdmin ? 'professional' : paidTier;
  const isPremium = TIER_RANK[tier] >= TIER_RANK.basic;

  return { userId: user.id, isAdmin, tier, isPremium };
});

/**
 * Server-side gate for a route that requires at least `min` tier. Redirects
 * unauthenticated users to login and under-tier users to pricing. Call at the
 * top of a route's server layout so the whole subtree is protected.
 */
export async function requireTier(min: Tier): Promise<void> {
  const access = await getAccess();
  if (!access.userId) redirect('/login');
  if (TIER_RANK[access.tier] < TIER_RANK[min]) {
    redirect(`/dashboard/pricing?upgrade=${min}`);
  }
}

/** Back-compat helper: requires any paid tier (basic or above). */
export async function requirePremium(): Promise<void> {
  return requireTier('basic');
}
