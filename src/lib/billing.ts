import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Shared utility to handle successful payment processing across webhooks and verification routes.
 * Implements idempotency to ensure a transaction is only processed once.
 */
export async function processSuccessfulPayment(transactionId: string, referenceId: string, appId: string) {
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

    // 1.5. Check ProcessedTransaction for external idempotency
    const processed = await tx.processedTransaction.findUnique({
      where: { externalId: referenceId }
    });

    if (processed) {
      // If found in ProcessedTransaction but our internal tx isn't marked completed,
      // it means there was a crash after processing but before completing the transaction.
      // We should still mark our internal tx as completed.
      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: 'completed', referenceId }
      });
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

    // 2.5. Record in ProcessedTransaction
    await tx.processedTransaction.create({
      data: {
        gateway: transaction.provider,
        externalId: referenceId,
        internalId: transactionId
      }
    });

    // 3. Get items from cart OR from direct transaction planId
    let plansToSubscribe: any[] = [];

    if (transaction.planId) {
      const directPlan = await tx.subscriptionPlan.findUnique({ where: { id: transaction.planId } });
      if (directPlan) plansToSubscribe.push(directPlan);
    } else {
      const cart = await tx.cart.findUnique({
        where: { userId_appId: { userId: transaction.userId, appId } },
        include: { items: { include: { plan: true } } }
      });

      if (cart && cart.items.length > 0) {
        plansToSubscribe = cart.items.map(item => item.plan);
        // Clear cart after pulling items
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    if (plansToSubscribe.length > 0) {
      for (const plan of plansToSubscribe) {
        let expiresAt: Date | null = null;
        if (plan.interval === 'monthly') {
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (plan.interval === 'yearly') {
          expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        
        // Upsert the subscription for this user on this app
        await tx.subscription.upsert({
          where: { appId_userId: { appId, userId: transaction.userId } },
          update: {
            planId: plan.id,
            status: 'active',
            startDate: new Date(),
            expiresAt: expiresAt
          },
          create: {
            appId,
            userId: transaction.userId,
            planId: plan.id,
            status: 'active',
            expiresAt: expiresAt
          }
        });
      }
    }

    // 4. Handle Affiliate Commission
    const subscribingUser = await tx.gGUser.findUnique({
      where: { id: transaction.userId },
      select: { referredById: true }
    });

    if (subscribingUser?.referredById && transaction.amount > 0) {
      const commissionAmount = transaction.amount * 0.20;
      await tx.referral.create({
        data: {
          referrerId: subscribingUser.referredById,
          referredUserId: transaction.userId,
          amount: commissionAmount,
          currency: transaction.currency || 'NPR',
          status: 'PENDING'
        }
      });
    }

    return { success: true, alreadyProcessed: false, transaction };
  });

  // Post-transaction tasks (Webhooks)
  if (result.success && !result.alreadyProcessed && result.transaction) {
    const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
    if (app && app.webhookUrl && app.webhookSecret) {
      // Fire webhook asynchronously
      import('./webhooks').then(({ dispatchWebhook }) => {
        dispatchWebhook(app.webhookUrl!, app.webhookSecret!, 'subscription.created', {
          transactionId: result.transaction!.id,
          userId: result.transaction!.userId,
          amount: result.transaction!.amount,
          planId: result.transaction!.planId,
          referenceId
        });
      });
    }
  }

  return result;
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

/**
 * Synchronizes all subscriptions in the platform.
 * Marks expired subscriptions as 'expired' and triggers revalidation.
 */
export async function syncAllSubscriptions() {
  const now = new Date();
  
  const expiredSubscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active',
      expiresAt: { lt: now }
    }
  });

  if (expiredSubscriptions.length === 0) {
    return { count: 0 };
  }

  const result = await prisma.subscription.updateMany({
    where: {
      id: { in: expiredSubscriptions.map((s: { id: string }) => s.id) }
    },
    data: {
      status: 'expired'
    }
  });

  return { count: result.count };
}
