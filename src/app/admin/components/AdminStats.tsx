'use client';

import { Users, Layout, TrendingUp, Sparkles, CreditCard } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalApps: number;
    totalRevenue: number;
    platformProfit: number;
    totalLeads: number;
    activeSubs: number;
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    { label: 'Total Platform Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Total Apps Hosted', value: stats.totalApps, icon: Layout, color: '#a855f7' },
    { label: 'Platform Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`, icon: CreditCard, color: '#10b981' },
    { label: 'Platform Profit (2.5%)', value: `Rs. ${stats.platformProfit.toLocaleString()}`, icon: TrendingUp, color: '#fbbf24' },
    { label: 'Global Leads Captured', value: stats.totalLeads, icon: Sparkles, color: '#f43f5e' },
    { label: 'Active Subscriptions', value: stats.activeSubs, icon: CreditCard, color: '#0ea5e9' },
  ];

  return (
    <div className="admin-stats-grid">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
            <card.icon size={20} />
          </div>
          <div className="stat-info">
            <p className="stat-label">{card.label}</p>
            <h3 className="stat-value">{card.value}</h3>
          </div>
        </div>
      ))}

      <style jsx>{`
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-glow);
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-label {
          color: var(--muted);
          font-size: 0.8rem;
          margin: 0;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
