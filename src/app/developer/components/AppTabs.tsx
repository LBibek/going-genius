'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Key, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  Bot,
  FileText
} from 'lucide-react';

interface TabProps {
  overview: React.ReactNode;
  access: React.ReactNode;
  config: React.ReactNode;
  billing: React.ReactNode;
  settings: React.ReactNode;
}

export function AppTabs({ overview, access, config, billing, settings }: TabProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'config', label: 'Configuration', icon: Key },
    { id: 'access', label: 'Access & Users', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-nav">
        {tabs.map((tab) => (
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
        {activeTab === 'config' && config}
        {activeTab === 'access' && access}
        {activeTab === 'billing' && billing}
        {activeTab === 'settings' && settings}
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
