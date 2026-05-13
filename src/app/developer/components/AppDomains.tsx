'use client';

import { useState } from 'react';
import { Globe, ShieldCheck, AlertCircle, ExternalLink, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';

export function AppDomains({ app }: { app: any }) {
  const [domain, setDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const verifyDomain = () => {
    setIsVerifying(true);
    setTimeout(() => setIsVerifying(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Globe className="text-primary" /> Custom Domain Support
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: '600px' }}>
          White-label your application by mapping your own domain or subdomain to the GG-hosted developer console and user views.
        </p>
      </div>

      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
        <div className="setup-flow">
          <div className="setup-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Specify your domain</h3>
              <p>Enter the domain or subdomain you want to use (e.g., auth.yourcompany.com).</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="auth.example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000' }}>
                  Add Domain
                </button>
              </div>
            </div>
          </div>

          <div className="setup-step" style={{ opacity: domain ? 1 : 0.5 }}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Configure DNS Records</h3>
              <p>Log in to your DNS provider (e.g., Cloudflare, GoDaddy) and add the following record:</p>
              
              <div className="dns-record-card">
                <div className="dns-row">
                  <span className="dns-label">Type</span>
                  <span className="dns-value">CNAME</span>
                </div>
                <div className="dns-row">
                  <span className="dns-label">Name</span>
                  <span className="dns-value">{domain.split('.')[0] || 'auth'}</span>
                  <button className="copy-btn" onClick={() => copyToClipboard(domain.split('.')[0] || 'auth', 'name')}>
                    {copied === 'name' ? <CheckCircle2 size={14} color="#4ade80" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="dns-row">
                  <span className="dns-label">Value</span>
                  <span className="dns-value">cname.going-genius.com</span>
                  <button className="copy-btn" onClick={() => copyToClipboard('cname.going-genius.com', 'value')}>
                    {copied === 'value' ? <CheckCircle2 size={14} color="#4ade80" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="setup-step" style={{ opacity: domain ? 1 : 0.5 }}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Verify & Propagate</h3>
              <p>Once you've added the record, click verify. Note that DNS changes can take up to 24 hours to propagate.</p>
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={verifyDomain}
                disabled={isVerifying}
              >
                {isVerifying ? <RefreshCw className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                Verify Configuration
              </button>
            </div>
          </div>
        </div>

        <div className="domain-status-panel">
          <div className="glass-card status-box">
            <h4>Current Status</h4>
            <div className="status-indicator">
              <div className="status-dot status-inactive" />
              <span>No domain connected</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1.5rem 0' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertCircle size={14} /> SSL certificates are automatically generated upon verification.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={14} /> <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Read the custom domain guide</a>
              </div>
            </div>
          </div>

          {app.isPremium && (
            <div className="pro-feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={16} color="#FFB116" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFB116' }}>PREMIUM FEATURE</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Your Enterprise plan includes support for up to 5 custom domains and edge-cached auth pages.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .setup-flow {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
        }

        .setup-flow::after {
          content: '';
          position: absolute;
          left: 17px;
          top: 40px;
          bottom: 40px;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary), rgba(255,255,255,0.05));
          z-index: 0;
        }

        .setup-step {
          display: flex;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .step-number {
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .step-content h3 {
          font-size: 1.1rem;
          margin: 0 0 0.5rem;
          font-weight: 700;
        }

        .step-content p {
          color: var(--muted);
          font-size: 0.9rem;
          margin: 0;
        }

        .dns-record-card {
          margin-top: 1.5rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .dns-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
        }

        .dns-label {
          color: var(--muted);
          width: 60px;
          font-weight: 500;
        }

        .dns-value {
          font-family: monospace;
          background: rgba(255,255,255,0.05);
          padding: 4px 8px;
          border-radius: 6px;
          color: #4ade80;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .status-box {
          padding: 1.5rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .status-box h4 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-inactive {
          background: #71717a;
          box-shadow: 0 0 8px #71717a;
        }

        .pro-feature-card {
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(255, 177, 22, 0.05), rgba(255, 140, 0, 0.05));
          border: 1px solid rgba(255, 177, 22, 0.2);
          border-radius: 12px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
