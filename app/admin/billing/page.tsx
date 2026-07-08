import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminBillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  // Admin views need to see ALL users/receipts. The user-session client is bound by
  // the profiles RLS policy (own row only), so read platform-wide data via the
  // service-role client — gated behind the admin check above.
  const admin = createAdminClient();

  const { data: allProfiles } = await admin
    .from("profiles")
    .select("id, full_name, email, role, plan, plan_period, plan_expires_at, created_at")
    .order("created_at", { ascending: false });

  // Payments actually land in payment_receipts (written by the PayPal capture route),
  // not billing_history. Read the real source of truth.
  const { data: allReceipts } = await admin
    .from("payment_receipts")
    .select("id, user_id, receipt_number, plan, plan_period, amount, currency, status, payer_email, payer_name, paypal_order_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Sandbox/test payments (PayPal sandbox accounts + explicit test orders) are excluded
  // from real revenue so the dashboard reflects actual collected money once live.
  const isTestReceipt = (r: { payer_email?: string | null; paypal_order_id?: string | null }) =>
    (r.payer_email || "").includes(".example.com") || (r.paypal_order_id || "").toUpperCase().startsWith("TEST-");
  const paidReceipts = (allReceipts || []).filter(r => r.status === "paid");
  const realReceipts = paidReceipts.filter(r => !isTestReceipt(r));
  const testReceiptCount = paidReceipts.length - realReceipts.length;

  const totalUsers = allProfiles?.length || 0;
  const paidUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free').length || 0;
  const activeUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free' && p.plan_expires_at && new Date(p.plan_expires_at) > new Date()).length || 0;
  const totalRevenue = realReceipts.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  const metrics = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'Paid Subscribers', value: paidUsers, icon: '💎', color: 'bg-purple-50 text-purple-700' },
    { label: 'Active Now', value: activeUsers, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Real Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-amber-50 text-amber-700' },
  ];

  const emailById = new Map((allProfiles || []).map(p => [p.id, p.email] as const));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue overview, subscriber management, and payment history.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${m.color}`}>{m.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">All Users</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allProfiles?.map(p => {
                const isExpired = p.plan_expires_at ? new Date(p.plan_expires_at) < new Date() : false;
                const isFree = !p.plan || p.plan === 'free';
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-gray-900">{p.full_name || 'No name'}</p>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isFree ? 'bg-gray-100 text-gray-500' : 'bg-violet-100 text-violet-700'}`}>
                        {isFree ? 'Free' : (p.plan || 'free')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 capitalize">{p.plan_period || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold ${isFree ? 'text-gray-400' : isExpired ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isFree ? '—' : isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      {p.plan_expires_at ? new Date(p.plan_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          {testReceiptCount > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {testReceiptCount} sandbox/test payment{testReceiptCount === 1 ? '' : 's'} (excluded from revenue)
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {paidReceipts.length > 0 ? paidReceipts.map((r) => {
            const isTest = isTestReceipt(r);
            return (
              <Link key={r.id} href={`/dashboard/receipt/${r.id}`} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${isTest ? 'bg-amber-100' : 'bg-emerald-100'}`}>{isTest ? '🧪' : '✅'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 capitalize">{r.plan} ({r.plan_period}) {isTest && <span className="text-[10px] font-bold text-amber-600 uppercase ml-1">test</span>}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {r.receipt_number || r.paypal_order_id || '—'} · {emailById.get(r.user_id) || r.payer_email || 'unknown'} · {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">${r.amount} <span className="text-xs text-gray-400 font-normal">{r.currency}</span></p>
              </Link>
            );
          }) : (
            <div className="px-6 py-12 text-center">
              <p className="text-4xl mb-3">{'💳'}</p>
              <p className="text-sm font-semibold text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Payments captured through PayPal will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
