'use client';

import { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Layout, 
  Code2, 
  ArrowRight,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { GGBillingButton } from '@going-genius/react';

export default function SDKDemoPage() {
  const [activeTab, setActiveTab] = useState('auth');

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap size={14} /> Developer Experience
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Integrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Going Genius</span> in Minutes
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our SDK handles the complexity of identity, subscription gating, and usage monitoring so you can focus on building your core product.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Patterns */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layout size={20} className="text-blue-500" /> Integration Patterns
            </h2>
            
            <button 
              onClick={() => setActiveTab('auth')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'auth' ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className="font-bold mb-1">Simple Content Gating</div>
              <div className="text-xs opacity-70">Hide features behind subscription tiers using pre-built components.</div>
            </button>

            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'billing' ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className="font-bold mb-1">Interactive Billing</div>
              <div className="text-xs opacity-70">Drop-in checkout buttons with Khalti/eSewa support.</div>
            </button>

            <button 
              onClick={() => setActiveTab('usage')}
              className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === 'usage' ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className="font-bold mb-1">Usage Monitoring</div>
              <div className="text-xs opacity-70">Track API tokens and consumption in real-time.</div>
            </button>
          </div>

          {/* Code & Preview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 rounded-2xl border border-white/5 bg-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Live Preview</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {activeTab === 'auth' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="text-green-500" />
                      <span className="font-bold">Premium Content Protected</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">This section is only visible to "Pro" members.</p>
                    <div className="h-20 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-lg animate-pulse border border-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-medium">Unlocked Data Visualization</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6 text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <GGBillingButton appId="gg_demo_app" planId="pro" className="w-full">Upgrade to Pro</GGBillingButton>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure checkout via Going Genius</div>
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">API Tokens</div>
                      <div className="text-2xl font-mono font-bold text-blue-400">12,482</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Cost (Est)</div>
                      <div className="text-2xl font-mono font-bold text-green-400">$4.12</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Code2 size={20} className="text-blue-400" /> Implementation Code
              </h3>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">
{activeTab === 'auth' && `// Using the Feature Gate
import { GGFeatureGate } from '@going-genius/react';

export function PremiumArea() {
  return (
    <GGFeatureGate 
      plan="pro" 
      fallback={<UpgradeNotice />}
    >
      <AdvancedCharts />
    </GGFeatureGate>
  );
}`}

{activeTab === 'billing' && `// Dropping a Billing Button
import { GGBillingButton } from '@going-genius/react';

export function Pricing() {
  return (
    <GGBillingButton 
      planId="price_123" 
      variant="premium"
    >
      Upgrade to Pro
    </GGBillingButton>
  );
}`}

{activeTab === 'usage' && `// Reactive Usage Monitoring
import { useGGUsage } from '@going-genius/react';

export function UsageStats() {
  const { tokens, cost } = useGGUsage();

  return (
    <div>
      <span>Tokens: {tokens}</span>
      <span>Cost: \${cost}</span>
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}
