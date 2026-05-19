'use client';

import React from 'react';
import Link from 'next/link';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glowing';
  glowColor?: 'golden' | 'blue' | 'purple' | 'emerald';
  fullWidth?: boolean;
  href?: string;
}

export function GlowButton({
  children,
  className = '',
  variant = 'glowing',
  glowColor = 'golden',
  fullWidth = false,
  href,
  ...props
}: GlowButtonProps) {
  
  const buttonClass = [
    "btn-glow",
    `btn-glow-${variant}`,
    fullWidth ? "btn-glow-w-full" : "",
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
      {variant === 'glowing' && (
        <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </>
  );

  // If href is specified, render as either an external link or a Next.js Link
  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a href={href} className={buttonClass}>
          {content}
        </a>
      );
    }
    
    return (
      <Link href={href} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClass} {...props}>
      {content}
    </button>
  );
}
