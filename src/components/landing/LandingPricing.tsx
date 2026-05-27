'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-foreground">
            Flexible Developer & Team Pricing
          </h2>
          <p className="text-lg text-muted-light">
            Choose the right tier to launch your billing-enabled SaaS or subscription application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          <GlassCard glowColor="none" hoverEffect="scale" className="p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-heading">Developer Starter</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">NPR 0</span>
                <span className="text-sm font-medium text-muted">/mo</span>
              </div>
              <p className="text-muted-light text-sm mt-3">Ideal for sandboxes, personal projects, and local testing.</p>
            </div>
            
            <ul className="flex-1 space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Up to 100 Active Users</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Basic Identity & SSO</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Standard Content Gating</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Local DB Sync</li>
              <li className="flex items-center gap-3 opacity-50"><span className="text-red-500">❌</span> Production Webhooks</li>
              <li className="flex items-center gap-3 opacity-50"><span className="text-red-500">❌</span> Multi-Tenant Support</li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <GlowButton href="/auth/register" variant="outline" fullWidth={true}>
                Get Started
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard glowColor="golden" hoverEffect="scale" className="p-8 flex flex-col relative transform md:-translate-y-4 border-primary/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Recommended
            </div>
            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold font-heading text-primary">Launch Professional</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">NPR 4,999</span>
                <span className="text-sm font-medium text-muted">/mo</span>
              </div>
              <p className="text-muted-light text-sm mt-3">For launching production SaaS apps with live localized billing.</p>
            </div>
            
            <ul className="flex-1 space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Unlimited Active Users</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> <strong className="text-foreground">Production Khalti & eSewa</strong></li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> <strong className="text-foreground">Advanced Role-Based Gating</strong></li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> <strong className="text-foreground">Webhooks & Developer APIs</strong></li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> <strong className="text-foreground">Custom Theme/Branding</strong></li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Email/SMS Support Integrations</li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <GlowButton href="/auth/register" variant="glowing" glowColor="golden" fullWidth={true}>
                Go Pro
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" hoverEffect="scale" className="p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-heading">Enterprise Core</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">Custom</span>
              </div>
              <p className="text-muted-light text-sm mt-3">For high-traffic platforms, custom regulatory compliance, and multi-tenant networks.</p>
            </div>
            
            <ul className="flex-1 space-y-4 my-8 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Dedicated Database Pools</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Custom On-premises Setup</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Advanced Genkit AI Nodes</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Zero-downtime Migration Help</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> 24/7 Priority Support SLAs</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✅</span> Custom Security Compliance</li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <GlowButton href="mailto:support@goinggenius.com.np" variant="outline" fullWidth={true}>
                Contact Sales
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
}
