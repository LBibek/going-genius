/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import { useGGPlan } from './useGGPlan';
import { GGBillingButton } from './GGBillingButton';
import { Loader2, Lock } from 'lucide-react';

interface GGFeatureGateProps {
  appId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  showUpgradeButton?: boolean;
  upgradeLabel?: string;
}

/**
 * A drop-in component to conditionally render UI based on the user's active subscription.
 */
export function GGFeatureGate({ 
  appId, 
  children, 
  fallback, 
  loadingComponent,
  showUpgradeButton = true,
  upgradeLabel = "Upgrade to unlock this feature"
}: GGFeatureGateProps) {
  const { hasActiveSubscription, isLoading, error } = useGGPlan(appId);

  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center p-8 animate-pulse text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Verifying subscription...
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  // Default fallback UI if no fallback is provided
  if (!fallback) {
    return (
      <div className="bg-muted/30 border border-border rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-lg mb-2">Premium Feature</h4>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
          This feature requires an active subscription to {appId}.
        </p>
        {showUpgradeButton && (
          <GGBillingButton appId={appId} label={upgradeLabel} className="mx-auto" />
        )}
      </div>
    );
  }

  return <>{fallback}</>;
}
