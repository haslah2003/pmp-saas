import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface Access {
  userId: string | null;
  isAdmin: boolean;
  isPremium: boolean;
}

/**
 * Resolves the current user's access level. Wrapped in React cache() so it runs
 * at most once per request even if called from several layouts/pages.
 *
 * Premium = admin, OR a paid plan that hasn't expired. The source of truth is
 * profiles.plan + plan_expires_at — that's what PayPal capture/webhook write and
 * what the admin analytics reads. (The subscriptions table is NOT kept in sync.)
 */
export const getAccess = cache(async (): Promise<Access> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, isAdmin: false, isPremium: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, plan, plan_expires_at')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const notExpired = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at) > new Date()
    : false;
  const isPremium = isAdmin || (!!profile?.plan && profile.plan !== 'free' && notExpired);

  return { userId: user.id, isAdmin, isPremium };
});

/**
 * Server-side gate for paid-only routes. Redirects unauthenticated users to
 * login and free users to the pricing page. Call at the top of a route's
 * server layout so the whole subtree is protected (even direct URL access).
 */
export async function requirePremium(): Promise<void> {
  const access = await getAccess();
  if (!access.userId) redirect('/login');
  if (!access.isPremium) redirect('/dashboard/pricing?locked=1');
}
