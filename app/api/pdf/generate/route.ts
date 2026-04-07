import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { PracticePdfDocument } from '@/lib/pdf/practice-pdf';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pdfBuffer = await renderToBuffer(
      PracticePdfDocument({
        studentName: body.studentName || 'Student',
        packageType: body.packageType === 'weekly' ? 'weekly' : 'single',
        wzLevel: body.wzLevel || 'WZ 10',
        strengths: body.strengths || [],
        supportAreas: body.supportAreas || [],
        recommendedNextPractice: body.recommendedNextPractice || [],
      }),
    );

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="wisezebra-practice-${body.packageType || 'single'}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
