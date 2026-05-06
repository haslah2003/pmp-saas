import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type PracticeFramework = 'pmbok7' | 'pmbok8' | 'bridge';

function normalizePracticeFramework(value: unknown): PracticeFramework {
  if (value === 'pmbok8') return 'pmbok8';
  if (value === 'bridge') return 'bridge';
  return 'pmbok7';
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const framework = normalizePracticeFramework(body.framework);
    const domain = normalizeText(body.domain, 'all');
    const difficulty = normalizeText(body.difficulty, 'entry');

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({
        user_id: user.id,
        framework,
        domain,
        difficulty,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error('Practice session API error:', error);
    return NextResponse.json({ error: 'Failed to create practice session' }, { status: 500 });
  }
}
