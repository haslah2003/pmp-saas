/**
 * components/path/TrackTabs.tsx
 * Tab-bar track picker — Coursera-style.
 * Active tab carries a 3px underline in the track's identity color.
 * Switching is a real navigation (?track=...) so the page re-renders with new progress.
 *
 * This file uses a Server Action to also persist the user's choice when authenticated.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { Locale, Track, TrackId } from '@/lib/pmp-path/types';
import { TRACK_IDS } from '@/lib/pmp-path/types';
import { TRACK_IDENTITY } from '@/lib/pmp-path/colors';
import { setActiveTrackForUser } from '@/lib/pmp-path/data.server';

interface Props {
  tracks: Track[];
  activeTrackId: TrackId;
  locale: Locale;
}

// Server Action — submit-on-click via a hidden-input form per tab
async function switchTrackAction(formData: FormData) {
  'use server';
  const trackId = formData.get('trackId');
  if (typeof trackId !== 'string') return;
  if (!(TRACK_IDS as readonly string[]).includes(trackId)) return;

  await setActiveTrackForUser(trackId as TrackId);
  revalidatePath('/dashboard/path');
  redirect(`/dashboard/path?track=${trackId}`);
}

export async function TrackTabs({ tracks, activeTrackId, locale }: Props) {
  const isAr = locale === 'ar';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.5px solid rgba(26,20,48,0.12)',
        marginBottom: '18px',
        overflow: 'hidden',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Tabs row */}
      <div
        role="tablist"
        aria-label={isAr ? 'اختيار المسار' : 'Track selection'}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderBottom: '0.5px solid rgba(26,20,48,0.08)',
        }}
      >
        {tracks.map((t) => {
          const isActive = t.meta.id === activeTrackId;
          const identity = TRACK_IDENTITY[t.meta.id];
          const subline = isAr
            ? `${t.meta.moduleCount} وحدات · ~${t.meta.estimatedHours}س · ${t.meta.badgeLabel.ar}`
            : `${t.meta.moduleCount} modules · ~${t.meta.estimatedHours}h · ${t.meta.badgeLabel.en}`;

          return (
            <form
              key={t.meta.id}
              action={switchTrackAction}
              style={{ flex: 1, display: 'flex' }}
            >
              <input type="hidden" name="trackId" value={t.meta.id} />
              <button
                type="submit"
                role="tab"
                aria-selected={isActive}
                aria-controls="pmp-path-content"
                style={{
                  flex: 1,
                  padding: '14px 12px 12px',
                  borderBottom: `3px solid ${isActive ? identity.accent : 'transparent'}`,
                  borderTop: 'none',
                  borderInlineStart: 'none',
                  borderInlineEnd: 'none',
                  background: 'transparent',
                  cursor: isActive ? 'default' : 'pointer',
                  textAlign: 'center',
                  transition: 'border-color 0.15s',
                  fontFamily: 'inherit',
                }}
                disabled={isActive}
              >
                <div
                  className="flex items-center"
                  style={{
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '2px',
                  }}
                >
                  <TrackIcon
                    icon={t.meta.icon}
                    color={isActive ? identity.iconActive : '#5E6078'}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isActive ? identity.iconActive : '#5E6078',
                      lineHeight: 1.3,
                    }}
                  >
                    {t.meta.shortName[locale]}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: isActive ? identity.iconActive : '#5E6078',
                    lineHeight: 1.3,
                    display: 'block',
                    opacity: 0.85,
                  }}
                >
                  {subline}
                </span>
              </button>
            </form>
          );
        })}
      </div>

      {/* Helper line */}
      <div
        className="flex items-center"
        style={{
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: '#FAFAF9',
        }}
      >
        <span style={{ fontSize: '11px', color: '#5E6078' }}>
          <InfoIcon />{' '}
          {isAr
            ? 'يمكنك تبديل المسار في أي وقت — تقدّمك محفوظ لكل مسار'
            : 'You can switch tracks anytime — your progress is saved per track'}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Track icons — match the per-track identity from the v4 design
// ============================================================

function TrackIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === 'sparkles') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6.34 6.34l-2.12-2.12M19.78 19.78l-2.12-2.12M6.34 17.66l-2.12 2.12M19.78 4.22l-2.12 2.12" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    );
  }
  if (icon === 'transfer') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    );
  }
  // default: 'book'
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-1px' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
