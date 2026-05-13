import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { EnterpriseGovernanceClient } from './components/EnterpriseGovernanceClient';

export default async function EnterpriseDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  // Fetch users with active subscriptions to analyze churn
  const activeSubscribers = await prisma.gGUser.findMany({
    where: {
      subscriptions: { some: { status: 'ACTIVE' } }
    },
    include: {
      subscriptions: true,
      sessions: { take: 1, orderBy: { createdAt: 'desc' } }
    },
    take: 5
  });

  return <EnterpriseGovernanceClient activeSubscribers={activeSubscribers} />;
}
