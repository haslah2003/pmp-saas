/**
 * app/dashboard/path/page.tsx
 * Server Component — My PMP Path.
 *
 * Behaviour:
 *   - reads ?track=<TrackId> from the URL when present
 *   - otherwise falls back to user_path_pref, then DEFAULT_TRACK_ID
 *   - reads pmp_locale cookie for EN/AR
 *   - renders tabs → header → 4 phase blocks → cross-sell → footer stats
 */

import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import type { Locale } from '@/lib/pmp-path/types';
import { ALL_TRACKS } from '@/lib/pmp-path/tracks';
import { getPathDataForUser } from '@/lib/pmp-path/data.server';

import { TrackTabs } from '@/components/path/TrackTabs';
import { PathHeader } from '@/components/path/PathHeader';
import { PhaseBlock } from '@/components/path/PhaseBlock';
import { CrossSellPanel } from '@/components/path/CrossSellPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My PMP Path — PMPeco',
  description: 'Your personalized journey to PMP certification.',
};

interface PageProps {
  searchParams: Promise<{ track?: string }>;
}

export default async function PMPathPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const locale: Locale = (cookieStore.get('pmp_locale')?.value === 'ar') ? 'ar' : 'en';
  const isAr = locale === 'ar';

  const { track, activeTrackId, progress, nextBestAction, isAuthenticated } =
    await getPathDataForUser(params.track ?? null);

  // Find the Up Next module so PhaseBlock can highlight it
  const upNextModuleId = nextBestAction.kind === 'path_complete' ? null : nextBestAction.moduleId;

  // Footer stat copy
  const overallPct = progress.overallPercent;

  return (
    <main
      style={{
        background: '#FAFAF9',
        minHeight: '100vh',
        padding: '24px',
      }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Page title */}
        <div
          className="flex items-center"
          style={{ justifyContent: 'space-between', marginBottom: '14px', paddingInlineStart: '4px' }}
        >
          <div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 500,
                margin: '0 0 2px',
                color: '#1A1430',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              {isAr ? 'مساري لـ PMP' : 'My PMP path'}
            </h1>
            <p style={{ fontSize: '12px', color: '#5E6078', margin: 0 }}>
              {isAr
                ? 'الإطار: 4 مراحل · 7 خطوات تعلّم · هدف واحد لكل وحدة'
                : '4 phases · 7-step learning loop · 1 CTA per module'}
            </p>
          </div>
        </div>

        {/* Track tabs */}
        <TrackTabs
          tracks={ALL_TRACKS}
          activeTrackId={activeTrackId}
          locale={locale}
        />

        <div id="pmp-path-content">
          {/* Hero header */}
          <PathHeader
            track={track}
            progress={progress}
            nextBestAction={nextBestAction}
            locale={locale}
            isAuthenticated={isAuthenticated}
          />

          {/* Journey spine — 4 phase blocks */}
          {track.phases.map((phase, i) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              phaseProgress={progress.phases[i]}
              locale={locale}
              upNextModuleId={upNextModuleId}
            />
          ))}

          {/* Cross-sell to the most relevant alternative track */}
          <CrossSellPanel activeTrackId={activeTrackId} locale={locale} />

          {/* Footer stats */}
          <div
            style={{
              background: '#FFFFFF',
              border: '0.5px solid rgba(26,20,48,0.12)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '18px',
            }}
          >
            <div className="flex items-center" style={{ gap: '16px' }}>
              <Stat n={track.meta.moduleCount} l={isAr ? 'وحدات' : 'MODULES'} />
              <Stat n={track.meta.lessonCount} l={isAr ? 'دروس' : 'LESSONS'} />
              <Stat n={`${track.meta.estimatedHours}h`} l={isAr ? 'مقدّرة' : 'ESTIMATED'} />
              <Stat
                n={`${overallPct}%`}
                l={isAr ? 'مكتمل' : 'COMPLETE'}
                color="#1AB0A2"
              />
            </div>
            <div style={{ fontSize: '11px', color: '#5E6078' }}>
              {isAr ? 'المسار: ' : 'Track: '}
              {track.meta.shortName[locale]}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  n,
  l,
  color = '#1A1430',
}: {
  n: number | string;
  l: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: '22px',
          fontWeight: 500,
          lineHeight: 1,
          color,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#5E6078',
          letterSpacing: '0.04em',
          marginTop: '4px',
        }}
      >
        {l}
      </div>
    </div>
  );
}
