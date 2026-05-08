'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

interface StrategicReport {
  report_title: string
  route_label: string
  cycle_label: string
  executive_summary: string
  readiness_score: number
  readiness_label: string
  overall_score: {
    correct: number
    total: number
    pct: number
  }
  domain_proficiency: {
    domain: string
    correct: number
    total: number
    pct: number
    status: string
    insight: string
  }[]
  growth_velocity: {
    value: string
    insight: string
  }
  mindset_gap: {
    label: string
    risk_level: string
    insight: string
  }
  tailoring_decisiveness: {
    score: number | null
    evidence_level: string
    insight: string
  }
  badges: {
    name: string
    description: string
    icon: string
  }[]
  route_focus: {
    label: string
    items: string[]
  }
  evidence: {
    question: string
    selected: string
    correct: string
    domain: string
    lesson: string
  }[]
  next_actions: string[]
}

interface StrategicReportRow {
  id: string
  active_route: string
  cycle_number: number
  block_number: number
  readiness_score: number | null
  overall_correct: number | null
  overall_total: number | null
  overall_pct: number | null
  report_payload: StrategicReport
  created_at: string
}

interface Props {
  reportRow: StrategicReportRow
  learnerName: string
  reportHistory: { id: string; readiness_score: number | null; overall_pct: number | null; created_at: string }[]
}

function InsightBubble({
  label,
  title,
  children,
}: {
  label: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((value) => !value)}
      tabIndex={0}
      role="button"
    >
      {label}
      {open && (
        <span className="absolute z-50 left-0 top-full mt-2 w-80 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-left text-xs leading-relaxed text-gray-700 shadow-xl">
          <span className="mb-1 block font-bold text-violet-800">{title}</span>
          {children}
        </span>
      )}
    </span>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = (Math.max(0, Math.min(score, 100)) / 100) * circumference

  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#E6F8F6" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#5B2D91"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-[#322057]">{score}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Readiness</span>
      </div>
    </div>
  )
}

