/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Monitor } from '@/lib/monitor';
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

      const app = transaction.app;
      if (!app.esewaSecretKey) {
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=config_missing', req.url));
      }

      // 3. Verify Signature
      const signedFieldNames = data.signed_field_names.split(',');
      const message = signedFieldNames
        .map((field: string) => `${field}=${data[field]}`)
        .join(',');

      const hash = crypto
        .createHmac('sha256', app.esewaSecretKey)
        .update(message)
        .digest('base64');

      if (hash !== data.signature) {
        console.error('[ESEWA WEBHOOK] Signature mismatch');
        return NextResponse.redirect(new URL('/dashboard/payment/failed?error=invalid_signature', req.url));
      }

      if (status === 'COMPLETE') {
        // 4. Update Transaction
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'completed' }
        });

        // 5. Update Subscription
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
            },
            create: {
              appId: transaction.appId,
              userId: transaction.userId,
              planId: transaction.planId,
              status: 'active'
            }
          });
        }

        return NextResponse.redirect(new URL('/dashboard/payment/success', req.url));
      }

      return NextResponse.redirect(new URL('/dashboard/payment/failed', req.url));

    } catch (error: any) {
      console.error('[ESEWA WEBHOOK ERROR]', error);
      return NextResponse.redirect(new URL('/dashboard/payment/failed?error=server_error', req.url));
    }
  });
}
