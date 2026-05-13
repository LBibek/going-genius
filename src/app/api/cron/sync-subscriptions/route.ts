import { NextResponse } from 'next/server';
import { syncAllSubscriptions } from '@/lib/billing';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Security: Check if CRON_SECRET matches
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncAllSubscriptions();
    return NextResponse.json({ 
      success: true, 
      expiredCount: result.count,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[CRON SYNC ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
