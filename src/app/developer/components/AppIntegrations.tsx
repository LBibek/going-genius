'use client';

import { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Settings, 
  Layers, 
  Upload, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code
} from 'lucide-react';

interface AppIntegrationsProps {
  app: any;
}

export function AppIntegrations({ app }: AppIntegrationsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleSimulateImport = () => {
    setIsImporting(true);
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsImporting(false), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="integrations-view">
      <div className="section-header">
        <h2 className="section-title">Ecosystem Integrations</h2>
        <p className="section-subtitle">Connect Going Genius to your existing CMS, platforms, and data pipelines.</p>
      </div>

      <div className="integrations-grid">
        {/* WordPress Card */}
        <div className="integration-card glass-card">
          <div className="card-top">
            <div className="provider-icon wp-icon">W</div>
            <div className="status-indicator online">Connected</div>
          </div>
          <div className="card-body">
            <h3>WordPress Plugin</h3>
            <p>Sync users, gate content, and accept payments directly within your WordPress site using our native integration.</p>
            <div className="card-meta">
              <span>Version: 0.1.0</span>
              <span>•</span>
              <span>Updated 2 days ago</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> Download Plugin
            </button>
            <button className="btn btn-ghost btn-sm">
              <Settings size={14} /> Configure
            </button>
          </div>
        </div>

        {/* Bulk Import Card */}
        <div className="integration-card glass-card">
          <div className="card-top">
            <div className="provider-icon import-icon">
              <Upload size={20} />
            </div>
          </div>
          <div className="card-body">
            <h3>Bulk User Import</h3>
            <p>Migrate your user base from Auth0, Firebase, or CSV. Supports metadata mapping and bulk subscription creation.</p>
            {isImporting ? (
              <div className="import-status">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${importProgress}%` }} />
                </div>
                <span className="import-text">Importing data... {importProgress}%</span>
              </div>
            ) : (
              <div className="import-action" onClick={handleSimulateImport}>
                <Upload size={16} />
                <span>Drag & Drop CSV or JSON</span>
              </div>
            )}
          </div>
          <div className="card-footer">
            <button className="btn btn-ghost btn-sm" disabled={isImporting}>
              View Import History
            </button>
          </div>
        </div>

        {/* Webhooks Card */}
        <div className="integration-card glass-card">
          <div className="card-top">
            <div className="provider-icon webhook-icon">
              <Code size={20} />
            </div>
            <div className="status-indicator offline">Inactive</div>
          </div>
          <div className="card-body">
            <h3>Webhooks & Events</h3>
            <p>Receive real-time notifications for user signups, subscription renewals, and failed payments on your own servers.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary btn-sm">
              Setup Webhook
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .integrations-view {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .section-header { margin-bottom: 0.5rem; }
        .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .section-subtitle { color: var(--muted); }

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .integration-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .integration-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .provider-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
        }
        .wp-icon { background: #21759b; color: #fff; }
        .import-icon { background: #3b82f6; color: #fff; }
        .webhook-icon { background: #10b981; color: #fff; }

        .status-indicator {
          font-size: 0.65rem;
          padding: 3px 10px;
          border-radius: 99px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-indicator.online { background: rgba(16,185,129,0.1); color: #10b981; }
        .status-indicator.offline { background: rgba(244,63,94,0.1); color: #f43f5e; }

        .card-body h3 { margin: 0 0 0.5rem; font-size: 1.15rem; }
        .card-body p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.5; }

        .card-meta {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #555;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .import-action {
          margin-top: 1rem;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #888;
        }
        .import-action:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59,130,246,0.05);
        }
        .import-action span { font-size: 0.8rem; }

        .import-status {
          margin-top: 1rem;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        .import-text { font-size: 0.75rem; color: #3b82f6; }
      `}</style>
    </div>
  );
}
