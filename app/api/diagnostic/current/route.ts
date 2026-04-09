import { NextResponse } from 'next/server';
import { getCurrentDiagnosticQuestion } from '@/lib/server/db';
import { getFallbackCurrentDiagnosticQuestion } from '@/lib/server/fallback-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'sessionId is required.' }, { status: 400 });
    }

    if (sessionId.startsWith('fallback-')) {
      const current = getFallbackCurrentDiagnosticQuestion(sessionId);
      if (current.completed) {
        return NextResponse.json({ ok: false, completed: true, error: 'Diagnostic already completed.' }, { status: 409 });
      }

      return NextResponse.json({
        ok: true,
        mode: 'fallback',
        question: current.question,
        answered: current.answered,
        maxQuestionCount: current.maxQuestionCount,
        liveState: current.liveState,
      });
    }

    const current = await getCurrentDiagnosticQuestion(sessionId);
    if (current.completed) {
      return NextResponse.json({ ok: false, completed: true, error: 'Diagnostic already completed.' }, { status: 409 });
    }

    return NextResponse.json({
      ok: true,
      mode: 'supabase',
      question: current.question,
      answered: current.answered,
      maxQuestionCount: current.maxQuestionCount,
      liveState: current.liveState,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Failed to load current diagnostic question.' }, { status: 500 });
  }
}
