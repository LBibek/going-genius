import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Monitor } from '@/lib/monitor';
import { processSuccessfulPayment } from '@/lib/billing';
import { verifyEsewaSignature } from '@/lib/billing/security';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  return await Monitor.trace('webhook.esewa', async () => {
    try {
      const { searchParams } = new URL(req.url);
      const encodedData = searchParams.get('data');

      if (!encodedData) {
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=missing_data', req.url));
      }

      // 1. Decode Data
      const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
      const data = JSON.parse(decodedString);
      const { transaction_uuid, total_amount, status } = data;

      // 2. Find Transaction
      const transaction = await prisma.transaction.findUnique({
        where: { referenceId: transaction_uuid },
        include: { app: true }
      });

      if (!transaction) {
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=not_found', req.url));
      }

      // Idempotency: If already completed, redirect to success
      if (transaction.status === 'completed') {
        return NextResponse.redirect(new URL('/dashboard/payment/success?status=already_processed', req.url));
      }

      const app = transaction.app;
      if (!app.esewaSecretKey) {
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=config_missing', req.url));
      }

      // 3. Verify Signature & Amount
      const isValid = verifyEsewaSignature(data, app.esewaSecretKey);

      if (!isValid) {
        console.error('[ESEWA WEBHOOK] Signature mismatch');
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=invalid_signature', req.url));
      }

      // Integrity Check: Ensure amount matches
      if (Number(total_amount) !== Number(transaction.amount)) {
        console.error(`[ESEWA WEBHOOK] Amount mismatch. Expected ${transaction.amount}, got ${total_amount}`);
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=amount_mismatch', req.url));
      }

      if (status === 'COMPLETE') {
        // 4. Process the successful payment using shared logic
        await processSuccessfulPayment(transaction.id, data.transaction_code || transaction_uuid, transaction.appId);
        return NextResponse.redirect(new URL('/dashboard/payment/success', req.url));
      }

      return NextResponse.redirect(new URL('/dashboard/payment/failed', req.url));

    } catch (error: any) {
      console.error('[ESEWA WEBHOOK ERROR]', error);
      return NextResponse.redirect(new URL('/dashboard/payment/failed?error=server_error', req.url));
    }
  });
}
