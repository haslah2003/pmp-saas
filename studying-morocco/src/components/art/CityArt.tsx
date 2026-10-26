import { cn } from '@/lib/utils'

export type ArtVariant = 'imperial' | 'coast' | 'mountain' | 'desert' | 'modern'

const palettes: Record<ArtVariant, { sky: [string, string]; sun: string; far: string; mid: string; near: string; accent: string }> = {
  imperial: { sky: ['#F4C892', '#E3825A'], sun: '#FFF1D6', far: '#D98E63', mid: '#B9643F', near: '#7E3B25', accent: '#2F6F62' },
  coast: { sky: ['#A9D8E8', '#F6E6C8'], sun: '#FFF7E3', far: '#9CC3C9', mid: '#E9DCC3', near: '#C99E6E', accent: '#2C6F8A' },
  mountain: { sky: ['#BCD7EC', '#EEF3F4'], sun: '#FFFFFF', far: '#93A9BE', mid: '#5E7F73', near: '#2F5348', accent: '#B0573A' },
  desert: { sky: ['#F7D9A6', '#EDA466'], sun: '#FFF4DD', far: '#E4A86A', mid: '#CF8549', near: '#A45F2E', accent: '#5A3A22' },
  modern: { sky: ['#CFE7E2', '#F5EFE3'], sun: '#FFFFFF', far: '#A9C9C1', mid: '#7FA79D', near: '#2E5F57', accent: '#D4A24C' },
}

const hash = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return Math.abs(h)
}

function Minaret({ x, base, h, fill, trim }: { x: number; base: number; h: number; fill: string; trim: string }) {
  const w = 30
  const top = base - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={fill} />
      <rect x={x + 9} y={top + 22} width={12} height={20} rx={6} fill={trim} opacity={0.55} />
      <rect x={x + 9} y={top + 58} width={12} height={16} rx={6} fill={trim} opacity={0.4} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 1 + i * 8} y={top - 6} width={5} height={6} fill={fill} />
      ))}
      <rect x={x + 8} y={top - 30} width={14} height={24} fill={fill} />
      <path d={`M${x + 8} ${top - 30} a7 7 0 0 1 14 0 Z`} fill={fill} />
      <line x1={x + 15} y1={top - 37} x2={x + 15} y2={top - 50} stroke={fill} strokeWidth={2} />
      <circle cx={x + 15} cy={top - 42} r={2.4} fill={trim} />
      <circle cx={x + 15} cy={top - 47} r={1.8} fill={trim} />
    </g>
  )
}

function Palm({ x, base, h, fill }: { x: number; base: number; h: number; fill: string }) {
  const top = base - h
  return (
    <g fill="none" stroke={fill} strokeLinecap="round">
      <path d={`M${x} ${base} C${x + 4} ${base - h * 0.4} ${x - 4} ${base - h * 0.7} ${x + 2} ${top}`} strokeWidth={4} />
      <g strokeWidth={3}>
        <path d={`M${x + 2} ${top} q-18 -6 -30 8`} />
        <path d={`M${x + 2} ${top} q18 -6 30 8`} />
        <path d={`M${x + 2} ${top} q-10 -16 -24 -14`} />
        <path d={`M${x + 2} ${top} q10 -16 24 -14`} />
        <path d={`M${x + 2} ${top} q0 -14 -2 -22`} />
      </g>
    </g>
  )
}

function ArchedBlock({ x, base, w, h, fill, window }: { x: number; base: number; w: number; h: number; fill: string; window: string }) {
  const cols = Math.max(1, Math.floor(w / 22))
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={fill} />
      {Array.from({ length: cols }).map((_, i) => {
        const wx = x + 7 + i * ((w - 14) / cols)
        return <rect key={i} x={wx} y={base - h + 14} width={8} height={13} rx={4} fill={window} opacity={0.5} />
      })}
    </g>
  )
}

function Dome({ cx, base, r, fill }: { cx: number; base: number; r: number; fill: string }) {
  return (
    <g fill={fill}>
      <rect x={cx - r} y={base - r * 0.6} width={r * 2} height={r * 0.6} />
      <path d={`M${cx - r} ${base - r * 0.6} a${r} ${r} 0 0 1 ${r * 2} 0 Z`} />
      <line x1={cx} y1={base - r * 1.6} x2={cx} y2={base - r * 1.95} stroke={fill} strokeWidth={2} />
    </g>
  )
}

/**
 * Illustrated city scene, used whenever an editor has not uploaded a photo.
 * Deterministic per `seed`, so each city keeps its own composition.
 */
