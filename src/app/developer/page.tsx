import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AppChart } from './components/AppChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getOverallAnalytics } from './actions';
import { StatsRow, AppsGrid, DashboardStyles } from './components/ResponsiveGrids';

export default async function DeveloperDashboard() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const apps = await prisma.oAuthApp.findMany({
    where: { ownerId: session.userId },
    include: {
      _count: {
        select: { appUsers: { where: { isActive: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const chartData = await getOverallAnalytics();

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="flex-responsive" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Developer Console</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your applications and users</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <ThemeToggle />
          <Link href="/dashboard" className="btn btn-outline" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem' }}>
            Dashboard
          </Link>
          <Link href="/developer/apps/new" className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000', borderRadius: '12px', padding: '0.6rem 1.2rem' }}>
            + Create New App
          </Link>
        </div>
      </div>

      <DashboardStyles>
        <StatsRow>
          <div className="glass-card stat-card">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{apps.length}</div>
          </div>
          <div className="glass-card stat-card" style={{ flex: 2 }}>
            <div className="stat-label">User Activity (Last 7 Days)</div>
            <div style={{ height: '80px', marginTop: '0.5rem' }}>
              <AppChart data={chartData} />
            </div>
          </div>
        </StatsRow>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Your Applications</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{apps.length} total</div>
        </div>
        
        {apps.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div className="empty-state-icon">🚀</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to launch?</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Create your first application to start using GGUser's secure authentication and billing features.
            </p>
            <Link href="/developer/apps/new" className="btn btn-primary">Create Your First App</Link>
          </div>
        ) : (
          <AppsGrid>
            {apps.map((app: any) => (
              <Link href={`/developer/apps/${app.id}`} key={app.id} className="app-card">
                <div className="app-card-content">
                  <div className="app-logo-wrapper">
                    {app.logoUrl ? (
                      <img src={app.logoUrl} alt={app.name} className="app-logo-img" />
                    ) : (
                      <div className="app-logo-placeholder">
                        {app.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="app-info">
                    <h3 className="app-name">{app.name}</h3>
                    <div className="app-meta">
                      <span>{app._count.appUsers} Users</span>
                      <span className="dot" />
                      <span className={app.isActive ? 'status-active' : 'status-inactive'}>
                        {app.isActive ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="app-card-arrow">→</div>
              </Link>
            ))}
          </AppsGrid>
        )}
      </DashboardStyles>
    </div>
  );
}
