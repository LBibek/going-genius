/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { regenerateClientSecret } from '@/app/actions/developer';
import { Copy, RefreshCw, Eye, EyeOff, Check } from 'lucide-react';

export function AppCredentials({ app }: { app: any }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const router = useRouter();

  const handleRegenerate = async () => {
    if (!confirm('Are you sure? Previous secrets will stop working immediately.')) return;
    setIsRegenerating(true);
    await regenerateClientSecret(app.id);
    setIsRegenerating(false);
    setShowSecret(true);
    router.refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">
        <label className="detail-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Client ID
          {copiedId && <span style={{ color: 'var(--success)', fontSize: '0.7rem' }}>Copied!</span>}
        </label>
        <div className="input-icon-wrapper">
          <div className="oauth-endpoint" style={{ width: '100%', fontSize: '0.8rem', paddingRight: '2.5rem' }}>
            {app.clientId}
          </div>
          <button 
            className="input-icon-btn" 
            onClick={() => copyToClipboard(app.clientId, setCopiedId)}
            title="Copy Client ID"
          >
            {copiedId ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="detail-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Client Secret
          {copiedSecret && <span style={{ color: 'var(--success)', fontSize: '0.7rem' }}>Copied!</span>}
        </label>
        <div className="input-icon-wrapper">
          <div className="oauth-endpoint" style={{ 
            width: '100%', 
            fontSize: '0.8rem', 
            paddingRight: '4.5rem',
            background: showSecret ? 'rgba(255,255,255,0.02)' : 'rgba(239, 68, 68, 0.05)',
            color: showSecret ? 'inherit' : '#fca5a5'
          }}>
            {showSecret ? app.clientSecret : '••••••••••••••••••••••••••••'}
          </div>
          <div style={{ position: 'absolute', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
            <button 
              className="input-icon-btn" 
              style={{ position: 'relative', right: 0 }}
              onClick={() => setShowSecret(!showSecret)}
              title={showSecret ? "Hide Secret" : "Show Secret"}
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button 
              className="input-icon-btn" 
              style={{ position: 'relative', right: 0 }}
              onClick={() => copyToClipboard(app.clientSecret, setCopiedSecret)}
              title="Copy Client Secret"
            >
              {copiedSecret ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={handleRegenerate}
        disabled={isRegenerating}
        className="btn btn-outline" 
        style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center', opacity: 0.7 }}
      >
        <RefreshCw size={12} className={isRegenerating ? 'spin' : ''} style={{ marginRight: '4px' }} />
        Regenerate Client Secret
      </button>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
