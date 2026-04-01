import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, plan, plan_period, plan_expires_at, paypal_order_id")
    .eq("id", user.id)
    .single();

  const { data: history } = await supabase
    .from("billing_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const currentPlan = PLANS.find(p => p.id === profile?.plan) || null;
  const isFreePlan = !profile?.plan || profile?.plan === "free";
  const expiresAt = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;
  const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan, payment method, and view billing history.</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: currentPlan ? undefined : '#e5e7eb' }}>
        <div className={`px-6 py-5 ${isFreePlan ? 'bg-gray-50' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isFreePlan ? 'text-gray-400' : 'text-white/70'}`}>Current Plan</p>
              <h2 className="text-2xl font-bold mt-1">{currentPlan ? `${currentPlan.icon} ${currentPlan.name}` : 'Free Plan'}</h2>
              {currentPlan && <p className={`text-sm mt-1 ${isFreePlan ? 'text-gray-500' : 'text-white/80'}`}>{currentPlan.tagline}</p>}
            </div>
            <div className="text-right">
              {!isFreePlan && !isExpired && (
                <>
                  <p className={`text-3xl font-bold ${isFreePlan ? 'text-gray-900' : 'text-white'}`}>
                    ${profile?.plan_period === 'annual' ? currentPlan?.annual.price : currentPlan?.monthly.price}
                  </p>
                  <p className={`text-xs ${isFreePlan ? 'text-gray-400' : 'text-white/60'}`}>per {profile?.plan_period === 'annual' ? 'year' : 'month'}</p>
                </>
              )}
              {isFreePlan && <p className="text-3xl font-bold text-gray-900">$0</p>}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isFreePlan ? 'bg-gray-100 text-gray-600' : isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isFreePlan ? 'Free Tier' : isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
          {!isFreePlan && expiresAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{isExpired ? 'Expired on' : 'Renews on'}</span>
              <span className="text-sm font-semibold text-gray-900">
                {expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {!isExpired && <span className="text-xs text-gray-400 ml-2">({daysLeft} days left)</span>}
              </span>
            </div>
          )}
          {!isFreePlan && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Billing Period</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">{profile?.plan_period || 'monthly'}</span>
            </div>
          )}
          <div className="pt-2">
            {isFreePlan || isExpired ? (
              <Link href="/dashboard/pricing" className="block text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Upgrade to Premium
              </Link>
            ) : (
              <Link href="/dashboard/pricing" className="block text-center py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                Change Plan
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Payment Method</h3></div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-2xl">🅿</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">PayPal</p>
              <p className="text-xs text-gray-400">{profile?.email ? `Connected as ${profile.email}` : 'Not connected'}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Default</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">All payments are securely processed through PayPal.</p>
        </div>
      </div>

      {/* Plan Features */}
      {currentPlan && !isFreePlan && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Your Plan Features</h3></div>
          <div className="px-6 py-4">
            <div className="grid sm:grid-cols-2 gap-2">
              {currentPlan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <span className="text-base">{f.split(' ')[0]}</span>
                  <span>{f.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Billing History</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {history && history.length > 0 ? history.map((h) => (
            <div key={h.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100">
                <span className="text-base">{h.status === 'completed' ? '✅' : '⏳'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 capitalize">{h.plan_id} Plan — {h.period}</p>
                <p className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${h.amount}</p>
                <p className="text-[10px] font-semibold text-emerald-600 uppercase">{h.status}</p>
              </div>
            </div>
          )) : (
            <div className="px-6 py-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm font-semibold text-gray-500">No billing history yet</p>
              <p className="text-xs text-gray-400 mt-1">Your payment transactions will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
