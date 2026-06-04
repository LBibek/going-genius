'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "relative rounded-3xl backdrop-blur-xl border bg-black/40 text-foreground overflow-hidden",
  {
    variants: {
      glowColor: {
        golden: 'shadow-[0_0_30px_rgba(255,177,22,0.08)] border-[rgba(255,177,22,0.2)] hover:border-[rgba(255,177,22,0.4)] hover:shadow-[0_0_50px_rgba(255,177,22,0.15)]',
        blue: 'shadow-[0_0_30px_rgba(59,130,246,0.08)] border-[rgba(59,130,246,0.2)] hover:border-[rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]',
        purple: 'shadow-[0_0_30px_rgba(168,85,247,0.08)] border-[rgba(168,85,247,0.2)] hover:border-[rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]',
        emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.08)] border-[rgba(16,185,129,0.2)] hover:border-[rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]',
        none: 'border-white/10 hover:border-white/20'
      },
      hoverEffect: {
        translate: 'transition-all duration-300 hover:-translate-y-2',
        scale: 'transition-all duration-300 hover:scale-[1.02]',
        none: 'transition-all duration-300'
      }
    },
    defaultVariants: {
      glowColor: "none",
      hoverEffect: "translate"
    }
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function GlassCard({
  children,
  className,
  glowColor,
  hoverEffect,
  ...props
}: GlassCardProps) {
  
  return (
    <div
      className={cn(cardVariants({ glowColor, hoverEffect, className }))}
      {...props}
    >
      {/* Absolute layout background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-3xl" />
      <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] pointer-events-none rounded-3xl" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
