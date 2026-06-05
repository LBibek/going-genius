import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Copy, ExternalLink, Link as LinkIcon, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function PaymentLinksPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;
  
  const session = await getSession();
  if (!session || !session.userId) redirect('/auth/login');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId },
    include: { plans: true }
  });

  if (!app) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Payment Links</h1>
          <p className="text-zinc-400">
            Share these links with your customers to accept payments without writing any code.
          </p>
        </div>
        <Link 
          href={`/developer/apps/${appId}/plans`}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Plan</span>
        </Link>
      </div>

      {app.plans.length === 0 ? (
        <div className="border border-zinc-800 rounded-xl p-12 text-center bg-zinc-900/50">
          <LinkIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No subscription plans found</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            You need to create at least one subscription plan before you can generate payment links.
          </p>
          <Link 
            href={`/developer/apps/${appId}/plans`}
            className="inline-flex items-center space-x-2 bg-white text-black hover:bg-zinc-200 px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            <span>Create your first plan</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {app.plans.map(plan => (
            <div key={plan.id} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {plan.name}
                  {!plan.isActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </h3>
                <p className="text-sm text-zinc-400">
                  {plan.currency} {plan.price.toLocaleString()} / {plan.interval}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 md:min-w-[300px]">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                    <div className="px-3 py-2 bg-zinc-900 border-r border-zinc-800 text-zinc-500">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://going-genius.com/pay/${plan.id}`}
                      className="w-full bg-transparent border-none text-sm text-zinc-300 px-3 py-2 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={`/pay/${plan.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors group relative"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
