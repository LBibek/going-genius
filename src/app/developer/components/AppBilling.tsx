'use client';

import { useState } from 'react';
import { createAppSubscriptionPlan, deleteAppSubscriptionPlan } from '@/app/actions/developer';
import { CreditCard, Plus, Trash2, CheckCircle, Package, DollarSign } from 'lucide-react';

export function AppBilling({ app, plans }: { app: any, plans: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    interval: 'monthly',
    features: ''
  });
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '');
    
    await createAppSubscriptionPlan(app.id, {
      ...formData,
      features: featuresArray
    });

    setIsAdding(false);
    setFormData({ name: '', description: '', price: 0, interval: 'monthly', features: '' });
    setIsPending(false);
  };

  const handleDelete = async (planId: string) => {
    if (confirm('Delete this plan? Existing subscribers will remain on this plan until it expires.')) {
      await deleteAppSubscriptionPlan(app.id, planId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
          Manage your recurring revenue models and feature gating tiers.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={`/demo/billing/${app.id}`} target="_blank" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
             View Public Page ↗
          </a>
          {!isAdding && (
            <button className="btn btn-primary" onClick={() => setIsAdding(true)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Create Plan
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: '1.25rem', border: '1px solid var(--primary)', background: 'rgba(255, 177, 22, 0.03)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>New Subscription Plan</h3>
          
          <div className="grid-2-col" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Plan Name</label>
              <input 
                className="form-input" 
                placeholder="e.g. Pro Plan" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (NPR)</label>
              <div className="input-icon-wrapper">
                <span className="input-prefix" style={{ left: '0.75rem', fontSize: '0.8rem' }}>Rs.</span>
                <input 
                  type="number"
                  className="form-input prefix-input" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Interval</label>
            <select 
              className="form-input"
              value={formData.interval}
              onChange={(e) => setFormData({...formData, interval: e.target.value})}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Features (One per line)</label>
            <textarea 
              className="form-input" 
              rows={3}
              placeholder="Cloud storage&#10;Priority support&#10;Unlimited apps"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? 'Creating...' : 'Save Plan'}
            </button>
          </div>
        </form>
      )}

      <div className="plans-grid">
        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <Package size={32} style={{ color: 'var(--muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No subscription plans defined yet.</p>
          </div>
        ) : (
          plans.map((plan: any) => (
            <div key={plan.id} className="plan-card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{plan.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0.25rem 0' }}>
                    Rs. {plan.price} <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 400 }}>/ {plan.interval}</span>
                  </p>
                </div>
                <button className="btn-icon-danger" onClick={() => handleDelete(plan.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-light)' }}>
                    <CheckCircle size={12} style={{ color: '#6ee7b7' }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="billing-docs glass-card" style={{ background: 'rgba(110, 231, 183, 0.03)', borderColor: 'rgba(110, 231, 183, 0.1)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
          <CreditCard size={16} /> Subscription Integration
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-light)', lineHeight: 1.5 }}>
          GGUser handles the payment state and user tiering automatically. You can check a user's subscription status via the User Info API or by using our drop-in React components.
        </p>
        <div style={{ background: '#000', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem' }}>
          {`// Gate access in your app\nif (user.subscription?.plan === 'Pro Plan') {\n  return <PremiumFeature />;\n}`}
        </div>
      </div>

      <style jsx>{`
        .plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .plan-card { padding: 1.25rem; border: 1px solid var(--border); transition: border-color 0.2s; }
        .plan-card:hover { border-color: var(--primary); }
        .btn-icon-danger { background: transparent; border: none; color: #fca5a5; cursor: pointer; padding: 4px; border-radius: 4px; }
        .btn-icon-danger:hover { background: rgba(239, 68, 68, 0.1); }
      `}</style>
    </div>
  );
}
