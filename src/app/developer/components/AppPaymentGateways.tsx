'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAppPaymentProviders } from '@/app/actions/developer';
import { Save, ShieldCheck, CreditCard, Lock } from 'lucide-react';

export function AppPaymentGateways({ app }: { app: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    khaltiPublicKey: app.khaltiPublicKey || '',
    khaltiSecretKey: app.khaltiSecretKey || '',
    esewaMerchantId: app.esewaMerchantId || '',
    esewaSecretKey: app.esewaSecretKey || ''
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  if (!app.isPremium) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)' }}>
        <Lock size={32} style={{ color: 'var(--muted)', marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Premium Feature</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
          Upgrade to a Pro or Enterprise plan to enable native Khalti and eSewa payment integrations.
        </p>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Upgrade Now</button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateAppPaymentProviders(app.id, formData);
      if (result.success) {
        setMessage({ text: 'Payment gateway configurations saved.', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: result.message || 'Failed to save settings.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error communicating with server.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div className={`form-alert ${message.type}`} style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>All keys are stored securely and used only for transaction processing.</span>
      </div>

      {/* Khalti */}
      <div className="gateway-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="gateway-icon" style={{ background: '#5C2D91' }}>
             <CreditCard size={14} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block' }}>Khalti Payment Gateway</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Merchant API credentials for Nepal</span>
          </div>
        </div>
        <div className="grid-2-col">
          <div className="form-group">
            <label className="form-label-sm">Public Key (Live/Test)</label>
            <input 
              className="form-input" 
              style={{ fontSize: '0.75rem' }}
              placeholder="Live_public_key_..."
              value={formData.khaltiPublicKey}
              onChange={(e) => setFormData({...formData, khaltiPublicKey: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label-sm">Secret Key</label>
            <input 
              className="form-input" 
              style={{ fontSize: '0.75rem' }}
              type="password"
              placeholder="Live_secret_key_..."
              value={formData.khaltiSecretKey}
              onChange={(e) => setFormData({...formData, khaltiSecretKey: e.target.value})}
            />
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

      {/* eSewa */}
      <div className="gateway-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="gateway-icon" style={{ background: '#60bb46' }}>
             <CreditCard size={14} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block' }}>eSewa Payment Gateway</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Merchant configuration for Nepal</span>
          </div>
        </div>
        <div className="grid-2-col">
          <div className="form-group">
            <label className="form-label-sm">Merchant ID</label>
            <input 
              className="form-input" 
              style={{ fontSize: '0.75rem' }}
              placeholder="EPAYTEST"
              value={formData.esewaMerchantId}
              onChange={(e) => setFormData({...formData, esewaMerchantId: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label-sm">Secret Key</label>
            <input 
              className="form-input" 
              style={{ fontSize: '0.75rem' }}
              type="password"
              placeholder="8g9h7..."
              value={formData.esewaSecretKey}
              onChange={(e) => setFormData({...formData, esewaSecretKey: e.target.value})}
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="btn btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
      >
        <Save size={18} style={{ marginRight: '8px' }} />
        {isSaving ? 'Saving Configurations...' : 'Save Payment Gateways'}
      </button>

      <style jsx>{`
        .gateway-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
        .gateway-group { display: flex; flex-direction: column; }
        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-label-sm { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.4rem; display: block; }
        @media (max-width: 600px) {
          .grid-2-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
