import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendTeacherPacketEmail(input: {
  to?: string;
  subject: string;
  text: string;
}) {
  const to = input.to ?? 'wisezebrami@gmail.com';

  if (!resend) {
    return {
      simulated: true,
      to,
      subject: input.subject,
    };
  }

  return resend.emails.send({
    from: process.env.TEACHER_PACKET_FROM || 'WiseZebra <noreply@wisezebra.com>',
    to,
    subject: input.subject,
    text: input.text,
  });
}
