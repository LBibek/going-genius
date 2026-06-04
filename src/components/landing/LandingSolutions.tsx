'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SparkleBadge } from '@/components/ui/SparkleBadge';
import { Key, CreditCard, Lock, BarChart, Shield, Bot, CheckCircle2 } from 'lucide-react';

export function LandingSolutions() {
  const solutions = [
    {
      icon: <Key className="w-8 h-8 text-primary" />,
      title: "Unified Auth & SSO",
      desc: "Secure, developer-friendly identity vault for B2B & B2C users. Built-in social login, session management, and multi-tenant structures.",
      features: ["OAuth2 & OpenID", "Multi-Tenant SSO", "Secure Profile Vault"],
      glow: "golden" as const
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-400" />,
      title: "Localized Payment Rails",
      desc: "Collect one-off or recurring subscription fees seamlessly using Khalti, eSewa, and global payment processors out-of-the-box.",
      features: ["Khalti & eSewa Hooks", "Automatic Invoicing", "Instant Settlement"],
      glow: "purple" as const
    },
    {
      icon: <Lock className="w-8 h-8 text-emerald-400" />,
      title: "Flexible Subscription Tiers",
      desc: "Create granular access tiers, trial configurations, and consumption-based gating limits with zero boilerplate code.",
      features: ["Tier-Based RBAC", "Real-Time Enforcements", "Usage-Based Billing"],
      glow: "emerald" as const
    },
    {
      icon: <BarChart className="w-8 h-8 text-blue-400" />,
      title: "Billing & User Insights",
      desc: "Complete dashboard analytics to track Monthly Recurring Revenue (MRR), churn rate, active logins, and gating efficiency.",
      features: ["MRR/ARR Dashboards", "User Event Analytics", "Exportable Audit Logs"],
      glow: "blue" as const
    },
    {
      icon: <Shield className="w-8 h-8 text-zinc-300" />,
      title: "Enterprise Security",
      desc: "Zero-trust tokenization, secure session keys via 'jose', encrypted password salts, and atomic database safeguards.",
      features: ["Encrypted Session Vault", "Role-Based Gating", "Prisma Atomic Isolation"],
      glow: "none" as const
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-400" />,
      title: "Firebase Genkit SDK",
      desc: "Deploy intelligent AI workflows powered by Firebase Genkit. Easily implement support agents, chatbots, and semantic search tools.",
      features: ["Firebase Genkit SDK", "Custom Tool Calling", "Conversational Agents"],
      glow: "purple" as const
    }
  ];

  return (
    <section id="solutions" className="premium-showcase-section">
      <div className="container">
        <div className="section-header text-center animate-fade-up">
          <SparkleBadge variant="emerald" animated={false}>
            PLATFORM CAPABILITIES
          </SparkleBadge>
          <h2 className="section-title mt-4">Architected for Speed & Scale</h2>
          <p className="section-subtitle">Everything you need to launch secure, billing-enabled B2B and B2C platforms in record time.</p>
        </div>

        <div className="premium-grid">
          {solutions.map((sol, index) => (
            <GlassCard key={index} glowColor={sol.glow} hoverEffect="translate" className="p-10 flex flex-col justify-between">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                {sol.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">{sol.title}</h3>
              <p className="text-muted-light text-sm mb-8 leading-relaxed flex-grow">{sol.desc}</p>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
              
              <ul className="flex flex-col gap-3">
                {sol.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-primary opacity-80" />
                    {feat}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
