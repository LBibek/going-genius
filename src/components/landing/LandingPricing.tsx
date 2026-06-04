'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { CheckCircle2, XCircle } from 'lucide-react';

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-foreground">
            Flexible Developer & Team Pricing
          </h2>
          <p className="text-lg text-muted-light">
            Choose the right tier to launch your billing-enabled SaaS or subscription application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          <GlassCard glowColor="none" hoverEffect="scale" className="p-10 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-heading text-zinc-100">Developer Starter</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">NPR 0</span>
                <span className="text-sm font-medium text-muted">/mo</span>
              </div>
              <p className="text-muted-light text-sm mt-3 leading-relaxed">Ideal for sandboxes, personal projects, and local testing.</p>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <ul className="flex-1 space-y-4 my-4 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Up to 100 Active Users</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Basic Identity & SSO</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Standard Content Gating</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Local DB Sync</span></li>
              <li className="flex items-center gap-3 opacity-50"><XCircle className="w-5 h-5 text-red-400" /> <span className="text-zinc-500 line-through">Production Webhooks</span></li>
              <li className="flex items-center gap-3 opacity-50"><XCircle className="w-5 h-5 text-red-400" /> <span className="text-zinc-500 line-through">Multi-Tenant Support</span></li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-white/5">
              <GlowButton href="/auth/register" variant="outline" fullWidth={true}>
                Get Started
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard glowColor="golden" hoverEffect="scale" className="p-10 flex flex-col relative transform md:-translate-y-4 border-primary/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_var(--primary-glow)]">
              Recommended
            </div>
            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold font-heading text-primary">Launch Professional</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">NPR 4,999</span>
                <span className="text-sm font-medium text-primary/70">/mo</span>
              </div>
              <p className="text-muted-light text-sm mt-3 leading-relaxed">For launching production SaaS apps with live localized billing.</p>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

            <ul className="flex-1 space-y-4 my-4 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-zinc-300">Unlimited Active Users</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-white font-semibold">Production Khalti & eSewa</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-white font-semibold">Advanced Role-Based Gating</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-white font-semibold">Webhooks & Developer APIs</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-white font-semibold">Custom Theme/Branding</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="text-zinc-300">Email/SMS Support Integrations</span></li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-white/5">
              <GlowButton href="/auth/register" variant="glowing" glowColor="golden" fullWidth={true}>
                Go Pro
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard glowColor="none" hoverEffect="scale" className="p-10 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-heading text-zinc-100">Enterprise Core</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-muted-light text-sm mt-3 leading-relaxed">For high-traffic platforms, custom regulatory compliance, and multi-tenant networks.</p>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <ul className="flex-1 space-y-4 my-4 text-sm">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Dedicated Database Pools</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Custom On-premises Setup</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Advanced Genkit AI Nodes</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Zero-downtime Migration Help</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">24/7 Priority Support SLAs</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> <span className="text-zinc-300">Custom Security Compliance</span></li>
            </ul>
            
            <div className="mt-auto pt-6 border-t border-white/5">
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
