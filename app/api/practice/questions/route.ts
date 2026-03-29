import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain') || 'all';
    const difficulty = searchParams.get('difficulty') || 'entry';
    const framework = searchParams.get('framework') || 'pmbok7';
    const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) || [];

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

    const { data: questions, error } = await query.limit(20);
    if (error) throw error;
    if (!questions || questions.length === 0) {
      // Fallback: remove exclude filter
      const { data: fallback } = await supabase
        .from('questions')
        .select('*')
        .eq('framework', framework)
        .eq('difficulty', difficulty)
        .eq('is_active', true)
        .limit(20);
      
      if (!fallback || fallback.length === 0) {
        return NextResponse.json({ error: 'No questions available' }, { status: 404 });
      }
      
      const shuffled = fallback.sort(() => Math.random() - 0.5).slice(0, 5);
      return NextResponse.json({ questions: shuffled, profile });
    }

    // Prioritize weak area questions if profile exists
    let prioritized = [...questions];
    if (profile?.weak_areas && Array.isArray(profile.weak_areas) && profile.weak_areas.length > 0) {
      const weakDomains = profile.weak_areas.map((w: { domain: string }) => w.domain);
      const weakQuestions = questions.filter(q => weakDomains.includes(q.domain));
      const otherQuestions = questions.filter(q => !weakDomains.includes(q.domain));
      prioritized = [...weakQuestions, ...otherQuestions];
    }

    const selected = prioritized.sort(() => Math.random() - 0.5).slice(0, 5);
    return NextResponse.json({ questions: selected, profile });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}