/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { getReconciliationReport, ReconciliationReport } from '../actions';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';
import { RefreshCw, Download, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

function formatNPR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ReconciliationDashboard({ initial }: { initial: ReconciliationReport }) {
  const [report, setReport] = useState(initial);
  const [range, setRange] = useState<'7d' | '30d' | 'month'>('30d');
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (newRange: '7d' | '30d' | 'month') => {
    setRange(newRange);
    startTransition(async () => {
      const fresh = await getReconciliationReport(newRange);
      setReport(fresh);
    });
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Transactions', 'Gross Revenue', 'Net Revenue'].join(','),
      ...report.dailyBreakdown.map(d =>
        [d.date, d.count, d.gross.toFixed(2), d.net.toFixed(2)].join(',')
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconciliation-${report.period.replace(/\s/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refundRate = report.grossRevenue > 0
    ? ((report.refundedAmount / report.grossRevenue) * 100).toFixed(1)
    : '0.0';

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['7d', '30d', 'month'] as const).map(r => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              disabled={isPending}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                background: range === r ? 'var(--primary)' : undefined,
                color: range === r ? '#000' : undefined,
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'This Month'}
            </button>
          ))}
          {isPending && <RefreshCw size={16} style={{ color: 'var(--muted)', animation: 'spin 1s linear infinite' }} />}
        </div>
        <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          {
            label: 'Gross Revenue',
            value: formatNPR(report.grossRevenue),
            icon: <DollarSign size={18} style={{ color: '#22c55e' }} />,
            sub: `${report.completedTransactions} completed txns`,
            color: '#22c55e'
          },
          {
            label: 'Total Refunded',
            value: formatNPR(report.refundedAmount),
            icon: <TrendingDown size={18} style={{ color: '#ef4444' }} />,
            sub: `${report.refundedTransactions} refunds (${refundRate}% rate)`,
            color: '#ef4444'
          },
          {
            label: 'Net Revenue',
            value: formatNPR(report.netRevenue),
            icon: <TrendingUp size={18} style={{ color: 'var(--primary)' }} />,
            sub: 'After refunds',
            color: 'var(--primary)'
          },
          {
            label: 'Failed Transactions',
            value: report.failedTransactions.toString(),
            icon: <AlertCircle size={18} style={{ color: '#f59e0b' }} />,
            sub: `${report.totalTransactions} total`,
            color: '#f59e0b'
          },
        ].map(card => (
          <div key={card.label} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
              {card.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color, marginBottom: '0.25rem' }}>{card.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily Revenue Chart */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Daily Revenue — {report.period}</h3>
        {report.dailyBreakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={report.dailyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: 'var(--muted)', fontSize: '0.75rem' }}
                formatter={(v: any) => [formatNPR(Number(v)), '']}
              />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="gross" name="Gross" stroke="#818cf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net" name="Net" stroke="#00F0FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No transaction data for this period.</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Gateway Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>By Gateway</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(report.byGateway).length > 0 ? Object.entries(report.byGateway).map(([gateway, data]) => (
              <div key={gateway} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>{gateway}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{data.count} transactions</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22c55e' }}>{formatNPR(data.net)}</div>
                  {data.refunded > 0 && <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>-{formatNPR(data.refunded)} refunded</div>}
                </div>
              </div>
            )) : (
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No gateway data.</div>
            )}
          </div>
        </div>

        {/* Top Apps */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Top Revenue Apps</h3>
          {report.topApps.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={report.topApps} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted)' }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="appName" tick={{ fontSize: 10, fill: 'var(--muted)' }} width={90} />
                <Tooltip
                  contentStyle={{ background: '#0A0A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(v: any) => [formatNPR(Number(v)), 'Net Revenue']}
                />
                <Bar dataKey="net" fill="#00F0FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No app revenue data.</div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
