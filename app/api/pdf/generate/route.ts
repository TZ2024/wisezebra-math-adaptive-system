import { NextResponse } from 'next/server';

function buildPracticePdfHtml(input: {
  studentName: string;
  packageType: 'single' | 'weekly';
  wzLevel: string;
  strengths: string[];
  supportAreas: string[];
  recommendedNextPractice: string[];
}) {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>WiseZebra Practice PDF</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #172033; }
        h1, h2, h3 { margin-bottom: 8px; }
        .muted { color: #5b6477; }
        .card { border: 1px solid #dde3f0; border-radius: 16px; padding: 16px; margin-bottom: 16px; }
        ul { margin-top: 6px; }
      </style>
    </head>
    <body>
      <h1>WiseZebra Personalized Practice</h1>
      <p class="muted">Student: ${input.studentName} | Package: ${input.packageType} | Level: ${input.wzLevel}</p>

      <div class="card">
        <h2>Strengths</h2>
        <ul>${input.strengths.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>

      <div class="card">
        <h2>Support Areas</h2>
        <ul>${input.supportAreas.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>

      <div class="card">
        <h2>Recommended Next Practice</h2>
        <ul>${input.recommendedNextPractice.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>

      <div class="card">
        <h2>Printable Practice Sheet</h2>
        <p>Practice questions will be inserted here from the generated package.</p>
      </div>
    </body>
  </html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const html = buildPracticePdfHtml({
      studentName: body.studentName || 'Student',
      packageType: body.packageType === 'weekly' ? 'weekly' : 'single',
      wzLevel: body.wzLevel || 'WZ 10',
      strengths: body.strengths || [],
      supportAreas: body.supportAreas || [],
      recommendedNextPractice: body.recommendedNextPractice || [],
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="wisezebra-practice-${body.packageType || 'single'}.html"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to generate printable file' }, { status: 500 });
  }
}
