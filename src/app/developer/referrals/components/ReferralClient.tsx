'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, ArrowRight } from 'lucide-react';
import { applyReferralCode } from '@/app/actions/referral';
import { useActionState } from 'react';

export function ReferralClient({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/auth/register?ref=${code}`;

  const [state, action, isPending] = useActionState(async (prev: any, formData: FormData) => {
    const inputCode = formData.get('referralCode') as string;
    return await applyReferralCode(inputCode);
  }, null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="client-wrapper">
      <div className="code-display">
        <span className="code">{code}</span>
        <button className="btn btn-ghost" onClick={copyToClipboard}>
          {copied ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="link-display">
        <label className="text-xs text-muted uppercase">Shareable Link</label>
        <div className="link-row">
          <input type="text" readOnly value={referralLink} className="link-input" />
        </div>
      </div>

      <div className="divider" />

      <form action={action} className="redeem-form">
        <h3>Redeem a Code</h3>
        <p className="text-xs text-muted">Were you referred by another developer? Enter their code here.</p>
        <div className="input-group">
          <input 
            type="text" 
            name="referralCode" 
            placeholder="Enter referral code..." 
            className="input-base"
            required 
          />
          <button className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Processing...' : <ArrowRight size={18} />}
          </button>
        </div>
        {state?.error && <p className="text-xs text-error mt-2">{state.error}</p>}
        {state?.success && <p className="text-xs text-success mt-2">Referral applied successfully!</p>}
      </form>

      <style jsx>{`
        .client-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .code-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
        }

        .code {
          font-family: monospace;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--primary);
        }

        .link-display {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .link-input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 1rem 0;
        }

        .redeem-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .redeem-form h3 {
          font-size: 1rem;
          margin: 0;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
        }

        .input-base {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 15px;
          border-radius: 8px;
          color: white;
        }

        .btn-primary {
          padding: 0 15px;
        }

        .text-error { color: #ef4444; }
        .text-success { color: #10b981; }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
