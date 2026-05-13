'use client';

import { 
  Search,
  Filter
} from 'lucide-react';
import { SafetyTableRow } from './SafetyTableRow';

interface SafetyDashboardClientProps {
  apps: any[];
}

export function SafetyDashboardClient({ apps }: SafetyDashboardClientProps) {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="fluid-h2">Platform Safety & Moderation</h1>
          <p className="text-muted">AI-powered autonomous fraud detection and app governance.</p>
        </div>
        <div className="stats-strip">
          <div className="stat-box">
            <span className="label">Total Apps</span>
            <span className="val">{apps.length}</span>
          </div>
          <div className="stat-box">
            <span className="label">Flagged</span>
            <span className="val text-error">{apps.filter((a: any) => a.moderationStatus === 'FLAGGED').length}</span>
          </div>
          <div className="stat-box">
            <span className="label">High Risk</span>
            <span className="val text-warning">{apps.filter((a: any) => (a.riskScore || 0) > 0.7).length}</span>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="controls glass-card">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Filter apps by name or developer..." />
          </div>
          <div className="filters">
            <button className="btn btn-outline sm"><Filter size={14}/> All Status</button>
            <button className="btn btn-outline sm">High Risk</button>
          </div>
        </div>

        <div className="table-container glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Developer</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Last Checked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <SafetyTableRow key={app.id} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .admin-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .stats-strip {
          display: flex;
          gap: 2rem;
        }

        .stat-box {
          text-align: right;
        }

        .stat-box .label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--muted);
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }

        .stat-box .val {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 16px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          max-width: 400px;
          color: var(--muted);
        }

        .search-bar input {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.9rem;
          width: 100%;
        }

        .filters {
          display: flex;
          gap: 0.75rem;
        }

        .table-container {
          border-radius: 20px;
          overflow: hidden;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--muted);
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .admin-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .text-error { color: var(--error); }
        .text-warning { color: var(--warning); }
      `}</style>
    </div>
  );
}
