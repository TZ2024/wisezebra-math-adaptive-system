import { NextResponse } from 'next/server';
import { runDiagnosticStep } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = String(body.sessionId || '').trim();
    const response = String(body.response || '').trim();

    if (!sessionId || !response) {
      return NextResponse.json({ ok: false, error: 'sessionId and response are required.' }, { status: 400 });
    }

    const result = await runDiagnosticStep({ sessionId, response });

    if (result.finished) {
      return NextResponse.json({
        ok: true,
        finished: true,
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
      question: result.nextQuestion,
      progress: result.progress,
      liveState: result.liveState,
      answerFeedback: result.answerFeedback,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to submit answer.' }, { status: 500 });
  }
}
