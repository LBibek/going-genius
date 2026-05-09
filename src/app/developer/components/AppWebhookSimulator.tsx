/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Send, Terminal, CheckCircle2, XCircle, Info, RefreshCcw } from 'lucide-react';
import { simulateWebhook } from '../actions';

const SAMPLE_EVENTS = [
  { 
    id: 'payment.success', 
    label: 'Payment Success', 
    payload: { 
      transactionId: 'txn_12345', 
      amount: 1000, 
      currency: 'NPR', 
      status: 'completed',
      userId: 'user_99'
    } 
  },
  { 
    id: 'subscription.created', 
    label: 'Subscription Created', 
    payload: { 
      subscriptionId: 'sub_67890', 
      planId: 'pro_monthly', 
      userId: 'user_99',
      expiresAt: '2026-06-09T00:00:00Z'
    } 
  },
  { 
    id: 'lead.captured', 
    label: 'Lead Captured', 
    payload: { 
      leadId: 'lead_abc', 
      email: 'customer@example.com', 
      source: 'AI Chat'
    } 
  }
];

export function AppWebhookSimulator({ app }: { app: any }) {
  const [selectedEvent, setSelectedEvent] = useState(SAMPLE_EVENTS[0]);
  const [payload, setPayload] = useState(JSON.stringify(SAMPLE_EVENTS[0].payload, null, 2));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const event = SAMPLE_EVENTS.find(ev => ev.id === e.target.value);
    if (event) {
      setSelectedEvent(event);
      setPayload(JSON.stringify(event.payload, null, 2));
    }
  };

  const handleSimulate = async () => {
    if (!app.webhookUrl) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await simulateWebhook(app.id, selectedEvent.id, JSON.parse(payload));
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <Terminal className="header-icon" size={20} />
        <div>
          <h3>Webhook Simulator</h3>
          <p>Test your endpoint by sending simulated GG events.</p>
        </div>
      </div>

      <div className="simulator-body">
        <div className="config-grid">
          <div className="form-group">
            <label>Event Type</label>
            <select value={selectedEvent.id} onChange={handleEventChange}>
              {SAMPLE_EVENTS.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Target URL</label>
            <div className="url-badge">
              {app.webhookUrl || 'Not configured (Set in API Keys)'}
            </div>
          </div>
        </div>

        <div className="payload-section">
          <label>JSON Payload</label>
          <textarea 
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="action-row">
          <button 
            onClick={handleSimulate}
            disabled={loading || !app.webhookUrl}
            className="btn-simulate"
          >
            {loading ? <RefreshCcw size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'Sending...' : 'Send Test Event'}
          </button>
          
          <div className="secret-info">
            <Info size={14} />
            <span>Signed with X-GG-Signature</span>
          </div>
        </div>

        {result && (
          <div className={`result-panel animate-in fade-in slide-in-from-top-2 ${result.success ? 'success' : 'error'}`}>
            <div className="result-header">
              {result.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{result.success ? `Response: ${result.status} ${result.statusText}` : 'Delivery Failed'}</span>
            </div>
            <pre className="result-body">
              {result.success ? result.response : result.error}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .simulator-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .simulator-header {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .header-icon {
          padding: 10px;
          border-radius: 12px;
          background: rgba(129, 140, 248, 0.1);
          color: #818cf8;
        }
        h3 { margin: 0; font-size: 1.1rem; }
        p { margin: 0.2rem 0 0; font-size: 0.85rem; color: var(--muted); }

        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label { font-size: 0.85rem; font-weight: 500; color: var(--muted); }

        select {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.6rem;
          color: var(--foreground);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .url-badge {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
          font-size: 0.85rem;
          color: var(--muted);
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .payload-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        textarea {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1rem;
          color: #818cf8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          min-height: 180px;
          resize: vertical;
        }

        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-simulate {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #818cf8;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-simulate:hover:not(:disabled) {
          background: #6366f1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-simulate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .secret-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .result-panel {
          margin-top: 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .result-panel.success { border-color: rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.05); }
        .result-panel.error { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); }

        .result-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-bottom: 1px solid var(--glass-border);
        }

        .result-panel.success .result-header { color: #22c55e; }
        .result-panel.error .result-header { color: #ef4444; }

        .result-body {
          margin: 0;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--foreground);
          max-height: 200px;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        @media (max-width: 640px) {
          .config-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
