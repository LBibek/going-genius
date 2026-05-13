/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
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
  Code,
  Link as LinkIcon,
  Copy,
  Check,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface AppIntegrationsProps {
  app: any;
}

export function AppIntegrations({ app }: AppIntegrationsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showWPConfig, setShowWPConfig] = useState(false);
  const [wpUrl, setWpUrl] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Callback URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
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
            <div className="status-indicator online">Standard Integration</div>
          </div>
          <div className="card-body">
            <h3>WordPress Plugin</h3>
            <p>Sync users, gate content, and accept payments directly within your WordPress site using our native integration.</p>
            <div className="card-meta">
              <span>Version: 0.1.0</span>
              <span>•</span>
              <span>Updated Today</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-outline btn-sm">
              <Download size={14} /> Download v0.1.0
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowWPConfig(!showWPConfig)}>
              <Settings size={14} /> {showWPConfig ? 'Close' : 'Configure'}
            </button>
          </div>
          
          {showWPConfig && (
            <div className="config-panel">
              <div className="panel-header">
                <h4>WordPress Connection Credentials</h4>
                <div className="badge-premium">Secure Handshake</div>
              </div>
              
              <p className="panel-hint">Use these credentials in your WordPress GG-Plugin settings to enable content gating and SSO.</p>
              
              <div className="config-fields">
                <div className="field-group">
                  <label>Client ID</label>
                  <div className="code-block-mini">
                    <code>{app.clientId}</code>
                    <button onClick={() => copyToClipboard(app.clientId)}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label>Client Secret</label>
                  <div className="code-block-mini">
                    <code>••••••••••••••••••••••••</code>
                    <button onClick={() => copyToClipboard(app.clientSecret)}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label>OAuth Callback URL</label>
                  <p className="field-hint">Whitelist this URL in your WP plugin settings.</p>
                  <div className="code-block-mini">
                    <code>{`${wpUrl || 'https://your-site.com'}/wp-json/gg/v1/callback`}</code>
                    <button onClick={() => copyToClipboard(`${wpUrl || 'https://your-site.com'}/wp-json/gg/v1/callback`)}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="handshake-status">
                <div className="status-item">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>OAuth 2.0 Ready</span>
                </div>
                <div className="status-item">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>PKCE Supported</span>
                </div>
              </div>

              <div className="action-row">
                <button className="btn btn-primary btn-xs w-full" onClick={() => window.open('/demo/wordpress', '_blank')}>
                  <ExternalLink size={12} /> Test Handshake in Demo
                </button>
              </div>
            </div>
          )}
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

        {/* WhatsApp Connector */}
        <div className="integration-card glass-card">
          <div className="card-top">
            <div className="provider-icon whatsapp-icon">
              <Activity size={20} />
            </div>
            {app.whatsappEnabled ? (
              <div className="status-indicator online">Active</div>
            ) : (
              <div className="status-indicator">Disabled</div>
            )}
          </div>
          <div className="card-body">
            <h3>WhatsApp Connector</h3>
            <p>Deploy AI lead-gen agents directly on WhatsApp. Capture leads and answer queries via the Meta Graph API.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-outline btn-sm">
              <Settings size={14} /> Configure
            </button>
          </div>
        </div>

        {/* Viber Connector */}
        <div className="integration-card glass-card">
          <div className="card-top">
            <div className="provider-icon viber-icon">
              <Activity size={20} />
            </div>
            {app.viberEnabled ? (
              <div className="status-indicator online">Active</div>
            ) : (
              <div className="status-indicator">Disabled</div>
            )}
          </div>
          <div className="card-body">
            <h3>Viber Business Chat</h3>
            <p>Connect your Going Genius AI agent to Viber. Ideal for the Nepali market with deep Viber penetration.</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-outline btn-sm">
              <Settings size={14} /> Configure
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
        .whatsapp-icon { background: #25d366; color: #fff; }
        .viber-icon { background: #7360f2; color: #fff; }

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

        .config-panel {
          margin-top: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h4 { margin: 0; font-size: 0.95rem; font-weight: 600; }
        
        .badge-premium {
          font-size: 0.6rem;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .panel-hint { font-size: 0.8rem; color: #71717a; margin: 0; }

        .config-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #a1a1aa;
        }

        .field-hint {
          font-size: 0.65rem;
          color: #52525b;
          margin: 0;
        }

        .handshake-status {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(16, 185, 129, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 500;
        }

        .code-block-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #09090b;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          border: 1px solid #27272a;
        }
        .code-block-mini code { font-size: 0.7rem; color: #aaa; overflow: hidden; text-overflow: ellipsis; }
        .code-block-mini button { background: transparent; border: none; color: #666; cursor: pointer; padding: 4px; }
        .code-block-mini button:hover { color: #fff; }

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
