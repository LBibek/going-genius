import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PricingTable } from '@/components/billing/PricingTable';
import { CartSheet } from '@/components/billing/CartSheet';
import { getSession } from '@/lib/session';

export default async function BillingDemoPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getSession();
  
  const app = await prisma.oAuthApp.findUnique({
    where: { id },
    include: {
      plans: {
        where: { isActive: true },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!app) notFound();

  return (
    <div className="auth-layout">
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow" />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in">
          <div className="auth-logo">
            <div className="auth-logo-icon">GG</div>
            <span className="auth-logo-text">Billing Console</span>
          </div>
          <h1 className="auth-title fluid-h1" style={{ marginBottom: '1rem' }}>
            Choose Your <span style={{ color: 'var(--primary)' }}>Growth Plan</span>
          </h1>
          <p className="auth-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Scale your application with our flexible subscription tiers. Each plan is designed to provide maximum value as your user base grows.
          </p>
        </div>

        <PricingTable appId={id} plans={app.plans} />

        {session && <CartSheet appId={id} />}

        <div style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <p>Secure payments processed via Khalti & eSewa.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', opacity: 0.5 }}>
            {/* Payment logos placeholder */}
            <span>KHALTI</span>
            <span>ESEWA</span>
            <span>VISA</span>
            <span>MASTERCARD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
