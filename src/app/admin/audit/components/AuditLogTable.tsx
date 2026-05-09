/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';

export function AuditLogTable({ logs }: { logs: any[] }) {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  const actions = ['ALL', ...Array.from(new Set(logs.map((l: any) => l.action)))];

  const filtered = logs.filter((log: any) => {
    const matchSearch = search === '' ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.targetId?.toLowerCase().includes(search.toLowerCase()) ||
      log.userId?.toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'ALL' || log.action === filterAction;
    return matchSearch && matchAction;
  });

  return (
    <div className="glass-card">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search by action, user, or target..."
            className="input-field"
            style={{ paddingLeft: '2.25rem', width: '100%' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {actions.map(action => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                background: filterAction === action ? 'var(--primary)' : undefined,
                color: filterAction === action ? '#000' : undefined,
              }}
            >
              {action.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No audit events found.</div>
        ) : (
          filtered.map((log: any) => (
            <div
              key={log.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              {/* Row Header */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              >
                <div style={{ color: 'var(--muted)', flexShrink: 0 }}>
                  {expanded === log.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                <div className="id-badge" style={{
                  background: log.action.includes('REFUND') ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                  color: log.action.includes('REFUND') ? '#f59e0b' : '#818cf8',
                  fontSize: '0.7rem',
                  flexShrink: 0
                }}>
                  {log.action.replace(/_/g, ' ')}
                </div>
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Target:</span>{' '}
                  <code style={{ fontSize: '0.78rem' }}>{log.targetId || '—'}</code>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Expanded Metadata */}
              {expanded === log.id && log.metadata && (
                <div style={{ padding: '0 1rem 1rem 2.5rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ marginTop: '0.75rem', background: '#000', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                    <pre style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#a5b4fc', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                  {log.userId && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                      User ID: <code>{log.userId}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'right' }}>
        Showing {filtered.length} of {logs.length} events
      </div>
    </div>
  );
}
