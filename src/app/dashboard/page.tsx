import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { logout } from '@/app/actions/auth';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

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
        <nav className="flex-responsive" style={{ marginBottom: '2.5rem' }}>
          <div className="dash-nav-brand">
            <div className="auth-logo-icon" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>GG</div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>GGUser</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }} className="mobile-stack">
            <ThemeToggle />
            <form action={logout} style={{ width: '100%' }}>
              <button id="btn-logout" type="submit" className="btn btn-outline" style={{ width: '100%', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                Sign out
              </button>
            </form>
          </div>
        </nav>

        {/* Profile Card */}
        <div className="glass-card flex-responsive animate-fade-in" style={{ gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
          <div className="dash-avatar" style={{ margin: '0 auto' }}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="dash-avatar-img" />
            ) : (
              <div className="dash-avatar-placeholder">
                {user.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="dash-profile-info" style={{ flex: 1, textAlign: 'inherit' }}>
            <h1 className="dash-display-name" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>{user.displayName}</h1>
            <p className="dash-username">@{user.username}</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }} className="flex-responsive">
              <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
              <Link href="/dashboard/profile" className="form-link-sm" style={{ textDecoration: 'none' }}>
                ✎ Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid-auto-fill" style={{ marginTop: '1.5rem' }}>
          <div className="glass-card dash-stat">
            <p className="dash-stat-label">Member since</p>
            <p className="dash-stat-value">{joinedDate}</p>
          </div>
          <div className="glass-card dash-stat">
            <p className="dash-stat-label">Active sessions</p>
            <p className="dash-stat-value">{user._count.sessions}</p>
          </div>
          <div className="glass-card dash-stat">
            <p className="dash-stat-label">Last sign-in</p>
            <p className="dash-stat-value">
              {user.lastLoginAt
                ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(user.lastLoginAt)
                : 'Just now'}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Account Details</h2>

          <div className="detail-row">
            <div className="detail-info">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <span className={`verify-badge ${user.emailVerified ? 'verified' : 'unverified'}`}>
              {user.emailVerified ? '✓ Verified' : '⚠ Unverified'}
            </span>
          </div>

          <div className="detail-row">
            <div className="detail-info">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{user.phone ?? 'Not added'}</span>
            </div>
            {user.phone && (
              <span className={`verify-badge ${user.phoneVerified ? 'verified' : 'unverified'}`}>
                {user.phoneVerified ? '✓ Verified' : '⚠ Unverified'}
              </span>
            )}
          </div>

          <div className="detail-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="detail-info">
              <span className="detail-label">User ID</span>
              <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.6 }}>
                {user.id}
              </span>
            </div>
          </div>
        </div>

        {/* OAuth Integration Card */}
        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>🔗 Cross-App Sign-In</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Use your GGUser account to sign into any Going Genius app. Other apps connect via the OAuth 2.0 API.
          </p>
          <div className="oauth-endpoints">
            <code className="oauth-endpoint">GET /api/gg/authorize</code>
            <code className="oauth-endpoint">POST /api/gg/token</code>
            <code className="oauth-endpoint">GET /api/gg/userinfo</code>
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/developer" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Go to Developer Console →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
