import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { AdminStats } from './components/AdminStats';
import { AppList } from './components/AppList';
import { AppChart } from '../developer/components/AppChart';
import { 
  getGlobalPlatformStats, 
  getGlobalAnalytics, 
  getAllApps, 
  getRecentLeads 
} from './actions';
import { Grid2Col } from '../developer/components/ResponsiveGrids';
import { ShieldCheck, Activity, Users, FileText, BarChart2 } from 'lucide-react';

import { AdminTransactions } from './components/AdminTransactions';
import { AdminDashboardStyles } from './components/AdminDashboardStyles';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: { role: true }
  });

  if (!user || user.role !== 'ADMIN') notFound();

  const [stats, chartData, apps, recentLeads] = await Promise.all([
    getGlobalPlatformStats(),
    getGlobalAnalytics(),
    getAllApps(),
    getRecentLeads()
  ]);

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <AdminDashboardStyles />
      <div className="flex-responsive" style={{ marginBottom: '3rem', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={32} style={{ color: 'var(--primary)' }} />
            <h1 className="fluid-h2" style={{ margin: 0 }}>Super Admin Control</h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>Platform-wide monitoring, governance, and revenue analytics.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={18} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase' }}>System Health</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Optimal (99.9%)</div>
            </div>
          </div>
          <Link href="/admin/audit" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <FileText size={18} style={{ color: '#818cf8' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Audit Trail</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>View Logs</div>
              </div>
            </div>
          </Link>
          <Link href="/admin/reconciliation" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <BarChart2 size={18} style={{ color: '#22c55e' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Revenue</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Reconciliation</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <AdminStats stats={stats} />

      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Global Growth Trends</h2>
        <div style={{ height: '350px' }}>
          <AppChart data={chartData} />
        </div>
      </div>

      <Grid2Col>
        <AppList apps={apps} />
        
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Global Leads</h2>
            <div className="id-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>LIVE FEED</div>
          </div>
          <div className="leads-list">
            {recentLeads.map((lead: any) => (
              <div key={lead.id} className="lead-item">
                <div className="lead-avatar-sm">
                  {lead.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lead.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{new Date(lead.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    Interested in {lead.app.name} • {lead.email || 'No Email'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Grid2Col>

      <AdminTransactions />
    </div>
  );
}
