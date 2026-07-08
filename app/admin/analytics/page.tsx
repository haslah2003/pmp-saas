import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, Badge, StatCard } from '@/components/ui';
import { formatCurrency, formatPercent } from '@/lib/utils';

// Server-safe bar chart (pure, no hooks).
function BarChart({ data, height = 180, color = '#1E40AF' }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-brand-900/40 font-medium">{d.value}</span>
          <div className="w-full rounded-t-md" style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: d.value > 0 ? 4 : 0, opacity: 0.85 }} />
          <span className="text-[9px] text-brand-900/30 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const PLAN_LABEL: Record<string, string> = { basic: 'Basic', standard: 'Standard', professional: 'Professional' };
const PLAN_COLOR: Record<string, string> = { basic: 'bg-blue-500', standard: 'bg-emerald-500', professional: 'bg-violet-500' };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') redirect('/dashboard');

  // Platform-wide reads bypass the profiles own-row RLS via the service-role client,
  // gated behind the admin check above.
  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, plan, plan_expires_at, created_at, role');
  const { data: receipts } = await admin
    .from('payment_receipts')
    .select('id, user_id, plan, plan_period, amount, status, payer_email, paypal_order_id, created_at')
    .order('created_at', { ascending: false });

  const allProfiles = profiles || [];
  const now = Date.now();
  const totalUsers = allProfiles.length;
  const freeUsers = allProfiles.filter(p => !p.plan || p.plan === 'free').length;
  const paidUsers = totalUsers - freeUsers;
  const activeSubscribers = allProfiles.filter(p => p.plan && p.plan !== 'free' && p.plan_expires_at && new Date(p.plan_expires_at).getTime() > now).length;
  const conversion = totalUsers ? paidUsers / totalUsers : 0;

  const isTest = (r: { payer_email?: string | null; paypal_order_id?: string | null }) =>
    (r.payer_email || '').includes('.example.com') || (r.paypal_order_id || '').toUpperCase().startsWith('TEST-');
  const paidReceipts = (receipts || []).filter(r => r.status === 'paid');
  const realReceipts = paidReceipts.filter(r => !isTest(r));
  const testCount = paidReceipts.length - realReceipts.length;
  const realRevenue = realReceipts.reduce((s, r) => s + parseFloat(r.amount || '0'), 0);

  // Signups over the last 14 days
  const days: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const count = allProfiles.filter(p => (p.created_at || '').slice(0, 10) === key).length;
    days.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: count });
  }

  // Real revenue grouped by plan
  const byPlan = new Map<string, { revenue: number; count: number }>();
  for (const r of realReceipts) {
    const cur = byPlan.get(r.plan) || { revenue: 0, count: 0 };
    cur.revenue += parseFloat(r.amount || '0'); cur.count += 1;
    byPlan.set(r.plan, cur);
  }
  const revenueByPlan = [...byPlan.entries()].sort((a, b) => b[1].revenue - a[1].revenue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Analytics Dashboard</h1>
          <p className="text-sm text-brand-900/50 mt-1">Live platform metrics from your database. Figures update on refresh.</p>
        </div>
        <Link href="/admin/billing" className="text-xs font-semibold px-3 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors">
          Billing & Sales →
        </Link>
      </div>

      {/* KPI Cards — all real */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totalUsers.toLocaleString()} change={`${freeUsers} free · ${paidUsers} paid`} changeType="neutral" icon={<span className="text-lg">👥</span>} iconBg="bg-blue-50" />
        <StatCard label="Active Subscribers" value={activeSubscribers.toLocaleString()} change="unexpired paid plans" changeType="neutral" icon={<span className="text-lg">💎</span>} iconBg="bg-violet-50" />
        <StatCard label="Free → Paid Conversion" value={formatPercent(conversion)} change={`${paidUsers} of ${totalUsers}`} changeType="neutral" icon={<span className="text-lg">📈</span>} iconBg="bg-emerald-50" />
        <StatCard label="Real Revenue" value={formatCurrency(realRevenue)} change={testCount > 0 ? `${testCount} test payment${testCount === 1 ? '' : 's'} excluded` : 'collected to date'} changeType="neutral" icon={<span className="text-lg">💰</span>} iconBg="bg-amber-50" />
      </div>

      {/* Sandbox notice */}
      {testCount > 0 && realReceipts.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ All {testCount} payment{testCount === 1 ? '' : 's'} recorded so far are PayPal <strong>sandbox/test</strong> transactions — no live money has been collected yet. Real revenue will populate once PayPal is switched to live mode.
        </div>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">Daily Signups (last 14 days)</h3>
            <Badge variant="info">{days.reduce((s, d) => s + d.value, 0)} new</Badge>
          </div>
          <BarChart data={days} color="#1E40AF" />
        </Card>

        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-3">User Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-900/60">Free Users</span>
              <span className="text-sm font-bold">{freeUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-900/60">Paid Users</span>
              <span className="text-sm font-bold text-gold-600">{paidUsers.toLocaleString()}</span>
            </div>
            <div className="h-3 rounded-full bg-surface-100 overflow-hidden flex">
              <div className="h-full bg-brand-500" style={{ width: `${totalUsers ? (freeUsers / totalUsers) * 100 : 0}%` }} />
              <div className="h-full bg-gold-500" style={{ width: `${totalUsers ? (paidUsers / totalUsers) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-brand-900/30">{formatPercent(conversion)} free → paid conversion · {activeSubscribers} currently active</p>
          </div>
        </Card>
      </div>

      {/* Revenue by plan (real) */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-900">Revenue by Plan</h3>
          <span className="text-sm font-bold text-brand-900">{formatCurrency(realRevenue)} total</span>
        </div>
        {revenueByPlan.length > 0 ? (
          <div className="space-y-3">
            {revenueByPlan.map(([plan, v]) => (
              <div key={plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-900/60">{PLAN_LABEL[plan] || plan}</span>
                  <span className="font-bold">{formatCurrency(v.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-surface-100">
                    <div className={`h-full rounded-full ${PLAN_COLOR[plan] || 'bg-brand-500'}`} style={{ width: `${realRevenue ? (v.revenue / realRevenue) * 100 : 0}%` }} />
                  </div>
                  <span className="text-[10px] text-brand-900/30 w-20 text-right">{v.count} payment{v.count === 1 ? '' : 's'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-900/40 py-6 text-center">No live payments yet. Revenue by plan will appear here once real transactions are collected.</p>
        )}
      </Card>

      {/* Recent transactions (real) */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-900">Recent Payments</h3>
          <Link href="/admin/billing" className="text-xs font-semibold text-brand-500 hover:underline">View all in Billing →</Link>
        </div>
        {paidReceipts.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {paidReceipts.slice(0, 8).map(r => (
              <div key={r.id} className="py-2.5 flex items-center gap-3">
                <span className="text-base">{isTest(r) ? '🧪' : '✅'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize truncate">{r.plan} ({r.plan_period}) {isTest(r) && <span className="text-[10px] font-bold text-amber-600 uppercase">test</span>}</p>
                  <p className="text-[11px] text-brand-900/40">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className="text-sm font-bold">${r.amount}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-900/40 py-6 text-center">No payments recorded yet.</p>
        )}
      </Card>

      {/* Honest gap note */}
      <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-xs text-brand-900/50">
        <strong className="text-brand-900/70">Not shown:</strong> engagement analytics (feature usage, session duration, retention cohorts, activity heatmaps) require per-event tracking that isn't wired yet. These were previously placeholder/demo figures and have been removed so this dashboard only reflects real data.
      </div>
    </div>
  );
}
