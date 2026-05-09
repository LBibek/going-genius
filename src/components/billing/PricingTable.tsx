/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { addToCart } from '@/app/actions/billing';
import { Check, Zap, Shield, Crown } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: any;
}

export function PricingTable({ appId, plans }: { appId: string, plans: Plan[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAddToCart = async (planId: string) => {
    setLoadingId(planId);
    try {
      await addToCart(appId, planId);
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart');
    } finally {
      setLoadingId(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--muted)' }}>No plans available for this application.</p>
      </div>
    );
  }

  return (
    <div className="grid-auto-fill" style={{ gap: '2rem' }}>
      {plans.map((plan) => {
        const isPremium = plan.price > 0;
        const features = Array.isArray(plan.features) ? plan.features : [];

        return (
          <div 
            key={plan.id} 
            className={`glass-card pricing-card ${isPremium ? 'premium-border' : ''} animate-fade-in`}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isPremium && (
              <div className="premium-badge">
                <Zap size={12} /> RECOMMENDED
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {plan.name}
                {isPremium ? <Crown size={18} style={{ color: 'var(--primary)' }} /> : <Shield size={18} style={{ color: 'var(--muted)' }} />}
              </h3>
              <p style={{ color: 'var(--muted-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {plan.description || `Perfect for testing and small projects.`}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                  {plan.currency === 'NPR' ? 'Rs.' : plan.currency} {plan.price}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '1rem' }}>/{plan.interval}</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {features.map((feature: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ 
                    marginTop: '2px',
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: isPremium ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Check size={12} style={{ color: isPremium ? 'var(--primary)' : 'var(--muted)' }} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={`btn-submit ${!isPremium ? 'btn-free' : ''}`}
              onClick={() => handleAddToCart(plan.id)}
              disabled={loadingId === plan.id}
              style={{ marginTop: 'auto' }}
            >
              {loadingId === plan.id ? (
                <div className="spinner" />
              ) : (
                isPremium ? 'Subscribe Now' : 'Get Started'
              )}
            </button>

            <style jsx>{`
              .pricing-card {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s;
              }
              .pricing-card:hover {
                transform: translateY(-8px);
              }
              .premium-border {
                border: 2px solid var(--primary);
                box-shadow: 0 0 30px var(--primary-glow);
              }
              .premium-badge {
                position: absolute;
                top: 1rem;
                right: -2rem;
                background: var(--primary);
                color: #000;
                font-size: 0.7rem;
                font-weight: 800;
                padding: 0.25rem 2.5rem;
                transform: rotate(45deg);
                letter-spacing: 0.05em;
              }
              .btn-free {
                background: var(--glass-hover);
                color: var(--foreground);
                border: 1px solid var(--border);
                box-shadow: none;
              }
              .btn-free:hover {
                background: rgba(255,255,255,0.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
