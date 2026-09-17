import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { postAnswerFeedback, scorePracticeResponse, type PracticeResponse } from '@/lib/practice/scoring';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      sessionId?: string;
      questionId?: string;
      blockNumber?: number;
      language?: string;
      response?: PracticeResponse;
    };
    if (!body.sessionId || !body.questionId || !Number.isInteger(body.blockNumber) || body.response == null) {
      return NextResponse.json({ error: 'Invalid answer request' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: session } = await admin.from('practice_sessions').select('id,user_id').eq('id', body.sessionId).maybeSingle();
    if (!session || session.user_id !== user.id) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const { data: question, error: questionError } = await admin.from('questions').select('*').eq('id', body.questionId).eq('is_active', true).maybeSingle();
    if (questionError || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const isCorrect = scorePracticeResponse(question, body.response);
    const selectedAnswer = JSON.stringify(body.response);
    const responseRow = {
      user_id: user.id,
      session_id: body.sessionId,
      question_id: body.questionId,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      block_number: body.blockNumber,
      answered_at: new Date().toISOString(),
    };
    const { data: existing } = await admin.from('question_responses').select('id')
      .eq('user_id', user.id).eq('session_id', body.sessionId).eq('question_id', body.questionId)
      .eq('block_number', body.blockNumber).maybeSingle();
    const write = existing
      ? await admin.from('question_responses').update(responseRow).eq('id', existing.id)
      : await admin.from('question_responses').insert(responseRow);
    if (write.error) throw write.error;

    return NextResponse.json({ isCorrect, feedback: postAnswerFeedback(question, body.language === 'ar') });
  } catch (error) {
    console.error('Practice answer API error:', error);
    return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 });
  }
}
