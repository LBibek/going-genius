'use client';

import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  EyeOff, 
  FileJson,
  AlertTriangle,
  History
} from 'lucide-react';
import { PrivacyClient } from './components/PrivacyClient';

export default function PrivacySettingsPage() {
  return (
    <div className="privacy-container">
      <header className="settings-header">
        <h1 className="fluid-h2">Privacy & Personal Data</h1>
        <p className="text-muted">Manage your data, exercise your rights under GDPR/CCPA, and control your digital footprint.</p>
      </header>

      <div className="privacy-grid">
        <section className="protection-box glass-card">
          <div className="box-icon"><ShieldCheck size={24}/></div>
          <h3>Zero-Knowledge Protection</h3>
          <p className="text-sm text-muted">
            Your sensitive data (bios, private metadata, and custom app secrets) is encrypted at the field level. 
            Even our administrators cannot read this data.
          </p>
          <div className="status-indicator">
            <div className="pulse"></div>
            <span>AES-256-GCM Active</span>
          </div>
        </section>

        <section className="data-rights glass-card">
          <div className="section-title">
            <Download size={20} />
            <h3>Data Portability</h3>
          </div>
          <p className="text-sm text-muted">
            Download a machine-readable archive of all your data stored on Going Genius.
          </p>
          <PrivacyClient actionType="EXPORT" />
        </section>

        <section className="data-rights glass-card warning">
          <div className="section-title">
            <Trash2 size={20} />
            <h3>Right to be Forgotten</h3>
          </div>
          <p className="text-sm text-muted">
            Permanently delete your account and all associated data. This action is irreversible.
          </p>
          <PrivacyClient actionType="DELETE" />
        </section>

        <section className="audit-box glass-card">
          <div className="section-title">
            <History size={20} />
            <h3>Privacy Audit Log</h3>
          </div>
          <div className="audit-list">
            <div className="audit-item">
              <span className="date">2026-05-10</span>
              <span className="event">Account login from 192.168.1.1</span>
            </div>
            <div className="audit-item">
              <span className="date">2026-05-09</span>
              <span className="event">Profile encryption keys rotated</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .privacy-container {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 3rem;
        }

        .privacy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .glass-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .box-icon {
          width: 48px;
          height: 48px;
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--primary);
        }

        .status-indicator {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.05);
          padding: 8px 12px;
          border-radius: 8px;
          width: fit-content;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .warning {
          border-color: rgba(239, 68, 68, 0.2);
        }

        .warning .section-title { color: #ef4444; }

        .audit-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .audit-item {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .audit-item .date { color: var(--text-muted); font-family: monospace; }

        @media (max-width: 600px) {
          .privacy-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
