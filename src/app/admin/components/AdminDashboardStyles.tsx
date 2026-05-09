'use client';

export function AdminDashboardStyles() {
  return (
    <style jsx global>{`
      .leads-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .lead-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 12px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--glass-border);
      }
      .lead-avatar-sm {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--primary);
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.8rem;
      }
    `}</style>
  );
}
