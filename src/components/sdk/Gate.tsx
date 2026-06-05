import { ReactNode } from 'react';
import { hasAccessToPlan } from '@/lib/gating';

interface GateProps {
  appId: string;
  planId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Server component that only renders its children if the user has an active
 * subscription to the specified plan.
 */
export async function Gate({ appId, planId, children, fallback = null }: GateProps) {
  const hasAccess = await hasAccessToPlan(appId, planId);

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
