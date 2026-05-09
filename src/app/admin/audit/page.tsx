import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { AuditLogTable } from './components/AuditLogTable';
import { ShieldCheck, FileText } from 'lucide-react';

export default async function AuditLogPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: { role: true }
  });
  if (!user || user.role !== 'ADMIN') notFound();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const actionCounts: Record<string, number> = {};
  logs.forEach((log: any) => {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
  });

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <FileText size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="fluid-h2" style={{ margin: 0 }}>Audit Trail</h1>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>
        Complete log of all administrative actions performed on the platform.
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {Object.entries(actionCounts).map(([action, count]) => (
          <div key={action} className="glass-card" style={{ padding: '1rem 1.5rem', minWidth: '160px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {action.replace(/_/g, ' ')}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{count}</div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="glass-card" style={{ padding: '1rem 1.5rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No audit events recorded yet.</div>
          </div>
        )}
      </div>

      <AuditLogTable logs={logs} />
    </div>
  );
}
