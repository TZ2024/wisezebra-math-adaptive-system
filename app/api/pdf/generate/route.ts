import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { PracticePdfDocument } from '@/lib/pdf/practice-pdf';
import { buildPracticeSetFromProfile, getSessionProfile, getStudentSession } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = String(body.sessionId || '').trim();
    const profileId = String(body.profileId || '').trim();
    const packageType = body.packageType === 'weekly' ? 'weekly' : 'single';
    const paid = body.paid === true || body.paid === 'true' || body.paid === 1 || body.paid === '1';

    if (!paid) {
      return NextResponse.json({ ok: false, error: 'Payment is required before PDF generation.' }, { status: 402 });
    }

    if (!sessionId || !profileId) {
      return NextResponse.json({ ok: false, error: 'sessionId and profileId are required.' }, { status: 400 });
    }

    const [session, profileRecord, practice] = await Promise.all([
      getStudentSession(sessionId),
      getSessionProfile(sessionId),
      buildPracticeSetFromProfile({ sessionId, profileId, packageType }),
    ]);

    if (!profileRecord) {
      return NextResponse.json({ ok: false, error: 'No completed diagnostic profile found.' }, { status: 400 });
    }

    const pdfBuffer = await renderToBuffer(
      PracticePdfDocument({
        studentName: session.student_name || 'Student',
        packageType,
        wzLevel: profileRecord.overall_wz_level,
        strengths: profileRecord.strengths,
        supportAreas: profileRecord.support_areas,
        recommendedNextPractice: profileRecord.recommended_next_practice,
        questions: practice.questions,
      }),
    );

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wisezebra-practice-${packageType}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
