import { NextResponse } from 'next/server';
import { buildPracticeSetFromProfile } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const packageType = body.packageType === 'weekly' ? 'weekly' : 'single';
    const sessionId = body.sessionId;
    const profileId = body.profileId;

    if (!sessionId || !profileId) {
      return NextResponse.json({ ok: false, error: 'sessionId and profileId are required' }, { status: 400 });
    }

    await buildPracticeSetFromProfile({
      sessionId,
      profileId,
      packageType,
    });

    const amount = packageType === 'weekly' ? '2.99' : '0.99';
    const successUrl = `/student/practice?sessionId=${encodeURIComponent(sessionId)}&profileId=${encodeURIComponent(profileId)}&packageType=${packageType}&paid=1`;

    return NextResponse.json({
      ok: true,
      packageType,
      amount,
      checkoutUrl: successUrl,
      checkoutMode: process.env.STRIPE_SECRET_KEY ? 'stripe_pending_wiring' : 'demo_success_redirect_until_stripe_keys_added',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Failed to create checkout flow' }, { status: 500 });
  }
}
