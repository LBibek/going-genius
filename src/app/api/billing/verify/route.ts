import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider');
  const appId = searchParams.get('appId');
  const txnId = searchParams.get('txnId'); // For Khalti redirect

  if (!appId) return NextResponse.json({ error: 'Missing appId' }, { status: 400 });

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });

  if (provider === 'khalti') {
    const pidx = searchParams.get('pidx');
    if (!pidx) return NextResponse.json({ error: 'Missing pidx' }, { status: 400 });

    const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${app.khaltiSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    const data = await response.json();

    if (data.status === 'Completed') {
      await processSuccessfulPayment(txnId!, data.transaction_id, appId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=failed`);
    }
  } else if (provider === 'esewa') {
    const encodedData = searchParams.get('data');
    if (!encodedData) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
    
    const message = `transaction_code=${decoded.transaction_code},status=${decoded.status},total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code},signed_field_names=${decoded.signed_field_names}`;
    const expectedSignature = crypto.createHmac('sha256', app.esewaSecretKey!).update(message).digest('base64');

    if (expectedSignature === decoded.signature && decoded.status === 'COMPLETE') {
      await processSuccessfulPayment(decoded.transaction_uuid, decoded.transaction_code, appId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=failed`);
    }
  }

  return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pidx, txnId, appId, status } = body;

  if (status === 'Completed') {
    try {
      await processSuccessfulPayment(txnId, pidx, appId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'Ignored' });
}

async function processSuccessfulPayment(transactionId: string, referenceId: string, appId: string) {
  return await (prisma as any).$transaction(async (tx: any) => {
    // 1. Check if transaction is already completed (Idempotency)
    const existingTx = await tx.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!existingTx || existingTx.status === 'completed') {
      return;
    }

    // 2. Update transaction status
    const transaction = await tx.transaction.update({
      where: { id: transactionId },
      data: { 
        status: 'completed',
        referenceId: referenceId
      }
    });

    // 3. Get items from cart
    const cart = await tx.cart.findUnique({
      where: { userId_appId: { userId: transaction.userId, appId } },
      include: { items: { include: { plan: true } } }
    });

    if (cart && cart.items.length > 0) {
      for (const item of cart.items) {
        let expiresAt: Date | null = null;
        if (item.plan.interval === 'monthly') {
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (item.plan.interval === 'yearly') {
          expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        
        await tx.subscription.upsert({
          where: { appId_userId: { appId, userId: transaction.userId } },
          update: {
            planId: item.planId,
            status: 'active',
            startDate: new Date(),
            expiresAt: expiresAt
          },
          create: {
            appId,
            userId: transaction.userId,
            planId: item.planId,
            status: 'active',
            expiresAt: expiresAt
          }
        });
      }

      // 4. Clear cart after successful subscription creation
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  });
}
