'use client';

import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-lg",
        secondary: "bg-muted text-foreground hover:bg-muted-light",
        outline: "border-2 border-primary/50 text-foreground hover:border-primary bg-transparent",
        glowing: "bg-gradient-to-br from-primary to-primary-hover text-black font-bold shadow-[0_0_20px_var(--primary-glow)] hover:shadow-[0_0_35px_var(--primary-glow)] hover:-translate-y-1",
      },
      glowColor: {
        golden: "shadow-[0_0_20px_rgba(255,177,22,0.4)]",
        blue: "shadow-[0_0_20px_rgba(59,130,246,0.4)] from-blue-500 to-blue-600 ring-blue-500",
        purple: "shadow-[0_0_20px_rgba(168,85,247,0.4)] from-purple-500 to-purple-600 ring-purple-500",
        emerald: "shadow-[0_0_20px_rgba(16,185,129,0.4)] from-emerald-500 to-emerald-600 ring-emerald-500",
        none: "",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
      }
    },
    defaultVariants: {
      variant: "glowing",
      glowColor: "golden",
      fullWidth: false,
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function GlowButton({
  children,
  className,
  variant,
  glowColor,
  fullWidth,
  size,
  href,
  ...props
}: GlowButtonProps) {
  
  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
      {variant === 'glowing' && (
        <>
          <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 hover:animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
        </>
      )}
    </>
  );

  const mergedClasses = cn(buttonVariants({ variant, glowColor, fullWidth, size, className }));

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a href={href} className={mergedClasses}>
          {content}
        </a>
      );
    }
    
    return (
      <Link href={href} className={mergedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={mergedClasses} {...props}>
      {content}
    </button>
  );
}
