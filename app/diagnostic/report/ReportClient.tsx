'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/language-context';

type Evidence = 'measured' | 'indicative' | 'not_assessed';
type ProfileRow = { key: string; label: string; proportion: number | null; correct: number; total: number; evidence: Evidence };
type Report = {
  band: { label: string; interpretation: string }; weightedScore: number;
  domains: Array<{ domain: string; label: string; proportion: number; correct: number; total: number }>;
  weakestTasks: Array<{ ecoTask: string; mastery: number; itemCount: number; misconceptions: string[] }>;
  kpis: { overallReadiness: number; situationalJudgment: number | null; approachAdaptabilityGap: number | null; knowledgeApplicationGap: number | null; decisionEfficiency: number | null; evidence: Evidence; uncertaintyLabel: string };
  approachProfile: ProfileRow[]; cognitiveProfile: ProfileRow[]; decisionProfile: ProfileRow[];
  timingQuality: { rushedAccuracy: number | null; labouredAccuracy: number | null; sustainableAccuracy: number | null };
  priorityMatrix: Array<{ rank: number; objective: string; observedMastery: number; evidence: Evidence; impact: string; action: string }>;
  coverage: { assessedItems: number; ecoTasks: number; domains: Evidence; approaches: Evidence; cognitiveDepth: Evidence; pmbok8Principles: Evidence; pmbok8PerformanceDomains: Evidence };
  studySequence: Array<{ label: string; recommendation: string }>;
  timing: { medianSeconds: number; rushed: number; laboured: number; targetSeconds: number };
  review: Array<{ itemId: string; correct: boolean; misconception: string | null; seconds: number }>;
  scoreExplanation: string; disclaimer: string; basis: string;
};

const pct = (value: number | null) => value === null ? 'Not assessed' : `${Math.round(value * 100)}%`;
const evidenceLabel = (value: Evidence) => value === 'not_assessed' ? 'Not assessed' : value[0].toUpperCase() + value.slice(1);

function EvidenceBadge({ value }: { value: Evidence }) {
  const tone = value === 'measured' ? 'bg-emerald-50 text-emerald-700' : value === 'indicative' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500';
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}>{evidenceLabel(value)}</span>;
}

