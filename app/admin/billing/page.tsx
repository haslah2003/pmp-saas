import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

type BillingView = 'users' | 'paid' | 'active' | 'revenue' | 'refunded';

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const selectedView: BillingView | null = ['users', 'paid', 'active', 'revenue', 'refunded'].includes(view || '')
    ? (view as BillingView)
    : null;
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
    .select("id, user_id, receipt_number, plan, plan_period, amount, currency, status, payer_email, payer_name, paypal_order_id, paypal_capture_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Sandbox/test payments (PayPal sandbox accounts + explicit test orders) are excluded
  // from real revenue so the dashboard reflects actual collected money once live.
  const isTestReceipt = (r: { payer_email?: string | null; paypal_order_id?: string | null }) =>
    (r.payer_email || "").includes(".example.com") || (r.paypal_order_id || "").toUpperCase().startsWith("TEST-");
  const paidReceipts = (allReceipts || []).filter(r => r.status === "paid");
  const refundedReceipts = (allReceipts || []).filter(r => r.status === "refunded");
  const realReceipts = paidReceipts.filter(r => !isTestReceipt(r));
  const testReceiptCount = paidReceipts.length - realReceipts.length;

  const totalUsers = allProfiles?.length || 0;
  const paidUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free').length || 0;
  const activeUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free' && p.plan_expires_at && new Date(p.plan_expires_at) > new Date()).length || 0;
  const totalRevenue = realReceipts.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);
  const totalRefunded = refundedReceipts
    .filter(r => !isTestReceipt(r))
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  const metrics: Array<{ label: string; value: string | number; icon: string; color: string; view: BillingView }> = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700', view: 'users' },
    { label: 'Paid Subscribers', value: paidUsers, icon: '💎', color: 'bg-purple-50 text-purple-700', view: 'paid' },
    { label: 'Active Now', value: activeUsers, icon: '✅', color: 'bg-emerald-50 text-emerald-700', view: 'active' },
    { label: 'Net Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-amber-50 text-amber-700', view: 'revenue' },
    { label: 'Refunded', value: `$${totalRefunded.toFixed(2)}`, icon: '↩️', color: 'bg-rose-50 text-rose-700', view: 'refunded' },
  ];

  const emailById = new Map((allProfiles || []).map(p => [p.id, p.email] as const));
  const paidProfiles = (allProfiles || []).filter(p => p.plan && p.plan !== 'free');
  const activeProfiles = paidProfiles.filter(p => p.plan_expires_at && new Date(p.plan_expires_at) > new Date());
  const metricProfiles = selectedView === 'users' ? (allProfiles || []) : selectedView === 'paid' ? paidProfiles : selectedView === 'active' ? activeProfiles : [];
  const metricReceipts = selectedView === 'revenue' ? realReceipts : selectedView === 'refunded' ? refundedReceipts.filter(r => !isTestReceipt(r)) : [];
  const selectedMetric = metrics.find(metric => metric.view === selectedView);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue overview, subscriber management, and payment history.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map(m => (
          <Link
            key={m.label}
            href={selectedView === m.view ? '/admin/billing' : `/admin/billing?view=${m.view}#metric-details`}
            aria-expanded={selectedView === m.view}
            className={`group bg-white rounded-2xl border shadow-sm p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 ${selectedView === m.view ? 'border-violet-400 ring-2 ring-violet-100' : 'border-gray-200'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${m.color}`}>{m.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-xs text-gray-400">{m.label}</p>
              <span className="text-xs font-bold text-violet-600">{selectedView === m.view ? 'Close ↑' : 'View ↓'}</span>
            </div>
          </Link>
        ))}
      </div>

      {selectedView && selectedMetric && (
        <section id="metric-details" className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden scroll-mt-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900">{selectedMetric.label} details</h2>
              <p className="text-xs text-gray-500 mt-1">
                {selectedView === 'revenue' || selectedView === 'refunded'
                  ? 'Select a transaction to inspect PayPal data and its receipt/invoice.'
                  : 'Select a learner to inspect account access and complete payment history.'}
              </p>
            </div>
            <Link href="/admin/billing" className="text-sm font-semibold text-gray-400 hover:text-gray-700">Close ×</Link>
          </div>

          {selectedView === 'revenue' || selectedView === 'refunded' ? (
            metricReceipts.length ? (
              <div className="divide-y divide-gray-100">
                {metricReceipts.map(receipt => {
                  const isRefunded = receipt.status === 'refunded';
                  return (
                    <Link key={receipt.id} href={`/admin/billing/${receipt.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/60 transition-colors group">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isRefunded ? 'bg-rose-100' : 'bg-emerald-100'}`}>{isRefunded ? '↩️' : '✅'}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 capitalize">{receipt.plan} · {receipt.plan_period}</p>
                        <p className="text-xs text-gray-400 truncate">{emailById.get(receipt.user_id) || receipt.payer_email || 'Unknown learner'} · {receipt.receipt_number || receipt.paypal_order_id || '—'} · {new Date(receipt.created_at).toLocaleDateString('en-US')}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${isRefunded ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{receipt.status}</span>
                      <p className={`text-sm font-bold ${isRefunded ? 'text-rose-700' : 'text-gray-900'}`}>${Number(receipt.amount || 0).toFixed(2)} <span className="text-xs font-normal text-gray-400">{receipt.currency}</span></p>
                      <span className="text-violet-600 opacity-0 group-hover:opacity-100">View →</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-sm text-gray-500">No matching transactions.</div>
            )
          ) : metricProfiles.length ? (
            <div className="divide-y divide-gray-100">
              {metricProfiles.map(profileItem => {
                const expires = profileItem.plan_expires_at ? new Date(profileItem.plan_expires_at) : null;
                const isFree = !profileItem.plan || profileItem.plan === 'free';
                const isExpired = Boolean(expires && expires < new Date());
                return (
                  <Link key={profileItem.id} href={`/admin/billing/users/${profileItem.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/60 transition-colors group">
                    <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">{(profileItem.full_name || profileItem.email || 'U')[0].toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{profileItem.full_name || 'Unnamed learner'}</p>
                      <p className="text-xs text-gray-400 truncate">{profileItem.email}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isFree ? 'bg-gray-100 text-gray-600' : isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {isFree ? 'Free' : isExpired ? 'Expired' : 'Active'}
                    </span>
                    <p className="text-sm capitalize text-gray-600">{profileItem.plan || 'free'}{profileItem.plan_period ? ` · ${profileItem.plan_period}` : ''}</p>
                    <span className="text-violet-600 opacity-0 group-hover:opacity-100">View →</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-gray-500">No matching learners.</div>
          )}
        </section>
      )}

      <div id="all-users" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-6">
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
                const userHref = `/admin/billing/users/${p.id}`;
                return (
                  <tr key={p.id} className="hover:bg-violet-50/60 transition-colors group cursor-pointer">
                    <td className="px-6 py-3.5">
                      <Link href={userHref} className="block">
                        <p className="font-semibold text-gray-900 group-hover:text-violet-700">{p.full_name || 'No name'}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <Link href={userHref} className="block">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isFree ? 'bg-gray-100 text-gray-500' : 'bg-violet-100 text-violet-700'}`}>
                          {isFree ? 'Free' : (p.plan || 'free')}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 capitalize"><Link href={userHref} className="block">{p.plan_period || '—'}</Link></td>
                    <td className="px-6 py-3.5">
                      <Link href={userHref} className="block">
                        <span className={`text-xs font-semibold ${isFree ? 'text-gray-400' : isExpired ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isFree ? '—' : isExpired ? 'Expired' : 'Active'}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">
                      <Link href={userHref} className="flex items-center justify-between gap-3">
                        <span>{p.plan_expires_at ? new Date(p.plan_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                        <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">View →</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div id="transactions" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Recent Transactions</h3>
          {testReceiptCount > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {testReceiptCount} sandbox/test payment{testReceiptCount === 1 ? '' : 's'} (excluded from revenue)
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {(allReceipts || []).length > 0 ? (allReceipts || []).map((r) => {
            const isTest = isTestReceipt(r);
            const isRefunded = r.status === 'refunded';
            return (
              <Link key={r.id} href={`/admin/billing/${r.id}`} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${isTest ? 'bg-amber-100' : isRefunded ? 'bg-rose-100' : 'bg-emerald-100'}`}>
                  {isTest ? '🧪' : isRefunded ? '↩️' : '✅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 capitalize flex items-center gap-2">
                    {r.plan} ({r.plan_period})
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isRefunded ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {r.status}
                    </span>
                    {isTest && <span className="text-[10px] font-bold text-amber-600 uppercase">test</span>}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {r.receipt_number || r.paypal_order_id || '—'} · {emailById.get(r.user_id) || r.payer_email || 'unknown'} · {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isRefunded ? 'text-rose-700' : 'text-gray-900'}`}>${r.amount} <span className="text-xs text-gray-400 font-normal">{r.currency}</span></p>
                  <p className="text-xs text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">View details →</p>
                </div>
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
