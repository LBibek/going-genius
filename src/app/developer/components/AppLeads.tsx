'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, Tag, MoreHorizontal, User } from 'lucide-react';

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
  const [filter, setFilter] = useState('ALL');

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

  return (
    <div className="leads-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lead Management (CRM)</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Captured automatically by your AI agents and integrations.</p>
        </div>
        
        <div className="filter-group">
          {['ALL', 'NEW', 'QUALIFIED', 'WON'].map(f => (
            <button 
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
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
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Try chatting with your AI agent to generate a lead.</p>
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
                  <div className="lead-status" style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}>
                    {lead.status}
                  </div>
                </div>
                <button className="icon-btn-sm"><MoreHorizontal size={16} /></button>
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
                  <span>{lead.source || 'AI Chat'}</span>
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
          padding: 1rem;
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
          margin-left: auto;
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
