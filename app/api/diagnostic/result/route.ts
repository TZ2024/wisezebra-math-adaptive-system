import { NextResponse } from 'next/server';
import { getSessionProfile, getStudentSession } from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'sessionId is required.' }, { status: 400 });
    }

    const [session, profile] = await Promise.all([
      getStudentSession(sessionId),
      getSessionProfile(sessionId),
    ]);

    if (!profile || session.status !== 'completed') {
      return NextResponse.json({ ok: false, error: 'Diagnostic is not complete yet.' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      session: {
        id: session.id,
        sessionCode: session.session_code,
        studentName: session.student_name,
        parentEmail: session.parent_email,
      },
      profile: {
        overallLevel: profile.overall_wz_level,
        strengths: profile.strengths,
        supportAreas: profile.support_areas,
        recommendedNextPractice: profile.recommended_next_practice,
        domainConfidence: profile.domain_confidence,
        stoppedReason: profile.stopped_reason,
      },
      profileId: profile.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to load diagnostic result.' }, { status: 500 });
  }
}
