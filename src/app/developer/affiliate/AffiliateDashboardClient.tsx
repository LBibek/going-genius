'use client';

import { useState } from 'react';
import { generateReferralCode } from '@/app/actions/affiliate';
import { Sparkles, Copy, Check, Users, DollarSign, Wallet } from 'lucide-react';

export function AffiliateDashboardClient({ user, stats }: { user: any, stats: any }) {
  const [customCode, setCustomCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const referralLink = user.referralCode 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://going-genius.com'}/auth/register?ref=${user.referralCode}`
    : '';

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    const res = await generateReferralCode(customCode.trim() || undefined);
    setIsGenerating(false);
    if (res?.error) {
      setError(res.error);
    }
  }

  function handleCopy() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Stats Grid */}
      <div className="grid-responsive" style={{ '--grid-cols': 3 } as any}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Referred Users</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.totalReferrals}</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 177, 22, 0.1)', borderRadius: '12px' }}>
            <DollarSign size={24} color="#FFB116" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Pending Commissions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${stats.pendingCommissions.toFixed(2)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <Wallet size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Paid Out</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${stats.paidCommissions.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Referral Link Generator / Viewer */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Affiliate Link</h2>
        
        {!user.referralCode ? (
          <div>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Generate your unique referral code to start earning commissions.
            </p>
            <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', maxWidth: '400px' }}>
              <div className="input-icon-wrapper" style={{ flex: 1 }}>
                <span className="input-prefix">gg_</span>
                <input 
                  type="text" 
                  className="form-input prefix-input" 
                  placeholder={user.username}
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                />
              </div>
              <button type="submit" className="btn-submit" disabled={isGenerating} style={{ width: 'auto' }}>
                {isGenerating ? 'Generating...' : 'Generate Code'}
              </button>
            </form>
            {error && <p className="form-error" style={{ marginTop: '0.5rem' }}>{error}</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-input" 
              value={referralLink} 
              readOnly 
              style={{ flex: 1, fontFamily: 'monospace', color: 'var(--primary)' }}
            />
            <button 
              onClick={handleCopy} 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
            </button>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Referrals</h2>
        {user.referralEarnings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <Sparkles size={32} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>You haven't referred anyone yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>User</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {user.referralEarnings.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{r.referred.displayName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>@{r.referred.username}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    ${r.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="id-badge" style={{ 
                      background: r.status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 177, 22, 0.1)', 
                      color: r.status === 'PAID' ? '#10b981' : '#FFB116' 
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