function Profile({ rows }: { rows: ProfileRow[] }) {
  return <div className="mt-4 space-y-4">{rows.map((row) => <div key={row.key}>
    <div className="mb-1 flex items-center justify-between gap-3 text-sm"><span>{row.label}</span><span className="flex items-center gap-2"><EvidenceBadge value={row.evidence} /><b>{pct(row.proportion)}</b></span></div>
    <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${(row.proportion || 0) * 100}%`, background: 'linear-gradient(90deg, #320f91 0%, #244bab 50%, #00aeae 100%)' }} /></div>
    <div className="mt-1 text-xs text-slate-400">{row.total ? `${row.correct}/${row.total} assessed items` : 'No tagged items in this form'}</div>
  </div>)}</div>;
}

function Donut({ value, label }: { value: number; label: string }) {
  return <div className="flex flex-col items-center"><div className="grid h-32 w-32 place-items-center rounded-full" style={{ background: `conic-gradient(#08adad ${value * 360}deg, #e2e8f0 0)` }}><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-2xl font-bold text-violet-900">{pct(value)}</div></div><div className="mt-3 text-sm font-semibold text-slate-600">{label}</div></div>;
}

function Radar({ rows }: { rows: ProfileRow[] }) {
  const center = 100, radius = 70;
  const point = (index: number, scale: number) => { const angle = -Math.PI / 2 + index * Math.PI * 2 / rows.length; return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`; };
  return <div className="mt-3"><svg viewBox="0 0 200 200" className="mx-auto h-52 w-52" role="img" aria-label="Delivery approach radar chart">
    {[.33, .66, 1].map((scale) => <polygon key={scale} points={rows.map((_, index) => point(index, scale)).join(' ')} fill="none" stroke="#d8dbe8" />)}
    <polygon points={rows.map((row, index) => point(index, row.proportion || 0)).join(' ')} fill="rgba(8,173,173,.18)" stroke="#08adad" strokeWidth="3" />
    {rows.map((row, index) => { const [x, y] = point(index, 1.22).split(','); return <text key={row.key} x={x} y={y} textAnchor="middle" className="fill-slate-600 text-[9px]">{row.label} {pct(row.proportion)}</text>; })}
  </svg><div className="flex justify-center gap-2">{rows.map((row) => <EvidenceBadge key={row.key} value={row.evidence} />)}</div></div>;
}

export default function ReportClient() {
  const { isArabic } = useLanguage();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/diagnostic/report').then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setReport(data.report); }).catch((cause) => setError(cause.message || 'Report unavailable')); }, []);
  if (error) return <main className="min-h-screen grid place-items-center p-5 text-red-700">{error}</main>;
  if (!report) return <main className="min-h-screen grid place-items-center p-5 text-slate-600">{isArabic ? 'جارٍ إعداد التقرير…' : 'Preparing report…'}</main>;
  const cards = [
    ['Overall readiness', pct(report.kpis.overallReadiness), report.kpis.evidence],
    ['Situational judgment', pct(report.kpis.situationalJudgment), report.kpis.evidence],
    ['Decision efficiency', pct(report.kpis.decisionEfficiency), report.kpis.evidence],
    ['Measurement confidence', report.kpis.uncertaintyLabel, report.kpis.evidence],
  ] as const;
  return <main dir={isArabic ? 'rtl' : 'ltr'} className="relative min-h-screen overflow-hidden bg-[#f4f3fb] px-4 py-8 text-slate-900">
    <Image src="/brand/pmpeco-watermark.png" alt="" width={620} height={620} className="pointer-events-none fixed -bottom-24 -right-24 opacity-[0.04]" />
    <div className="relative mx-auto max-w-5xl space-y-6">
      <header className="rounded-3xl p-8 text-white shadow-sm" style={{ background: 'linear-gradient(90deg, #320f91 0%, #244bab 50%, #00aeae 100%)' }}><div className="flex items-center gap-4"><Image src="/brand/pmpeco-white-logo.png" alt="PMPeco" width={64} height={64} className="object-contain"/><div><div className="text-sm font-bold text-white/90">PMPeco</div><h1 className="mt-1 text-3xl font-bold">{isArabic ? 'تقرير تشخيص الجاهزية لاختبار PMP' : 'PMP Readiness Diagnostic'}</h1></div></div><div className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 font-semibold">{report.band.label}</div><p className="mt-4 max-w-3xl leading-7 text-white/90">{report.band.interpretation}</p></header>
      <section className="grid gap-4 rounded-2xl border border-violet-100 bg-white p-6 md:grid-cols-[180px_1fr]"><div><Donut value={report.kpis.overallReadiness} label="Overall readiness"/><p className="mt-3 text-center text-xs leading-5 text-slate-500">{report.scoreExplanation}</p></div><div className="grid gap-4 sm:grid-cols-3">{cards.slice(1).map(([label, value, evidence]) => <div key={label} className="rounded-2xl bg-violet-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-2 text-2xl font-bold text-violet-900">{value}</div><div className="mt-3"><EvidenceBadge value={evidence} /></div></div>)}</div></section>
      <section className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">{isArabic ? 'الأداء حسب مجال ECO' : 'ECO domain performance'}</h2><div className="mt-5 space-y-5">{report.domains.map((domain) => <div key={domain.domain}><div className="mb-2 flex justify-between text-sm"><span>{domain.label}</span><span>{Math.round(domain.proportion * 100)}% ({domain.correct}/{domain.total})</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full" style={{ width: `${domain.proportion * 100}%`, background: 'linear-gradient(90deg, #320f91 0%, #244bab 50%, #00aeae 100%)' }} /></div></div>)}</div></section>
      <section className="grid gap-6 md:grid-cols-3"><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="font-bold text-violet-950">Delivery approach agility</h2><Radar rows={report.approachProfile} /></div><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="font-bold text-violet-950">Cognitive depth</h2><Profile rows={report.cognitiveProfile} /></div><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="font-bold text-violet-950">Decision priority</h2><Profile rows={report.decisionProfile} /></div></section>
      <section className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">Priority improvement matrix</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Priority</th><th className="p-3">Learning objective</th><th className="p-3">Observed</th><th className="p-3">Evidence</th><th className="p-3">Recommended action</th></tr></thead><tbody>{report.priorityMatrix.map((row) => <tr key={row.objective} className="border-b border-slate-100"><td className="p-3 font-bold text-violet-900">{row.rank}</td><td className="p-3 font-medium">{row.objective}</td><td className="p-3">{pct(row.observedMastery)}</td><td className="p-3"><EvidenceBadge value={row.evidence} /></td><td className="p-3 text-slate-600">{row.action}</td></tr>)}</tbody></table></div></section>
      <section className="grid gap-6 md:grid-cols-[1fr_320px]"><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">Timing quality</h2><div className="mt-4 grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-violet-50 p-4"><b>{report.timing.medianSeconds}s</b><div className="text-xs text-slate-500">Median</div></div><div className="rounded-xl bg-violet-50 p-4"><b>{pct(report.timingQuality.rushedAccuracy)}</b><div className="text-xs text-slate-500">Rushed accuracy</div></div><div className="rounded-xl bg-violet-50 p-4"><b>{pct(report.timingQuality.labouredAccuracy)}</b><div className="text-xs text-slate-500">Laboured accuracy</div></div></div></div><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="font-bold text-violet-950">Report confidence</h2><p className="mt-3 text-sm leading-6 text-slate-600">Based on <b>{report.coverage.assessedItems}</b> items across <b>{report.coverage.ecoTasks}</b> sampled ECO tasks. Each granular result is labelled Measured or Indicative so you can act on it appropriately.</p></div></section>
      <section className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">{isArabic ? 'أنماط الفهم الخاطئ' : 'Misconception patterns'}</h2><div className="mt-4 space-y-4">{report.weakestTasks.map((gap) => <div key={gap.ecoTask} className="rounded-xl bg-amber-50 p-4"><div className="font-semibold">{gap.ecoTask} · {Math.round(gap.mastery * 100)}%</div>{gap.misconceptions.map((text, index) => <p key={index} className="mt-2 text-sm text-slate-700">{text}</p>)}</div>)}</div></div><div className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">{isArabic ? 'مسار الجاهزية الموصى به' : 'Recommended readiness path'}</h2><ol className="mt-4 space-y-4">{report.studySequence.map((step, index) => <li key={step.label} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">{index + 1}</span><span className="text-sm leading-6">{step.recommendation}</span></li>)}</ol><a href="/dashboard" className="mt-6 block rounded-xl bg-gradient-to-r from-violet-700 to-teal-600 px-5 py-4 text-center font-semibold text-white">Start my readiness plan</a></div></section>
      <section className="rounded-2xl border border-violet-100 bg-white p-6"><h2 className="text-xl font-bold text-violet-950">{isArabic ? 'مراجعة الإجابات' : 'Response review'}</h2><p className="mt-2 text-sm text-slate-500">{isArabic ? 'نوضح نمط الفهم الخاطئ دون كشف مفتاح الإجابة.' : 'Misconceptions are explained without exposing the answer key.'}</p><div className="mt-4 space-y-2">{report.review.map((item, index) => <div key={item.itemId} className={`rounded-lg p-3 text-sm ${item.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}><b>{index + 1}. {item.correct ? (isArabic ? 'صحيح' : 'Correct') : (isArabic ? 'غير صحيح' : 'Incorrect')}</b>{item.misconception && <span> - {item.misconception}</span>}</div>)}</div></section>
      <a href="/api/diagnostic/report/pdf" className="block rounded-xl bg-gradient-to-r from-violet-700 to-teal-600 px-5 py-4 text-center font-semibold text-white">{isArabic ? 'تنزيل تقرير PDF بعلامة مائية' : 'Download branded, watermarked PDF report'}</a>
      <footer className="space-y-2 pb-8 text-xs leading-5 text-slate-500"><p>{report.basis}</p><p>{report.disclaimer}</p><p>Measured = 5+ relevant items; Indicative = 1-4 relevant items; Not assessed = no eligible tagged items. Granular indicators are diagnostic signals, not official PMI scores.</p></footer>
    </div>
  </main>;
}
