import { prisma } from './prisma';

export class UsageMonitor {
  /**
   * Tracks AI token usage for a specific app and user.
   */
  static async trackAiTokens(params: {
    appId: string;
    userId?: string;
    model: string;
    tokens: number;
  }) {
    const { appId, userId, model, tokens } = params;
    
    // Simple cost calculation (can be made more complex)
    // 0.0001 NPR per token as a placeholder
    const cost = tokens * 0.0001;

    try {
      await prisma.apiUsage.create({
        data: {
          appId,
          userId,
          type: 'ai_tokens',
          model,
          quantity: tokens,
          cost
        }
      });
    } catch (err) {
      console.error('[USAGE MONITOR] Error tracking tokens:', err);
    }
  }

  /**
   * Gets aggregated usage for an app.
   */
  static async getAppUsage(appId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const usage = await prisma.apiUsage.groupBy({
      by: ['type'],
      where: {
        appId,
        createdAt: { gte: since }
      },
      _sum: {
        quantity: true,
        cost: true
      }
    });

    return usage;
  }
}
