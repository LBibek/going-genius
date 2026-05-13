'use client';

import { 
  Users, 
  Gift, 
  TrendingUp, 
  Clock
} from 'lucide-react';
import { ReferralClient as ReferralCodeClient } from './ReferralClient';

interface ReferralPageClientProps {
  stats: any;
}

export function ReferralPageClient({ stats }: ReferralPageClientProps) {
  return (
    <div className="referral-container">
      <header className="page-header">
        <h1 className="fluid-h2">Developer Referral Program</h1>
        <p className="text-muted">Grow the Going Genius ecosystem and earn commissions for every developer you refer.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <Users className="icon" size={24} />
          <div className="data">
            <span className="label">Total Referrals</span>
            <span className="val">{stats.referralCount}</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <Gift className="icon" size={24} />
          <div className="data">
            <span className="label">Total Earned</span>
            <span className="val">NPR {stats.totalEarned.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <TrendingUp className="icon" size={24} />
          <div className="data">
            <span className="label">Pending Payout</span>
            <span className="val text-warning">NPR {stats.pendingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="referral-box glass-card">
          <h3>Your Referral Code</h3>
          <p className="text-sm text-muted">Share this code or link with other developers.</p>
          <ReferralCodeClient code={stats.referralCode} />
        </div>

        <div className="history-box glass-card">
          <h3>Earning History</h3>
          {stats.history.length === 0 ? (
            <div className="empty-state">
              <Clock size={40} className="text-muted" />
              <p>No earnings history yet. Start referring!</p>
            </div>
          ) : (
            <table className="referral-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.history.map((item: any) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="font-bold">NPR {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .referral-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-card .icon {
          color: var(--primary);
          padding: 12px;
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 12px;
        }

        .stat-card .data {
          display: flex;
          flex-direction: column;
        }

        .stat-card .label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-card .val {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
        }

        .referral-box {
          padding: 2rem;
          height: fit-content;
        }

        .referral-box h3 {
          margin-bottom: 0.5rem;
        }

        .history-box {
          padding: 2rem;
        }

        .history-box h3 {
          margin-bottom: 1.5rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 1rem;
        }

        .referral-table {
          width: 100%;
          border-collapse: collapse;
        }

        .referral-table th {
          text-align: left;
          padding: 1rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .referral-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .status-pill.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-pill.paid { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
