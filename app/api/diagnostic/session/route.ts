import { NextResponse } from 'next/server';
import { createStudentSession, getCurrentDiagnosticQuestion } from '@/lib/server/db';
import { createFallbackStudentSession, getFallbackCurrentDiagnosticQuestion, isFallbackModeEnabled } from '@/lib/server/fallback-store';
import { hasSupabaseEnv } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentName = String(body.studentName || '').trim();
    const parentEmail = String(body.parentEmail || '').trim();

    if (!studentName) {
      return NextResponse.json({ ok: false, error: 'Student name is required.' }, { status: 400 });
    }

    if (!hasSupabaseEnv() && isFallbackModeEnabled()) {
      const session = createFallbackStudentSession({ studentName, parentEmail: parentEmail || null });
      const current = getFallbackCurrentDiagnosticQuestion(session.id);
      if (current.completed) {
        return NextResponse.json({ ok: false, error: 'Diagnostic session completed unexpectedly.' }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        mode: 'fallback',
        warning: 'Supabase is not configured, so the diagnostic is running in temporary fallback mode.',
        session: {
          id: session.id,
          sessionCode: session.session_code,
          studentName: session.student_name,
          parentEmail: session.parent_email,
        },
        question: current.question,
        answered: current.answered,
        maxQuestionCount: current.maxQuestionCount,
        liveState: current.liveState,
      });
    }

    const session = await createStudentSession({
      studentName,
      parentEmail: parentEmail || null,
    });

    const current = await getCurrentDiagnosticQuestion(session.id);
    if (current.completed) {
      return NextResponse.json({ ok: false, error: 'Diagnostic session completed unexpectedly.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mode: 'supabase',
      session: {
        id: session.id,
        sessionCode: session.session_code,
        studentName: session.student_name,
        parentEmail: session.parent_email,
      },
      question: current.question,
      answered: current.answered,
      maxQuestionCount: current.maxQuestionCount,
      liveState: current.liveState,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Failed to start diagnostic session.' }, { status: 500 });
  }
}
