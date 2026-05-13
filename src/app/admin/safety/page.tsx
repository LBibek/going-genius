import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { SafetyDashboardClient } from './components/SafetyDashboardClient';

export default async function SafetyDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const apps = await prisma.oAuthApp.findMany({
    include: { owner: true },
    orderBy: { riskScore: 'desc' }
  });

  return <SafetyDashboardClient apps={apps} />;
}
