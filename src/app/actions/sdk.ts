/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function checkGGSubscription(appId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { authenticated: false, hasActiveSubscription: false };
    }

    const subscription = await (prisma as any).subscription.findFirst({
      where: {
        userId: session.userId,
        appId: appId,
        status: 'active',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        plan: true
      }
    });

    return {
      authenticated: true,
      hasActiveSubscription: !!subscription,
      subscription: subscription ? {
        id: subscription.id,
        planName: subscription.plan.name,
        expiresAt: subscription.expiresAt
      } : null
    };
  } catch (error) {
    console.error('SDK Action Error:', error);
    return { error: 'Failed to check subscription' };
  }
}

export async function getGGAppPlans(appId: string) {
  try {
    const plans = await (prisma as any).subscriptionPlan.findMany({
      where: { appId: appId },
      orderBy: { price: 'asc' }
    });

    return { plans };
  } catch (error) {
    console.error('SDK Action Error:', error);
    return { error: 'Failed to fetch plans' };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error('Unauthorized');
    }

    // Verify ownership
    const subscription = await (prisma as any).subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription || subscription.userId !== session.userId) {
      throw new Error('Subscription not found');
    }

    await (prisma as any).subscription.update({
      where: { id: subscriptionId },
      data: { status: 'cancelled' }
    });

    return { success: true };
  } catch (error: any) {
    console.error('SDK Action Error:', error);
    return { error: error.message || 'Failed to cancel subscription' };
  }
}
