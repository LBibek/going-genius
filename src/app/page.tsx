import Link from 'next/link';
import { getSession } from '@/lib/session';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="home-wrapper">
      {/* ─── Navbar ───────────────────────────────────────────────────────────── */}
      <nav className="glass-navbar">
        <div className="container nav-container">
          <div className="auth-logo">
            <div className="auth-logo-icon">GG</div>
            <span className="auth-logo-text">Going Genius</span>
          </div>
          <div className="nav-links hide-mobile">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#premium" className="nav-link">Premium</Link>
            <Link href="#pricing" className="nav-link">Pricing</Link>
            <Link href="#developers" className="nav-link">Developers</Link>
          </div>
          <div className="nav-actions">
            {session ? (
              <Link href="/dashboard" className="btn-nav primary-gradient">Dashboard</Link>
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

      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="auth-bg-grid" />
        <div className="auth-bg-glow" />
        
        <div className="container hero-container animate-fade-in">
          <div className="hero-badge animate-float">🚀 NEXT-GEN INFRASTRUCTURE</div>
          <h1 className="hero-title">
            Scaling Intelligence <br />
            <span className="gradient-text-golden">Across Nepal</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate IDaaS & Billing platform for high-margin digital businesses. 
            Automate your auth, manage multi-tenant subscriptions, and deploy AI agents in minutes.
          </p>
          <div className="hero-actions">
            <Link href="/auth/register" className="btn-hero primary-gradient">Build Your App</Link>
            <Link href="#premium" className="btn-hero btn-outline">See Premium Features →</Link>
          </div>

          <div className="hero-visual-wrapper">
            <div className="hero-visual-glow"></div>
            <div className="hero-visual-card glass-card">
              <img 
                src="/images/premium-showcase.png" 
                alt="Premium Showcase" 
                className="hero-visual-img"
              />
              <div className="visual-floating-badge badge-1">
                <span className="icon">🛡️</span>
                <span className="text">Secure Auth</span>
              </div>
              <div className="visual-floating-badge badge-2">
                <span className="icon">🤖</span>
                <span className="text">AI Agents</span>
              </div>
              <div className="visual-floating-badge badge-3">
                <span className="icon">💳</span>
                <span className="text">Khalti/eSewa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Premium Features Showcase ────────────────────────────────────────── */}
      <section id="premium" className="premium-showcase-section">
        <div className="container">
          <div className="section-header">
            <div className="hero-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>ELITE CAPABILITIES</div>
            <h2 className="section-title">Engineered for High-Margin Apps</h2>
            <p className="section-subtitle">Going Genius provides the specialized tools that modern startups need to outpace the market.</p>
          </div>

          <div className="premium-grid">
            <div className="premium-card glass-card">
              <div className="premium-card-gradient"></div>
              <div className="premium-icon">🏢</div>
              <h3>Multi-Tenant IDaaS</h3>
              <p>Built-in support for B2B applications. Manage multiple organizations, teams, and tiered permissions under a single umbrella.</p>
              <ul className="premium-features-list">
                <li>Custom Branding</li>
                <li>Org-level Analytics</li>
                <li>Team Management</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">🧠</div>
              <h3>AI Orchestration</h3>
              <p>Leverage Firebase Genkit to deploy intelligent agents that handle support, lead generation, and workflow automation.</p>
              <ul className="premium-features-list">
                <li>Tool-Calling Ready</li>
                <li>RAG Support</li>
                <li>WhatsApp Integration</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">⚡</div>
              <h3>Revenue Infrastructure</h3>
              <p>Complete billing solution with automated webhook verification for Khalti and eSewa. Focus on product, not payments.</p>
              <ul className="premium-features-list">
                <li>Idempotent Webhooks</li>
                <li>Auto-Subscription Sync</li>
                <li>Revenue Dashboards</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">💳</div>
              <h3>Universal Wallet</h3>
              <p>A single interface for users to manage every subscription across any app built on Going Genius. One-click upgrades and cancellations.</p>
              <ul className="premium-features-list">
                <li>Unified Billing History</li>
                <li>One-Click Plan Upgrades</li>
                <li>Global Payment Sync</li>
              </ul>
              <div className="mt-6">
                <Link href="/dashboard/subscriptions" className="form-link-sm text-red-500 hover:text-red-400 transition-colors">
                  View Wallet Demo →
                </Link>
              </div>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">🌐</div>
              <h3>WordPress Integration</h3>
              <p>Seamlessly integrate E-Commerce and Scheduling drop-ins directly into any WordPress site using our powerful bulk import facility.</p>
              <ul className="premium-features-list">
                <li>Drop-in Checkout</li>
                <li>Scheduling Widgets</li>
                <li>Bulk Data Import</li>
              </ul>
              <div className="mt-6">
                <Link href="/demo/wordpress" className="form-link-sm text-blue-500 hover:text-blue-400 transition-colors">
                  View Live WP Demo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Developer SDK Section ────────────────────────────────────────── */}
      <section id="developers" className="sdk-section py-24 bg-[#080808]">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <div className="hero-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>FOR DEVELOPERS</div>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight font-outfit">
              Integrate Revenue <br />
              <span className="text-blue-500">In 3 Lines of Code</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Don't waste months building billing infrastructure. Our React SDK provides drop-in hooks and components for authentication and subscription management.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl h-fit text-blue-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">useGGPlan() Hook</h4>
                  <p className="text-muted-foreground text-sm">Gate your premium content with simple, real-time subscription checks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl h-fit text-amber-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">&lt;GGBillingButton /&gt;</h4>
                  <p className="text-muted-foreground text-sm">Drop a beautiful, pre-configured checkout button that handles all local payment gateways.</p>
                </div>
              </div>
            </div>

            <Link href="/developer/apps" className="btn-hero primary-gradient inline-flex">
              Start Building Now
            </Link>
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
                <div className="text-[10px] font-mono text-muted-foreground">PremiumGate.tsx</div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <p className="text-purple-400">import <span className="text-blue-400">{"{ useGGPlan, GGBillingButton }"}</span> from <span className="text-emerald-400">'@going-genius/react'</span>;</p>
                <br />
                <p className="text-purple-400">export default function <span className="text-yellow-400">ProFeatures</span>() {"{"}</p>
                <p className="pl-4 text-purple-400">const <span className="text-foreground">{"{ hasActiveSubscription, isLoading }"}</span> = <span className="text-yellow-400">useGGPlan</span>(<span className="text-emerald-400">'app_123'</span>);</p>
                <br />
                <p className="pl-4 text-gray-500">// Automatically gate content</p>
                <p className="pl-4 text-purple-400">if (!hasActiveSubscription) {"{"}</p>
                <p className="pl-8 text-purple-400">return &lt;<span className="text-blue-400">GGBillingButton</span> appId=<span className="text-emerald-400">"app_123"</span> /&gt;;</p>
                <p className="pl-4 text-purple-400">{"}"}</p>
                <br />
                <p className="pl-4 text-purple-400">return &lt;<span className="text-blue-400">div</span>&gt;Welcome to Pro!&lt;/<span className="text-blue-400">div</span>&gt;;</p>
                <p className="text-purple-400">{"}"}</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-black px-4 py-2 rounded-lg font-black text-xs shadow-xl animate-bounce">
              3 MINUTES TO LIVE ⚡
            </div>
          </div>
        </div>
      </section>


      {/* ─── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Value-Based Pricing</h2>
            <p className="section-subtitle">Choose the plan that fits your ambition. Scale seamlessly from prototype to enterprise.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Starter Kit</h3>
                <div className="price">NPR 0<span>/mo</span></div>
                <p>Perfect for individual developers and testing.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Up to 500 Active Users</li>
                <li>✅ Standard OAuth 2.0 Auth</li>
                <li>✅ 1 Social Provider</li>
                <li>✅ Basic Developer Console</li>
                <li>❌ Premium Webhooks</li>
                <li>❌ AI Agent Orchestration</li>
              </ul>
              <Link href="/auth/register" className="btn-pricing">Get Started Free</Link>
            </div>

            <div className="pricing-card glass-card premium-tier">
              <div className="popular-badge">MOST POPULAR</div>
              <div className="pricing-header">
                <h3>Developer Pro</h3>
                <div className="price">NPR 1,499<span>/mo</span></div>
                <p>For growing apps that need premium infra.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Unlimited Active Users</li>
                <li>✅ All Social Providers</li>
                <li>✅ **Khalti/eSewa Webhooks**</li>
                <li>✅ **AI Agent Builder (Genkit)**</li>
                <li>✅ **Multi-tenant Org Support**</li>
                <li>✅ Priority Dev Support</li>
              </ul>
              <Link href="/auth/register" className="btn-pricing primary-gradient">Upgrade to Pro</Link>
            </div>

            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">Custom</div>
                <p>For large-scale platforms and government projects.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Custom SLA & Latency</li>
                <li>✅ White-labeled Auth UI</li>
                <li>✅ On-premise Deployment</li>
                <li>✅ Custom Security Audits</li>
                <li>✅ 24/7 Dedicated Support</li>
                <li>✅ Managed Integration Service</li>
              </ul>
              <a href="mailto:support@goinggenius.com.np" className="btn-pricing">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="main-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <div className="auth-logo">
              <div className="auth-logo-icon">GG</div>
              <span className="auth-logo-text">Going Genius</span>
            </div>
            <p className="footer-tagline">Providing the infrastructure that powers the next generation of Nepali digital products.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link href="#features">Features</Link>
              <Link href="#premium">Premium</Link>
              <Link href="#pricing">Pricing</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/developer">Documentation</Link>
              <Link href="/demo">Demo App</Link>
              <Link href="/demo/wordpress">WordPress Plugin</Link>
              <Link href="/auth/register">Sign Up</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/security">Security</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Going Genius. Built with passion in Nepal 🇳🇵</p>
        </div>
      </footer>

      {/* ─── Additional Styles ───────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .home-wrapper { overflow-x: hidden; }
        
        /* Navbar */
        .glass-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(13, 13, 18, 0.7); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0.75rem 0;
        }
        .nav-container { display: flex; justify-content: space-between; align-items: center; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-link { color: var(--muted-light); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: var(--primary); }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .btn-nav { padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem; }

        /* Hero */
        .hero-section { position: relative; padding: 12rem 0 8rem; overflow: hidden; text-align: center; }
        .hero-title { font-size: clamp(2.5rem, 10vw, 5rem); font-weight: 900; line-height: 1.05; margin-bottom: 1.5rem; }
        .hero-subtitle { max-width: 800px; margin: 0 auto 3.5rem; color: var(--muted-light); font-size: 1.25rem; line-height: 1.6; }
        .hero-visual-wrapper { position: relative; margin-top: 6rem; max-width: 1000px; margin-left: auto; margin-right: auto; }
        .hero-visual-card { 
          position: relative; border-radius: 32px; overflow: visible; 
          padding: 1rem; border: 1px solid rgba(255, 177, 22, 0.2);
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
        }
        .hero-visual-img { width: 100%; height: auto; border-radius: 24px; display: block; }
        .hero-visual-glow {
          position: absolute; inset: -50px;
          background: radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%);
          z-index: -1; opacity: 0.5;
        }

        /* Floating Badges */
        .visual-floating-badge {
          position: absolute; background: var(--glass-heavy); backdrop-filter: blur(12px);
          padding: 0.75rem 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 0.75rem;
          border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          animation: float 4s ease-in-out infinite;
        }
        .badge-1 { top: 10%; left: -5%; animation-delay: 0s; }
        .badge-2 { bottom: 20%; right: -5%; animation-delay: 1s; }
        .badge-3 { top: 40%; right: 10%; animation-delay: 2s; }
        .visual-floating-badge .icon { font-size: 1.25rem; }
        .visual-floating-badge .text { font-size: 0.9rem; font-weight: 700; color: var(--foreground); }

        /* Premium Showcase */
        .premium-showcase-section { padding: 8rem 0; background: var(--background-alt); position: relative; }
        .premium-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .premium-card { 
          padding: 3rem 2rem; position: relative; overflow: hidden; border-radius: 28px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .premium-card:hover { transform: translateY(-12px); border-color: var(--primary); }
        .premium-card-gradient { position: absolute; top: 0; left: 0; right: 0; height: 150px; background: linear-gradient(135deg, rgba(255, 177, 22, 0.2) 0%, transparent 100%); z-index: 0; }
        .premium-icon { font-size: 3.5rem; margin-bottom: 2rem; position: relative; z-index: 1; }
        .premium-card h3 { font-size: 1.75rem; margin-bottom: 1rem; position: relative; z-index: 1; }
        .premium-card p { color: var(--muted-light); line-height: 1.6; margin-bottom: 2rem; position: relative; z-index: 1; }
        .premium-features-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; position: relative; z-index: 1; }
        .premium-features-list li { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); font-weight: 600; font-size: 0.9rem; }
        .premium-features-list li::before { content: '→'; }

        /* Pricing */
        .pricing-section { padding: 8rem 0; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .pricing-card { padding: 3rem 2.5rem; display: flex; flex-direction: column; gap: 2.5rem; border-radius: 32px; transition: scale 0.3s; }
        .pricing-card:hover { scale: 1.02; }
        .pricing-header h3 { font-size: 1.5rem; color: var(--muted); margin-bottom: 1rem; }
        .pricing-header .price { font-size: 3rem; font-weight: 800; color: var(--foreground); }
        .pricing-header .price span { font-size: 1rem; color: var(--muted); font-weight: 500; }
        .pricing-header p { margin-top: 1rem; color: var(--muted-light); }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .pricing-features li { font-size: 0.95rem; color: var(--muted-light); line-height: 1.5; }
        .btn-pricing { 
          padding: 1rem; border-radius: 16px; text-align: center; font-weight: 700; 
          border: 1px solid var(--border); transition: all 0.2s;
        }
        .btn-pricing:hover { background: var(--glass-hover); border-color: var(--primary); }
        
        .premium-tier { 
          position: relative; border: 2px solid var(--primary); 
          box-shadow: 0 0 40px var(--primary-glow); background: rgba(255, 177, 22, 0.03); 
        }
        .popular-badge {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
          background: var(--primary); color: #000; padding: 0.4rem 1rem; border-radius: 50px;
          font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em;
        }
        .premium-tier .pricing-header h3 { color: var(--primary); }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        .primary-gradient { 
          background: linear-gradient(135deg, var(--primary) 0%, #FF8C00 100%); 
          color: #000; transition: box-shadow 0.3s;
        }
        .primary-gradient:hover { box-shadow: 0 0 30px var(--primary-glow); }

        .gradient-text-golden { 
          background: linear-gradient(135deg, #fff 0%, var(--primary) 50%, #FF8C00 100%); 
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
        }

        @media (max-width: 768px) {
          .hero-section { padding: 10rem 0 4rem; }
          .hero-visual-wrapper { margin-top: 3rem; }
          .visual-floating-badge { display: none; }
          .pricing-grid { grid-template-columns: 1fr; }
          .premium-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}
