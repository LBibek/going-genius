'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  BrainCircuit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { runChurnPrediction } from '@/app/actions/safety';

export function ChurnAnalyticsCard({ user }: { user: any }) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handlePredict() {
    setLoading(true);
    const res = await runChurnPrediction(user.id);
    if (res.success) {
      setPrediction(res.result);
    }
    setLoading(false);
  }

  return (
    <div className={`churn-card glass-card ${prediction?.churnRisk.toLowerCase()}`}>
      <div className="card-main">
        <div className="user-info">
          <div className="avatar">
            {user.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="name">{user.displayName || 'Anonymous User'}</div>
            <div className="sub-type">{user.subscriptions[0]?.planId} • {user.subscriptions[0]?.status}</div>
          </div>
        </div>

        <div className="prediction-trigger">
          {prediction ? (
            <div className="risk-badge">
              {prediction.churnRisk} RISK ({(prediction.riskScore * 100).toFixed(0)}%)
            </div>
          ) : (
            <button 
              className="btn btn-ghost sm ai-btn" 
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
              Analyze Risk
            </button>
          )}
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-details">
          {prediction ? (
            <>
              <div className="factors">
                <label>Key Risk Factors</label>
                <ul>
                  {prediction.factors.map((f: string, i: number) => (
                    <li key={i}><AlertCircle size={12}/> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendations">
                <label>Recommended Retention Strategy</label>
                <ul>
                  {prediction.recommendations.map((r: string, i: number) => (
                    <li key={i}><CheckCircle2 size={12}/> {r}</li>
                  ))}
                </ul>
              </div>
              {prediction.predictedLTV && (
                <div className="ltv-badge">
                  Predicted LTV: NPR {prediction.predictedLTV.toLocaleString()}
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-muted italic">Run AI analysis to see churn factors and retention strategies.</p>
          )}
        </div>
      )}

      <style jsx>{`
        .churn-card {
          padding: 1rem;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .churn-card.critical { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .churn-card.high { border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
        .churn-card.medium { border-left-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        .churn-card.low { border-left-color: #10b981; background: rgba(16, 185, 129, 0.05); }

        .card-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .name { font-size: 0.95rem; font-weight: 700; }
        .sub-type { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }

        .prediction-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .risk-badge {
          font-size: 0.7rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
        }

        .ai-btn {
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--primary);
        }

        .expand-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .card-details {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-details label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }

        .card-details ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-details li {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }

        .factors li svg { color: #ef4444; }
        .recommendations li svg { color: #10b981; }

        .ltv-badge {
          align-self: flex-end;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          padding: 6px 12px;
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 6px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
