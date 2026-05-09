import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { getReconciliationReport } from './actions';
import { ReconciliationDashboard } from './components/ReconciliationDashboard';
import { BarChart2 } from 'lucide-react';

export const metadata = {
  title: 'Revenue Reconciliation | Admin',
  description: 'Compare platform revenue against payment gateway statements.',
};

export default async function ReconciliationPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: { role: true }
  });
  if (!user || user.role !== 'ADMIN') notFound();

  const initialReport = await getReconciliationReport('30d');

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <BarChart2 size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="fluid-h2" style={{ margin: 0 }}>Revenue Reconciliation</h1>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>
        Compare platform revenue against payment gateway statements. Export reports for accounting.
      </p>

      <ReconciliationDashboard initial={initialReport} />
    </div>
  );
}
