/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAppKeys } from '../actions';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Zap, 
  Brain, 
  CreditCard,
  Save,
  Check
} from 'lucide-react';

export function AppAPIKeys({ app }: { app: any }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    openaiApiKey: app.openaiApiKey || '',
    geminiApiKey: app.geminiApiKey || '',
    khaltiPublicKey: app.khaltiPublicKey || '',
    khaltiSecretKey: app.khaltiSecretKey || '',
    esewaMerchantId: app.esewaMerchantId || '',
    esewaSecretKey: app.esewaSecretKey || ''
  });

  const toggleVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveAppKeys(app.id, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (error) {
      alert('Failed to save keys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="api-keys-container">
      <div className="key-section">
        <div className="section-header">
          <Brain className="section-icon ai-icon" size={20} />
          <div>
            <h3>AI Provider Keys</h3>
            <p>Credentials for Genkit-powered AI agents.</p>
          </div>
        </div>
        
        <div className="keys-grid">
          <div className="form-group">
            <label>OpenAI API Key</label>
            <div className="input-wrapper">
              <input 
                type={showKeys['openai'] ? 'text' : 'password'}
                value={formData.openaiApiKey}
                onChange={(e) => setFormData({...formData, openaiApiKey: e.target.value})}
                placeholder="sk-..."
              />
              <button type="button" onClick={() => toggleVisibility('openai')}>
                {showKeys['openai'] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Google Gemini Key</label>
            <div className="input-wrapper">
              <input 
                type={showKeys['gemini'] ? 'text' : 'password'}
                value={formData.geminiApiKey}
                onChange={(e) => setFormData({...formData, geminiApiKey: e.target.value})}
                placeholder="AIza..."
              />
              <button type="button" onClick={() => toggleVisibility('gemini')}>
                {showKeys['gemini'] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="key-section">
        <div className="section-header">
          <CreditCard className="section-icon payment-icon" size={20} />
          <div>
            <h3>Payment Gateway Credentials</h3>
            <p>Config for Khalti and eSewa multi-tenant billing.</p>
          </div>
        </div>

        <div className="keys-grid">
          <div className="form-group">
            <label>Khalti Public Key</label>
            <input 
              type="text"
              value={formData.khaltiPublicKey}
              onChange={(e) => setFormData({...formData, khaltiPublicKey: e.target.value})}
              placeholder="Live_Public_Key_..."
            />
          </div>
          <div className="form-group">
            <label>Khalti Secret Key</label>
            <div className="input-wrapper">
              <input 
                type={showKeys['khalti_secret'] ? 'text' : 'password'}
                value={formData.khaltiSecretKey}
                onChange={(e) => setFormData({...formData, khaltiSecretKey: e.target.value})}
                placeholder="Live_Secret_Key_..."
              />
              <button type="button" onClick={() => toggleVisibility('khalti_secret')}>
                {showKeys['khalti_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>eSewa Merchant ID</label>
            <input 
              type="text"
              value={formData.esewaMerchantId}
              onChange={(e) => setFormData({...formData, esewaMerchantId: e.target.value})}
              placeholder="EPAYTEST"
            />
          </div>
          <div className="form-group">
            <label>eSewa Secret Key</label>
            <div className="input-wrapper">
              <input 
                type={showKeys['esewa_secret'] ? 'text' : 'password'}
                value={formData.esewaSecretKey}
                onChange={(e) => setFormData({...formData, esewaSecretKey: e.target.value})}
                placeholder="8g7as7..."
              />
              <button type="button" onClick={() => toggleVisibility('esewa_secret')}>
                {showKeys['esewa_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="save-footer">
        <div className="security-note">
          <Lock size={14} />
          <span>Keys are encrypted at rest and never exposed to client-side bundles.</span>
        </div>
        <button type="submit" className="btn btn-primary save-btn" disabled={loading}>
          {loading ? <div className="spinner" /> : (saved ? <Check size={18} /> : <Save size={18} />)}
          {loading ? 'Saving...' : (saved ? 'Saved!' : 'Save Credentials')}
        </button>
      </div>

      <style jsx>{`
        .api-keys-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .key-section {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .section-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
        }
        .section-icon {
          padding: 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
        }
        .ai-icon { color: #818cf8; background: rgba(129, 140, 248, 0.1); }
        .payment-icon { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
        
        h3 { margin: 0; font-size: 1.1rem; }
        p { margin: 0.2rem 0 0; font-size: 0.85rem; color: var(--muted); }

        .keys-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label { font-size: 0.85rem; font-weight: 500; color: var(--muted); }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.6rem 2.5rem 0.6rem 0.8rem;
          color: var(--foreground);
          font-family: monospace;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        input:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(0,0,0,0.4);
        }

        .input-wrapper button {
          position: absolute;
          right: 0.5rem;
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          border-radius: 6px;
        }

        .input-wrapper button:hover {
          background: rgba(255,255,255,0.05);
          color: var(--foreground);
        }

        .save-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
        }

        .security-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .save-btn {
          min-width: 180px;
          height: 44px;
          gap: 0.75rem;
          font-weight: 600;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .keys-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
