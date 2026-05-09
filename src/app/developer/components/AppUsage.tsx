/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { getAppUsageStats } from '../actions';
import { 
  Sparkles, 
  BarChart3, 
  Zap, 
  DollarSign, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function AppUsage({ appId }: { appId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getAppUsageStats(appId);
        setData(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to load usage stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [appId]);

  if (loading) return <div className="loading-shimmer" style={{ height: '300px', borderRadius: '16px' }} />;
  if (error) return (
    <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="flex-responsive" style={{ gap: '1.5rem' }}>
        <div className="glass-card flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
            <Zap size={16} />
            <span style={{ fontSize: '0.85rem' }}>AI Tokens Consumed</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
            {data.summary.totalTokens.toLocaleString()}
          </div>
        </div>

        <div className="glass-card flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
            <BarChart3 size={16} />
            <span style={{ fontSize: '0.85rem' }}>Total API Calls</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>
            {data.summary.totalCalls.toLocaleString()}
          </div>
        </div>

        <div className="glass-card flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '0.85rem' }}>Estimated Cost</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>
            ${data.summary.totalCost}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Daily AI Consumption
          </h3>
          <div className="id-badge">Last 30 Days</div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="var(--muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="var(--muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  padding: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTokens)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Cost Breakdown by Provider</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mock data for now until we have real multi-provider records */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
              <span>OpenAI (GPT-4o)</span>
            </div>
            <span style={{ fontWeight: 600 }}>${(Number(data.summary.totalCost) * 0.7).toFixed(4)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <span>Google Gemini</span>
            </div>
            <span style={{ fontWeight: 600 }}>${(Number(data.summary.totalCost) * 0.3).toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
