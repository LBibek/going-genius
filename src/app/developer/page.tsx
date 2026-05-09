import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AppChart } from './components/AppChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getOverallAnalytics } from './actions';
import { StatsRow, AppsGrid, DashboardStyles, Grid2Col } from './components/ResponsiveGrids';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Activity, Shield, Cpu, Sparkles } from 'lucide-react';

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

  // Simple latency check
  const start = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  const dbLatency = Math.round(performance.now() - start);

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
          <div className="glass-card stat-card" style={{ flex: 1 }}>
            <div className="stat-label">System Health</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Cpu size={12}/> DB Latency</span>
                <span style={{ color: dbLatency < 50 ? '#4ade80' : '#fbbf24', fontWeight: 600 }}>{dbLatency}ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Activity size={12}/> Edge API</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Shield size={12}/> Auth Layer</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>Secured</span>
              </div>
            </div>
          </div>
        </StatsRow>

        {apps.length > 0 && !apps.some((a: any) => a.isPremium) && (
          <div className="glass-card premium-banner" style={{ marginBottom: '2.5rem', background: 'linear-gradient(90deg, rgba(255, 177, 22, 0.1), rgba(255, 140, 0, 0.1))', border: '1px solid rgba(255, 177, 22, 0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FFB116', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} /> Unlock Premium Capabilities
                </h3>
                <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', maxWidth: '600px' }}>
                  Get access to AI Agent Orchestration, Multi-tenant Billing, Khalti/eSewa integrations, and priority support.
                </p>
              </div>
              <Link href="/#pricing" className="btn btn-primary" style={{ background: '#FFB116', color: '#000', fontWeight: 700, borderRadius: '12px' }}>
                Upgrade Now
              </Link>
            </div>
            <div style={{ position: 'absolute', right: '-50px', top: '-50px', opacity: 0.1 }}>
              <Sparkles size={200} />
            </div>
          </div>
        )}

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
              <Link href={`/developer/apps/${app.id}`} key={app.id} className="app-card" style={{ position: 'relative' }}>
                <div className="app-card-content">
                  <div className="app-logo-wrapper">
                    <OptimizedImage 
                      src={app.logoUrl || '/images/app-placeholder.png'} 
                      alt={app.name} 
                      width={48} 
                      height={48} 
                      className="app-logo-img" 
                    />
                  </div>
                  <div className="app-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 className="app-name">{app.name}</h3>
                      {app.isPremium && (
                        <div className="id-badge" style={{ padding: '2px 6px', fontSize: '10px', background: 'linear-gradient(135deg, #FFB116, #FF8C00)', color: '#000', fontWeight: 900 }}>PRO</div>
                      )}
                    </div>
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

        <div style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Ecosystem Resources</h2>
          </div>
          <Grid2Col>
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#3b82f6' }}>
                <Cpu size={20} className="mx-auto" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>GG-SDK (React Alpha)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Drop-in components and hooks to integrate authentication, billing, and feature gating in minutes.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href="/demo/wordpress" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                  View Demo
                </Link>
                <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: '8px', color: '#4ade80' }}>
                  npm install @going-genius/react
                </code>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#a855f7' }}>
                <Activity size={20} className="mx-auto" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Universal Wallet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                The centralized hub for your users to manage subscriptions across all apps in the GG ecosystem.
              </p>
              <Link href="/dashboard/subscriptions" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                Manage My Wallet
              </Link>
            </div>
          </Grid2Col>
        </div>
      </DashboardStyles>
    </div>
  );
}
