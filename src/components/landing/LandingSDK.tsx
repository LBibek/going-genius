'use client';

import React from 'react';
import Link from 'next/link';

export function LandingSDK() {
  return (
    <section id="developers" className="sdk-section py-24 bg-[#080808]">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-left">
          <div className="hero-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>API & INTEGRATION</div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight font-outfit">
            Gate Your Apps <br />
            <span className="text-blue-500">In Minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Our powerful React SDK and developer APIs allow you to bridge Going Genius with your custom applications, microservices, or websites seamlessly.
          </p>
          
          <div className="space-y-6 mb-10">
            <div className="flex gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl h-fit text-blue-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-left">Unified Auth Bridge</h4>
                <p className="text-muted-foreground text-sm text-left">Synchronize identities across all your custom subdomains, applications, or API microservices.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-500/20 p-3 rounded-xl h-fit text-amber-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-left">Real-Time Webhooks</h4>
                <p className="text-muted-foreground text-sm text-left">Trigger instant service updates or email sequences when subscriptions are purchased, renewed, or revoked.</p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <Link href="/developer/apps" className="btn-hero primary-gradient inline-flex">
              Developer Console
            </Link>
          </div>
        </div>

        <div className="relative animate-fade-in-right">
          <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-30"></div>
          <div className="glass-card p-0 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative z-10">
            <div className="bg-white/5 border-bottom border-white/10 p-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">PaywallGating.tsx</div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-left">
              <p className="text-purple-400">import <span className="text-blue-400">{"{ useGGBilling }"}</span> from <span className="text-emerald-400">'@going-genius/react'</span>;</p>
              <br />
              <p className="text-purple-400">export default function <span className="text-yellow-400">PremiumPortal</span>() {"{"}</p>
              <p className="pl-4 text-purple-400">const <span className="text-foreground">{"{ hasAccess, currentTier }"}</span> = <span className="text-yellow-400">useGGBilling</span>(<span className="text-emerald-400">'user_98b50'</span>);</p>
              <br />
              <p className="pl-4 text-gray-500">// Check tier-based access safeguards</p>
              <p className="pl-4 text-purple-400">if (!hasAccess) {"{"}</p>
              <p className="pl-8 text-purple-400">return &lt;<span className="text-blue-400">PaywallRequired</span> tier="Pro" /&gt;;</p>
              <p className="pl-4 text-purple-400">{"}"}</p>
              <br />
              <p className="pl-4 text-purple-400">return &lt;<span className="text-blue-400">div</span>&gt;Welcome to Developer Course Dashboard&lt;/<span className="text-blue-400">div</span>&gt;;</p>
              <p className="text-purple-400">{"}"}</p>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-black px-4 py-2 rounded-lg font-black text-xs shadow-xl animate-bounce">
            SECURE & SCALABLE ⚡
          </div>
        </div>
      </div>
    </section>
  );
}
