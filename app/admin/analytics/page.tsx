'use client';

import React, { useState } from 'react';
import { Card, Badge, Tabs, StatCard, Button } from '@/components/ui';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';

// ── Mock Data ───────────────────────────────────────────────────────────────
const OVERVIEW = {
  total_users: 2847,
  active_today: 342,
  active_week: 1205,
  active_month: 2103,
  premium_users: 489,
  free_users: 2358,
  conversion_rate: 0.172,
  mrr: 11_840,
  arr: 142_080,
  churn_rate: 0.034,
  retention_30d: 0.82,
  avg_session_min: 24,
};

const SIGNUPS_DATA = [
  { date: 'Mar 1', signups: 22, conversions: 3 }, { date: 'Mar 2', signups: 18, conversions: 2 },
  { date: 'Mar 3', signups: 31, conversions: 5 }, { date: 'Mar 4', signups: 28, conversions: 4 },
  { date: 'Mar 5', signups: 35, conversions: 6 }, { date: 'Mar 6', signups: 42, conversions: 8 },
  { date: 'Mar 7', signups: 38, conversions: 7 }, { date: 'Mar 8', signups: 45, conversions: 9 },
  { date: 'Mar 9', signups: 52, conversions: 11 }, { date: 'Mar 10', signups: 48, conversions: 10 },
  { date: 'Mar 11', signups: 55, conversions: 12 }, { date: 'Mar 12', signups: 61, conversions: 14 },
  { date: 'Mar 13', signups: 58, conversions: 13 }, { date: 'Mar 14', signups: 67, conversions: 15 },
];

const FEATURE_USAGE = [
  { feature: 'Course', sessions: 3420, users: 1845, avg_min: 32, premium: false, pct: 85 },
  { feature: 'AiTuTorZ', sessions: 2890, users: 1560, avg_min: 18, premium: false, pct: 72 },
  { feature: 'Study Studio', sessions: 2105, users: 1230, avg_min: 26, premium: false, pct: 60 },
  { feature: 'Practice (PRO)', sessions: 1850, users: 420, avg_min: 35, premium: true, pct: 48 },
  { feature: 'Mind Map (PRO)', sessions: 1240, users: 380, avg_min: 15, premium: true, pct: 35 },
  { feature: 'Mock Exam', sessions: 890, users: 445, avg_min: 48, premium: false, pct: 25 },
];

const REVENUE_DATA = [
  { month: 'Oct', revenue: 6200 }, { month: 'Nov', revenue: 7800 },
  { month: 'Dec', revenue: 8400 }, { month: 'Jan', revenue: 9100 },
  { month: 'Feb', revenue: 10500 }, { month: 'Mar', revenue: 11840 },
];

const COHORT_DATA = [
  { cohort: 'Jan 2026', w1: 100, w2: 72, w3: 58, w4: 48, w5: 42, w6: 38, w7: 35, w8: 33 },
  { cohort: 'Feb 2026', w1: 100, w2: 75, w3: 62, w4: 54, w5: 48, w6: 44, w7: 41, w8: null },
  { cohort: 'Mar 2026', w1: 100, w2: 78, w3: 65, w4: 58, w5: null, w6: null, w7: null, w8: null },
];

