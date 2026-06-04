import React from 'react';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { RevenueChart } from '@/components/dashboard/RevenueChart';

export const metadata = {
  title: 'Analytics | Dashboard',
};

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Fetch apps owned by this user
  const apps = await prisma.oAuthApp.findMany({
    where: { ownerId: session.userId },
    select: { id: true, name: true }
  });

  const appIds = apps.map((app: { id: string }) => app.id);

  // Fetch last 30 days of transactions for these apps
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rawTransactions = await prisma.transaction.findMany({
    where: {
      appId: { in: appIds },
      createdAt: { gte: thirtyDaysAgo }
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      status: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground">Analytics</h1>
        <p className="text-muted-light mt-2">Track your MRR and transaction volume across your applications.</p>
      </div>

      {apps.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-light">Create an application to start tracking revenue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <RevenueChart transactions={rawTransactions} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Top Applications</h3>
              <ul className="space-y-4">
                {apps.map((app: { id: string, name: string }) => (
                  <li key={app.id} className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                    <span className="font-semibold">{app.name}</span>
                    <span className="text-primary text-sm font-bold">Active</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
              {rawTransactions.length === 0 ? (
                <p className="text-sm text-muted-light">No recent transactions.</p>
              ) : (
                <ul className="space-y-3">
                  {rawTransactions.slice(-5).reverse().map(t => (
                    <li key={t.id} className="flex justify-between text-sm">
                      <span className="text-muted-light">{new Date(t.createdAt).toLocaleDateString()}</span>
                      <span className={t.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}>
                        NPR {t.amount} ({t.status})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
