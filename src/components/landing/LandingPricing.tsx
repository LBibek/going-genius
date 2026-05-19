'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';

export function LandingPricing() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Flexible Developer & Team Pricing</h2>
          <p className="section-subtitle">Choose the right tier to launch your billing-enabled SaaS or subscription application.</p>
        </div>

        <div className="pricing-grid">
          <GlassCard glowColor="none" hoverEffect="scale" className="pricing-card p-10 flex flex-col justify-between">
            <div className="pricing-header">
              <h3>Developer Starter</h3>
              <div className="price text-3xl font-extrabold text-foreground mt-2">NPR 0<span className="text-sm font-medium text-muted">/mo</span></div>
              <p className="text-muted-light text-sm mt-3">Ideal for sandboxes, personal projects, and local testing.</p>
            </div>
            <ul className="pricing-features my-6">
              <li>✅ Up to 100 Active Users</li>
              <li>✅ Basic Identity & SSO</li>
              <li>✅ Standard Content Gating</li>
              <li>✅ Local DB Sync</li>
              <li>❌ Production Webhooks</li>
              <li>❌ Multi-Tenant Support</li>
            </ul>
            <GlowButton href="/auth/register" variant="outline" fullWidth={true}>
              Get Started
            </GlowButton>
          </GlassCard>

          <GlassCard glowColor="golden" hoverEffect="scale" className="pricing-card p-10 flex flex-col justify-between premium-tier">
            <div className="popular-badge">RECOMMENDED</div>
            <div className="pricing-header">
              <h3>Launch Professional</h3>
              <div className="price text-3xl font-extrabold text-foreground mt-2">NPR 4,999<span className="text-sm font-medium text-muted">/mo</span></div>
              <p className="text-muted-light text-sm mt-3">For launching production SaaS apps with live localized billing.</p>
            </div>
            <ul className="pricing-features my-6">
              <li>✅ Unlimited Active Users</li>
              <li>✅ <strong>Production Khalti & eSewa</strong></li>
              <li>✅ <strong>Advanced Role-Based Gating</strong></li>
              <li>✅ <strong>Webhooks & Developer APIs</strong></li>
              <li>✅ <strong>Custom Theme/Branding</strong></li>
              <li>✅ Email/SMS Support Integrations</li>
            </ul>
            <GlowButton href="/auth/register" variant="glowing" glowColor="golden" fullWidth={true}>
              Go Pro
            </GlowButton>
          </GlassCard>

          <GlassCard glowColor="none" hoverEffect="scale" className="pricing-card p-10 flex flex-col justify-between">
            <div className="pricing-header">
              <h3>Enterprise Core</h3>
              <div className="price text-3xl font-extrabold text-foreground mt-2">Custom</div>
              <p className="text-muted-light text-sm mt-3">For high-traffic platforms, custom regulatory compliance, and multi-tenant networks.</p>
            </div>
            <ul className="pricing-features my-6">
              <li>✅ Dedicated Database Pools</li>
              <li>✅ Custom On-premises Setup</li>
              <li>✅ Advanced Genkit AI Nodes</li>
              <li>✅ Zero-downtime Migration Help</li>
              <li>✅ 24/7 Priority Support SLAs</li>
              <li>✅ Custom Security Compliance</li>
            </ul>
            <GlowButton href="mailto:support@goinggenius.com.np" variant="outline" fullWidth={true}>
              Contact Sales
            </GlowButton>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
