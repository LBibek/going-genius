'use client';

import { OptimizedImage } from '@/components/OptimizedImage';
import { ExternalLink, Shield, Mail, Activity } from 'lucide-react';
import Link from 'next/link';

interface AppListProps {
  apps: any[];
}

export function AppList({ apps }: AppListProps) {
  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>All Ecosystem Applications</h2>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Owner</th>
              <th>Users</th>
              <th>Leads</th>
              <th>AI Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <OptimizedImage 
                      src={app.logoUrl || '/images/app-placeholder.png'} 
                      alt={app.name} 
                      width={32} 
                      height={32} 
                      style={{ borderRadius: '8px' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{app.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{app.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div>{app.owner.displayName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{app.owner.email}</div>
                  </div>
                </td>
                <td>{app._count.appUsers}</td>
                <td>{app._count.leads}</td>
                <td>{app._count.apiUsages} calls</td>
                <td>
                  {app.isPremium ? (
                    <span className="id-badge" style={{ background: 'linear-gradient(135deg, #FFB116, #FF8C00)', color: '#000' }}>PRO</span>
                  ) : (
                    <span className="id-badge">FREE</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/developer/apps/${app.id}`} className="icon-btn-sm" title="View as Developer">
                      <ExternalLink size={14} />
                    </Link>
                    <button className="icon-btn-sm" title="Inspect Security">
                      <Shield size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th {
          text-align: left;
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.02);
          color: var(--muted);
          font-weight: 600;
          border-bottom: 1px solid var(--glass-border);
        }
        .admin-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        .admin-table tr:hover {
          background: rgba(255,255,255,0.01);
        }
        .icon-btn-sm {
          padding: 0.4rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .icon-btn-sm:hover {
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
        }
        .table-responsive {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
