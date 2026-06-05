import React from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Mail, Phone, User, Calendar, Database } from 'lucide-react';

export const metadata = {
  title: 'Leads CRM | Going Genius',
};

export default async function LeadsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;
  const session = await getSession();

  if (!session) redirect('/auth/login');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId }
  });

  if (!app) redirect('/developer/dashboard');

  const leads = await prisma.lead.findMany({
    where: { appId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Leads CRM</h1>
          <p className="text-muted-light mt-2">Manage users captured by your AI Agents and marketing campaigns.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <Database size={16} />
          {leads.length} Total Leads
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Database className="mx-auto text-muted-light mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">No Leads Yet</h3>
          <p className="text-muted-light">
            Once users interact with your AI Agent and provide their contact info, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-border">Contact Info</th>
                <th className="px-6 py-4 font-medium border-b border-border">Source</th>
                <th className="px-6 py-4 font-medium border-b border-border">Status</th>
                <th className="px-6 py-4 font-medium border-b border-border">Captured On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {lead.name && <span className="font-bold flex items-center gap-2"><User size={14} className="text-muted-light"/> {lead.name}</span>}
                      {lead.email && <span className="text-sm flex items-center gap-2"><Mail size={14} className="text-muted-light"/> {lead.email}</span>}
                      {lead.phone && <span className="text-sm flex items-center gap-2"><Phone size={14} className="text-muted-light"/> {lead.phone}</span>}
                      {!lead.name && !lead.email && !lead.phone && <span className="text-muted-light italic">Anonymous</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {lead.source || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-light flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
