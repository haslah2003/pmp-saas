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

type PracticeFramework = 'pmbok7' | 'pmbok8' | 'bridge';

function normalizePracticeFramework(value: unknown): PracticeFramework {
  return value === 'pmbok8' || value === 'bridge' ? value : 'pmbok7';
}

function questionFrameworkCandidates(framework: PracticeFramework) {
  if (framework === 'pmbok7') return ['pmbok7'];
  if (framework === 'pmbok8') return ['pmbok8', 'pmbok7'];
  return ['bridge', 'pmbok8', 'pmbok7'];
}

function nativeFrameworksForRoute(framework: PracticeFramework) {
  if (framework === 'pmbok7') return ['pmbok7'];
  if (framework === 'pmbok8') return ['pmbok8'];
  return ['bridge', 'pmbok8'];
}

function uniqueFrameworks(rows: QuestionRow[]) {
  return Array.from(
    new Set(
      rows
        .map((row) => row.framework)
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    )
  ).sort();
}

function questionBankNotice(framework: PracticeFramework, useArabic: boolean) {
  if (framework === 'pmbok7') return null;

  return useArabic
    ? 'بنك أسئلة هذا المسار قيد الإعداد. تم استخدام أسئلة PMBOK 7 الأساسية مؤقتًا لضمان استمرار التدريب.'
    : 'This route question bank is being prepared. PMBOK 7 baseline questions were used temporarily to keep practice available.';
}

function buildQuestionBankStatus({
  requestedFramework,
  selectedQuestions,
  nativeQuestionCount,
  fallbackQuestionCount,
  useArabic,
}: {
  requestedFramework: PracticeFramework;
  selectedQuestions: QuestionRow[];
  nativeQuestionCount: number;
  fallbackQuestionCount: number;
  useArabic: boolean;
}) {
  const actualQuestionFrameworks = uniqueFrameworks(selectedQuestions);
  const nativeFrameworksExpected = nativeFrameworksForRoute(requestedFramework);
  const fallbackFramework = 'pmbok7';

  const fallbackUsed =
    requestedFramework !== 'pmbok7' &&
    actualQuestionFrameworks.includes(fallbackFramework);

  const message =
    fallbackUsed || (requestedFramework !== 'pmbok7' && nativeQuestionCount === 0)
      ? questionBankNotice(requestedFramework, useArabic)
      : null;

  return {
    requestedFramework,
    nativeFrameworksExpected,
    nativeQuestionCount,
    fallbackFramework,
    fallbackQuestionCount,
    fallbackUsed,
    actualQuestionFrameworks,
    message,
  };
}

async function countQuestionsForFrameworks({
  supabase,
  frameworks,
  domain,
  difficulty,
}: {
  supabase: any;
  frameworks: string[];
  domain: string;
  difficulty: string;
}) {
  let query = supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .in('framework', frameworks)
    .eq('difficulty', difficulty)
    .eq('is_active', true);

  if (domain !== 'all') query = query.eq('domain', domain);

  const { count, error } = await query;
  if (error) throw error;

  return count || 0;
}


async function fetchQuestionsForFrameworks({
  supabase,
  frameworks,
  domain,
  difficulty,
  excludeIds,
  limit,
}: {
  supabase: any;
  frameworks: string[];
  domain: string;
  difficulty: string;
  excludeIds: string[];
  limit: number;
}) {
  let query = supabase
    .from('questions')
    .select('*')
    .in('framework', frameworks)
    .eq('difficulty', difficulty)
    .eq('is_active', true);

  if (domain !== 'all') query = query.eq('domain', domain);
  if (excludeIds.length > 0) query = query.not('id', 'in', `(${excludeIds.join(',')})`);

  const { data, error } = await query.limit(limit);
  if (error) throw error;

  return (data || []) as QuestionRow[];
}


