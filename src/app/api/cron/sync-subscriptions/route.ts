import { NextRequest, NextResponse } from 'next/server';
import { syncAllSubscriptions } from '@/lib/billing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncAllSubscriptions();
    return NextResponse.json({
      success: true,
      message: `Synchronized ${result.count} subscriptions`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[CRON] Subscription Sync Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
