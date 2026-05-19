'use client';

import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glowColor?: 'golden' | 'blue' | 'purple';
}

export function GlassInput({
  label,
  error,
  className = '',
  glowColor = 'golden',
  ...props
}: GlassInputProps) {
  
  const focusStyles = {
    golden: 'focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(255,177,22,0.15)]',
    blue: 'focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    purple: 'focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
  };

  const inputClass = [
    "w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-foreground placeholder-white/30 focus:outline-none transition-all duration-300",
    focusStyles[glowColor],
    error ? "border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "",
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold text-muted-light tracking-wide uppercase px-1">
          {label}
        </label>
      )}
      <input className={inputClass} {...props} />
      {error && (
        <span className="text-xs font-medium text-red-400 px-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}
