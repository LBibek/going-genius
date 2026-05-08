import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CreditCard, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import Link from 'next/link';

export default async function SubscriptionsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.userId },
    include: {
      app: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="h1" style={{ marginBottom: '0.5rem' }}>Your Subscriptions</h1>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Manage your active plans and billing history across the Going Genius ecosystem.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ background: 'var(--primary-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 1.5rem' }}>
            <CreditCard size={32} color="var(--primary)" />
          </div>
          <h3 className="h3">No active subscriptions</h3>
          <p className="text-muted" style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
            You haven't subscribed to any premium apps yet.
          </p>
          <Link href="/developer/apps" className="btn btn-primary">
            Explore Apps
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {subscriptions.map((sub) => (
            <div key={sub.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                padding: '0.5rem 1rem', 
                background: sub.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: sub.status === 'active' ? '#10b981' : '#ef4444',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderBottomLeftRadius: '12px'
              }}>
                {sub.status}
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: 'var(--border)' }}>
                    <OptimizedImage 
                      src={sub.app.logoUrl || '/images/app-placeholder.png'} 
                      alt={sub.app.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{sub.app.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                      <ShieldCheck size={12} />
                      {sub.plan.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span className="text-muted">Price</span>
                    <span style={{ fontWeight: 600 }}>NPR {sub.plan.price}/{sub.plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span className="text-muted">Next Billing</span>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}>
                    Manage
                  </button>
                  <Link 
                    href={`/demo/billing/${sub.appId}`} 
                    className="btn btn-primary" 
                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
                  >
                    <ExternalLink size={12} style={{ marginRight: '4px' }} />
                    View App
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .h1 { font-family: var(--font-outfit); font-weight: 800; letter-spacing: -0.03em; }
        .h3 { font-family: var(--font-outfit); font-weight: 700; }
      `}</style>
    </div>
  );
}
