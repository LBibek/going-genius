'use server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function exportTransactionsToCsv() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  // Fetch apps owned by this user
  const apps = await prisma.oAuthApp.findMany({
    where: { ownerId: session.userId },
    select: { id: true, name: true }
  });

  const appMap = new Map(apps.map(app => [app.id, app.name]));
  const appIds = Array.from(appMap.keys());

  const transactions = await prisma.transaction.findMany({
    where: { appId: { in: appIds } },
    orderBy: { createdAt: 'desc' },
    include: { plan: true }
  });

  // Generate CSV string
  const header = ['Transaction ID', 'App Name', 'Plan', 'Amount', 'Currency', 'Status', 'Gateway', 'Date'];
  
  const rows = transactions.map(t => [
    t.id,
    appMap.get(t.appId) || 'Unknown App',
    t.plan?.name || 'Custom',
    t.amount.toString(),
    t.currency,
    t.status,
    t.provider,
    t.createdAt.toISOString()
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}
