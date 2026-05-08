'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import crypto from 'crypto';

/**
 * Get the cart for the current user and specified app.
 */
export async function getCart(appId: string) {
  const session = await getSession();
  if (!session) return null;

  return await prisma.cart.findUnique({
    where: { userId_appId: { userId: session.userId, appId } },
    include: {
      items: {
        include: { plan: true }
      }
    }
  });
}

/**
 * Add a plan to the cart.
 */
export async function addToCart(appId: string, planId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const cart = await prisma.cart.upsert({
    where: { userId_appId: { userId: session.userId, appId } },
    update: {},
    create: { userId: session.userId, appId }
  });

  // Check if item already exists
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, planId }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        planId,
        quantity: 1
      }
    });
  }

  revalidatePath(`/demo/billing/${appId}`);
  return { success: true };
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCart(appId: string, itemId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.cartItem.delete({
    where: { id: itemId }
  });

  revalidatePath(`/demo/billing/${appId}`);
  return { success: true };
}

/**
 * Clear the cart.
 */
export async function clearCart(appId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const cart = await prisma.cart.findUnique({
    where: { userId_appId: { userId: session.userId, appId } }
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
  }

  revalidatePath(`/demo/billing/${appId}`);
  return { success: true };
}

/**
 * Initialize payment with a provider (Khalti or eSewa).
 */
export async function initiateCheckout(appId: string, provider: 'khalti' | 'esewa') {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const cart = await prisma.cart.findUnique({
    where: { userId_appId: { userId: session.userId, appId } },
    include: { items: { include: { plan: true } } }
  });

  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app) throw new Error('App not found');

  const totalAmount = cart.items.reduce((acc, item) => acc + (item.plan.price * item.quantity), 0);

  // Create a pending transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId: session.userId,
      appId: appId,
      amount: totalAmount,
      provider: provider,
      status: 'pending',
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (provider === 'khalti') {
    if (!app.khaltiSecretKey) throw new Error('Khalti not configured for this app');

    const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${app.khaltiSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        return_url: `${baseUrl}/api/billing/verify?provider=khalti&appId=${appId}&txnId=${transaction.id}`,
        website_url: baseUrl,
        amount: totalAmount * 100, // paisa
        purchase_order_id: transaction.id,
        purchase_order_name: `Subscription for ${app.name}`,
      })
    });

    const data = await response.json();
    if (data.payment_url) {
      return { url: data.payment_url };
    } else {
      console.error('Khalti Error:', data);
      throw new Error('Failed to initiate Khalti payment');
    }
  } else {
    // eSewa
    if (!app.esewaSecretKey || !app.esewaMerchantId) throw new Error('eSewa not configured for this app');

    // For eSewa, we usually return the form data to the client to submit
    const message = `total_amount=${totalAmount},transaction_uuid=${transaction.id},product_code=${app.esewaMerchantId}`;
    const signature = crypto.createHmac('sha256', app.esewaSecretKey).update(message).digest('base64');

    return {
      provider: 'esewa',
      formData: {
        amount: totalAmount.toString(),
        tax_amount: '0',
        total_amount: totalAmount.toString(),
        transaction_uuid: transaction.id,
        product_code: app.esewaMerchantId,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: `${baseUrl}/api/billing/verify?provider=esewa&appId=${appId}`,
        failure_url: `${baseUrl}/demo/billing/${appId}?status=failed`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: signature
      }
    };
  }
}
