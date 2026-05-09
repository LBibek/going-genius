/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfDay, subDays, format } from 'date-fns';

export async function getAppAnalytics(appId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  // Verify ownership
  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId },
    select: { ownerId: true }
  });

  if (!app || app.ownerId !== session.userId) {
    throw new Error('Forbidden');
  }

  const days = 30;
  const startDate = subDays(startOfDay(new Date()), days);

  const [userStats, subStats, revenueStats] = await Promise.all([
    (prisma as any).appUser.groupBy({
      by: ['createdAt'],
      where: { appId, createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    }),
    (prisma as any).subscription.groupBy({
      by: ['createdAt'],
      where: { appId, createdAt: { gte: startDate }, status: 'active' },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    }),
    (prisma as any).transaction.groupBy({
      by: ['createdAt'],
      where: { appId, createdAt: { gte: startDate }, status: 'completed' },
      _sum: { amount: true },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const dailyData: Record<string, { users: number; subs: number; revenue: number }> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyData[dateStr] = { users: 0, subs: 0, revenue: 0 };
  }

  userStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].users += stat._count.id;
  });

  subStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].subs += stat._count.id;
  });

  revenueStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].revenue += stat._sum.amount || 0;
  });

  return Object.entries(dailyData)
    .map(([name, data]) => ({ name, ...data }))
    .reverse();
}

export async function getOverallAnalytics() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const days = 30;
  const startDate = subDays(startOfDay(new Date()), days);

  const [userStats, revenueStats] = await Promise.all([
    (prisma as any).appUser.groupBy({
      by: ['createdAt'],
      where: { app: { ownerId: session.userId }, createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    }),
    (prisma as any).transaction.groupBy({
      by: ['createdAt'],
      where: { app: { ownerId: session.userId }, createdAt: { gte: startDate }, status: 'completed' },
      _sum: { amount: true },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const dailyData: Record<string, { users: number; revenue: number }> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyData[dateStr] = { users: 0, revenue: 0 };
  }

  userStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].users += stat._count.id;
  });

  revenueStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].revenue += stat._sum.amount || 0;
  });

  return Object.entries(dailyData)
    .map(([name, data]) => ({ name, ...data }))
    .reverse();
}

export async function saveAppKeys(appId: string, keys: {
  openaiApiKey?: string;
  geminiApiKey?: string;
  anthropicApiKey?: string;
  deepseekApiKey?: string;
  khaltiPublicKey?: string;
  khaltiSecretKey?: string;
  esewaMerchantId?: string;
  esewaSecretKey?: string;
  webhookUrl?: string;
  webhookSecret?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  // Verify ownership
  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId },
    select: { ownerId: true }
  });

  if (!app || app.ownerId !== session.userId) {
    throw new Error('Forbidden');
  }

  return await prisma.oAuthApp.update({
    where: { id: appId },
    data: {
      ...keys
    }
  });
}export async function getAppUsageStats(appId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  // Verify ownership
  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId },
    select: { ownerId: true }
  });

  if (!app || app.ownerId !== session.userId) {
    throw new Error('Forbidden');
  }

  const days = 30;
  const startDate = subDays(startOfDay(new Date()), days);

  const usageData = await prisma.apiUsage.findMany({
    where: {
      appId,
      timestamp: { gte: startDate }
    },
    orderBy: { timestamp: 'asc' }
  });

  // Aggregate by day
  const dailyUsage: Record<string, { tokens: number; calls: number; cost: number }> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyUsage[dateStr] = { tokens: 0, calls: 0, cost: 0 };
  }

  usageData.forEach((record: any) => {
    const dateStr = format(record.timestamp, 'MMM dd');
    if (dailyUsage[dateStr]) {
      dailyUsage[dateStr].tokens += record.tokensUsed;
      dailyUsage[dateStr].calls += 1;
      dailyUsage[dateStr].cost += Number(record.cost);
    }
  });

  const chartData = Object.entries(dailyUsage)
    .map(([name, data]) => ({ name, ...data }))
    .reverse();

  const totalTokens = usageData.reduce((acc: number, curr: any) => acc + curr.tokensUsed, 0);
  const totalCalls = usageData.length;
  const totalCost = usageData.reduce((acc: number, curr: any) => acc + Number(curr.cost), 0);

  return {
    chartData,
    summary: {
      totalTokens,
      totalCalls,
      totalCost: totalCost.toFixed(4)
    }
  };
}

export async function simulateWebhook(appId: string, event: string, payload: any) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId }
  });

  if (!app || app.ownerId !== session.userId) {
    throw new Error('Forbidden');
  }

  if (!app.webhookUrl) {
    throw new Error('Webhook URL not configured');
  }

  const crypto = await import('crypto');
  const body = JSON.stringify({
    event,
    timestamp: new Date().toISOString(),
    payload
  });

  const signature = crypto
    .createHmac('sha256', app.webhookSecret || 'default')
    .update(body)
    .digest('hex');

  try {
    const res = await fetch(app.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GG-Signature': signature,
        'User-Agent': 'Going-Genius-Webhook-Simulator/1.0'
      },
      body
    });

    return {
      success: true,
      status: res.status,
      statusText: res.statusText,
      response: await res.text().catch(() => 'No response body')
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
