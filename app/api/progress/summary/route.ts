import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DOMAIN_WEIGHTS: Record<string, number> = {
  'People': 0.42,
  'Process': 0.50,
  'Business Environment': 0.08,
}

type StatBucket = { correct: number; total: number }

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const framework = req.nextUrl.searchParams.get('framework') || 'pmbok7'

  // ── 1. Fetch all completed sessions ──────────────────────────────────────
  const { data: sessions, error: sessErr } = await supabase
    .from('practice_sessions')
    .select('id, score, total_questions, domain_filter, difficulty_filter, created_at, completed_at')
    .eq('user_id', user.id)
    .eq('framework', framework)

    .order('created_at', { ascending: false })
    .limit(200)

  if (sessErr) {
    return NextResponse.json({ error: sessErr.message }, { status: 500 })
  }

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ empty: true })
  }

  const sessionIds = sessions.map((s: { id: string }) => s.id)

  // ── 2. Fetch all responses with question metadata ─────────────────────────
  const { data: responses, error: respErr } = await supabase
    .from('question_responses')
    .select(`
      is_correct,
      time_spent_seconds,
      questions (
        domain,
        difficulty
      )
    `)
    .in('session_id', sessionIds)

  if (respErr) {
    return NextResponse.json({ error: respErr.message }, { status: 500 })
  }

  // ── 3. Aggregate ──────────────────────────────────────────────────────────
  const domainStats: Record<string, StatBucket> = {
    'People': { correct: 0, total: 0 },
    'Process': { correct: 0, total: 0 },
    'Business Environment': { correct: 0, total: 0 },
  }
  const difficultyStats: Record<string, StatBucket> = {
    'entry': { correct: 0, total: 0 },
    'paced': { correct: 0, total: 0 },
    'difficult': { correct: 0, total: 0 },
    'challenging': { correct: 0, total: 0 },
  }

  let totalCorrect = 0
  let totalAnswered = 0
  let totalTimeSeconds = 0

  for (const r of (responses ?? [])) {
    const q = r.questions as unknown as { domain: string; difficulty: string } | null
    totalAnswered++
    totalTimeSeconds += (r.time_spent_seconds as number) || 0
    if (r.is_correct) totalCorrect++

    if (q?.domain && domainStats[q.domain]) {
      domainStats[q.domain].total++
      if (r.is_correct) domainStats[q.domain].correct++
    }
    if (q?.difficulty && difficultyStats[q.difficulty]) {
      difficultyStats[q.difficulty].total++
      if (r.is_correct) difficultyStats[q.difficulty].correct++
    }
  }

  // ── 4. Readiness score (ECO-weighted) ────────────────────────────────────
  let weightedSum = 0
  let weightUsed = 0
  for (const [domain, weight] of Object.entries(DOMAIN_WEIGHTS)) {
    const s: StatBucket = domainStats[domain]
    if (s.total > 0) {
      weightedSum += (s.correct / s.total) * weight
      weightUsed += weight
    }
  }
  const readinessScore = weightUsed > 0
    ? Math.round((weightedSum / weightUsed) * 100)
    : 0

  // ── 5. Streak ─────────────────────────────────────────────────────────────
  const activitySet = new Set(
    sessions.map((s: { created_at: string }) => s.created_at.slice(0, 10))
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    if (activitySet.has(ds)) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  // ── 6. 30-day activity grid ───────────────────────────────────────────────
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().slice(0, 10)
    return {
      date: dateStr,
      count: sessions.filter(
        (s: { created_at: string }) => s.created_at.startsWith(dateStr)
      ).length,
    }
  })

  // ── 7. Recent sessions ────────────────────────────────────────────────────
  const recentSessions = sessions.slice(0, 5).map((s: {
    id: string
    created_at: string
    domain_filter: string | null
    difficulty_filter: string | null
    score: number | null
    total_questions: number | null
  }) => ({
    id: s.id,
    date: s.created_at,
    domain: s.domain_filter || 'All Domains',
    difficulty: s.difficulty_filter || 'Mixed',
    score: s.score ?? 0,
    total: s.total_questions ?? 0,
    accuracy: s.total_questions
      ? Math.round(((s.score ?? 0) / s.total_questions) * 100)
      : 0,
  }))

  // ── 8. Weak areas ─────────────────────────────────────────────────────────
  const weakAreas: string[] = []
  for (const [domain, s] of Object.entries(domainStats) as [string, StatBucket][]) {
    if (s.total >= 3 && s.correct / s.total < 0.6) weakAreas.push(domain)
  }
  for (const [diff, s] of Object.entries(difficultyStats) as [string, StatBucket][]) {
    if (s.total >= 3 && s.correct / s.total < 0.5) {
      weakAreas.push(diff.charAt(0).toUpperCase() + diff.slice(1) + ' level questions')
    }
  }

  // ── 9. Return ─────────────────────────────────────────────────────────────
  return NextResponse.json({
    empty: false,
    readinessScore,
    totalQuestions: totalAnswered,
    totalCorrect,
    overallAccuracy: totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0,
    avgTimePerQuestion: totalAnswered > 0
      ? Math.round(totalTimeSeconds / totalAnswered)
      : 0,
    streak,
    totalSessions: sessions.length,
    domainStats: Object.entries(domainStats).map(
      ([domain, s]: [string, StatBucket]) => ({
        domain,
        correct: s.correct,
        total: s.total,
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
        weight: Math.round(DOMAIN_WEIGHTS[domain] * 100),
      })
    ),
    difficultyStats: Object.entries(difficultyStats).map(
      ([difficulty, s]: [string, StatBucket]) => ({
        difficulty,
        correct: s.correct,
        total: s.total,
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      })
    ),
    last30Days,
    recentSessions,
    weakAreas: weakAreas.slice(0, 3),
  })
}