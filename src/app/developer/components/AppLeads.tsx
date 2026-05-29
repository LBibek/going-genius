'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, Tag, MoreHorizontal, User, Plus, Code, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  createdAt: Date | string;
  metadata?: any;
}

interface AppLeadsProps {
  appId: string;
  leads: Lead[];
}

export function AppLeads({ appId, leads }: AppLeadsProps) {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  
  // UI states
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [showEmbedScript, setShowEmbedScript] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredLeads = filter === 'ALL' 
    ? leads 
    : leads.filter(l => l.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return '#6ee7b7';
      case 'QUALIFIED': return '#3b82f6';
      case 'CONTACTED': return '#fbbf24';
      case 'WON': return '#10b981';
      default: return 'var(--muted)';
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          ...formData,
          source: 'Manual Entry'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add lead');

      setFormData({ name: '', email: '', phone: '' });
      setShowManualAdd(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const embedScriptCode = `<script src="https://goinggenius.com.np/scripts/lead-form.js" id="gg-lead-form-script" data-app-id="${appId}"></script>\n<div id="gg-lead-container"></div>`;

  return (
    <div className="leads-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lead Management (CRM)</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Captured automatically by your AI agents, forms, and integrations.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            onClick={() => { setShowEmbedScript(!showEmbedScript); setShowManualAdd(false); }}
          >
            <Code size={16} /> Get Embed Script
          </button>
          <button 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            onClick={() => { setShowManualAdd(!showManualAdd); setShowEmbedScript(false); }}
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {showEmbedScript && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Embed Lead Capture Form</h3>
            <button className="icon-btn-sm" onClick={() => setShowEmbedScript(false)}><X size={20} /></button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Copy and paste this snippet anywhere on your external website. It will automatically render a secure lead capture form connected to this application.
          </p>
          <div style={{ position: 'relative' }}>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px', overflowX: 'auto', fontSize: '0.85rem', border: '1px solid var(--border)', color: '#e2e8f0' }}>
              {embedScriptCode}
            </pre>
            <button 
              className="btn btn-primary" 
              style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px' }}
              onClick={() => navigator.clipboard.writeText(embedScriptCode)}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {showManualAdd && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add Lead Manually</h3>
            <button className="icon-btn-sm" onClick={() => setShowManualAdd(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleManualSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+1 234 567 8900" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" style={{ height: '42px', width: '100%' }} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Lead'}
              </button>
            </div>
          </form>
          {errorMsg && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem' }}>{errorMsg}</p>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <div className="filter-group">
          {['ALL', 'NEW', 'QUALIFIED', 'WON'].map(f => (
            <button 
              key={f}
              className={`filter-btn \${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <User size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No leads found matching the filter.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Try adding one manually or embed the capture form on your site.</p>
        </div>
      ) : (
        <div className="leads-grid">
          {filteredLeads.map(lead => (
            <div key={lead.id} className="lead-card">
              <div className="lead-header">
                <div className="lead-avatar">
                  {lead.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="lead-info">
                  <h3>{lead.name || 'Anonymous Lead'}</h3>
                  <div className="lead-status" style={{ background: `\${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}>
                    {lead.status}
                  </div>
                </div>
                <button className="icon-btn-sm" style={{ marginLeft: 'auto' }}><MoreHorizontal size={16} /></button>
              </div>

              <div className="lead-body">
                {lead.email && (
                  <div className="lead-meta-item">
                    <Mail size={14} />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="lead-meta-item">
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </div>
                )}
                <div className="lead-meta-item">
                  <Calendar size={14} />
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="lead-meta-item">
                  <Tag size={14} />
                  <span>{lead.source || 'Manual Entry'}</span>
                </div>
              </div>

              {lead.metadata && (lead.metadata as any).interest && (
                <div className="lead-interest">
                  <strong>Interest:</strong> {(lead.metadata as any).interest}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .leads-container {
          padding: 0;
        }
        .filter-group {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          padding: 0.25rem;
          border-radius: 10px;
        }
        .filter-btn {
          padding: 0.4rem 1rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--glass-border);
          color: var(--foreground);
        }
        .leads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .lead-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          transition: transform 0.2s;
        }
        .lead-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-glow);
        }
        .lead-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .lead-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--primary);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.2rem;
        }
        .lead-info h3 {
          margin: 0;
          font-size: 1rem;
        }
        .lead-status {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          text-transform: uppercase;
          margin-top: 0.25rem;
          display: inline-block;
        }
        .lead-body {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        .lead-meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--muted);
          font-size: 0.85rem;
        }
        .lead-interest {
          font-size: 0.85rem;
          background: rgba(255,255,255,0.03);
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          color: var(--muted);
        }
        .icon-btn-sm {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 8px;
        }
        .icon-btn-sm:hover {
          background: rgba(255,255,255,0.05);
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}
