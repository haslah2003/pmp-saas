'use client'

import { useMemo, useRef, useState } from 'react'

type Point = { date: string; views: number; visitors: number }

const W = 760
const H = 230
const PAD = { top: 16, right: 16, bottom: 28, left: 44 }

const niceMax = (v: number) => {
  if (v <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(v))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => v / s <= 4) ?? pow * 10
  return Math.ceil(v / step) * step
}

const compact = (n: number, locale: string) => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n)

/** Two-series line chart (page views, visitors) with crosshair tooltip. One axis: both are counts. */
export function TrafficChart({ data, labels, locale }: { data: Point[]; labels: { views: string; visitors: string; empty: string }; locale: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.views, d.visitors))))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH

  const paths = useMemo(() => {
    const line = (key: 'views' | 'visitors') => data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ')
    const area = `${line('views')} L${x(data.length - 1)} ${PAD.top + innerH} L${x(0)} ${PAD.top + innerH} Z`
    return { views: line('views'), visitors: line('visitors'), area }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, max])

  if (!data.length || data.every((d) => d.views === 0)) return <p className="sim-empty">{labels.empty}</p>

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f))
  const fmtDate = (iso: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(iso))
  const labelEvery = Math.max(1, Math.ceil(data.length / 8))
  const h = hover != null ? data[hover] : null

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - PAD.left) / innerW) * (data.length - 1))
    setHover(Math.min(data.length - 1, Math.max(0, i)))
  }

  return (
    <div className="sim-chart" dir="ltr">
      <div className="sim-legend">
        <span>
          <i style={{ background: 'var(--sim-s1)' }} /> {labels.views}
        </span>
        <span>
          <i style={{ background: 'var(--sim-s2)' }} /> {labels.visitors}
        </span>
      </div>
      <div className="sim-chart__plot">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${labels.views} / ${labels.visitors}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="sim-grid" />
              <text x={PAD.left - 8} y={y(t)} className="sim-axis" textAnchor="end" dominantBaseline="middle">
                {compact(t, locale)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            i % labelEvery === 0 ? (
              <text key={d.date} x={x(i)} y={H - 8} className="sim-axis" textAnchor="middle">
                {fmtDate(d.date)}
              </text>
            ) : null,
          )}
          <path d={paths.area} fill="var(--sim-s1)" opacity={0.1} />
          <path d={paths.views} fill="none" stroke="var(--sim-s1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={paths.visitors} fill="none" stroke="var(--sim-s2)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {h && hover != null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} className="sim-crosshair" />
              <circle cx={x(hover)} cy={y(h.views)} r={4.5} fill="var(--sim-s1)" stroke="var(--theme-elevation-0)" strokeWidth={2} />
              <circle cx={x(hover)} cy={y(h.visitors)} r={4.5} fill="var(--sim-s2)" stroke="var(--theme-elevation-0)" strokeWidth={2} />
            </g>
          )}
          <rect x={PAD.left} y={PAD.top} width={innerW} height={innerH} fill="transparent" />
        </svg>
        {h && hover != null && (
          <div className="sim-tooltip" style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > data.length / 2 ? '-105%' : '5%'})` }}>
            <strong>{fmtDate(h.date)}</strong>
            <span>
              <i style={{ background: 'var(--sim-s1)' }} /> {labels.views}: {h.views.toLocaleString(locale)}
            </span>
            <span>
              <i style={{ background: 'var(--sim-s2)' }} /> {labels.visitors}: {h.visitors.toLocaleString(locale)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
