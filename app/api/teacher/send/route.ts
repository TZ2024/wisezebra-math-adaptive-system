import { NextResponse } from 'next/server';
import { sendTeacherPacketEmail } from '@/lib/server/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendTeacherPacketEmail({
      to: body.to || 'wisezebrami@gmail.com',
      subject: body.subject || 'WiseZebra Teacher Packet',
      text: body.text || 'Teacher packet placeholder',
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to send teacher packet email' }, { status: 500 });
  }
}