const HEATMAP_HOURS = Array.from({ length: 24 }, (_, h) => h);
const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function SimpleBarChart({ data, dataKey, labelKey, color = '#1E40AF', height = 200 }: { data: Record<string, any>[]; dataKey: string; labelKey: string; color?: string; height?: number }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-brand-900/40 font-medium">{d[dataKey]}</span>
          <div className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${(d[dataKey] / max) * 100}%`, backgroundColor: color, minHeight: 4, opacity: 0.8 + (d[dataKey] / max) * 0.2 }} />
          <span className="text-[9px] text-brand-900/30 truncate w-full text-center">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data, dataKey, color = '#1E40AF' }: { data: Record<string, any>[]; dataKey: string; color?: string }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  const min = Math.min(...data.map(d => d[dataKey]));
  const range = max - min || 1;
  const h = 60;
  const w = data.length * 20;
  const points = data.map((d, i) => `${i * (w / (data.length - 1))},${h - ((d[dataKey] - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Analytics Dashboard</h1>
          <p className="text-sm text-brand-900/50 mt-1">Platform performance, revenue, and learning engagement metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', '12m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                period === p ? 'bg-brand-500 text-white' : 'bg-surface-100 text-brand-900/50 hover:bg-surface-200')}>
              {p}
            </button>
          ))}
          <Button variant="secondary" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={OVERVIEW.total_users.toLocaleString()} change="+12.4% vs last month" changeType="up"
          icon={<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          iconBg="bg-blue-50" />
        <StatCard label="Monthly Revenue (MRR)" value={formatCurrency(OVERVIEW.mrr)} change="+18.2%" changeType="up"
          icon={<svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBg="bg-emerald-50" />
        <StatCard label="Conversion Rate" value={formatPercent(OVERVIEW.conversion_rate)} change="+2.1pp" changeType="up"
          icon={<svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          iconBg="bg-violet-50" />
        <StatCard label="Churn Rate" value={formatPercent(OVERVIEW.churn_rate)} change="-0.8pp" changeType="up"
          icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
          iconBg="bg-amber-50" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Today" value={OVERVIEW.active_today.toLocaleString()} change="12% of total" changeType="neutral"
          icon={<span className="text-lg">📊</span>} iconBg="bg-blue-50" />
        <StatCard label="Active This Week" value={OVERVIEW.active_week.toLocaleString()} change="42% of total" changeType="neutral"
          icon={<span className="text-lg">📈</span>} iconBg="bg-emerald-50" />
        <StatCard label="30-Day Retention" value={formatPercent(OVERVIEW.retention_30d)} change="+3.5pp" changeType="up"
          icon={<span className="text-lg">🔄</span>} iconBg="bg-violet-50" />
        <StatCard label="Avg Session" value={`${OVERVIEW.avg_session_min}m`} change="+2m vs last month" changeType="up"
          icon={<span className="text-lg">⏱️</span>} iconBg="bg-amber-50" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Signups chart */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">Daily Signups</h3>
            <Badge variant="success">↑ 42% vs prior period</Badge>
          </div>
          <SimpleBarChart data={SIGNUPS_DATA} dataKey="signups" labelKey="date" color="#1E40AF" height={180} />
        </Card>

        {/* Revenue chart */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-900">Monthly Revenue</h3>
            <span className="text-sm font-bold text-brand-900">ARR: {formatCurrency(OVERVIEW.arr)}</span>
          </div>
          <SimpleBarChart data={REVENUE_DATA} dataKey="revenue" labelKey="month" color="#059669" height={180} />
        </Card>
      </div>

      {/* Feature Usage */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-brand-900">Feature Usage</h3>
          <Badge variant="info">{OVERVIEW.active_month.toLocaleString()} active users</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left text-xs font-semibold text-brand-900/40 pb-3 pr-4">Feature</th>
                <th className="text-right text-xs font-semibold text-brand-900/40 pb-3 px-4">Sessions</th>
                <th className="text-right text-xs font-semibold text-brand-900/40 pb-3 px-4">Unique Users</th>
                <th className="text-right text-xs font-semibold text-brand-900/40 pb-3 px-4">Avg Duration</th>
                <th className="text-left text-xs font-semibold text-brand-900/40 pb-3 pl-4 w-48">Adoption</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_USAGE.map((f) => (
                <tr key={f.feature} className="border-b border-surface-100 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{f.feature}</span>
                      {f.premium && <Badge variant="premium">PRO</Badge>}
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-sm font-medium">{f.sessions.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-sm font-medium">{f.users.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-sm font-medium">{f.avg_min}m</td>
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-surface-100">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${f.pct}%` }} />
                      </div>
                      <span className="text-xs text-brand-900/40 w-8">{f.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cohort Retention + Learning Heatmap */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cohort table */}
        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-4">Cohort Retention</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-brand-900/40 pb-2">Cohort</th>
                  {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(w => (
                    <th key={w} className="text-center font-semibold text-brand-900/40 pb-2 px-1">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_DATA.map((row) => (
                  <tr key={row.cohort}>
                    <td className="py-1.5 font-medium text-brand-900/70">{row.cohort}</td>
                    {[row.w1, row.w2, row.w3, row.w4, row.w5, row.w6, row.w7, row.w8].map((val, i) => (
                      <td key={i} className="text-center py-1.5 px-1">
                        {val !== null ? (
                          <span className={cn('inline-block w-10 py-0.5 rounded text-[10px] font-bold',
                            val >= 60 ? 'bg-emerald-100 text-emerald-700' : val >= 40 ? 'bg-amber-100 text-amber-700' : val >= 20 ? 'bg-red-100 text-red-600' : 'bg-emerald-200 text-emerald-800')}>
                            {val}%
                          </span>
                        ) : <span className="text-brand-900/10">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Learning Heatmap */}
        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-4">Learning Activity Heatmap</h3>
          <p className="text-xs text-brand-900/40 mb-3">When users are most active (sessions per hour/day)</p>
          <div className="space-y-1">
            <div className="flex gap-1 ml-8">
              {HEATMAP_HOURS.filter((_, i) => i % 3 === 0).map(h => (
                <span key={h} className="text-[9px] text-brand-900/30 w-4 text-center">{h}</span>
              ))}
            </div>
            {HEATMAP_DAYS.map((day, di) => (
              <div key={day} className="flex items-center gap-1">
                <span className="text-[10px] text-brand-900/40 w-7 text-right">{day}</span>
                {HEATMAP_HOURS.map((h) => {
                  // Simulate intensity
                  const peak = (h >= 9 && h <= 11) || (h >= 19 && h <= 22);
                  const mid = (h >= 7 && h <= 23);
                  const weekend = di >= 5;
                  const intensity = peak ? 0.7 + Math.random() * 0.3 : mid ? 0.2 + Math.random() * 0.4 : Math.random() * 0.15;
                  const adjusted = weekend ? intensity * 0.6 : intensity;
                  return (
                    <div key={h} className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: `rgba(30, 64, 175, ${adjusted})` }}
                      title={`${day} ${h}:00 — ${Math.round(adjusted * 100)}% activity`} />
                  );
                })}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 ml-8">
              <span className="text-[9px] text-brand-900/30">Less</span>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                <div key={o} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(30, 64, 175, ${o})` }} />
              ))}
              <span className="text-[9px] text-brand-900/30">More</span>
            </div>
          </div>
        </Card>
      </div>

      {/* User Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-3">User Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-900/60">Free Users</span>
              <span className="text-sm font-bold">{OVERVIEW.free_users.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-900/60">Premium Users</span>
              <span className="text-sm font-bold text-gold-600">{OVERVIEW.premium_users.toLocaleString()}</span>
            </div>
            <div className="h-3 rounded-full bg-surface-100 overflow-hidden flex">
              <div className="h-full bg-brand-500" style={{ width: `${(OVERVIEW.free_users / OVERVIEW.total_users) * 100}%` }} />
              <div className="h-full bg-gold-500" style={{ width: `${(OVERVIEW.premium_users / OVERVIEW.total_users) * 100}%` }} />
            </div>
            <p className="text-xs text-brand-900/30">{formatPercent(OVERVIEW.conversion_rate)} free → premium conversion</p>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-3">Revenue by Plan</h3>
          <div className="space-y-3">
            {[
              { plan: 'Monthly ($29)', users: 210, revenue: 6090, color: 'bg-blue-500' },
              { plan: 'Quarterly ($69)', users: 156, revenue: 3588, color: 'bg-emerald-500' },
              { plan: 'Annual ($199)', users: 123, revenue: 2162, color: 'bg-violet-500' },
            ].map(p => (
              <div key={p.plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-900/60">{p.plan}</span>
                  <span className="font-bold">{formatCurrency(p.revenue)}/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-surface-100">
                    <div className={cn('h-full rounded-full', p.color)} style={{ width: `${(p.revenue / OVERVIEW.mrr) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-brand-900/30">{p.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-bold text-brand-900 mb-3">Top Performing Content</h3>
          <div className="space-y-2">
            {[
              { title: 'EVM Deep Dive', completions: 892, rating: 4.8 },
              { title: 'Stakeholder Engagement', completions: 756, rating: 4.7 },
              { title: 'Agile vs Predictive', completions: 698, rating: 4.6 },
              { title: 'Risk Management', completions: 645, rating: 4.5 },
              { title: 'Servant Leadership', completions: 589, rating: 4.9 },
            ].map((c, i) => (
              <div key={c.title} className="flex items-center gap-3 py-2">
                <span className="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center text-xs font-bold text-brand-900/40">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-[10px] text-brand-900/40">{c.completions} completions</p>
                </div>
                <Badge variant="success">★ {c.rating}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
