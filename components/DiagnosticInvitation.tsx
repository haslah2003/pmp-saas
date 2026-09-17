'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const suppressedPaths = ['/diagnostic', '/login', '/signup', '/forgot-password', '/reset-password', '/dashboard/payment', '/dashboard/exam', '/dashboard/practice'];
const storageKey = 'pmpeco_diagnostic_invitation_dismissed_at';
const cooldown = 5 * 24 * 60 * 60 * 1000;

function record(eventName: string, source: string) {
  void fetch('/api/diagnostic/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventName, source, path: window.location.pathname }) });
}

export default function DiagnosticInvitation() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (suppressedPaths.some((path) => pathname.startsWith(path))) return;
    const dismissed = Number(localStorage.getItem(storageKey) || 0);
    if (Date.now() - dismissed < cooldown || sessionStorage.getItem('pmpeco_diagnostic_invitation_seen')) return;
    const safeToInterrupt = () => {
      const active = document.activeElement;
      const mediaPlaying = [...document.querySelectorAll('video,audio')].some((node) => !(node as HTMLMediaElement).paused);
      return !mediaPlaying && !(active instanceof HTMLInputElement) && !(active instanceof HTMLTextAreaElement) && !(active instanceof HTMLSelectElement);
    };
    const show = (source: string) => {
      if (!safeToInterrupt()) return;
      sessionStorage.setItem('pmpeco_diagnostic_invitation_seen', '1');
      setVisible(true); record('invitation_view', source);
    };
    const idle = window.setTimeout(() => show('idle_40s'), 40000);
    const scroll = () => { if (window.scrollY > (document.documentElement.scrollHeight - window.innerHeight) * .65) show('deep_scroll'); };
    const exit = (event: MouseEvent) => { if (event.clientY <= 4) show('exit_intent'); };
    window.addEventListener('scroll', scroll, { passive: true }); document.addEventListener('mouseout', exit);
    return () => { window.clearTimeout(idle); window.removeEventListener('scroll', scroll); document.removeEventListener('mouseout', exit); };
  }, [pathname]);
  if (!visible) return null;
  const dismiss = () => { localStorage.setItem(storageKey, String(Date.now())); setVisible(false); record('invitation_dismiss', 'smart_prompt'); };
  return <aside role="dialog" aria-label="Free PMP readiness diagnostic" className="fixed inset-x-3 bottom-3 z-[200] mx-auto max-w-md rounded-2xl border border-teal-100 bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6">
    <button type="button" onClick={dismiss} className="absolute right-3 top-2 p-2 text-slate-400" aria-label="Dismiss">x</button>
    <div className="text-xs font-bold uppercase tracking-wide text-teal-700">Free readiness report</div>
    <h2 className="mt-2 pr-6 text-xl font-bold text-slate-950">Not sure which PMP path fits you?</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">Take the free 32-question diagnostic and receive a personalized readiness report.</p>
    <Link href={`/diagnostic?source=smart_prompt&returnTo=${encodeURIComponent(pathname)}`} onClick={() => record('cta_click', 'smart_prompt')} className="mt-4 block rounded-xl bg-teal-700 px-4 py-3 text-center font-semibold text-white">Take the Free Diagnostic</Link>
  </aside>;
}
