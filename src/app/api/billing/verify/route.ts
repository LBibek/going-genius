/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { processSuccessfulPayment } from '@/lib/billing';

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
      await processSuccessfulPayment(txnId!, data.transaction_id || pidx, appId);
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
