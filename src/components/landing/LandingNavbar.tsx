'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingNavbarProps {
  session: any;
}

export function LandingNavbar({ session }: LandingNavbarProps) {
  return (
    <nav className="glass-navbar">
      <div className="container nav-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">GG</div>
          <span className="auth-logo-text">Going Genius</span>
        </div>
        <div className="nav-links">
          <Link href="#solutions" className="nav-link">Solutions</Link>
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#pricing" className="nav-link">Pricing</Link>
          <Link href="#developers" className="nav-link">API & SDK</Link>
        </div>
        <div className="nav-actions">
          {session ? (
            <Link href="/dashboard" className="btn-nav primary-gradient">Admin Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" className="nav-link hide-mobile">Sign In</Link>
              <Link href="/auth/register" className="btn-nav primary-gradient">Get Started</Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
