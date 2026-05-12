import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type QuestionRow = Record<string, unknown>;

function pickLocalizedText(row: QuestionRow, arKey: string, enKey: string) {
  const ar = row[arKey];
  const en = row[enKey];

  if (typeof ar === 'string' && ar.trim().length > 0) {
    return ar;
  }

  return en;
}

function localizeQuestion(row: QuestionRow, useArabic: boolean) {
  if (!useArabic) return row;

  return {
    ...row,
    question_text: pickLocalizedText(row, 'question_text_ar', 'question_text'),
    option_a: pickLocalizedText(row, 'option_a_ar', 'option_a'),
    option_b: pickLocalizedText(row, 'option_b_ar', 'option_b'),
    option_c: pickLocalizedText(row, 'option_c_ar', 'option_c'),
    option_d: pickLocalizedText(row, 'option_d_ar', 'option_d'),
    explanation: pickLocalizedText(row, 'explanation_ar', 'explanation'),
    rita_tip: pickLocalizedText(row, 'rita_tip_ar', 'rita_tip'),
  };
}


export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || 'all';
    const difficulty = searchParams.get('difficulty') || 'entry';
    const framework = searchParams.get('framework') || 'pmbok7';
    const lang = searchParams.get('lang') || req.cookies.get('pmp_locale')?.value || 'en';
    const useArabic = lang.toLowerCase().startsWith('ar');
    const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
    const debugQuestionId = searchParams.get('debugQuestionId')?.trim() || '';
    const rawCount = Number.parseInt(searchParams.get('count') || '5', 10);
    const requestedCount = Number.isFinite(rawCount)
      ? Math.min(Math.max(rawCount, 1), 180)
      : 5;
    const queryLimit = Math.max(20, requestedCount * 2);

    // Build query
    let query = supabase
      .from('questions')
      .select('*')
      .eq('framework', framework)
      .eq('difficulty', difficulty)
      .eq('is_active', true);

    if (domain !== 'all') query = query.eq('domain', domain);
    if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`);

    // Get learning profile to adapt questions
    const { data: profile } = await supabase
      .from('learning_profiles')
      .select('weak_areas, domain_scores')
      .eq('user_id', user.id)
      .single();

    // Debug mode: return one exact question for controlled bilingual QA testing.
    // Normal users still receive shuffled adaptive question blocks.
    if (debugQuestionId) {
      const { data: debugQuestion, error: debugError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', debugQuestionId)
        .eq('is_active', true)
        .maybeSingle();

      if (debugError) throw debugError;
      if (!debugQuestion) {
        return NextResponse.json({ error: 'Debug question not found' }, { status: 404 });
      }

      return NextResponse.json({
        questions: [localizeQuestion(debugQuestion, useArabic)],
        profile,
        debugQuestionId,
      });
    }

    const { data: questions, error } = await query.limit(queryLimit);
    if (error) throw error;
    if (!questions || questions.length === 0) {
      // Fallback: remove exclude filter
      const { data: fallback } = await supabase
        .from('questions')
        .select('*')
        .eq('framework', framework)
        .eq('difficulty', difficulty)
        .eq('is_active', true)
        .limit(queryLimit);
      
      if (!fallback || fallback.length === 0) {
        return NextResponse.json({ error: 'No questions available' }, { status: 404 });
      }
      
      const shuffled = fallback.sort(() => Math.random() - 0.5).slice(0, requestedCount);
      const localizedFallback = shuffled.map((q) => localizeQuestion(q, useArabic));
      return NextResponse.json({ questions: localizedFallback, profile });
    }

    // Prioritize weak area questions if profile exists
    let prioritized = [...questions];
    if (profile?.weak_areas && Array.isArray(profile.weak_areas) && profile.weak_areas.length > 0) {
      const weakDomains = profile.weak_areas.map((w: { domain: string }) => w.domain);
      const weakQuestions = questions.filter(q => weakDomains.includes(q.domain));
      const otherQuestions = questions.filter(q => !weakDomains.includes(q.domain));
      prioritized = [...weakQuestions, ...otherQuestions];
    }

    const selected = prioritized.sort(() => Math.random() - 0.5).slice(0, requestedCount);
    const localizedSelected = selected.map((q) => localizeQuestion(q, useArabic));
    return NextResponse.json({ questions: localizedSelected, profile });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}