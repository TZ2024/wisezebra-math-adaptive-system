import { NextResponse } from 'next/server';
import { getSessionProfile, getStudentSession } from '@/lib/server/db';
import { getFallbackResult } from '@/lib/server/fallback-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'sessionId is required.' }, { status: 400 });
    }

    if (sessionId.startsWith('fallback-')) {
      const result = getFallbackResult(sessionId);
      return NextResponse.json({ ok: true, mode: 'fallback', ...result });
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
      mode: 'supabase',
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
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Failed to load diagnostic result.' }, { status: 500 });
  }
}