function MiniTrend({
  history,
}: {
  history: { readiness_score: number | null; overall_pct: number | null; created_at: string }[]
}) {
  const scores = history
    .map((item) => item.readiness_score ?? item.overall_pct)
    .filter((score): score is number => typeof score === 'number')

  if (scores.length < 2) {
    return (
      <div className="h-16 rounded-2xl border border-dashed border-violet-200 bg-white/70 px-4 py-3 text-xs text-gray-500">
        Baseline established. Future saved strategic reports will create a real readiness trend.
      </div>
    )
  }

  const width = 220
  const height = 48
  const min = Math.min(...scores, 0)
  const max = Math.max(...scores, 100)
  const range = max - min || 1
  const points = scores
    .map((score, index) => {
      const x = (index / (scores.length - 1)) * width
      const y = height - ((score - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  const delta = scores[scores.length - 1] - scores[0]

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full">
        <polyline fill="none" stroke="#5B2D91" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {scores.map((score, index) => {
          const x = (index / (scores.length - 1)) * width
          const y = height - ((score - min) / range) * height
          return <circle key={index} cx={x} cy={y} r="4" fill={index === scores.length - 1 ? '#1AB0A2' : '#C4B5FD'} />
        })}
      </svg>
      <p className="mt-1 text-xs font-semibold text-gray-600">
        {delta >= 0 ? '+' : ''}
        {delta} pts across saved strategic reports
      </p>
    </div>
  )
}

export default function StrategicReportClient({ reportRow, learnerName, reportHistory }: Props) {
  const report = reportRow.report_payload
  const [copied, setCopied] = useState(false)

  const reportDate = useMemo(
    () =>
      new Date(reportRow.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [reportRow.created_at]
  )

  const reportUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyReportLink = async () => {
    if (!reportUrl) return
    await navigator.clipboard?.writeText(reportUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-gray-800">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/practice" className="hover:text-gray-800">
              Practice
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">Strategic Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyReportLink}
              className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-[#1AB0A2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#148F84]"
            >
              Print / PDF
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <section className="overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-[#E6F8F6] via-white to-[#F0EAFA] p-7 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#1AB0A2]/20 bg-[#E6F8F6] px-4 py-1.5 text-xs font-bold text-[#148F84]">
                  {report.route_label}
                </span>
                <span className="rounded-full border border-[#5B2D91]/20 bg-[#F0EAFA] px-4 py-1.5 text-xs font-bold text-[#5B2D91]">
                  {report.cycle_label}
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#1A1430] md:text-4xl">
                {report.report_title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5E6078]">
                {report.executive_summary}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Learner', value: learnerName },
                  { label: 'Date', value: reportDate },
                  { label: 'Cycle Score', value: `${report.overall_score.correct}/${report.overall_score.total}` },
                ].map((item) => (
                  <InsightBubble
                    key={item.label}
                    title={item.label}
                    label={
                      <span className="block rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                        <span className="mt-1 block text-sm font-bold text-[#1A1430]">{item.value}</span>
                      </span>
                    }
                  >
                    This report element is part of the saved strategic cycle snapshot and can be revisited from this direct link.
                  </InsightBubble>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-sm">
              <div className="flex items-center justify-center">
                <ScoreGauge score={report.readiness_score} />
              </div>
              <p className="mt-3 text-center text-sm font-bold text-[#322057]">{report.readiness_label}</p>
              <InsightBubble
                title="PMP Readiness Velocity"
                label={<p className="mt-4 cursor-help text-center text-xs font-semibold text-[#5E6078] underline decoration-dotted">View readiness trend logic</p>}
              >
                {report.growth_velocity.insight}
              </InsightBubble>
              <div className="mt-4">
                <MiniTrend history={reportHistory} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {[
            {
              label: 'Readiness Score',
              value: `${report.readiness_score}%`,
              hint: 'Overall strategic readiness across this 15-question cycle.',
            },
            {
              label: 'PMP Readiness Velocity',
              value: report.growth_velocity.value,
              hint: report.growth_velocity.insight,
            },
            {
              label: 'PMP Mindset Gap',
              value: report.mindset_gap.label,
              hint: report.mindset_gap.insight,
            },
            {
              label: 'PMP Contextual Judgment',
              value: report.tailoring_decisiveness.score === null ? '—' : `${report.tailoring_decisiveness.score}%`,
              hint: 'Measures how well you adapt PMP decisions to delivery approach, stakeholder context, risk, governance, and value impact.',
            },
          ].map((metric) => (
            <InsightBubble
              key={metric.label}
              title={metric.label}
              label={
                <div className="h-full cursor-help rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-violet-200">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{metric.label}</p>
                  <p className="mt-2 text-xl font-black text-[#322057]">{metric.value}</p>
                </div>
              }
            >
              {metric.hint}
            </InsightBubble>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-lg font-black text-[#1A1430]">Domain Proficiency</h2>
            <div className="space-y-5">
              {report.domain_proficiency.map((domain) => (
                <InsightBubble
                  key={domain.domain}
                  title={domain.domain}
                  label={
                    <div className="cursor-help">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-gray-800">{domain.domain}</p>
                        <p className="text-xs font-semibold text-gray-500">
                          {domain.correct}/{domain.total} · {domain.pct}% · {domain.status}
                        </p>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#F0EAFA]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#1AB0A2] to-[#5B2D91]"
                          style={{ width: `${domain.pct}%` }}
                        />
                      </div>
                    </div>
                  }
                >
                  {domain.insight}
                </InsightBubble>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-[#1A1430]">{report.route_focus.label}</h2>
            <div className="space-y-3">
              {report.route_focus.items.map((item, index) => (
                <InsightBubble
                  key={index}
                  title={`Focus ${index + 1}`}
                  label={
                    <div className="cursor-help rounded-2xl bg-[#FAFAF9] px-4 py-3 text-sm font-medium text-gray-700">
                      {item}
                    </div>
                  }
                >
                  This focus item connects the saved report to your selected PMP pathway and should guide your next practice cycle.
                </InsightBubble>
              ))}
            </div>
          </div>
        </section>

        {report.evidence.length > 0 && (
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-[#1A1430]">Evidence From Weak Answers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {report.evidence.map((item, index) => (
                <InsightBubble
                  key={index}
                  title={`${item.domain} Evidence`}
                  label={
                    <div className="h-full cursor-help rounded-2xl border border-gray-100 bg-[#FAFAF9] p-4">
                      <p className="mb-2 text-xs font-bold text-[#5B2D91]">{item.domain}</p>
                      <p className="line-clamp-3 text-sm font-semibold text-gray-900">{item.question}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        Selected: {item.selected} · Correct: {item.correct}
                      </p>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600">{item.lesson}</p>
                    </div>
                  }
                >
                  {item.lesson}
                </InsightBubble>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-violet-100 bg-[#F0EAFA] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#322057]">Recommended Action Path</h2>
              <p className="mt-1 text-sm text-violet-700">
                These actions convert the report into targeted learning interventions.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {report.next_actions.map((action, index) => (
              <InsightBubble
                key={index}
                title={`Action ${index + 1}`}
                label={
                  <Link
                    href="/dashboard/practice"
                    className="block h-full rounded-2xl border border-violet-200 bg-white p-5 text-left shadow-sm hover:border-[#1AB0A2] hover:bg-white"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1AB0A2]">Action {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-[#322057]">{action}</p>
                    <p className="mt-4 text-xs font-bold text-violet-600">Start targeted practice →</p>
                  </Link>
                }
              >
                This action is generated from your saved cycle evidence. Future versions will route directly to a pre-filtered drill.
              </InsightBubble>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
