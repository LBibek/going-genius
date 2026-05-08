'use client';

export function Grid2Col({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-2-col">
      {children}
      <style jsx>{`
        .grid-2-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .grid-2-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export function AppsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="apps-grid">
      {children}
      <style jsx>{`
        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .apps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export function StatsRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="stats-row">
      {children}
      <style jsx>{`
        .stats-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .stats-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export function DashboardStyles({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-content">
      {children}
      <style jsx>{`
        .dashboard-content :global(.stat-card) {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .dashboard-content :global(.stat-label) {
          font-size: 0.8rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .dashboard-content :global(.stat-value) {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: var(--primary);
        }
        .dashboard-content :global(.app-card) {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
        }
        .dashboard-content :global(.app-card:hover) {
          transform: translateY(-4px);
          border-color: var(--primary);
          background: rgba(255, 177, 22, 0.05);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }
        .dashboard-content :global(.app-card-content) {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .dashboard-content :global(.app-logo-wrapper) {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--background-alt);
          border: 1px solid var(--border);
        }
        .dashboard-content :global(.app-logo-img) { width: 100%; height: 100%; object-fit: cover; }
        .dashboard-content :global(.app-logo-placeholder) {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: #000;
          font-weight: 800;
          font-size: 1.25rem;
        }
        .dashboard-content :global(.app-name) { font-size: 1.1rem; margin: 0 0 0.25rem 0; font-weight: 700; }
        .dashboard-content :global(.app-meta) { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; color: var(--muted); }
        .dashboard-content :global(.dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--border); }
        .dashboard-content :global(.status-active) { color: #10b981; font-weight: 600; }
        .dashboard-content :global(.status-inactive) { color: var(--muted); }
        .dashboard-content :global(.app-card-arrow) { font-size: 1.25rem; color: var(--muted); opacity: 0; transition: all 0.2s; }
        .dashboard-content :global(.app-card:hover .app-card-arrow) { opacity: 1; transform: translateX(4px); color: var(--primary); }
        .dashboard-content :global(.empty-state-icon) { font-size: 4rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}
