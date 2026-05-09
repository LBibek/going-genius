/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfDay, subDays, format } from 'date-fns';

/**
 * Verifies if the current user is a Super Admin.
 */
async function verifyAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: { role: true }
  });

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Super Admin access required');
  }
  return session;
}

/**
 * Fetches global platform statistics.
 */
export async function getGlobalPlatformStats() {
  await verifyAdmin();

  const [totalUsers, totalApps, totalRevenue, totalLeads, activeSubs] = await Promise.all([
    prisma.gGUser.count(),
    prisma.oAuthApp.count(),
    prisma.transaction.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    }),
    prisma.lead.count(),
    prisma.subscription.count({ where: { status: 'active' } })
  ]);

  return {
    totalUsers,
    totalApps,
    totalRevenue: totalRevenue._sum.amount || 0,
    platformProfit: (totalRevenue._sum.amount || 0) * 0.025, // 2.5% Platform Fee
    totalLeads,
    activeSubs
  };
}

/**
 * Fetches global growth analytics for the platform.
 */
export async function getGlobalAnalytics() {
  await verifyAdmin();

  const days = 30;
  const startDate = subDays(startOfDay(new Date()), days);

  const [userStats, revenueStats, leadStats] = await Promise.all([
    (prisma as any).gGUser.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    }),
    (prisma as any).transaction.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate }, status: 'completed' },
      _sum: { amount: true },
      orderBy: { createdAt: 'asc' }
    }),
    (prisma as any).lead.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const dailyData: Record<string, { users: number; revenue: number; leads: number }> = {};
  for (let i = 0; i <= days; i++) {
    const dateStr = format(subDays(new Date(), i), 'MMM dd');
    dailyData[dateStr] = { users: 0, revenue: 0, leads: 0 };
  }

  userStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].users += stat._count.id;
  });

  revenueStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].revenue += stat._sum.amount || 0;
  });

  leadStats.forEach((stat: any) => {
    const dateStr = format(stat.createdAt, 'MMM dd');
    if (dailyData[dateStr]) dailyData[dateStr].leads += stat._count.id;
  });

  return Object.entries(dailyData)
    .map(([name, data]) => ({ name, ...data }))
    .reverse();
}

/**
 * Lists all applications on the platform with their usage and ownership details.
 */
export async function getAllApps() {
  await verifyAdmin();

  return await prisma.oAuthApp.findMany({
    include: {
      owner: { select: { id: true, displayName: true, email: true } },
      _count: { select: { appUsers: true, leads: true, apiUsages: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Fetches recent leads across all applications.
 */
export async function getRecentLeads() {
  await verifyAdmin();

  return await prisma.lead.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      app: { select: { name: true } }
    }
  });
}