export function CityArt({
  variant = 'imperial',
  seed = 'city',
  className,
  title,
}: {
  variant?: ArtVariant | null
  seed?: string
  className?: string
  title?: string
}) {
  const v = (variant ?? 'imperial') as ArtVariant
  const p = palettes[v] ?? palettes.imperial
  const h = hash(seed)
  const id = `sky-${v}-${h % 100000}`
  const shift = (h % 5) * 14 - 28
  const sunX = 90 + (h % 7) * 30
  const ground = 420

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id})`} />
      <circle cx={sunX} cy={150} r={46} fill={p.sun} opacity={0.85} />
      <circle cx={sunX} cy={150} r={70} fill={p.sun} opacity={0.18} />

      {v === 'mountain' && (
        <g>
          <path d="M-20 330 L90 180 L170 300 L250 160 L420 340 L420 500 L-20 500Z" fill={p.far} />
          <path d="M68 210 L90 180 L112 210 L100 206 L90 214 L80 206Z M228 190 L250 160 L272 192 L258 188 L250 196 L240 188Z" fill="#fff" />
          <path d="M-20 380 C80 330 160 360 240 330 S380 320 420 350 L420 500 L-20 500Z" fill={p.mid} />
          {[30, 70, 300, 345, 380].map((x, i) => (
            <path key={i} d={`M${x} ${ground - 10} l16 -58 l16 58 Z`} fill={p.near} />
          ))}
          <g transform={`translate(${150 + shift} 0)`}>
            <rect x="0" y="352" width="70" height="58" fill="#F4EFE6" />
            <path d="M-8 356 L35 318 L78 356Z" fill={p.accent} />
            <rect x="12" y="372" width="12" height="14" fill={p.near} opacity={0.5} />
            <rect x="46" y="372" width="12" height="14" fill={p.near} opacity={0.5} />
          </g>
        </g>
      )}

      {v === 'desert' && (
        <g>
          <path d="M-20 340 C60 300 140 320 210 300 S360 290 420 320 L420 500 L-20 500Z" fill={p.far} />
          <path d="M-20 390 C70 350 170 380 250 350 S380 360 420 380 L420 500 L-20 500Z" fill={p.mid} />
          <g transform={`translate(${200 + shift} 0)`} fill={p.near}>
            <path d="M0 400 L4 300 L36 300 L40 400Z" />
            <path d="M40 400 L40 330 L110 330 L110 400Z" />
            <path d="M110 400 L114 310 L146 310 L150 400Z" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={2 + i * 9} y={292} width={5} height={8} />
            ))}
          </g>
          <Palm x={90 + shift} base={410} h={120} fill={p.accent} />
          <Palm x={130 + shift} base={415} h={90} fill={p.accent} />
        </g>
      )}

      {v === 'coast' && (
        <g>
          <path d="M-20 360 C80 340 180 352 260 340 S380 336 420 344 L420 500 L-20 500Z" fill={p.far} />
          <Minaret x={250 + shift} base={360} h={150} fill={p.near} trim="#F7EBD3" />
          <ArchedBlock x={40} base={360} w={110} h={46} fill="#FFFFFF" window={p.accent} />
          <ArchedBlock x={150} base={360} w={70} h={64} fill={p.mid} window={p.accent} />
          <Dome cx={185} base={296} r={18} fill="#FFFFFF" />
          <ArchedBlock x={300 + shift} base={360} w={90} h={38} fill="#FFFFFF" window={p.accent} />
          <rect x="-20" y="360" width="440" height="140" fill={p.accent} />
          {[384, 410, 440, 470].map((y, i) => (
            <path
              key={y}
              d={`M-20 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.35 - i * 0.06}
              strokeWidth={2}
            />
          ))}
        </g>
      )}

      {v === 'imperial' && (
        <g>
          <path d="M-20 330 C60 310 140 324 220 312 S360 304 420 318 L420 500 L-20 500Z" fill={p.far} />
          <Minaret x={70 + shift} base={ground - 40} h={190} fill={p.near} trim="#F7DFC2" />
          <ArchedBlock x={130 + shift} base={ground - 40} w={120} h={70} fill={p.mid} window="#F7DFC2" />
          <Dome cx={300} base={ground - 70} r={26} fill={p.accent} />
          <ArchedBlock x={260} base={ground - 40} w={90} h={60} fill={p.mid} window="#F7DFC2" />
          <path d={`M-20 ${ground - 40} H420 V500 H-20Z`} fill={p.near} />
          <g fill={p.sky[1]} opacity={0.9}>
            <path d={`M150 500 V${ground + 10} a50 50 0 0 1 100 0 V500Z`} />
          </g>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={-20 + i * 32} y={ground - 50} width={16} height={10} fill={p.near} />
          ))}
          <Palm x={340} base={ground - 38} h={110} fill={p.accent} />
        </g>
      )}

      {v === 'modern' && (
        <g>
          <path d="M-20 350 C100 330 200 345 300 332 S400 330 420 336 L420 500 L-20 500Z" fill={p.far} />
          {[
            [30, 120, 90],
            [130, 80, 150],
            [215, 110, 110],
            [330, 70, 70],
          ].map(([x, w, hh], i) => (
            <g key={i}>
              <rect x={x! + shift / 2} y={ground - 40 - hh!} width={w} height={hh} fill={i % 2 ? p.near : p.mid} />
              {Array.from({ length: Math.floor(hh! / 22) }).map((_, r) =>
                Array.from({ length: Math.floor(w! / 20) }).map((__, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={x! + shift / 2 + 6 + c * 20}
                    y={ground - 40 - hh! + 8 + r * 22}
                    width={10}
                    height={12}
                    fill="#fff"
                    opacity={0.35}
                  />
                )),
              )}
            </g>
          ))}
          <rect x="-20" y={ground - 40} width="440" height="140" fill={p.mid} />
          <path d={`M-20 ${ground} H420`} stroke={p.accent} strokeWidth={6} />
          <Palm x={70} base={ground - 36} h={80} fill={p.near} />
          <Palm x={360} base={ground - 36} h={96} fill={p.near} />
        </g>
      )}
    </svg>
  )
}
