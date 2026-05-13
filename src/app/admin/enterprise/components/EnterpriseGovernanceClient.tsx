'use client';

import { 
  Building2, 
  ShieldCheck, 
  Users, 
  TrendingDown,
  Globe,
  Database,
  Lock
} from 'lucide-react';
import { ChurnAnalyticsCard } from './ChurnAnalyticsCard';

interface EnterpriseGovernanceClientProps {
  activeSubscribers: any[];
}

export function EnterpriseGovernanceClient({ activeSubscribers }: EnterpriseGovernanceClientProps) {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="fluid-h2">Enterprise Governance</h1>
          <p className="text-muted">Global edge compute, predictive analytics, and enterprise SSO management.</p>
        </div>
        <div className="action-row">
          <button className="btn btn-outline sm"><Globe size={14}/> Edge Status: Active</button>
          <button className="btn btn-primary sm">Configure SAML</button>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card glass-card">
          <Building2 className="icon" />
          <div className="data">
            <span className="label">Managed Orgs</span>
            <span className="val">12</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <TrendingDown className="icon text-warning" />
          <div className="data">
            <span className="label">Avg Churn Risk</span>
            <span className="val">14.2%</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <Database className="icon text-success" />
          <div className="data">
            <span className="label">DB Replicas</span>
            <span className="val">3 Regions</span>
          </div>
        </div>
      </div>

      <main className="admin-main">
        <div className="dashboard-grid">
          <section className="analytics-section">
            <div className="section-header">
              <h3>Predictive Churn Analytics</h3>
              <p className="text-sm text-muted">AI-powered retention insights for high-value subscribers.</p>
            </div>
            <div className="churn-grid">
              {activeSubscribers.map(user => (
                <ChurnAnalyticsCard key={user.id} user={user} />
              ))}
            </div>
          </section>

          <section className="governance-section">
            <div className="section-header">
              <h3>SSO & Security Federation</h3>
            </div>
            <div className="federation-list glass-card">
              <div className="fed-item">
                <div className="fed-info">
                  <div className="fed-icon"><Lock size={16}/></div>
                  <div>
                    <div className="fed-name">SAML 2.0 Integration</div>
                    <div className="text-xs text-muted">Provisioning via Okta/Azure AD</div>
                  </div>
                </div>
                <span className="badge success">ENABLED</span>
              </div>
              <div className="fed-item">
                <div className="fed-info">
                  <div className="fed-icon"><Users size={16}/></div>
                  <div>
                    <div className="fed-name">SCIM Provisioning</div>
                    <div className="text-xs text-muted">Automated user lifecycle sync</div>
                  </div>
                </div>
                <span className="badge warning">PENDING</span>
              </div>
              <div className="fed-item disabled">
                <div className="fed-info">
                  <div className="fed-icon"><ShieldCheck size={16}/></div>
                  <div>
                    <div className="fed-name">Custom Domain Federation</div>
                    <div className="text-xs text-muted">White-labeled auth endpoints</div>
                  </div>
                </div>
                <span className="badge muted">ENTERPRISE ONLY</span>
              </div>
            </div>

            <div className="replication-box glass-card">
              <h3>Global DB Replication Status</h3>
              <div className="replica-map">
                <div className="replica-node active">
                  <span className="dot"></span>
                  <span className="name">US-East (Primary)</span>
                  <span className="latency">12ms</span>
                </div>
                <div className="replica-node active">
                  <span className="dot"></span>
                  <span className="name">EU-Central</span>
                  <span className="latency">24ms</span>
                </div>
                <div className="replica-node active">
                  <span className="dot"></span>
                  <span className="name">AP-South</span>
                  <span className="latency">18ms</span>
                </div>
              </div>
            </div>
          </section>
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
          align-items: flex-start;
          margin-bottom: 3rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-card .icon {
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .stat-card .data {
          display: flex;
          flex-direction: column;
        }

        .stat-card .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .stat-card .val {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2.5rem;
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .churn-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .federation-list {
          display: flex;
          flex-direction: column;
        }

        .fed-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .fed-item:last-child { border-bottom: none; }

        .fed-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fed-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          border-radius: 8px;
        }

        .fed-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .badge.muted { background: rgba(255,255,255,0.05); color: var(--text-muted); }

        .replication-box {
          margin-top: 2rem;
          padding: 1.5rem;
        }

        .replication-box h3 {
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .replica-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 8px 12px;
          background: rgba(0,0,0,0.1);
          border-radius: 8px;
        }

        .replica-node .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        .replica-node .name { font-size: 0.85rem; flex: 1; }
        .replica-node .latency { font-size: 0.75rem; color: #10b981; font-weight: 700; }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
