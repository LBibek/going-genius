import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AppChart } from './components/AppChart';
import { ThemeToggle } from '@/components/ThemeToggle';

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

  // Analytics data for the chart (mocking some growth)
  const chartData = [
    { name: 'Mon', users: 12 },
    { name: 'Tue', users: 19 },
    { name: 'Wed', users: 15 },
    { name: 'Thu', users: 22 },
    { name: 'Fri', users: 30 },
    { name: 'Sat', users: 25 },
    { name: 'Sun', users: 40 },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Developer Console</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your applications and users</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <Link href="/dashboard" className="btn btn-outline" style={{ borderRadius: '12px', padding: '0.8rem 1.5rem' }}>
            Dashboard
          </Link>
          <Link href="/developer/apps/new" className="btn btn-primary" style={{ background: 'var(--primary)', color: '#fff', borderRadius: '12px', padding: '0.8rem 1.5rem' }}>
            + Create New App
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Total Apps</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{apps.length}</div>
        </div>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>User Activity (Last 7 Days)</h3>
          <div style={{ height: '100px' }}>
            <AppChart data={chartData} />
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Applications</h2>
      
      {apps.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3>No apps yet</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Create your first application to start using GGUser SSO.</p>
          <Link href="/developer/apps/new" className="btn btn-outline">Get Started</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {apps.map((app) => (
            <Link href={`/developer/apps/${app.id}`} key={app.id} className="glass-card" style={{ display: 'block', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                {app.logoUrl ? (
                  <img src={app.logoUrl} alt={app.name} style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {app.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <h3 style={{ margin: 0 }}>{app.name}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.9rem' }}>
                <span>{app._count.appUsers} active users</span>
                <span>{app.isActive ? 'Active' : 'Disabled'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
