import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  ritaTip: string;
  domain: string;
  difficulty: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { sessionId, blockNumber, results, framework = 'pmbok7' } = body as {
      sessionId: string;
      blockNumber: number;
      results: QuestionResult[];
      framework: string;
    };

    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const score = Math.round((correct / total) * 100);

    // Save responses to DB
    const responses = results.map(r => ({
      user_id: user.id,
      session_id: sessionId,
      question_id: r.questionId,
      selected_answer: r.selectedAnswer,
      is_correct: r.isCorrect,
      block_number: blockNumber,
    }));
    await supabase.from('question_responses').insert(responses);

    // Update learning profile
    const { data: existingProfile } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const domainScores = existingProfile?.domain_scores || {};
    const weakAreas: { domain: string; score: number }[] = existingProfile?.weak_areas || [];

    results.forEach(r => {
      if (!domainScores[r.domain]) domainScores[r.domain] = { correct: 0, total: 0 };
      domainScores[r.domain].total += 1;
      if (r.isCorrect) domainScores[r.domain].correct += 1;
    });

    // Recalculate weak areas
    const updatedWeak = Object.entries(domainScores)
      .map(([domain, val]) => {
        const scores = val as { correct: number; total: number };
        return {
          domain,
          score: Math.round((scores.correct / scores.total) * 100),
        };
      })
      .filter(d => d.score < 60)
      .sort((a, b) => a.score - b.score);

    const profileUpdate = {
      user_id: user.id,
      framework,
      total_questions_answered: (existingProfile?.total_questions_answered || 0) + total,
      total_correct: (existingProfile?.total_correct || 0) + correct,
      domain_scores: domainScores,
      weak_areas: updatedWeak,
      blocks_completed: (existingProfile?.blocks_completed || 0) + 1,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await supabase.from('learning_profiles').upsert(profileUpdate, { onConflict: 'user_id' });

    // Generate AI block wrap-up
    const wrongQuestions = results.filter(r => !r.isCorrect);
    const domainsInBlock = [...new Set(results.map(r => r.domain))];

    const wrapUpPrompt = `You are an expert PMP exam tutor. A learner just completed a 5-question practice block.

RESULTS:
- Score: ${correct}/${total} (${score}%)
- Domains covered: ${domainsInBlock.join(', ')}
- Questions they got WRONG: ${wrongQuestions.map(q => `"${q.questionText}" (correct: ${q.correctAnswer})`).join('; ') || 'None - perfect score!'}

Generate a wrap-up with EXACTLY this JSON structure (no markdown, pure JSON):
{
  "score_message": "A warm, encouraging 1-sentence message about their score",
  "key_learnings": [
    {"concept": "concept name", "insight": "1-2 sentence learning point", "source": "PMBOK 7 / ECO 2021 / Rita"}
  ],
  "rita_technique": "1 specific Rita Mulcahy exam technique relevant to the questions they struggled with",
  "mindmap_center": "The central concept for the radial mind map (1-3 words)",
  "mindmap_branches": [
    {
      "label": "branch name",
      "color": "#hexcolor",
      "children": [
        {"label": "sub-concept", "explanation": "brief explanation for the leaf node"}
      ]
    }
  ],
  "next_focus": "1 sentence on what they should focus on next"
}

Keep key_learnings to max 3 items. Keep mindmap_branches to 3-4 branches. Make it encouraging and practical.`;

    const wrapUpResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: wrapUpPrompt }],
    });

    let wrapUp = null;
    try {
      const rawText = wrapUpResponse.content[0].type === 'text' ? wrapUpResponse.content[0].text : '';
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      wrapUp = JSON.parse(cleaned);
    } catch {
      wrapUp = {
        score_message: score >= 80 ? "Excellent work! You're on track for exam success." : "Good effort! Let's review the key concepts together.",
        key_learnings: wrongQuestions.slice(0, 3).map(q => ({
          concept: q.domain,
          insight: q.explanation,
          source: 'PMBOK 7',
        })),
        rita_technique: "Read the last sentence of each question first to identify exactly what is being asked before reading the options.",
        mindmap_center: domainsInBlock[0] || 'Project Management',
        mindmap_branches: [
          { label: 'Key Concepts', color: '#6366f1', children: [{ label: 'Review needed', explanation: 'Focus on the domains covered in this block' }] }
        ],
        next_focus: "Review the explanations for any incorrect answers before moving to the next block.",
      };
    }

    // Get YouTube resources for the domains covered
    const { data: videos } = await supabase
      .from('youtube_resources')
      .select('*')
      .in('domain', domainsInBlock)
      .eq('is_active', true)
      .eq('framework', framework)
      .limit(3);

    // Check if guru report is due (every 3 blocks)
    const newBlockCount = (existingProfile?.blocks_completed || 0) + 1;
    const guruReportDue = newBlockCount % 3 === 0;

    let guruReport = null;
    if (guruReportDue) {
      const { data: recentResponses } = await supabase
        .from('question_responses')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .order('answered_at', { ascending: false })
        .limit(15);

      const recentCorrect = recentResponses?.filter(r => r.is_correct).length || 0;
      const recentTotal = recentResponses?.length || 15;
      const recentScore = Math.round((recentCorrect / recentTotal) * 100);

      const guruPrompt = `You are Master Chen Wei, a legendary PMP Guru who has been with PMI since its founding. You have personally mentored thousands of project managers to certification success. You speak with warmth, wisdom, deep expertise, and genuine care for each learner's journey.

A learner has just completed 15 practice questions (3 blocks of 5). Here is their performance data:

RECENT PERFORMANCE (last 15 questions):
- Overall score: ${recentCorrect}/${recentTotal} (${recentScore}%)
- Domain breakdown: ${JSON.stringify(domainScores, null, 2)}
- Weak areas identified: ${updatedWeak.map(w => `${w.domain} (${w.score}%)`).join(', ') || 'None identified yet'}

Write a professional, warm, deeply insightful progress report as Master Chen Wei. Use this EXACT JSON structure (pure JSON, no markdown):
{
  "greeting": "Personal, warm greeting to the learner (2 sentences)",
  "overall_assessment": "Professional assessment of their progress (3-4 sentences, warm but honest)",
  "strengths": [
    {"area": "strength area", "message": "specific encouraging observation"}
  ],
  "growth_areas": [
    {"area": "area needing work", "priority": "high/medium", "guidance": "specific actionable advice", "domain_link": "domain name to link to AiTuTorZ"}
  ],
  "wisdom_quote": "A short piece of wisdom from Master Chen Wei about this stage of the learning journey",
  "next_session_focus": "Specific recommendation for what to focus on in the next session",
  "confidence_message": "A final empowering message (2 sentences)"
}

Be the most caring, wise, experienced mentor they could hope for. Make them feel seen, supported, and capable.

CRITICAL: Always use the word "learner" — NEVER use the word "student". This is a professional adult learning environment.`;

      const guruResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: guruPrompt }],
      });

      try {
        const rawGuru = guruResponse.content[0].type === 'text' ? guruResponse.content[0].text : '';
        const cleanedGuru = rawGuru.replace(/```json|```/g, '').trim();
        guruReport = JSON.parse(cleanedGuru);
      } catch {
        guruReport = null;
      }
    }// ── Award Performance Badge (≥80% on 15 questions) ──
    let badge = null;
    if (guruReportDue) {
      const { data: recentForBadge } = await supabase
        .from('question_responses')
        .select('is_correct')
        .eq('user_id', user.id)
        .order('answered_at', { ascending: false })
        .limit(15);

      const badgeCorrect = recentForBadge?.filter(r => r.is_correct).length || 0;
      const badgeScore = Math.round((badgeCorrect / 15) * 100);

      if (badgeScore >= 80) {
        const topDomains = Object.entries(domainScores)
          .map(([d, v]) => ({ domain: d, score: Math.round(((v as {correct:number;total:number}).correct / (v as {correct:number;total:number}).total) * 100) }))
          .sort((a, b) => b.score - a.score);

        const badgeIcon = badgeScore === 100 ? '🏆' : badgeScore >= 93 ? '🥇' : '🏅';
        const badgeName = badgeScore === 100 ? 'Perfect Mastery' : badgeScore >= 93 ? 'Expert Performance' : 'Strong Performance';
        const badgeDesc = badgeScore === 100
          ? `Flawless 15/15 — absolute mastery across ${topDomains[0]?.domain || 'all domains'}!`
          : `Scored ${badgeCorrect}/15 (${badgeScore}%) — strong command of PMP concepts.`;

        const { data: inserted } = await supabase
          .from('badges')
          .insert({
            user_id: user.id,
            badge_type: 'performance',
            badge_name: badgeName,
            badge_description: badgeDesc,
            badge_icon: badgeIcon,
            domain: topDomains[0]?.domain || null,
            score: badgeScore,
            questions_count: 15,
            session_block: newBlockCount,
          })
          .select()
          .single();

        badge = inserted;
      }
    }

    // Calculate overall 15-question score and save guru report
    let overallScore = null;
    let guruReportId = null;
    if (guruReportDue) {
      const { data: last15 } = await supabase
        .from('question_responses')
        .select('is_correct')
        .eq('user_id', user.id)
        .order('answered_at', { ascending: false })
        .limit(15);
      const oc = last15?.filter(r => r.is_correct).length || 0;
      const opct = Math.round((oc / 15) * 100);
      overallScore = { correct: oc, total: 15, pct: opct };

      // Calculate community averages from all learners
      const { data: allProfiles } = await supabase
        .from('learning_profiles')
        .select('total_questions_answered, total_correct, domain_scores')
        .gt('total_questions_answered', 0);

      const communityAvg: Record<string, number> = {};
      let communityOverall = 0;
      if (allProfiles && allProfiles.length > 0) {
        const totalC = allProfiles.reduce((s, p) => s + (p.total_correct || 0), 0);
        const totalQ = allProfiles.reduce((s, p) => s + (p.total_questions_answered || 0), 0);
        communityOverall = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
        communityAvg['overall'] = communityOverall;

        // Per-domain community averages
        const domainTotals: Record<string, { correct: number; total: number }> = {};
        allProfiles.forEach(p => {
          const ds = p.domain_scores as Record<string, { correct: number; total: number }> || {};
          Object.entries(ds).forEach(([domain, vals]) => {
            if (!domainTotals[domain]) domainTotals[domain] = { correct: 0, total: 0 };
            domainTotals[domain].correct += vals.correct || 0;
            domainTotals[domain].total += vals.total || 0;
          });
        });
        Object.entries(domainTotals).forEach(([domain, vals]) => {
          communityAvg[domain] = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
        });
      }

      // Save guru report to database
      if (guruReport) {
        const { data: savedReport } = await supabase
          .from('guru_reports')
          .insert({
            user_id: user.id,
            greeting: guruReport.greeting,
            overall_assessment: guruReport.overall_assessment,
            strengths: guruReport.strengths,
            growth_areas: guruReport.growth_areas,
            wisdom_quote: guruReport.wisdom_quote,
            next_session_focus: guruReport.next_session_focus,
            confidence_message: guruReport.confidence_message,
            overall_score: opct,
            overall_correct: oc,
            overall_total: 15,
            domain_scores: domainScores,
            weak_areas: updatedWeak,
            community_avg: communityAvg,
            blocks_completed: newBlockCount,
            framework,
            badge_id: badge?.id || null,
          })
          .select('id')
          .single();
        guruReportId = savedReport?.id || null;
      }
    }

    return NextResponse.json({
      success: true,
      score,
      correct,
      total,
      wrapUp,
      videos: videos || [],
      guruReport,
      guruReportDue,
      blocksCompleted: newBlockCount,
      badge,
      overallScore,
      guruReportId,
    });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json({ error: 'Failed to submit block' }, { status: 500 });
  }
}