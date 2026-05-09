import { useState, useEffect } from 'react';
import { useGoingGenius } from './context';

export function useGGPlan(appId: string) {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGoingGenius();

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setHasActiveSubscription(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/gg/subscription?appId=${appId}`);
        const data = await res.json();
        setHasActiveSubscription(data.active);
      } catch (err) {
        setError('Failed to verify subscription');
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [appId, user]);

  return { hasActiveSubscription, isLoading, error };
}
