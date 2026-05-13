/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useTransition } from 'react';
import { getGlobalTransactions, refundTransaction } from '../actions';
import { 
  CreditCard, 
  ArrowRight, 
  RefreshCcw, 
  Search, 
  CheckCircle2, 
  XCircle,
  Undo2,
  MoreVertical
} from 'lucide-react';

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const fetchTransactions = async () => {
    try {
      const data = await getGlobalTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefund = async (id: string) => {
    if (!confirm('Are you sure you want to refund this transaction? This will also revoke the user\'s active subscription for this app.')) return;
    
    startTransition(async () => {
      try {
        await refundTransaction(id);
        await fetchTransactions();
        alert('Transaction refunded successfully.');
      } catch (error: any) {
        alert(error.message || 'Failed to refund transaction.');
      }
    });
  };

  const filtered = transactions.filter((tx: any) => 
    tx.user?.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    tx.app?.name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.referenceId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Financial Governance</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Monitor and manage global transactions and reversals.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="input-field"
            style={{ paddingLeft: '2.5rem', width: '250px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Application</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>Loading transactions...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>No transactions found.</td></tr>
            ) : (
              filtered.map((tx: any) => (
                <tr key={tx.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{tx.user?.displayName || 'Unknown'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{tx.user?.email}</div>
                  </td>
                  <td>{tx.app?.name}</td>
                  <td style={{ fontWeight: 600 }}>{tx.currency} {tx.amount.toLocaleString()}</td>
                  <td>
                    <div className="id-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.7rem' }}>
                      {tx.provider.toUpperCase()}
                    </div>
                  </td>
                  <td>
                    {tx.status === 'completed' && (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                    {tx.status === 'refunded' && (
                      <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Undo2 size={14} /> Refunded
                      </span>
                    )}
                    {tx.status === 'failed' && (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <XCircle size={14} /> Failed
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <RefreshCcw size={14} className="spin" /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    {tx.status === 'completed' && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleRefund(tx.id)}
                        disabled={isPending}
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
