import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

/**
 * API route for the SDK to check the subscription status of a user for a specific app.
 * GET /api/gg/subscription?appId=...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'Missing appId' }, { status: 400 });
    }

    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ active: false, reason: 'unauthenticated' });
    }

    const subscription = await (prisma as any).subscription.findFirst({
      where: {
        userId: session.userId,
        appId: appId,
        status: 'active',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    return NextResponse.json({
      active: !!subscription,
      planId: subscription?.planId
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') throw error;
    console.error('Subscription Check API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
