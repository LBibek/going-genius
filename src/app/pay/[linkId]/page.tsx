import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { CartSheet } from '@/components/billing/CartSheet';
import { PaymentActions } from './PaymentActions';
import { ShieldCheck, Check } from 'lucide-react';

export default async function DirectPaymentPage({ params, searchParams }: { params: Promise<{ linkId: string }>, searchParams: Promise<{ redirect_url?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const planId = resolvedParams.linkId;
  const redirectUrl = resolvedSearch.redirect_url;
  
  const session = await getSession();

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
    include: { app: true }
  });

  if (!plan || !plan.isActive) notFound();

  // If the user isn't logged in, they must log in first to pay.
  // We attach a callback url to redirect back here.
  if (!session) {
    const callback = encodeURIComponent(`/pay/${planId}${redirectUrl ? `?redirect_url=${redirectUrl}` : ''}`);
    redirect(`/auth/login?callbackUrl=${callback}`);
  }

  // Parse features safely
  let features: string[] = [];
  if (plan.features) {
    try {
      features = typeof plan.features === 'string' ? JSON.parse(plan.features) : (plan.features as string[]);
    } catch (e) {
      features = [];
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="p-8 text-center border-b border-zinc-800 bg-zinc-900/50">
            {plan.app.logoUrl ? (
              <img src={plan.app.logoUrl} alt={plan.app.name} className="w-16 h-16 rounded-2xl mx-auto mb-4 border border-zinc-800 shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-md text-2xl font-bold">
                {plan.app.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white mb-2">{plan.app.name}</h1>
            <p className="text-zinc-400">Complete your subscription for {plan.name}</p>
          </div>

          {/* Plan Details */}
          <div className="p-8 bg-zinc-950">
            <div className="flex justify-center items-end gap-1 mb-6">
              <span className="text-4xl font-extrabold">{plan.currency} {plan.price.toLocaleString()}</span>
              <span className="text-zinc-500 mb-1">/{plan.interval}</span>
            </div>

            {features.length > 0 && (
              <div className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-indigo-500/20 text-indigo-400 p-1 rounded-full">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                Secure payment processed by <strong className="text-white">Going Genius</strong>. Your financial details are never shared with {plan.app.name}.
              </p>
            </div>

            <PaymentActions 
              appId={plan.appId} 
              planId={plan.id} 
              amount={plan.price}
              redirectUrl={redirectUrl}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-zinc-600">
          Powered by <span className="font-bold text-zinc-500">Going Genius</span> Billing
        </div>
      </div>
      <CartSheet appId={plan.appId} />
    </div>
  );
}
