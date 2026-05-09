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
      <div className="flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase">
          <AlertTriangle size={12} />
          Confirm Cancellation
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            disabled={isPending}
            onClick={() => setIsConfirming(false)}
            className="py-2 px-3 rounded-lg border border-border text-[10px] font-bold hover:bg-muted"
          >
            Keep Plan
          </button>
          <button 
            disabled={isPending}
            onClick={handleCancel}
            className="py-2 px-3 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 flex items-center justify-center"
          >
            {isPending ? <Loader2 size={12} className="animate-spin" /> : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted font-bold text-xs transition-colors"
    >
      <XCircle size={14} className="text-muted-foreground" />
      Cancel
    </button>
  );
}
