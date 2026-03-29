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

    const wrapUpPrompt = `You are an expert PMP exam tutor. A student just completed a 5-question practice block.

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

      const guruPrompt = `You are Master Chen Wei, a legendary PMP Guru who has been with PMI since its founding. You have personally mentored thousands of project managers to certification success. You speak with warmth, wisdom, deep expertise, and genuine care for each student's journey.

A student has just completed 15 practice questions (3 blocks of 5). Here is their performance data:

RECENT PERFORMANCE (last 15 questions):
- Overall score: ${recentCorrect}/${recentTotal} (${recentScore}%)
- Domain breakdown: ${JSON.stringify(domainScores, null, 2)}
- Weak areas identified: ${updatedWeak.map(w => `${w.domain} (${w.score}%)`).join(', ') || 'None identified yet'}

Write a professional, warm, deeply insightful progress report as Master Chen Wei. Use this EXACT JSON structure (pure JSON, no markdown):
{
  "greeting": "Personal, warm greeting to the student (2 sentences)",
  "overall_assessment": "Professional assessment of their progress (3-4 sentences, warm but honest)",
  "strengths": [
    {"area": "strength area", "message": "specific encouraging observation"}
  ],
  "growth_areas": [
    {"area": "area needing work", "priority": "high/medium", "guidance": "specific actionable advice", "domain_link": "domain name to link to AI tutor"}
  ],
  "wisdom_quote": "A short piece of wisdom from Master Chen Wei about this stage of the learning journey",
  "next_session_focus": "Specific recommendation for what to focus on in the next session",
  "confidence_message": "A final empowering message (2 sentences)"
}

Be the most caring, wise, experienced mentor they could hope for. Make them feel seen, supported, and capable.`;

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
    });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json({ error: 'Failed to submit block' }, { status: 500 });
  }
}