import React from 'react';
import { useGGPlan } from './useGGPlan';
import { GGBillingButton } from './GGBillingButton';

interface GGFeatureGateProps {
  appId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  showUpgradeButton?: boolean;
  upgradeLabel?: string;
}

export function GGFeatureGate({ 
  appId, 
  children, 
  fallback, 
  loadingComponent,
  showUpgradeButton = true,
  upgradeLabel = "Upgrade to unlock this feature"
}: GGFeatureGateProps) {
  const { hasActiveSubscription, isLoading } = useGGPlan(appId);

  if (isLoading) {
    return loadingComponent || (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        Verifying subscription...
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  if (!fallback) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(31, 41, 55, 0.5)', 
        border: '1px solid #374151', 
        borderRadius: '16px', 
        padding: '32px', 
        textAlign: 'center' 
      }}>
        <h4 style={{ color: '#fff', marginBottom: '8px' }}>Premium Feature</h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
          This feature requires an active subscription to {appId}.
        </p>
        {showUpgradeButton && (
          <GGBillingButton appId={appId} label={upgradeLabel} variant="primary" />
        )}
      </div>
    );
  }

  return <>{fallback}</>;
}
