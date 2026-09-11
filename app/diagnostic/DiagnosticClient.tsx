'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';

type VisualSpec = { kind: 'bar_chart' | 'table'; title?: string; labels?: string[]; values?: number[]; columns?: string[]; rows?: Array<Array<string | number>>; unit?: string };
type Item = { id: string; stem: string; domain: string; position: number; itemType: 'single_response' | 'multiple_response' | 'graphic_single_response'; visualSpec?: VisualSpec | null; positionOptions: Array<{ id: string; text: string }> };
type Snapshot = {
  session: { id: string; status: string; currentPosition: number; flaggedItemIds: string[]; startedAt: string; locale: string };
  form: { id: string; length: 32 | 60; trackId: string };
  items: Item[];
  responses: Array<{ item_id: string; selected_option: string | null; selected_options?: string[] | null; seconds_on_item: number }>;
};

export default function DiagnosticClient() {
  const { isArabic: ar } = useLanguage();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [position, setPosition] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [seconds, setSeconds] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [trackId, setTrackId] = useState<'pmbok8' | 'bridge'>('pmbok8');
  const [learnerName, setLearnerName] = useState('');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);

  const record = useCallback((eventName: string, metadata: Record<string, unknown> = {}) => {
    const params = new URLSearchParams(window.location.search);
    void fetch('/api/diagnostic/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventName, source: params.get('source') || 'direct', path: window.location.pathname, metadata }) });
  }, []);

  const hydrate = useCallback((data: Snapshot) => {
    setSnapshot(data);
    setPosition(data.session.currentPosition || 1);
    setFlags(data.session.flaggedItemIds || []);
    setAnswers(Object.fromEntries(data.responses.map((r) => [r.item_id, r.selected_options?.length ? r.selected_options : (r.selected_option ? [r.selected_option] : [])]).filter(([, value]) => value.length)));
    setSeconds(Object.fromEntries(data.responses.map((r) => [r.item_id, r.seconds_on_item || 0])));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo');
    if (returnTo?.startsWith('/')) sessionStorage.setItem('pmpeco_diagnostic_return_to', returnTo);
    record('diagnostic_view');
    fetch('/api/diagnostic/session').then((res) => res.json()).then((data) => { if (data.session) hydrate(data); }).catch(() => setError(ar ? 'تعذر استعادة الجلسة.' : 'Unable to restore the session.')).finally(() => setLoading(false));
  }, [ar, hydrate, record]);

  const current = snapshot?.items[position - 1];
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!current) return;
      setSeconds((value) => ({ ...value, [current.id]: (value[current.id] || 0) + 1 }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [current]);

  const elapsed = snapshot ? Math.max(0, Math.floor((Date.now() - new Date(snapshot.session.startedAt).getTime()) / 1000)) : 0;
  const formatTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

  async function start() {
    if (!learnerName.trim() || !/^\S+@\S+\.\S+$/.test(learnerEmail)) { setError(ar ? 'يرجى إدخال الاسم والبريد الإلكتروني الصحيح.' : 'Enter your name and a valid email address.'); return; }
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch('/api/diagnostic/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ length: 32, locale: ar ? 'ar' : 'en', trackId, learnerName: learnerName.trim(), learnerEmail: learnerEmail.trim(), marketingConsent, acquisitionSource: params.get('source') || 'direct' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to start');
      hydrate(data);
      record('diagnostic_start', { trackId, marketingConsent });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to start'); }
    finally { setLoading(false); }
  }

  async function save(nextPosition = position, submit = false, nextFlags = flags, selectedOverride?: string[]) {
    if (!snapshot || !current) return false;
    setSaving(true); setError('');
    try {
      const selectedOptions = selectedOverride === undefined ? answers[current.id] || [] : selectedOverride;
      const res = await fetch('/api/diagnostic/response', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: current.id, selectedOptions, secondsOnItem: seconds[current.id] || 0, currentPosition: nextPosition, flaggedItemIds: nextFlags, submit }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      if (submit) {
        setSnapshot({ ...snapshot, session: { ...snapshot.session, status: 'submitted' } });
        record('diagnostic_submit', { trackId: snapshot.form.trackId });
      }
      return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Save failed'); return false; }
    finally { setSaving(false); }
  }

  async function navigate(next: number) {
    if (await save(next)) setPosition(next);
  }

  async function toggleFlag() {
    if (!current) return;
    const next = flags.includes(current.id) ? flags.filter((id) => id !== current.id) : [...flags, current.id];
    setFlags(next);
    await save(position, false, next);
  }

  async function openReport() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/diagnostic/score', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to prepare report');
      window.location.href = '/diagnostic/report';
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to prepare report'); setLoading(false); }
  }

  function selectAnswer(optionId: string) {
    if (!current) return;
    const prior = answers[current.id] || [];
    const selected = current.itemType === 'multiple_response'
      ? (prior.includes(optionId) ? prior.filter((id) => id !== optionId) : [...prior, optionId])
      : [optionId];
    setAnswers((value) => ({ ...value, [current.id]: selected }));
    void save(position, false, flags, selected);
  }

  function renderVisual(visual?: VisualSpec | null) {
    if (!visual) return null;
    if (visual.kind === 'table') return <figure className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4" aria-label={visual.title || 'Item data'}><figcaption className="mb-3 font-semibold text-slate-800">{visual.title}</figcaption><table className="w-full text-sm"><thead><tr>{visual.columns?.map((column) => <th key={column} className="border-b border-slate-300 p-2 text-left">{column}</th>)}</tr></thead><tbody>{visual.rows?.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-slate-200 p-2">{cell}</td>)}</tr>)}</tbody></table></figure>;
    const values = visual.values || [];
    const max = Math.max(...values, 1);
    return <figure className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4" aria-label={visual.title || 'Bar chart'}><figcaption className="mb-4 font-semibold text-slate-800">{visual.title}</figcaption><div className="space-y-3">{values.map((value, index) => <div key={`${visual.labels?.[index]}-${index}`} className="grid grid-cols-[7rem_1fr_4rem] items-center gap-3 text-sm"><span>{visual.labels?.[index]}</span><div className="h-5 overflow-hidden rounded bg-slate-200"><div className="h-full bg-teal-600" style={{ width: `${(value / max) * 100}%` }} /></div><span>{value}{visual.unit || ''}</span></div>)}</div></figure>;
  }

  if (loading) return <main className="min-h-screen grid place-items-center bg-slate-50 text-slate-700">{ar ? 'جارٍ التحميل…' : 'Loading…'}</main>;
  if (!snapshot) return (
    <main dir={ar ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 px-5 py-12 grid place-items-center">
      <section className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-7 shadow-sm">
        <div className="text-sm font-bold text-teal-700">PMPeco</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">{ar ? 'تشخيص الجاهزية لاختبار PMP' : 'PMP Readiness Diagnostic'}</h1>
        <p className="mt-4 text-slate-600 leading-7">{ar ? 'اختر مسارك أولاً. تتكون النسخة القصيرة من 32 سؤالًا وتستغرق نحو 32 دقيقة.' : 'Choose your pathway first. The diagnostic contains 32 English exam-style items and takes about 32 minutes.'}</p>
        <div className="mt-6 grid gap-3">
          <button type="button" onClick={() => setTrackId('pmbok8')} className={`rounded-xl border-2 p-4 text-left ${trackId === 'pmbok8' ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}><b>{ar ? 'مسار PMP الحالي' : 'Current PMP Path'}</b><span className="mt-1 block text-sm text-slate-500">PMBOK 8 + ECO 2026</span></button>
          <button type="button" onClick={() => setTrackId('bridge')} className={`rounded-xl border-2 p-4 text-left ${trackId === 'bridge' ? 'border-violet-600 bg-violet-50' : 'border-slate-200'}`}><b>{ar ? 'الوضع الانتقالي' : 'Bridge Mode'}</b><span className="mt-1 block text-sm text-slate-500">PMBOK 7 to PMBOK 8</span></button>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="text-sm font-semibold text-slate-700">{ar ? 'الاسم الكامل' : 'Full name'}<input value={learnerName} onChange={(event) => setLearnerName(event.target.value)} autoComplete="name" className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" /></label>
          <label className="text-sm font-semibold text-slate-700">{ar ? 'البريد الإلكتروني' : 'Email address'}<input type="email" value={learnerEmail} onChange={(event) => setLearnerEmail(event.target.value)} autoComplete="email" className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" /></label>
          <label className="flex items-start gap-3 text-xs leading-5 text-slate-600"><input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} className="mt-1"/><span>{ar ? 'أوافق على تلقي نصائح واستفسارات حول الاستعداد لاختبار PMP. يمكنني إلغاء الاشتراك في أي وقت.' : 'I agree to receive PMP readiness tips and enrollment follow-ups. I can unsubscribe at any time.'}</span></label>
        </div>
        <p className="mt-3 text-xs text-slate-500">{ar ? 'هذه أداة إعداد مستقلة وغير تابعة أو معتمدة من PMI.' : 'Independent preparation instrument. Not affiliated with or endorsed by PMI.'}</p>
        <button onClick={start} className="mt-7 w-full rounded-xl bg-teal-700 px-5 py-4 font-semibold text-white hover:bg-teal-800">{ar ? 'ابدأ التشخيص' : 'Start diagnostic'}</button>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>
    </main>
  );
  if (snapshot.session.status === 'submitted') return <main className="min-h-screen grid place-items-center bg-slate-50 p-5"><section className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold">{ar ? 'تم إرسال التشخيص' : 'Diagnostic submitted'}</h1><p className="mt-3 text-slate-600">{ar ? 'تم حفظ جميع إجاباتك بأمان. يمكنك الآن إنشاء تقرير الجاهزية.' : 'All responses are safely stored. Your readiness report is ready to prepare.'}</p><button onClick={openReport} className="mt-6 w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white">{ar ? 'عرض التقرير' : 'View report'}</button>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</section></main>;

  const answered = Object.keys(answers).length;
  return (
    <main dir={ar ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 px-4 py-5 sm:py-9">
      <section className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-3 text-sm text-slate-600"><span className="font-bold text-teal-700">PMPeco</span><span aria-label={ar ? 'الوقت المنقضي' : 'Elapsed time'}>◷ {formatTime(elapsed)}</span></header>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-teal-600" style={{ width: `${(answered / snapshot.form.length) * 100}%` }} /></div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{ar ? `السؤال ${position} من ${snapshot.form.length}` : `Question ${position} of ${snapshot.form.length}`}</span><span>{ar ? `${answered} تمت الإجابة` : `${answered} answered`}</span></div>
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label={ar ? 'انتقل إلى سؤال' : 'Question navigator'}>{snapshot.items.map((item) => <button key={item.id} onClick={() => navigate(item.position)} className={`h-8 w-8 rounded-md text-xs font-semibold ${item.position === position ? 'bg-teal-700 text-white' : answers[item.id] ? 'bg-teal-100 text-teal-800' : flags.includes(item.id) ? 'bg-amber-100 text-amber-800' : 'bg-white text-slate-600 border border-slate-200'}`} aria-label={`${ar ? 'السؤال' : 'Question'} ${item.position}`}>{item.position}</button>)}</div>
        <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{current?.domain.replace('_', ' ')}</span><button onClick={toggleFlag} className={`rounded-lg px-3 py-2 text-sm ${current && flags.includes(current.id) ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>⚑ {ar ? 'للمراجعة' : 'Review'}</button></div>
          <h1 className="mt-6 text-lg font-semibold leading-8 text-slate-950" lang="en" dir="ltr">{current?.stem}</h1>
          {renderVisual(current?.visualSpec)}
          {current?.itemType === 'multiple_response' && <p className="mt-4 text-sm font-semibold text-teal-800">{ar ? 'اختر جميع الإجابات الصحيحة.' : 'Select all correct answers.'}</p>}
          <div className="mt-6 space-y-3" role={current?.itemType === 'multiple_response' ? 'group' : 'radiogroup'} aria-label={ar ? 'خيارات الإجابة' : 'Answer options'}>{current?.positionOptions.map((option) => <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 text-left ${answers[current.id]?.includes(option.id) ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`} dir="ltr"><input type={current.itemType === 'multiple_response' ? 'checkbox' : 'radio'} name="answer" value={option.id} checked={answers[current.id]?.includes(option.id) || false} onChange={() => selectAnswer(option.id)} className="mt-1" /><span><b className="mr-2">{option.id}.</b>{option.text}</span></label>)}</div>
        </article>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <nav className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><button disabled={position === 1 || saving} onClick={() => navigate(position - 1)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold disabled:opacity-40">{ar ? 'السابق' : 'Previous'}</button>{position < snapshot.form.length ? <button disabled={saving} onClick={() => navigate(position + 1)} className="col-start-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-50 sm:col-start-3">{saving ? (ar ? 'جارٍ الحفظ…' : 'Saving…') : (ar ? 'التالي' : 'Next')}</button> : <button disabled={saving || answered < snapshot.form.length} onClick={() => save(position, true)} className="col-start-2 rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-50 sm:col-start-3">{ar ? 'إرسال' : 'Submit'}</button>}</nav>
      </section>
    </main>
  );
}
