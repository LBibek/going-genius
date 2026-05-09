import React from 'react';
import { Zap, CreditCard } from 'lucide-react';

interface GGBillingButtonProps {
  appId: string;
  planId?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
}

export function GGBillingButton({ 
  appId, 
  planId, 
  className = '', 
  children,
  variant = 'primary',
  onClick
}: GGBillingButtonProps) {
  
  const handleCheckout = () => {
    if (onClick) {
      onClick();
      return;
    }
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const checkoutUrl = new URL(`https://going-genius.vercel.app/demo/billing/${appId}`);
    if (planId) checkoutUrl.searchParams.append('planId', planId);
    checkoutUrl.searchParams.append('redirect_url', baseUrl);
    
    window.location.href = checkoutUrl.toString();
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    border: 'none',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const variants = {
    primary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      color: 'inherit'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'inherit'
    }
  };

  const activeStyles: React.CSSProperties = {
    transform: 'scale(0.96)'
  };

  return (
    <button 
      onClick={handleCheckout}
      className={`gg-billing-button ${className}`}
      style={{ ...baseStyles, ...variants[variant] }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Zap size={16} fill={variant === 'primary' ? 'currentColor' : 'none'} />
      <span>{children || 'Upgrade with Going Genius'}</span>
      <CreditCard size={14} style={{ opacity: 0.6 }} />
    </button>
  );
}
