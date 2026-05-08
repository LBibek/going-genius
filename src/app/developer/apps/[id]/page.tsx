import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { AppSettings } from '../../components/AppSettings';
import { AppUserList } from '../../components/AppUserList';
import { AppChart } from '../../components/AppChart';
import { AppCredentials } from '../../components/AppCredentials';
import { AppDocs } from '../../components/AppDocs';
import { AppInvites } from '../../components/AppInvites';
import { AppSocialProviders } from '../../components/AppSocialProviders';
import { AppAIAgents } from '../../components/AppAIAgents';
import { AppLoginPreview } from '../../components/AppLoginPreview';
import { AppBilling } from '../../components/AppBilling';
import { AppBotPreview } from '../../components/AppBotPreview';
import { getAppAnalytics } from '../../actions';

export default async function AppDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { id } = await params;

  const app = await prisma.oAuthApp.findUnique({
    where: { id },
    include: {
      appUsers: {
        where: { isActive: true },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
      invites: {
        where: { usedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' }
      },
      plans: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!app || app.ownerId !== session.userId) notFound();

  const chartData = await getAppAnalytics(id);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link href="/developer" className="form-link-sm" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Console
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {app.logoUrl ? (
            <img src={app.logoUrl} alt={app.name} style={{ width: '64px', height: '64px', borderRadius: '16px' }} />
          ) : (
            <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
              {app.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{app.name}</h1>
            <p style={{ color: 'var(--muted)' }}>Application ID: {app.id}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="id-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>Live</div>
          <div className="id-badge">OAuth 2.0</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Analytics</h2>
            <div style={{ height: '200px' }}>
              <AppChart data={chartData} />
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Social Connection Preview</h2>
              <Link href="/demo/auth" className="form-link-sm">View Full Demo →</Link>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              This is how your application's login screen will appear to your users. Configure social providers in the settings to enable one-click sign-in.
            </p>
            <AppLoginPreview app={app} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Agent Preview</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Test your application's integrated AI agent. This uses your configured API keys to simulate user interactions.
            </p>
            <AppBotPreview app={app} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Subscription Billing</h2>
            <AppBilling app={app} plans={app.plans} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Application Users</h2>
            <AppUserList appId={app.id} users={app.appUsers} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Developer Documentation</h2>
            <AppDocs app={app} />
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>API Credentials</h2>
            <AppCredentials app={app} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Social Providers</h2>
            <AppSocialProviders app={app} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>AI Agents Config</h2>
            <AppAIAgents app={app} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Invitations</h2>
            <AppInvites appId={app.id} invites={app.invites} />
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Settings</h2>
            <AppSettings app={app} />
          </div>

        </div>
      </div>
    </div>
  );
}
