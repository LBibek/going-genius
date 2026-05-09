/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Settings2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cancelSubscription } from '@/app/actions/sdk';
import { useRouter } from 'next/navigation';

export function SubscriptionManager({ subscriptionId, appName }: { subscriptionId: string, appName: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsPending(true);
    try {
      const result = await cancelSubscription(subscriptionId);
      if (result.success) {
        setIsConfirming(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex flex-col gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
          <AlertTriangle size={12} className="animate-pulse" />
          Final Confirmation
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">
          You'll lose access to {appName} premium features at the end of this billing cycle.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button 
            disabled={isPending}
            onClick={() => setIsConfirming(false)}
            className="py-2 px-3 rounded-xl bg-muted/50 border border-border text-[10px] font-bold hover:bg-muted transition-all"
          >
            Keep Pro
          </button>
          <button 
            disabled={isPending}
            onClick={handleCancel}
            className="py-2 px-3 rounded-xl bg-red-500 text-white text-[10px] font-black hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-1"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border bg-card/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 font-bold text-xs transition-all group"
    >
      <XCircle size={14} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
      Manage Plan
    </button>
  );
}
