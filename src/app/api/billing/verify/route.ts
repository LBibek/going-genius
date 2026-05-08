import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider');
  const appId = searchParams.get('appId');
  const txnId = searchParams.get('txnId'); // For Khalti

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
      // Update transaction and create subscription
      await processSuccessfulPayment(txnId!, data.transaction_id, appId);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/demo/billing/${appId}?status=failed`);
    }
  } else if (provider === 'esewa') {
    // eSewa returns data in query or encoded
    const encodedData = searchParams.get('data');
    if (!encodedData) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
    
    // Verify signature
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

async function processSuccessfulPayment(transactionId: string, referenceId: string, appId: string) {
  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { 
      status: 'completed',
      referenceId: referenceId
    },
    include: { user: true, app: true }
  });

  // Get items from cart and create subscriptions
  const cart = await prisma.cart.findUnique({
    where: { userId_appId: { userId: transaction.userId, appId } },
    include: { items: true }
  });

  if (cart) {
    for (const item of cart.items) {
      // Calculate expiresAt based on plan interval
      let expiresAt: Date | null = null;
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: item.planId } });
      if (plan) {
        if (plan.interval === 'monthly') {
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (plan.interval === 'yearly') {
          expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        
        await prisma.subscription.upsert({
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
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