export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || 'all';
    const difficulty = searchParams.get('difficulty') || 'entry';
    const activeFramework = normalizePracticeFramework(searchParams.get('framework') || 'pmbok7');
    const frameworkCandidates = questionFrameworkCandidates(activeFramework);
    const lang = searchParams.get('lang') || req.cookies.get('pmp_locale')?.value || 'en';
    const useArabic = lang.toLowerCase().startsWith('ar');
    const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
    const debugQuestionId = searchParams.get('debugQuestionId')?.trim() || '';
    const rawCount = Number.parseInt(searchParams.get('count') || '5', 10);
    const requestedCount = Number.isFinite(rawCount)
      ? Math.min(Math.max(rawCount, 1), 180)
      : 5;
    const queryLimit = Math.max(20, requestedCount * 2);

    // Candidate order is reported for transparency.
    // Actual selection below is native-first, then fallback only for shortage.

    // Get learning profile to adapt questions
    const { data: profile } = await supabase
      .from('learning_profiles')
      .select('weak_areas, domain_scores')
      .eq('user_id', user.id)
      .single();

    const nativeQuestionCount = await countQuestionsForFrameworks({
      supabase,
      frameworks: nativeFrameworksForRoute(activeFramework),
      domain,
      difficulty,
    });

    const fallbackQuestionCount = await countQuestionsForFrameworks({
      supabase,
      frameworks: ['pmbok7'],
      domain,
      difficulty,
    });

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

      const selectedDebugQuestions = [debugQuestion] as QuestionRow[];
      const questionBankStatus = buildQuestionBankStatus({
        requestedFramework: activeFramework,
        selectedQuestions: selectedDebugQuestions,
        nativeQuestionCount,
        fallbackQuestionCount,
        useArabic,
      });

      return NextResponse.json({
        questions: selectedDebugQuestions.map((q) => localizeQuestion(q, useArabic)),
        profile,
        activeFramework,
        questionFrameworks: frameworkCandidates,
        questionBankNotice: questionBankStatus.message,
        questionBankStatus,
        debugQuestionId,
      });
    }

    let nativeQuestions = await fetchQuestionsForFrameworks({
      supabase,
      frameworks: nativeFrameworksForRoute(activeFramework),
      domain,
      difficulty,
      excludeIds,
      limit: queryLimit,
    });

    let fallbackQuestions =
      activeFramework !== 'pmbok7' && nativeQuestions.length < requestedCount
        ? await fetchQuestionsForFrameworks({
            supabase,
            frameworks: ['pmbok7'],
            domain,
            difficulty,
            excludeIds,
            limit: queryLimit,
          })
        : [];

    // If exclusions emptied the available pool, retry without exclusions while preserving domain/difficulty.
    if (nativeQuestions.length === 0 && fallbackQuestions.length === 0 && excludeIds.length > 0) {
      nativeQuestions = await fetchQuestionsForFrameworks({
        supabase,
        frameworks: nativeFrameworksForRoute(activeFramework),
        domain,
        difficulty,
        excludeIds: [],
        limit: queryLimit,
      });

      fallbackQuestions =
        activeFramework !== 'pmbok7' && nativeQuestions.length < requestedCount
          ? await fetchQuestionsForFrameworks({
              supabase,
              frameworks: ['pmbok7'],
              domain,
              difficulty,
              excludeIds: [],
              limit: queryLimit,
            })
          : [];
    }

    if (nativeQuestions.length === 0 && fallbackQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 });
    }

    const prioritizeByProfile = (rows: QuestionRow[]) => {
      if (profile?.weak_areas && Array.isArray(profile.weak_areas) && profile.weak_areas.length > 0) {
        const weakDomains = profile.weak_areas.map((w: { domain: string }) => w.domain);
        const weakQuestions = rows.filter(
          (q) => typeof q.domain === 'string' && weakDomains.includes(q.domain)
        );
        const otherQuestions = rows.filter(
          (q) => !(typeof q.domain === 'string' && weakDomains.includes(q.domain))
        );
        return [...weakQuestions, ...otherQuestions];
      }

      return [...rows];
    };

    const selectedNative = prioritizeByProfile(nativeQuestions)
      .sort(() => Math.random() - 0.5)
      .slice(0, requestedCount);

    const selectedNativeIds = new Set(
      selectedNative
        .map((row) => row.id)
        .filter((value): value is string => typeof value === 'string')
    );

    const shortage = requestedCount - selectedNative.length;

    const selectedFallback =
      shortage > 0
        ? prioritizeByProfile(fallbackQuestions)
            .filter((row) => !(typeof row.id === 'string' && selectedNativeIds.has(row.id)))
            .sort(() => Math.random() - 0.5)
            .slice(0, shortage)
        : [];

    const selected = [...selectedNative, ...selectedFallback];
    const localizedSelected = selected.map((q) => localizeQuestion(q, useArabic));
    const questionBankStatus = buildQuestionBankStatus({
      requestedFramework: activeFramework,
      selectedQuestions: selected,
      nativeQuestionCount,
      fallbackQuestionCount,
      useArabic,
    });

    return NextResponse.json({
      questions: localizedSelected,
      profile,
      activeFramework,
      questionFrameworks: frameworkCandidates,
      questionBankNotice: questionBankStatus.message,
      questionBankStatus,
    });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}