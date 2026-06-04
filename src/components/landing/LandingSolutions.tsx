'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SparkleBadge } from '@/components/ui/SparkleBadge';

export function LandingSolutions() {
  const solutions = [
    {
      icon: "🔑",
      title: "Unified Auth & SSO",
      desc: "Secure, developer-friendly identity vault for B2B & B2C users. Built-in social login, session management, and multi-tenant structures.",
      features: ["OAuth2 & OpenID", "Multi-Tenant SSO", "Secure Profile Vault"],
      glow: "golden" as const
    },
    {
      icon: "💳",
      title: "Localized Payment Rails",
      desc: "Collect one-off or recurring subscription fees seamlessly using Khalti, eSewa, and global payment processors out-of-the-box.",
      features: ["Khalti & eSewa Hooks", "Automatic Invoicing", "Instant Settlement"],
      glow: "purple" as const
    },
    {
      icon: "🔐",
      title: "Flexible Subscription Tiers",
      desc: "Create granular access tiers, trial configurations, and consumption-based gating limits with zero boilerplate code.",
      features: ["Tier-Based RBAC", "Real-Time Enforcements", "Usage-Based Billing"],
      glow: "emerald" as const
    },
    {
      icon: "📊",
      title: "Billing & User Insights",
      desc: "Complete dashboard analytics to track Monthly Recurring Revenue (MRR), churn rate, active logins, and gating efficiency.",
      features: ["MRR/ARR Dashboards", "User Event Analytics", "Exportable Audit Logs"],
      glow: "blue" as const
    },
    {
      icon: "🛡️",
      title: "Enterprise Security",
      desc: "Zero-trust tokenization, secure session keys via 'jose', encrypted password salts, and atomic database safeguards.",
      features: ["Encrypted Session Vault", "Role-Based Gating", "Prisma Atomic Isolation"],
      glow: "none" as const
    },
    {
      icon: "🤖",
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
              <div className="premium-icon">{sol.icon}</div>
              <h3 className="text-xl font-bold mt-4 mb-2">{sol.title}</h3>
              <p className="text-muted-light text-sm mb-6 leading-relaxed">{sol.desc}</p>
              <ul className="premium-features-list">
                {sol.features.map((feat, fIdx) => (
                  <li key={fIdx}>{feat}</li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
