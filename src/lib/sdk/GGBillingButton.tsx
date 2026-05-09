'use client';

import React from 'react';
import { CreditCard, Zap } from 'lucide-react';

interface GGBillingButtonProps {
  appId: string;
  planId?: string;
  className?: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function GGBillingButton({ 
  appId, 
  planId, 
  className = '', 
  label = 'Upgrade with Going Genius',
  variant = 'primary'
}: GGBillingButtonProps) {
  
  const handleCheckout = () => {
    const baseUrl = window.location.origin;
    const checkoutUrl = new URL(`${baseUrl}/demo/billing/${appId}`);
    if (planId) checkoutUrl.searchParams.append('planId', planId);
    
    // In a real SDK, this would redirect to the GG production billing domain
    window.location.href = checkoutUrl.toString();
  };

  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
    outline: "bg-transparent border border-border text-foreground hover:bg-muted",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
  };

  return (
    <button 
      onClick={handleCheckout}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <Zap size={18} className={variant === 'primary' ? 'animate-pulse' : ''} />
      <span>{label}</span>
      <CreditCard size={14} className="opacity-50 ml-1" />
    </button>
  );
}
