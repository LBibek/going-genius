import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { logout } from '@/app/actions/auth';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserTabs } from './components/UserTabs';
import { Grid2Col, StatsRow } from '@/app/developer/components/ResponsiveGrids';
import { LogOut, User as UserIcon, Shield, ExternalLink, Calendar, Monitor, Activity, Key } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      emailVerified: true,
      phoneVerified: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { sessions: true } },
    },
  });

  if (!user) redirect('/auth/login');

  const joinedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(user.createdAt);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2rem 1rem' }}>
      <div className="container">

        {/* Header bar */}
        <nav className="flex-responsive" style={{ marginBottom: '3rem', alignItems: 'center' }}>
          <div className="dash-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="auth-logo-icon" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'var(--primary)', color: '#000', borderRadius: '12px' }}>GG</div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif', display: 'block' }}>Account</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Managing your Going Genius identity</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }} className="mobile-stack">
            <ThemeToggle />
            <form action={logout}>
              <button id="btn-logout" type="submit" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '12px' }}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </nav>

        <UserTabs
          overview={
            <>
              {/* Profile Hero */}
              <div className="glass-card flex-responsive animate-fade-in" style={{ gap: '2rem', alignItems: 'center', padding: '2rem' }}>
                <div className="dash-avatar" style={{ flexShrink: 0 }}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} style={{ width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800 }}>
                      {user.displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="dash-profile-info" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{user.displayName}</h1>
                    <span className={`role-badge role-${user.role.toLowerCase()}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{user.role}</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginTop: '0.25rem' }}>@{user.username}</p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <Link href="/dashboard/profile" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px' }}>
                      Edit Profile
                    </Link>
                    <Link href="/developer" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px' }}>
                      Developer Console
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <StatsRow>
                <div className="glass-card" style={{ flex: 1, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Member Since</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{joinedDate}</div>
                </div>
                <div className="glass-card" style={{ flex: 1, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    <Monitor size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Sessions</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user._count.sessions}</div>
                </div>
                <div className="glass-card" style={{ flex: 1, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                    <Activity size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Last Activity</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {user.lastLoginAt
                      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(user.lastLoginAt)
                      : 'Today'}
                  </div>
                </div>
              </StatsRow>
            </>
          }
          security={
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} /> Security & Access
              </h2>
              <div className="detail-row" style={{ padding: '1rem 0' }}>
                <div className="detail-info">
                  <span className="detail-label">Active Sessions</span>
                  <span className="detail-value">{user._count.sessions} currently active device(s)</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Revoke All</button>
              </div>
              <div className="detail-row" style={{ padding: '1rem 0' }}>
                <div className="detail-info">
                  <span className="detail-label">Password</span>
                  <span className="detail-value">Last updated 3 months ago</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Change</button>
              </div>
              <div className="detail-row" style={{ padding: '1rem 0', borderBottom: 'none' }}>
                <div className="detail-info">
                  <span className="detail-label">Two-Factor Authentication</span>
                  <span className="detail-value" style={{ color: 'var(--muted)' }}>Not enabled</span>
                </div>
                <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Setup</button>
              </div>
            </div>
          }
          account={
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Account Details</h2>
              <Grid2Col>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="detail-info">
                    <span className="detail-label">Email Address</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="detail-value">{user.email}</span>
                      <span className={`verify-badge ${user.emailVerified ? 'verified' : 'unverified'}`} style={{ fontSize: '0.7rem' }}>
                        {user.emailVerified ? '✓' : '⚠'}
                      </span>
                    </div>
                  </div>
                  <div className="detail-info">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{user.phone ?? 'Not provided'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="detail-info">
                    <span className="detail-label">User Identifier</span>
                    <code style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px', wordBreak: 'break-all' }}>
                      {user.id}
                    </code>
                  </div>
                  <div className="detail-info">
                    <span className="detail-label">Account Role</span>
                    <span className="detail-value">{user.role}</span>
                  </div>
                </div>
              </Grid2Col>
            </div>
          }
          integrations={
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} /> Developer Integrations
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Manage how other applications interact with your Going Genius account.
              </p>
              
              <div className="glass-card" style={{ background: 'rgba(0,0,0,0.1)', border: 'none', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🔗 OAuth 2.0 Endpoints</h3>
                <div className="oauth-endpoints" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <code className="oauth-endpoint" style={{ padding: '0.75rem', borderRadius: '8px' }}>GET /api/gg/authorize</code>
                  <code className="oauth-endpoint" style={{ padding: '0.75rem', borderRadius: '8px' }}>POST /api/gg/token</code>
                  <code className="oauth-endpoint" style={{ padding: '0.75rem', borderRadius: '8px' }}>GET /api/gg/userinfo</code>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Link href="/developer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Open Developer Console <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          }
        />

      </div>
    </main>
  );
}

