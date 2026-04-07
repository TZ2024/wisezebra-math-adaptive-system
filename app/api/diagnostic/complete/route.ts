import { NextResponse } from 'next/server';
import { buildSessionProfile, generatePracticeMix, initializeDomainConfidence } from '@/lib/adaptive-engine';
import { sampleQuestions } from '@/lib/mock-data';
import { createStudentSession, saveSessionProfile, createTeacherPacket } from '@/lib/server/db';
import { teacherPacketTemplate } from '@/emails/teacher-packet-template';
import { sendTeacherPacketEmail } from '@/lib/server/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentName = body.studentName || 'Student';
    const parentEmail = body.parentEmail || null;

    const states = initializeDomainConfidence().map((state, index) => ({
      ...state,
      confidence: [0.84, 0.78, 0.73, 0.8, 0.69][index],
      total: 3,
      correct: [3, 2, 2, 2, 1][index],
      levelIndex: 7 + index,
    }));

    const profile = buildSessionProfile(states);
    const practice = generatePracticeMix(profile, sampleQuestions);

    const session = await createStudentSession({ studentName, parentEmail });
    const savedProfile = await saveSessionProfile(session.id, profile);

    const packetBody = teacherPacketTemplate({
      studentName,
      sessionId: session.session_code,
      profileSummary: `${profile.overallLevel}; strengths: ${profile.strengths.join(', ')}; support areas: ${profile.supportAreas.join(', ')}`,
      teacherEmail: 'wisezebrami@gmail.com',
      assignedQuestions: practice.map((question) => ({
        prompt: question.prompt,
        answer: question.answer,
        explanation: question.teacherExplanation,
        commonErrors: question.commonErrors,
        hints: question.hints,
      })),
      suggestedTeachingNotes: [
        'Review fraction models before symbolic bridge work.',
        'Keep signed-number support visual and concrete.',
      ],
    });

    const packet = await createTeacherPacket({
      sessionId: session.id,
      profileId: savedProfile.id,
      parentEmail,
      packetBody,
    });

    const emailResult = await sendTeacherPacketEmail({
      to: 'wisezebrami@gmail.com',
      subject: `WiseZebra Teacher Report • ${studentName} • ${session.session_code}`,
      text: packetBody,
    });

    return NextResponse.json({
      ok: true,
      sessionCode: session.session_code,
      profile,
      practiceOffer: {
        single: 0.99,
        weekly: 2.99,
      },
      teacherPacketId: packet.id,
      emailResult,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to complete diagnostic' }, { status: 500 });
  }
}
