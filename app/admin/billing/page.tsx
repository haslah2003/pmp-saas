import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminBillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, plan, plan_period, plan_expires_at, created_at")
    .order("created_at", { ascending: false });

  const { data: allBilling } = await supabase
    .from("billing_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const totalUsers = allProfiles?.length || 0;
  const paidUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free').length || 0;
  const activeUsers = allProfiles?.filter(p => p.plan && p.plan !== 'free' && p.plan_expires_at && new Date(p.plan_expires_at) > new Date()).length || 0;
  const totalRevenue = allBilling?.reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0) || 0;

  const metrics = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'Paid Subscribers', value: paidUsers, icon: '💎', color: 'bg-purple-50 text-purple-700' },
    { label: 'Active Now', value: activeUsers, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-amber-50 text-amber-700' },
  ];

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
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-bold text-gray-900">Recent Transactions</h3></div>
        <div className="divide-y divide-gray-50">
          {allBilling && allBilling.length > 0 ? allBilling.map((b) => (
            <div key={b.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-base">{'✅'}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{b.plan_id} ({b.period})</p>
                <p className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <p className="text-sm font-bold text-gray-900">${b.amount}</p>
            </div>
          )) : (
            <div className="px-6 py-12 text-center">
              <p className="text-4xl mb-3">{'💳'}</p>
              <p className="text-sm font-semibold text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
