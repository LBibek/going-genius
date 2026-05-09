import React from 'react';

interface GGBillingButtonProps {
  appId: string;
  planId?: string;
  className?: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
}

export function GGBillingButton({ 
  appId, 
  planId, 
  className = '', 
  label = 'Upgrade with Going Genius',
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

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    fontSize: '14px'
  };

  const variants = {
    primary: {
      backgroundColor: '#6366f1',
      color: '#ffffff'
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #374151',
      color: '#d1d5db'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#9ca3af'
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      className={`gg-billing-button ${className}`}
      style={{ ...baseStyles, ...variants[variant] }}
    >
      {label}
    </button>
  );
}
