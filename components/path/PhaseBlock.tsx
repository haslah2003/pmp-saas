
/**
 * components/path/PhaseBlock.tsx
 * Renders a single phase of the journey: marker, header, and its modules.
 */

import type { Locale, Phase, PhaseProgress } from '@/lib/pmp-path/types';
import { themeFor } from '@/lib/pmp-path/colors';
import { ModuleCard } from './ModuleCard';

interface Props {
  phase: Phase;
  phaseProgress: PhaseProgress;
  locale: Locale;
  upNextModuleId: string | null;
}

export function PhaseBlock({
  phase,
  phaseProgress,
  locale,
  upNextModuleId,
}: Props) {
  const isAr = locale === 'ar';
  const theme = themeFor(phase.id);

  const phaseLabel = isAr
    ? `المرحلة ${phase.number} · ${phase.title.ar.toUpperCase()}`
    : `PHASE ${phase.number} · ${phase.title.en.toUpperCase()}`;

  // Subtitle line: count of modules + total lessons + total hours
  const totalLessons = phase.modules.reduce(
    (s, m) => s + m.lessons.length,
    0
  );
  const totalMinutes = phase.modules.reduce(
    (s, m) =>
      s + m.lessons.reduce((ls, l) => ls + l.estimatedMinutes, 0),
    0
  );
  const totalHours = Math.round(totalMinutes / 60);

  const subline = isAr
    ? `${phase.modules.length} وحدات · ${totalLessons} درساً · ~${totalHours}س`
    : `${phase.modules.length} modules · ${totalLessons} lessons · ~${totalHours}h`;

  return (
    <section
      style={{ marginBottom: '32px' }}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={`${phase.title[locale]} phase`}
    >
      {/* Phase header */}
      <div
        className="flex items-center"
        style={{ gap: '12px', marginBottom: '12px', paddingLeft: '4px' }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: theme.primary,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 500,
            fontSize: '13px',
            flex: '0 0 32px',
          }}
          aria-hidden="true"
        >
          {phase.number}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '11px',
              color: '#5E6078',
              letterSpacing: '0.08em',
            }}
          >
            {phaseLabel}
          </div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#1A1430',
              lineHeight: 1.3,
            }}
          >
            {phase.promise[locale]}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#5E6078',
              marginTop: '2px',
            }}
          >
            {subline}
          </div>
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '999px',
            background: theme.pale,
            color: theme.textOnPale,
          }}
        >
          {phaseProgress.modulesCompleted} / {phaseProgress.modulesTotal}
        </span>
      </div>

      {/* Module list */}
      {phase.modules.map((mod) => {
        const mp = phaseProgress.modules.find(
          (m) => m.moduleId === mod.id
        );
        if (!mp) return null;
        return (
          <ModuleCard
            key={mod.id}
            module={mod}
            progress={mp}
            locale={locale}
            isUpNext={mod.id === upNextModuleId}
          />
        );
      })}
    </section>
  );
}
