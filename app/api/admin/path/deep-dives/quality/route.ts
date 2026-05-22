import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { auditLessonDeepDiveContent } from '@/lib/pmp-path/deep-dive-quality';

export const maxDuration = 30;

function readText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const contentMarkdown = readText(body.contentMarkdown) || readText(body.content_markdown);

  if (!contentMarkdown.trim()) {
    return NextResponse.json({ error: 'contentMarkdown is required' }, { status: 400 });
  }

  const audit = auditLessonDeepDiveContent({
    trackId: readText(body.trackId) || readText(body.track_id),
    framework: readText(body.framework, 'pmbok8'),
    moduleId: readText(body.moduleId) || readText(body.module_id),
    lessonId: readText(body.lessonId) || readText(body.lesson_id),
    step: readText(body.step, 'learn'),
    language: readText(body.language, 'en'),
    title: readText(body.title, ''),
    contentMarkdown,
  });

  return NextResponse.json({ audit });
}
