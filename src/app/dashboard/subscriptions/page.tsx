/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { 
  CreditCard, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Settings2,
  AlertCircle,
  History,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import Link from 'next/link';
import { SubscriptionManager } from './components/SubscriptionManager';
import { WalletAssistantUI } from './components/WalletAssistantUI';
import { getEcosystemBillingSummary } from '@/lib/billing';

export default async function SubscriptionsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const summary = await getEcosystemBillingSummary(session.userId);

  const subscriptions = await (prisma as any).subscription.findMany({
    where: { userId: session.userId },
    include: {
      app: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const transactions = await (prisma as any).transaction.findMany({
    where: { userId: session.userId },
    include: {
      app: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-outfit">
            Universal Wallet
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your centralized hub for subscriptions, billing, and access across the Going Genius ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Zap className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly Burn</p>
              <p className="text-2xl font-bold font-outfit text-amber-500">NPR {summary.totalMonthlyBurn.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Wallet className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lifetime Spend</p>
              <p className="text-2xl font-bold font-outfit">NPR {summary.totalLifetimeSpend.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Subscriptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-amber-500 w-5 h-5" />
              Active Subscriptions
            </h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {subscriptions.length} Apps
            </span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="bg-muted/20 border-2 border-dashed border-border rounded-3xl p-12 text-center">
              <div className="bg-muted/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-muted-foreground w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No active subscriptions</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                You haven't subscribed to any premium apps yet. Start exploring the ecosystem to unlock pro features.
              </p>
              <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all">
                Explore Ecosystem
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptions.map((sub: any) => (
                <div key={sub.id} className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                  <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest z-10 ${
                    sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {sub.status}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted border border-border relative">
                        <OptimizedImage 
                          src={sub.app.logoUrl || '/images/app-placeholder.png'} 
                          alt={sub.app.name}
                          width={56}
                          height={56}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{sub.app.name}</h3>
                        <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                          <ShieldCheck size={14} />
                          {sub.plan.name}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-muted/30 p-4 rounded-2xl">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pricing</span>
                        <span className="font-bold">NPR {sub.plan.price}/{sub.plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Renewal Date</span>
                        <span className="font-bold flex items-center gap-1.5">
                          <Clock size={14} className="text-muted-foreground" />
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <SubscriptionManager subscriptionId={sub.id} appName={sub.app.name} />
                        <Link 
                          href={`/demo/billing/${sub.appId}`} 
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all"
                        >
                          <ExternalLink size={14} />
                          Open App
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Recent Activity & Insights */}
        <div className="space-y-8">
          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Billing
            </h3>
            
            <div className="space-y-5">
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No recent transactions.</p>
              ) : (
                transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-bold shrink-0 border border-border">
                      {tx.app.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{tx.app.name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">NPR {tx.amount}</p>
                      <p className={`text-[10px] font-bold ${
                        tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>{tx.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-3 px-4 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors">
              View Full History
            </button>
          </div>

          {/* Ecosystem Insight */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <TrendingUp className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm mb-2">Ecosystem Loyalty</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                You're currently using {subscriptions.length} apps. GG ecosystem members save an average of 15% when bundling 3+ apps.
              </p>
              <Link href="/" className="text-xs font-black text-primary hover:underline">
                View Bundles →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <WalletAssistantUI />
    </div>
  );
}
