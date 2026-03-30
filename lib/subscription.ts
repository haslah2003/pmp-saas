import { createClient } from "@/lib/supabase/server";

export type Plan = "free" | "monthly" | "quarterly" | "annual";
export type SubStatus = "active" | "inactive" | "cancelled" | "past_due";

export interface Subscription {
  plan: Plan;
  status: SubStatus;
  current_period_end: string | null;
}

export async function getUserSubscription(): Promise<Subscription> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { plan: "free", status: "inactive", current_period_end: null };

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (!data) return { plan: "free", status: "active", current_period_end: null };
  return data as Subscription;
}

export function isPremium(sub: Subscription): boolean {
  return sub.plan !== "free" && sub.status === "active";
}

// Admin-aware premium check — use when you have the user's profile
export function isPremiumOrAdmin(sub: Subscription, role?: string): boolean {
  return role === "admin" || (sub.plan !== "free" && sub.status === "active");
}
