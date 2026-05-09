/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { checkGGSubscription } from '@/app/actions/sdk';

export function useGGPlan(appId: string) {
  const [data, setData] = useState<{
    isLoading: boolean;
    hasActiveSubscription: boolean;
    subscription: any;
    error: string | null;
  }>({
    isLoading: true,
    hasActiveSubscription: false,
    subscription: null,
    error: null
  });

  useEffect(() => {
    async function check() {
      if (!appId) return;
      
      try {
        const result = await checkGGSubscription(appId);
        if ('error' in result) {
          setData(prev => ({ ...prev, error: result.error as string, isLoading: false }));
        } else {
          setData({
            isLoading: false,
            hasActiveSubscription: result.hasActiveSubscription,
            subscription: result.subscription,
            error: null
          });
        }
      } catch (err) {
        setData(prev => ({ ...prev, error: 'Failed to fetch subscription status', isLoading: false }));
      }
    }

    check();
  }, [appId]);

  return data;
}
