'use client';

import React from 'react';
import { SparkleBadge } from '@/components/ui/SparkleBadge';
import { GlowButton } from '@/components/ui/GlowButton';

export function LandingHero() {
  return (
    <section className="hero-section">
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow" />
      
      <div className="container hero-container animate-fade-in">
        <SparkleBadge variant="golden" animated={true} className="mb-4">
          🔐 ENTERPRISE IDENTITY & SUBSCRIPTION ENGINE
        </SparkleBadge>
        
        <h1 className="hero-title mt-4">
          The Billing & Identity Engine <br />
          for <span className="gradient-text-golden">Modern SaaS Platforms</span>
        </h1>
        <p className="hero-subtitle">
          The premium B2B/B2C user identity, dynamic content gating, and subscription-billing boilerplate for organizations and developers. 
          Fully integrated with Khalti, eSewa, and modern payment gateways to power your digital growth.
        </p>
        
        <div className="hero-actions">
          <GlowButton href="/auth/register" variant="glowing" glowColor="golden" className="w-[200px]">
            Start Building Now
          </GlowButton>
          <GlowButton href="#solutions" variant="outline" className="w-[200px]">
            Explore Solutions →
          </GlowButton>
        </div>

        <div className="hero-visual-wrapper">
          <div className="hero-visual-glow"></div>
          <div className="hero-visual-card glass-card">
            <img 
              src="/images/identity_billing_hero.png" 
              alt="Identity & Billing Engine" 
              className="hero-visual-img"
            />
            <div className="visual-floating-badge badge-1">
              <span className="icon">🆔</span>
              <span className="text">Single Sign-On (SSO)</span>
            </div>
            <div className="visual-floating-badge badge-2">
              <span className="icon">🔐</span>
              <span className="text">Multi-Tier Gating</span>
            </div>
            <div className="visual-floating-badge badge-3">
              <span className="icon">💸</span>
              <span className="text">Khalti & eSewa SDK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
