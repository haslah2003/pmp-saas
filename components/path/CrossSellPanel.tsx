/**
 * components/path/CrossSellPanel.tsx
 * Bidirectional amber cross-sell panel.
 * Driven entirely by CROSS_SELL_SUGGESTIONS from lib/pmp-path/tracks/index.ts.
 * The CTA calls the same switchTrackAction as TrackTabs so the UX is consistent.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { Locale, TrackId } from '@/lib/pmp-path/types';
import { TRACK_IDS } from '@/lib/pmp-path/types';
import { CROSS_SELL_SUGGESTIONS } from '@/lib/pmp-path/tracks';
import { setActiveTrackForUser } from '@/lib/pmp-path/data.server';

async function switchTrackAction(formData: FormData) {
  'use server';
  const trackId = formData.get('trackId');
  if (typeof trackId !== 'string') return;
  if (!(TRACK_IDS as readonly string[]).includes(trackId)) return;

  await setActiveTrackForUser(trackId as TrackId);
  revalidatePath('/dashboard/path');
  redirect(`/dashboard/path?track=${trackId}`);
}

interface Props {
  activeTrackId: TrackId;
  locale: Locale;
}

export async function CrossSellPanel({ activeTrackId, locale }: Props) {
  const suggestion = CROSS_SELL_SUGGESTIONS[activeTrackId];
  if (!suggestion) return null;

  const isAr = locale === 'ar';
  const headline = isAr ? suggestion.headlineAr : suggestion.headlineEn;
  const body = isAr ? suggestion.bodyAr : suggestion.bodyEn;
  const cta = isAr ? suggestion.ctaAr : suggestion.ctaEn;

  return (
    <aside
      style={{
        background: '#FFF7E6',
        borderRadius: '14px',
        padding: '16px',
        marginTop: '18px',
        borderInlineStart: '4px solid #F5A623',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={isAr ? 'اقتراح مسار بديل' : 'Alternative track suggestion'}
    >
      <div className="flex items-center" style={{ gap: '6px', marginBottom: '8px' }}>
        <TransferIcon />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#854F0B',
            letterSpacing: '0.08em',
          }}
        >
          {headline}
        </span>
      </div>

      <p
        style={{
          fontSize: '12px',
          color: '#5E6078',
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}
      >
        {body}
      </p>

      <form action={switchTrackAction}>
        <input type="hidden" name="trackId" value={suggestion.toTrackId} />
        <button
          type="submit"
          style={{
            background: '#FFFFFF',
            color: '#854F0B',
            border: '1px solid rgba(245,166,35,0.4)',
            padding: '9px 14px',
            borderRadius: '10px',
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <TransferIcon size={13} />
          <span>{cta}</span>
        </button>
      </form>
    </aside>
  );
}

function TransferIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
