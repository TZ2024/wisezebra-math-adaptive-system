import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: 'The sample complete endpoint has been retired. Use the real diagnostic session and submit endpoints instead.',
    },
    { status: 410 },
  );
}
