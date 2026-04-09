import { NextResponse } from 'next/server';
import { runDiagnosticStep } from '@/lib/server/db';
import { runFallbackDiagnosticStep } from '@/lib/server/fallback-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = String(body.sessionId || '').trim();
    const response = String(body.response || '').trim();

    if (!sessionId || !response) {
      return NextResponse.json({ ok: false, error: 'sessionId and response are required.' }, { status: 400 });
    }

    if (sessionId.startsWith('fallback-')) {
      const result = runFallbackDiagnosticStep({ sessionId, response });
      if (result.finished) {
        return NextResponse.json({
          ok: true,
          finished: true,
          mode: 'fallback',
          session: {
            id: result.session.id,
            sessionCode: result.session.session_code,
            studentName: result.session.student_name,
          },
          profile: result.profile,
          profileId: result.profileId,
        });
      }

      return NextResponse.json({
        ok: true,
        finished: false,
        mode: 'fallback',
        question: result.nextQuestion,
        progress: result.progress,
        liveState: result.liveState,
      });
    }

    const result = await runDiagnosticStep({ sessionId, response });

    if (result.finished) {
      return NextResponse.json({
        ok: true,
        finished: true,
        mode: 'supabase',
        session: {
          id: result.session.id,
          sessionCode: result.session.session_code,
          studentName: result.session.student_name,
        },
        profile: result.profile,
        profileId: result.savedProfile.id,
      });
    }

    return NextResponse.json({
      ok: true,
      finished: false,
      mode: 'supabase',
      question: result.nextQuestion,
      progress: result.progress,
      liveState: result.liveState,
      answerFeedback: result.answerFeedback,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Failed to submit answer.' }, { status: 500 });
  }
}
