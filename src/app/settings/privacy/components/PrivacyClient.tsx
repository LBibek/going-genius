'use client';

import { useState } from 'react';
import { Download, Trash2, FileJson, Loader2, AlertTriangle } from 'lucide-react';
import { exportUserData, deleteUserAccount } from '@/app/actions/privacy';

export function PrivacyClient({ actionType }: { actionType: 'EXPORT' | 'DELETE' }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleExport() {
    setLoading(true);
    const res = await exportUserData();
    if (res.success) {
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `going-genius-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    setLoading(true);
    const res = await deleteUserAccount();
    if (res.success) {
      window.location.href = '/';
    } else {
      alert(res.error);
      setShowConfirm(false);
    }
    setLoading(false);
  }

  if (actionType === 'EXPORT') {
    return (
      <button 
        className="btn btn-primary" 
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" size={18}/> : <FileJson size={18}/>}
        {loading ? 'Generating Archive...' : 'Request Data Export'}
      </button>
    );
  }

  return (
    <div className="delete-container">
      {!showConfirm ? (
        <button className="btn btn-outline-error" onClick={() => setShowConfirm(true)}>
          <Trash2 size={18} /> Delete My Account
        </button>
      ) : (
        <div className="confirm-box">
          <p className="text-xs text-error font-bold flex items-center gap-2">
            <AlertTriangle size={14}/> ARE YOU SURE? ALL DATA WILL BE WIPED.
          </p>
          <div className="btn-group">
            <button className="btn btn-ghost sm" onClick={() => setShowConfirm(false)}>Cancel</button>
            <button className="btn btn-error sm" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete Everything'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .delete-container {
          margin-top: auto;
        }

        .btn-outline-error {
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-outline-error:hover {
          background: rgba(239, 68, 68, 0.05);
          border-color: #ef4444;
        }

        .confirm-box {
          padding: 1rem;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .btn.sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .btn-error {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .text-error { color: #ef4444; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }

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
