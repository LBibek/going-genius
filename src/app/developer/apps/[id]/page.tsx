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
import { AppTabs } from '../../components/AppTabs';
import { Grid2Col } from '../../components/ResponsiveGrids';
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
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Link href="/developer" className="form-link-sm" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Back to Console
      </Link>

      <div className="flex-responsive" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {app.logoUrl ? (
            <img src={app.logoUrl} alt={app.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#000' }}>
              {app.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="fluid-h2" style={{ margin: 0 }}>{app.name}</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', wordBreak: 'break-all' }}>ID: {app.id}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className="id-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>Live</div>
          <div className="id-badge">OAuth 2.0</div>
        </div>
      </div>

      <AppTabs 
        overview={
          <>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Analytics</h2>
              <div style={{ height: '200px' }}>
                <AppChart data={chartData} />
              </div>
            </div>

            <Grid2Col>
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Social Preview</h2>
                  <Link href="/demo/auth" className="form-link-sm">Full Demo →</Link>
                </div>
                <AppLoginPreview app={app} />
              </div>

              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Agent Preview</h2>
                <AppBotPreview app={app} />
              </div>
            </Grid2Col>

            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Integration Guide</h2>
              <AppDocs app={app} />
            </div>
          </>
        }
        config={
          <Grid2Col>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>API Credentials</h2>
              <AppCredentials app={app} />
            </div>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Social Providers</h2>
              <AppSocialProviders app={app} />
            </div>
            <div className="glass-card" style={{ gridColumn: 'span 2' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>AI Agents Config</h2>
              <AppAIAgents app={app} />
            </div>
          </Grid2Col>
        }
        access={
          <Grid2Col>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Application Users</h2>
              <AppUserList appId={app.id} users={app.appUsers} />
            </div>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Invitations</h2>
              <AppInvites appId={app.id} invites={app.invites} />
            </div>
          </Grid2Col>
        }
        billing={
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Subscription Billing</h2>
            <AppBilling app={app} plans={app.plans} />
          </div>
        }
        settings={
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Settings</h2>
            <AppSettings app={app} />
          </div>
        }
      />
    </div>
  );
}
