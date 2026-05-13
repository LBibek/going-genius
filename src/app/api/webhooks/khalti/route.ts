import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Monitor } from '@/lib/monitor';
import { processSuccessfulPayment } from '@/lib/billing';
import { verifyKhaltiPayment } from '@/lib/billing/security';


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

      // Idempotency: If already completed, just return success
      if (transaction.status === 'completed') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Security Check: Ensure the purchase_order_id from Khalti matches our transaction ID
      // This prevents someone from using a pidx from another app to fulfill this one if they know the pidx.
      if (purchase_order_id !== transaction.id) {
        console.error(`[KHALTI WEBHOOK] Security breach attempt: purchase_order_id mismatch. Expected ${transaction.id}, got ${purchase_order_id}`);
        return NextResponse.json({ message: 'Security check failed' }, { status: 403 });
      }

      const app = transaction.app;
      if (!app.khaltiSecretKey) {
        return NextResponse.json({ message: 'App payment config missing' }, { status: 500 });
      }

      // 2. Verify with Khalti Lookup API
      const verification = await verifyKhaltiPayment(pidx, app.khaltiSecretKey);

      if (verification.status === 'Completed') {
        // Integrity Check: Ensure amount matches
        // Khalti returns amount in Paisa, so we divide by 100 to compare with our Rupee amount
        const receivedAmount = Number(verification.amount) / 100;
        if (receivedAmount !== Number(transaction.amount)) {
          console.error(`[KHALTI WEBHOOK] Amount mismatch. Expected ${transaction.amount}, got ${receivedAmount}`);
          return NextResponse.json({ message: 'Amount verification failed' }, { status: 403 });
        }

        // 3. Process the successful payment using shared logic
        await processSuccessfulPayment(transaction.id, verification.transaction_id || pidx, transaction.appId);
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
