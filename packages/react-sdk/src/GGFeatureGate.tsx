import React from 'react';
import { useGGPlan } from './useGGPlan';
import { GGBillingButton } from './GGBillingButton';
import { Lock, Loader2 } from 'lucide-react';

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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '32px', 
        color: '#64748b',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
        <span>Verifying subscription...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  if (!fallback) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.1)', 
        borderRadius: '20px', 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#3b82f6'
        }}>
          <Lock size={24} />
        </div>
        <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>Premium Feature</h4>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          This section is reserved for subscribers. Upgrade your plan to gain full access.
        </p>
        {showUpgradeButton && (
          <GGBillingButton appId={appId} variant="primary">
            {upgradeLabel}
          </GGBillingButton>
        )}
      </div>
    );
  }

  return <>{fallback}</>;
}
