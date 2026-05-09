/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

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

export async function getAuditLogs(filters?: { action?: string; limit?: number }) {
  await verifyAdmin();

  return await prisma.auditLog.findMany({
    where: filters?.action ? { action: filters.action } : undefined,
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 50,
  });
}
