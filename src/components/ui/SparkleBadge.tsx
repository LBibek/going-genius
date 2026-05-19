'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SparkleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'golden' | 'blue' | 'purple' | 'emerald';
  animated?: boolean;
}

export function SparkleBadge({
  children,
  className = '',
  variant = 'golden',
  animated = true,
  ...props
}: SparkleBadgeProps) {
  
  const variantStyles = {
    golden: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const badgeClass = [
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border backdrop-blur-md",
    animated ? "animate-pulse" : "",
    variantStyles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={badgeClass} {...props}>
      <Sparkles size={11} className="shrink-0 animate-bounce" />
      <span>{children}</span>
    </div>
  );
}
