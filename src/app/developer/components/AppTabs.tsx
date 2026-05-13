/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
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
  FileText,
  Sparkles,
  Layers,
  Terminal,
  Globe
} from 'lucide-react';

interface TabProps {
  overview: React.ReactNode;
  access: React.ReactNode;
  usage: React.ReactNode;
  config: React.ReactNode;
  billing: React.ReactNode;
  settings: React.ReactNode;
  playground: React.ReactNode;
  prompts: React.ReactNode;
  integrations: React.ReactNode;
  leads: React.ReactNode;
  simulator: React.ReactNode;
  domains: React.ReactNode;
  isPremium?: boolean;
}

export function AppTabs({ overview, access, usage, config, billing, settings, playground, prompts, integrations, leads, simulator, domains, isPremium = false }: TabProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'usage', label: 'Usage & AI', icon: Sparkles, isPremium: true },
    { id: 'config', label: 'Configuration', icon: Key },
    { id: 'prompts', label: 'Prompt Manager', icon: FileText, isPremium: true },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'access', label: 'Access & Users', icon: Users },
    { id: 'leads', label: 'Leads & CRM', icon: Users, isPremium: true },
    { id: 'billing', label: 'Billing', icon: CreditCard, isPremium: true },
    { id: 'playground', label: 'AI Playground', icon: Bot, isPremium: true },
    { id: 'simulator', label: 'Webhook Simulator', icon: Terminal },
    { id: 'domains', label: 'Custom Domains', icon: Globe, isPremium: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-nav">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''} ${tab.isPremium && !isPremium ? 'premium-tab' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {tab.icon && <tab.icon size={18} />}
              <span>{tab.label}</span>
              {tab.isPremium && !isPremium && (
                <Sparkles size={12} className="premium-sparkle" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="tab-content animate-fade-in">
        {activeTab === 'overview' && overview}
        {activeTab === 'usage' && usage}
        {activeTab === 'config' && config}
        {activeTab === 'integrations' && integrations}
        {activeTab === 'access' && access}
        {activeTab === 'leads' && leads}
        {activeTab === 'billing' && billing}
        {activeTab === 'prompts' && prompts}
        {activeTab === 'playground' && playground}
        {activeTab === 'simulator' && simulator}
        {activeTab === 'domains' && domains}
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

        .premium-tab {
          border: 1px solid transparent;
        }

        :global(.premium-sparkle) {
          color: #FFB116;
          filter: drop-shadow(0 0 4px rgba(255, 177, 22, 0.4));
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
