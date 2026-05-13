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
import { AppAPIKeys } from '../../components/AppAPIKeys';
import { AppAIAgents } from '../../components/AppAIAgents';
import { AppLoginPreview } from '../../components/AppLoginPreview';
import { AppBilling } from '../../components/AppBilling';
import { AppUsage } from '../../components/AppUsage';
import { AppBotPreview } from '../../components/AppBotPreview';
import { AppTabs } from '../../components/AppTabs';
import { AppAIPlayground } from '../../components/AppAIPlayground';
import { Grid2Col } from '../../components/ResponsiveGrids';
import { getAppAnalytics } from '../../actions';
import { AppPaymentGateways } from '../../components/AppPaymentGateways';
import { AppIntegrations } from '../../components/AppIntegrations';
import { AppWebhookSimulator } from '../../components/AppWebhookSimulator';
import { OptimizedImage } from '@/components/OptimizedImage';
import { AppDomains } from '../../components/AppDomains';

import { AppLeads } from '../../components/AppLeads';
import { AppPrompts } from '../../components/AppPrompts';

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
      },
      leads: {
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
          <OptimizedImage 
            src={app.logoUrl || '/images/app-placeholder.png'} 
            alt={app.name} 
            width={56} 
            height={56} 
            style={{ borderRadius: '14px', objectFit: 'cover' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 className="fluid-h2" style={{ margin: 0 }}>{app.name}</h1>
              {app.isPremium && (
                <div className="id-badge" style={{ background: 'linear-gradient(135deg, #FFB116, #FF8C00)', color: '#000', fontWeight: 900 }}>PRO</div>
              )}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', wordBreak: 'break-all' }}>ID: {app.id}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className="id-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>Live</div>
          <div className="id-badge">OAuth 2.0</div>
        </div>
      </div>

      <AppTabs 
        isPremium={app.isPremium}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Agent Preview</h2>
                  {!app.isPremium && <span className="id-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>PREMIUM</span>}
                </div>
                <AppBotPreview app={app} />
              </div>
            </Grid2Col>

            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Integration Guide</h2>
              <AppDocs app={app} />
            </div>
          </>
        }
        usage={<AppUsage appId={app.id} />}
        config={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Grid2Col>
              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Core OAuth Credentials</h2>
                <AppCredentials app={app} />
              </div>
              <div className="glass-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Social Providers</h2>
                <AppSocialProviders app={app} />
              </div>
            </Grid2Col>
            
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>API & Provider Credentials</h2>
                {!app.isPremium && <span className="id-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>PRO FEATURE</span>}
              </div>
              <AppAPIKeys app={app} />
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Agents Config</h2>
                {!app.isPremium && <span className="id-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>PRO FEATURE</span>}
              </div>
              <AppAIAgents app={app} />
            </div>
          </div>
        }
        integrations={<AppIntegrations app={app} />}
        leads={<AppLeads appId={app.id} leads={app.leads} />}
        simulator={
          <div className="glass-card">
            <AppWebhookSimulator app={app} />
          </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Payment Gateways</h2>
                {!app.isPremium && <span className="id-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>PRO FEATURE</span>}
              </div>
              <AppPaymentGateways app={app} />
            </div>
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Subscription Plans</h2>
              <AppBilling app={app} plans={app.plans} />
            </div>
          </div>
        }
        settings={
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Settings</h2>
            <AppSettings app={app} />
          </div>
        }
        playground={
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>AI Agent Playground</h2>
              {!app.isPremium && <span className="id-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>PRO FEATURE</span>}
            </div>
            <AppAIPlayground app={app} />
          </div>
        }
        prompts={<AppPrompts app={app} />}
        domains={<AppDomains app={app} />}
      />
    </div>
  );
}
