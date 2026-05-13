/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities, react/jsx-no-comment-textnodes */
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
            <Link href="#solutions" className="nav-link">Solutions</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#pricing" className="nav-link">Institutional Plans</Link>
            <Link href="#developers" className="nav-link">API & SDK</Link>
          </div>
          <div className="nav-actions">
            {session ? (
              <Link href="/dashboard" className="btn-nav primary-gradient">Admin Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link hide-mobile">Portal Login</Link>
                <Link href="/auth/register" className="btn-nav primary-gradient">Partner with Us</Link>
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
          <div className="hero-badge animate-float">🏫 SMART CAMPUS INFRASTRUCTURE</div>
          <h1 className="hero-title">
            The Digital Heart of <br />
            <span className="gradient-text-golden">Modern Institutions</span>
          </h1>
          <p className="hero-subtitle">
            The unified Identity & Billing platform designed for Schools, Colleges, and Universities in Nepal. 
            From smart attendance to cashless canteens, we power your campus ecosystem.
          </p>
          <div className="hero-actions">
            <Link href="/auth/register" className="btn-hero primary-gradient">Onboard Your School</Link>
            <Link href="#solutions" className="btn-hero btn-outline">Explore Solutions →</Link>
          </div>

          <div className="hero-visual-wrapper">
            <div className="hero-visual-glow"></div>
            <div className="hero-visual-card glass-card">
              <img 
                src="/images/smart_campus_hero.png" 
                alt="Smart Campus Ecosystem" 
                className="hero-visual-img"
              />
              <div className="visual-floating-badge badge-1">
                <span className="icon">🆔</span>
                <span className="text">Unified Student ID</span>
              </div>
              <div className="visual-floating-badge badge-2">
                <span className="icon">🤳</span>
                <span className="text">Biometric Attendance</span>
              </div>
              <div className="visual-floating-badge badge-3">
                <span className="icon">💸</span>
                <span className="text">Cashless Canteen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Solutions Section ────────────────────────────────────────── */}
      <section id="solutions" className="premium-showcase-section">
        <div className="container">
          <div className="section-header">
            <div className="hero-badge" style={{ background: 'rgba(255, 177, 22, 0.1)', color: '#FFB116' }}>END-TO-END SOLUTIONS</div>
            <h2 className="section-title">Built for Educational Excellence</h2>
            <p className="section-subtitle">Going Genius provides the specialized infrastructure to digitize every aspect of campus life.</p>
          </div>

          <div className="premium-grid">
            <div className="premium-card glass-card">
              <div className="premium-card-gradient"></div>
              <div className="premium-icon">🎓</div>
              <h3>Universal Student ID</h3>
              <p>A single digital identity for students that works across the library, labs, and main gate. Secured with biometric encryption.</p>
              <ul className="premium-features-list">
                <li>QR & NFC Support</li>
                <li>Digital Profile Vault</li>
                <li>Parental Access</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">💳</div>
              <h3>Automated Fee Portals</h3>
              <p>Eliminate queues with real-time fee collection via Khalti and eSewa. Automated receipts and arrears tracking for accounts.</p>
              <ul className="premium-features-list">
                <li>Instant Settlement</li>
                <li>Payment Reminders</li>
                <li>Fee History Logs</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">🍱</div>
              <h3>Smart Canteen POS</h3>
              <p>Fully integrated POS system with face-recognition payments. Students pay with their ID, parents top-up from home.</p>
              <ul className="premium-features-list">
                <li>Offline-First Design</li>
                <li>Spending Limits</li>
                <li>Inventory Alerts</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">📊</div>
              <h3>Institutional Analytics</h3>
              <p>Data-driven insights for management. Track attendance patterns, financial health, and student engagement in real-time.</p>
              <ul className="premium-features-list">
                <li>Live Dashboards</li>
                <li>Automated Reports</li>
                <li>Multi-Campus Support</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">🛡️</div>
              <h3>Security & Compliance</h3>
              <p>Enterprise-grade security ensuring student data privacy. Compliant with local regulations and international standards.</p>
              <ul className="premium-features-list">
                <li>End-to-End Encryption</li>
                <li>Role-Based Access</li>
                <li>Audit-Ready Logs</li>
              </ul>
            </div>

            <div className="premium-card glass-card">
              <div className="premium-card-gradient" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, transparent 100%)' }}></div>
              <div className="premium-icon">🤖</div>
              <h3>Campus AI Assistants</h3>
              <p>Deploy AI agents to handle student queries, admission leads, and automated documentation help on your website.</p>
              <ul className="premium-features-list">
                <li>WhatsApp Chatbots</li>
                <li>Support Automation</li>
                <li>Admission Guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Developer SDK Section ────────────────────────────────────────── */}
      <section id="developers" className="sdk-section py-24 bg-[#080808]">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <div className="hero-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>API & INTEGRATION</div>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight font-outfit">
              Connect Your LMS <br />
              <span className="text-blue-500">In Minutes</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Our powerful SDK allows you to bridge Going Genius with your existing School ERP or Learning Management System (LMS) seamlessly.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl h-fit text-blue-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Identity Bridge</h4>
                  <p className="text-muted-foreground text-sm">Synchronize student identities across all your third-party educational tools.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl h-fit text-amber-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Custom Billing Webhooks</h4>
                  <p className="text-muted-foreground text-sm">Automate your accounting software when fees are paid via our secure portal.</p>
                </div>
              </div>
            </div>

            <Link href="/developer/apps" className="btn-hero primary-gradient inline-flex">
              Developer Console
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
                <div className="text-[10px] font-mono text-muted-foreground">FeeGating.tsx</div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <p className="text-purple-400">import <span className="text-blue-400">{"{ useGGStudent }"}</span> from <span className="text-emerald-400">'@going-genius/react'</span>;</p>
                <br />
                <p className="text-purple-400">export default function <span className="text-yellow-400">ExamPortal</span>() {"{"}</p>
                <p className="pl-4 text-purple-400">const <span className="text-foreground">{"{ isFeePaid, arrears }"}</span> = <span className="text-yellow-400">useGGStudent</span>(<span className="text-emerald-400">'roll_2024_01'</span>);</p>
                <br />
                <p className="pl-4 text-gray-500">// Block exam access if fees are pending</p>
                <p className="pl-4 text-purple-400">if (!isFeePaid) {"{"}</p>
                <p className="pl-8 text-purple-400">return &lt;<span className="text-blue-400">ArrearsNotice</span> amount={"{"}arrears{"}"} /&gt;;</p>
                <p className="pl-4 text-purple-400">{"}"}</p>
                <br />
                <p className="pl-4 text-purple-400">return &lt;<span className="text-blue-400">div</span>&gt;Access Granted to Exam&lt;/<span className="text-blue-400">div</span>&gt;;</p>
                <p className="text-purple-400">{"}"}</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-black px-4 py-2 rounded-lg font-black text-xs shadow-xl animate-bounce">
              SECURE & SCALABLE ⚡
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Institutional Engagement Plans</h2>
            <p className="section-subtitle">Scale your digital transformation with predictable, value-driven pricing.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Academy Starter</h3>
                <div className="price">NPR 0<span>/mo</span></div>
                <p>Perfect for small schools or initial testing.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Up to 200 Students</li>
                <li>✅ Basic Digital IDs</li>
                <li>✅ Fee Collection Portal</li>
                <li>✅ Web Dashboards</li>
                <li>❌ Biometric POS</li>
                <li>❌ Multi-Campus Support</li>
              </ul>
              <Link href="/auth/register" className="btn-pricing">Request Demo</Link>
            </div>

            <div className="pricing-card glass-card premium-tier">
              <div className="popular-badge">RECOMMENDED</div>
              <div className="pricing-header">
                <h3>Smart Campus Pro</h3>
                <div className="price">NPR 9,999<span>/mo</span></div>
                <p>For growing institutions needing full automation.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Unlimited Students</li>
                <li>✅ **Biometric Attendance**</li>
                <li>✅ **Cashless Canteen Integration**</li>
                <li>✅ **Parental Mobile App**</li>
                <li>✅ **Custom School Branding**</li>
                <li>✅ SMS/Email Notifications</li>
              </ul>
              <Link href="/auth/register" className="btn-pricing primary-gradient">Go Pro</Link>
            </div>

            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>University Global</h3>
                <div className="price">Custom</div>
                <p>For large-scale university systems and multi-campus setups.</p>
              </div>
              <ul className="pricing-features">
                <li>✅ Dedicated Server Clusters</li>
                <li>✅ On-premise Data Residency</li>
                <li>✅ Advanced AI Orchestration</li>
                <li>✅ ERP/LMS Migration Support</li>
                <li>✅ 24/7 Managed Success Team</li>
                <li>✅ Custom Security Compliance</li>
              </ul>
              <a href="mailto:support@goinggenius.com.np" className="btn-pricing">Contact Institutional Sales</a>
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
            <p className="footer-tagline">Powering the next generation of smart educational infrastructure in Nepal.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link href="#solutions">Solutions</Link>
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/developer">Documentation</Link>
              <Link href="/demo/sdk">SDK Demo</Link>
              <Link href="/demo/wordpress">WordPress Plugin</Link>
              <Link href="https://github.com/LBibek/going-genius/blob/main/DEVELOPER_QUICKSTART.md">Integration Guide</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/security">Institutional Security</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Going Genius. Built with passion for Education in Nepal 🇳🇵</p>
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
