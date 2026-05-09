import { prisma } from '../prisma';

/**
 * Logs AI token usage for a specific application and user.
 * This is used for both billing and platform analytics.
 */
export async function logAiUsage({
  appId,
  userId,
  model,
  tokens,
  type = 'ai_tokens'
}: {
  appId: string;
  userId?: string;
  model: string;
  tokens: number;
  type?: string;
}) {
  try {
    // Estimated cost logic (could be moved to a configuration file)
    // 15% markup on average costs ($0.01 per 1k tokens for simple models)
    const costPerToken = 0.00001; 
    const markup = 1.15;
    const calculatedCost = tokens * costPerToken * markup;

    return await prisma.apiUsage.create({
      data: {
        appId,
        userId,
        model,
        type,
        quantity: tokens,
        cost: calculatedCost
      }
    });
  } catch (error) {
    console.error('[METERING] Failed to log AI usage:', error);
    // Non-blocking: we don't want to crash the AI response if logging fails
  }
}

/**
 * Returns the total AI usage cost for a specific app within a timeframe.
 */
export async function getAppUsageStats(appId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await prisma.apiUsage.aggregate({
    where: {
      appId,
      createdAt: { gte: startDate }
    },
    _sum: {
      quantity: true,
      cost: true
    }
  });
}
