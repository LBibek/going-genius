/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';

async function verifyAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: { role: true }
  });
  if (!user || user.role !== 'ADMIN') throw new Error('Forbidden');
  return session;
}

export interface ReconciliationReport {
  period: string;
  totalTransactions: number;
  completedTransactions: number;
  refundedTransactions: number;
  failedTransactions: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  byGateway: Record<string, {
    count: number;
    gross: number;
    refunded: number;
    net: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    count: number;
    gross: number;
    net: number;
  }>;
  topApps: Array<{
    appId: string;
    appName: string;
    count: number;
    net: number;
  }>;
}

export async function getReconciliationReport(
  range: '7d' | '30d' | 'month' = '30d'
): Promise<ReconciliationReport> {
  await verifyAdmin();

  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;
  let periodLabel: string;

  if (range === '7d') {
    startDate = startOfDay(subDays(now, 7));
    periodLabel = 'Last 7 Days';
  } else if (range === 'month') {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
    periodLabel = format(now, 'MMMM yyyy');
  } else {
    startDate = startOfDay(subDays(now, 30));
    periodLabel = 'Last 30 Days';
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate }
    },
    include: {
      app: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Aggregate totals
  let grossRevenue = 0;
  let refundedAmount = 0;
  const byGateway: ReconciliationReport['byGateway'] = {};
  const byApp: Record<string, { appId: string; appName: string; count: number; net: number }> = {};
  const byDay: Record<string, { count: number; gross: number; net: number }> = {};

  for (const tx of transactions) {
    const amount = Number(tx.amount) || 0;
    const dateKey = format(new Date(tx.createdAt), 'yyyy-MM-dd');
    const gateway = (tx.gateway as string) || 'unknown';

    // Day bucketing
    if (!byDay[dateKey]) byDay[dateKey] = { count: 0, gross: 0, net: 0 };
    byDay[dateKey].count++;

    // Gateway bucketing
    if (!byGateway[gateway]) byGateway[gateway] = { count: 0, gross: 0, refunded: 0, net: 0 };
    byGateway[gateway].count++;

    if (tx.status === 'completed') {
      grossRevenue += amount;
      byGateway[gateway].gross += amount;
      byGateway[gateway].net += amount;
      byDay[dateKey].gross += amount;
      byDay[dateKey].net += amount;
    } else if (tx.status === 'refunded') {
      grossRevenue += amount;
      refundedAmount += amount;
      byGateway[gateway].gross += amount;
      byGateway[gateway].refunded += amount;
      byDay[dateKey].gross += amount;
    }

    // App bucketing (completed only)
    if (tx.status === 'completed' && tx.app) {
      const appKey = tx.app.id;
      if (!byApp[appKey]) byApp[appKey] = { appId: tx.app.id, appName: tx.app.name, count: 0, net: 0 };
      byApp[appKey].count++;
      byApp[appKey].net += amount;
    }
  }

  const completedCount = transactions.filter((t: { status: string }) => t.status === 'completed').length;
  const refundedCount = transactions.filter((t: { status: string }) => t.status === 'refunded').length;
  const failedCount = transactions.filter((t: { status: string }) => t.status === 'failed').length;

  const topApps = Object.values(byApp)
    .sort((a, b) => b.net - a.net)
    .slice(0, 10);

  const dailyBreakdown = Object.entries(byDay)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    period: periodLabel,
    totalTransactions: transactions.length,
    completedTransactions: completedCount,
    refundedTransactions: refundedCount,
    failedTransactions: failedCount,
    grossRevenue,
    refundedAmount,
    netRevenue: grossRevenue - refundedAmount,
    byGateway,
    dailyBreakdown,
    topApps,
  };
}
