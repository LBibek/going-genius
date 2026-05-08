'use client';

import { useState } from 'react';
import { 
  User, 
  Shield, 
  Settings, 
  Activity,
  Key,
  Globe,
  CreditCard
} from 'lucide-react';

interface TabProps {
  overview: React.ReactNode;
  security: React.ReactNode;
  account: React.ReactNode;
  integrations: React.ReactNode;
  billing: React.ReactNode;
}

export function UserTabs({ overview, security, account, integrations, billing }: TabProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-nav">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content animate-fade-in">
        {activeTab === 'overview' && overview}
        {activeTab === 'security' && security}
        {activeTab === 'account' && account}
        {activeTab === 'integrations' && integrations}
        {activeTab === 'billing' && billing}
      </div>

      <style jsx>{`
        .tabs-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .tabs-nav {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs-nav::-webkit-scrollbar { display: none; }
        
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.25rem;
          border: none;
          background: transparent;
          color: var(--muted);
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .tab-btn.active {
          background: var(--primary);
          color: #000;
          font-weight: 600;
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        
        .tab-btn:not(.active):hover {
          background: rgba(255,255,255,0.05);
          color: var(--foreground);
        }
        
        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
}
