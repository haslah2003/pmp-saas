import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MindMapClient from "./MindMapClient";
import Link from "next/link";
import { getAccess } from "@/lib/auth/access";

export default async function MindMapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Route layout already gates this to premium; this is defense-in-depth.
  const { isPremium } = await getAccess();

  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center mb-6">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mind Map Explorer</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Unlock the interactive PMBOK 7 & ECO 2021 Mind Map with a Premium subscription.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"
        >
          ⭐ Upgrade to Premium
        </Link>
      </div>
    );
  }

  return <MindMapClient />;
}
