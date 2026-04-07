import { NextResponse } from 'next/server';
import { sampleQuestions } from '@/lib/mock-data';
import { createPracticeSet } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const packageType = body.packageType === 'weekly' ? 'weekly' : 'single';
    const sessionId = body.sessionId;
    const profileId = body.profileId;

    if (!sessionId || !profileId) {
      return NextResponse.json({ ok: false, error: 'sessionId and profileId are required' }, { status: 400 });
    }

    const questionIds = sampleQuestions.map((question) => question.id);
    const practiceSet = await createPracticeSet({
      sessionId,
      profileId,
      packageType,
      questionIds,
    });

    return NextResponse.json({
      ok: true,
      practiceSetId: practiceSet.id,
      amount: packageType === 'weekly' ? 2.99 : 0.99,
      packageType,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to create practice set' }, { status: 500 });
  }
}
