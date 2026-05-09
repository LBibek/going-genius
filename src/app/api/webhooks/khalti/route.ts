import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Monitor } from '@/lib/monitor';


export async function POST(req: NextRequest) {
  return await Monitor.trace('webhook.khalti', async () => {
    try {
      const body = await req.json();
      const { pidx, amount, status, purchase_order_id } = body;

      if (!pidx) {
        return NextResponse.json({ message: 'Missing pidx' }, { status: 400 });
      }

      // 1. Find the transaction
      const transaction = await prisma.transaction.findUnique({
        where: { referenceId: pidx },
        include: { app: true }
      });

      if (!transaction) {
        console.error(`[KHALTI WEBHOOK] Transaction not found for pidx: ${pidx}`);
        return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
      }

      const app = transaction.app;
      if (!app.khaltiSecretKey) {
        return NextResponse.json({ message: 'App payment config missing' }, { status: 500 });
      }

      // 2. Verify with Khalti Lookup API
      const lookupUrl = process.env.NODE_ENV === 'production' 
        ? 'https://khalti.com/api/v2/epayment/lookup/' 
        : 'https://a.khalti.com/api/v2/epayment/lookup/';

      const verifyRes = await fetch(lookupUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${app.khaltiSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pidx })
      });

      const verification = await verifyRes.json();

      if (verification.status === 'Completed') {
        // 3. Update Transaction
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'completed' }
        });

        // 4. Update or Create Subscription
        if (transaction.planId && transaction.userId) {
          await prisma.subscription.upsert({
            where: {
              appId_userId: {
                appId: transaction.appId,
                userId: transaction.userId
              }
            },
            update: {
              planId: transaction.planId,
              status: 'active',
              startDate: new Date(),
              // Logic for expiresAt based on plan interval would go here
            },
            create: {
              appId: transaction.appId,
              userId: transaction.userId,
              planId: transaction.planId,
              status: 'active'
            }
          });
        }

        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ message: 'Payment not completed', status: verification.status });

    } catch (error: any) {
      console.error('[KHALTI WEBHOOK ERROR]', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  });
}

// Khalti also supports GET callbacks on the return_url
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pidx = searchParams.get('pidx');
  const status = searchParams.get('status');

  // For GET (Return URL), we usually just redirect the user
  // The POST webhook handles the actual data processing
  if (status === 'Completed') {
    return NextResponse.redirect(new URL('/dashboard/payment/success', req.url));
  } else {
    return NextResponse.redirect(new URL('/dashboard/payment/failed', req.url));
  }
}
