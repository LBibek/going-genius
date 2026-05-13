'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCw, 
  Eye,
  Loader2
} from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import Link from 'next/link';
import { triggerSafetyScan } from '@/app/actions/safety';

export function SafetyTableRow({ app }: { app: any }) {
  const [isScanning, setIsScanning] = useState(false);

  async function handleScan() {
    setIsScanning(true);
    await triggerSafetyScan(app.id);
    setIsScanning(false);
  }

  return (
    <tr>
      <td>
        <div className="app-cell">
          <OptimizedImage src={app.logoUrl || '/images/app-placeholder.png'} alt={app.name} width={32} height={32} style={{ borderRadius: '8px' }} />
          <div>
            <div className="font-bold">{app.name}</div>
            <div className="text-xs text-muted">{app.id.substring(0, 8)}...</div>
          </div>
        </div>
      </td>
      <td>
        <div className="text-sm">{app.owner.displayName}</div>
        <div className="text-xs text-muted">{app.owner.email}</div>
      </td>
      <td>
        <div className="risk-indicator">
          <div className="risk-bar">
            <div 
              className="risk-fill" 
              style={{ 
                width: `${(app.riskScore || 0) * 100}%`,
                background: (app.riskScore || 0) > 0.7 ? '#ef4444' : (app.riskScore || 0) > 0.4 ? '#f59e0b' : '#10b981'
              }} 
            />
          </div>
          <span className="risk-val">{(app.riskScore || 0).toFixed(2)}</span>
        </div>
      </td>
      <td>
        <span className={`status-pill ${app.moderationStatus.toLowerCase()}`}>
          {app.moderationStatus === 'APPROVED' && <ShieldCheck size={12}/>}
          {app.moderationStatus === 'FLAGGED' && <AlertTriangle size={12}/>}
          {app.moderationStatus === 'REJECTED' && <ShieldAlert size={12}/>}
          {app.moderationStatus}
        </span>
      </td>
      <td className="text-sm text-muted">
        {new Date(app.updatedAt).toLocaleDateString()}
      </td>
      <td>
        <div className="action-btns">
          <button 
            className="btn btn-ghost sm" 
            title="Rescan with AI"
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          </button>
          <Link href={`/developer/apps/${app.id}`} className="btn btn-ghost sm" title="View Details">
            <Eye size={16} />
          </Link>
        </div>
      </td>

      <style jsx>{`
        .app-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .risk-indicator {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 150px;
        }

        .risk-bar {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: hidden;
        }

        .risk-fill {
          height: 100%;
          transition: width 0.5s ease-out;
        }

        .risk-val {
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pill.approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.flagged { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-pill.rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .action-btns {
          display: flex;
          gap: 0.5rem;
        }

        .btn.sm {
          padding: 6px;
          min-width: auto;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </tr>
  );
}
