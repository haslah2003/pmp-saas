'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Locale, TrackId } from '@/lib/pmp-path/types';

interface Props {
  trackId: TrackId;
  lessonId: string;
  locale: Locale;
}

export function FinishLessonButton({ trackId, lessonId, locale }: Props) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  async function finishLesson() {
    if (status === 'saving') return;

    setStatus('saving');

    const response = await fetch('/api/path/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId, lessonId }),
    });

    if (!response.ok) {
      setStatus('error');
      return;
    }

    router.push(`/dashboard/path?lang=${locale}`);
    router.refresh();
  }

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', alignItems: isAr ? 'flex-start' : 'flex-end' }}>
      <button
        type="button"
        onClick={finishLesson}
        disabled={status === 'saving'}
        style={{
          border: '1px solid #0F6E56',
          background: status === 'saving' ? '#6B8F84' : '#0F6E56',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 900,
          cursor: status === 'saving' ? 'wait' : 'pointer',
        }}
      >
        {status === 'saving'
          ? isAr ? 'جارٍ الحفظ...' : 'Saving...'
          : isAr ? 'إنهاء الدرس' : 'Finish lesson'}
      </button>

      {status === 'error' ? (
        <span style={{ fontSize: '11px', color: '#B42318', fontWeight: 700 }}>
          {isAr ? 'تعذر حفظ التقدم. حاول مرة أخرى.' : 'Could not save progress. Try again.'}
        </span>
      ) : null}
    </span>
  );
}
