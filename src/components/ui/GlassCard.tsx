'use client';

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: 'golden' | 'blue' | 'purple' | 'emerald' | 'none';
  hoverEffect?: 'translate' | 'scale' | 'none';
  borderOpacity?: 'low' | 'medium' | 'high';
}

export function GlassCard({
  children,
  className = '',
  glowColor = 'none',
  hoverEffect = 'translate',
  borderOpacity = 'medium',
  ...props
}: GlassCardProps) {
  
  const glowStyles = {
    golden: 'shadow-[0_0_30px_rgba(255,177,22,0.06)] border-[rgba(255,177,22,0.18)] hover:border-[rgba(255,177,22,0.35)]',
    blue: 'shadow-[0_0_30px_rgba(59,130,246,0.06)] border-[rgba(59,130,246,0.18)] hover:border-[rgba(59,130,246,0.35)]',
    purple: 'shadow-[0_0_30px_rgba(168,85,247,0.06)] border-[rgba(168,85,247,0.18)] hover:border-[rgba(168,85,247,0.35)]',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.18)] hover:border-[rgba(16,185,129,0.35)]',
    none: 'border-white/10 hover:border-white/20'
  };

  const hoverStyles = {
    translate: 'transition-all duration-300 hover:-translate-y-2',
    scale: 'transition-all duration-300 hover:scale-[1.02]',
    none: 'transition-all duration-300'
  };

  const cardClass = [
    "relative rounded-3xl backdrop-blur-xl border bg-black/40 text-foreground overflow-hidden",
    glowStyles[glowColor],
    hoverStyles[hoverEffect],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClass}
      {...props}
    >
      {/* Absolute layout background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
