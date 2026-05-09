import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Shared utility to handle successful payment processing across webhooks and verification routes.
 * Implements idempotency to ensure a transaction is only processed once.
 */
export async function processSuccessfulPayment(transactionId: string, referenceId: string, appId: string) {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Check if transaction is already completed (Idempotency)
    const existingTx = await tx.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!existingTx) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (existingTx.status === 'completed') {
      return { success: true, alreadyProcessed: true };
    }

    // 2. Update transaction status
    const transaction = await tx.transaction.update({
      where: { id: transactionId },
      data: { 
        status: 'completed',
        referenceId: referenceId
      }
    });

    // 3. Get items from cart for this user/app
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
        
        // Upsert the subscription for this user on this app
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

    return { success: true, alreadyProcessed: false };
  });
}

/**
 * Aggregates billing data for a user across the entire ecosystem.
 * Used for the Universal Wallet dashboard to show total spend and upcoming renewals.
 */
export async function getEcosystemBillingSummary(userId: string) {
  const [subscriptions, transactions] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId, status: 'active' },
      include: { 
        app: { select: { name: true, logoUrl: true } },
        plan: { select: { name: true, price: true, interval: true } }
      }
    }),
    prisma.transaction.findMany({
      where: { userId, status: 'completed' },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const totalMonthlyBurn = subscriptions.reduce((acc: number, sub: any) => {
    const price = Number(sub.plan.price);
    return acc + (sub.plan.interval === 'monthly' ? price : price / 12);
  }, 0);

  const totalLifetimeSpend = transactions.reduce((acc: number, tx: any) => acc + Number(tx.amount), 0);

  const upcomingRenewals = (subscriptions as any[])
    .filter((sub: any) => sub.expiresAt)
    .sort((a: any, b: any) => a.expiresAt!.getTime() - b.expiresAt!.getTime())
    .map((sub: any) => ({
      appName: sub.app.name,
      expiresAt: sub.expiresAt?.toISOString(),
      amount: sub.plan.price
    }));

  return {
    activeCount: subscriptions.length,
    totalMonthlyBurn,
    totalLifetimeSpend,
    upcomingRenewals,
    recentTransactions: transactions.map((tx: any) => ({
      id: tx.id,
      amount: tx.amount,
      gateway: tx.provider,
      date: tx.createdAt.toISOString()
    }))
  };
}
