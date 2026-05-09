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
}


