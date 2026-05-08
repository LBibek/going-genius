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

  const stats = await (prisma as any).appUser.groupBy({
    by: ['createdAt'],
    where: {
      appId,
      createdAt: { gte: startDate }
    },
    _count: {
      id: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Process data into daily buckets
  const dailyData: Record<string, number> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyData[dateStr] = 0;
  }

  stats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr] += stat._count.id;
    }
  });

  return Object.entries(dailyData)
    .map(([name, users]) => ({ name, users }))
    .reverse();
}

export async function getOverallAnalytics() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const days = 30;
  const startDate = subDays(startOfDay(new Date()), days);

  const stats = await (prisma as any).appUser.groupBy({
    by: ['createdAt'],
    where: {
      app: { ownerId: session.userId },
      createdAt: { gte: startDate }
    },
    _count: {
      id: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const dailyData: Record<string, number> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyData[dateStr] = 0;
  }

  stats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr] += stat._count.id;
    }
  });

  return Object.entries(dailyData)
    .map(([name, users]) => ({ name, users }))
    .reverse();
}
