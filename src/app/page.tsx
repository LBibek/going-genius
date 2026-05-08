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
            <span className="auth-logo-text">GGUser</span>
          </div>
          <div className="nav-links hide-mobile">
            <Link href="#features" className="nav-link">Features</Link>
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
        <div className="auth-bg-glow" style={{ background: 'radial-gradient(ellipse at center, rgba(255, 177, 22, 0.1) 0%, transparent 70%)' }} />
        
        <div className="container hero-container animate-fade-in">
          <div className="hero-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}>PROUDLY MADE IN NEPAL 🇳🇵</div>
          <h1 className="hero-title">
            The Digital Identity for <br />
            <span className="gradient-text-golden">Next-Gen Nepal</span>
          </h1>
          <p className="hero-subtitle">
            One unified account for Nepal&apos;s fastest-growing ecosystem. Built for developers in Nepal who want world-class authentication with local relevance.
          </p>
          <div className="hero-actions">
            <Link href="/auth/register" className="btn-hero primary-gradient">Get Started</Link>
            <Link href="#developers" className="btn-hero btn-outline">Explore APIs →</Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Secure</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">OAuth 2.0</span>
              <span className="stat-label">API</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">&lt;50ms</span>
              <span className="stat-label">Latency</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built for the Future</h2>
            <p className="section-subtitle">Everything you need to manage identity across your entire digital landscape.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Identity</h3>
              <p>World-class security with local reliability, optimized for Nepal&apos;s network landscape.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Global Socials</h3>
              <p>Easily connect Google, GitHub, or Steam to your local Nepali applications.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Support Agents</h3>
              <p>Integrate drop-in AI bots via React or WhatsApp to automate CSD and drive sales.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">💳</div>
              <h3>Subscription Billing</h3>
              <p>Monetize easily with tiered subscription plans, fully integrated with Khalti and eSewa.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">💻</div>
              <h3>Developer Console</h3>
              <p>Manage API keys, team invites, social auth, and real-time user analytics in one place.</p>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">🇳🇵</div>
              <h3>Local First</h3>
              <p>The first identity and integration hub designed specifically for Nepali builders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Growth Section ─────────────────────────────────────────────────── */}
      <section className="growth-section">
        <div className="container">
          <div className="dev-content">
            <div className="dev-text">
              <div className="hero-badge">BUILT FOR BUILDERS</div>
              <h2 className="section-title">Empowering the <br/> Nepali Dev Community</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
                Join hundreds of developers across Nepal who are scaling their apps with GGUser. Our platform handles the complexity, you build the innovation.
              </p>
              <ul className="dev-list">
                <li>✅ Localized Onboarding Flows</li>
                <li>✅ Zero-Config Invite System</li>
                <li>✅ Visual Auth Configuration</li>
                <li>✅ Dedicated Developer Support</li>
              </ul>
            </div>
            <div className="dev-code-preview">
              <div className="glass-card preview-mockup">
                <div className="mockup-header">
                  <div className="mockup-logo">GG</div>
                  <span>Preview: Auth Screen</span>
                </div>
                <div className="mockup-body">
                  <div className="mockup-social-btns">
                    <div className="mockup-social">Google</div>
                    <div className="mockup-social">GitHub</div>
                    <div className="mockup-social">Steam</div>
                  </div>
                  <div className="mockup-divider">or use email</div>
                  <div className="mockup-input"></div>
                  <div className="mockup-btn">Continue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us Section ────────────────────────────────────────────── */}
      <section id="why-us" className="why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why GGUser for Nepal?</h2>
            <p className="section-subtitle">The first identity platform built to handle the unique needs of the Nepali digital landscape.</p>
          </div>
          
          <div className="why-grid">
            <div className="why-item">
              <div className="why-number">01</div>
              <div className="why-content">
                <h3>Local Reliability</h3>
                <p>Infrastructure optimized for Nepal&apos;s network. Say goodbye to high-latency authentication from foreign servers.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">02</div>
              <div className="why-content">
                <h3>Ecosystem Integration</h3>
                <p>Seamlessly connect with all Going Genius products and hundreds of local partner apps in one click.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">03</div>
              <div className="why-content">
                <h3>Developer Velocity</h3>
                <p>Implement auth in minutes, not days. Our intuitive console and SDKs are built for speed and simplicity.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">04</div>
              <div className="why-content">
                <h3>Regulatory Ready</h3>
                <p>Compliant with local data privacy expectations and built by engineers who understand the Nepali market.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Docs Section ──────────────────────────────────────────────── */}
      <section className="docs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Integrate in Seconds</h2>
            <p className="section-subtitle">Standard OAuth 2.0 flow. Works with any language or framework.</p>
          </div>

          <div className="docs-tab-container glass-card">
            <div className="docs-tabs">
              <div className="docs-tab active">Next.js</div>
              <div className="docs-tab">cURL</div>
              <div className="docs-tab">Python</div>
            </div>
            <div className="docs-content">
              <pre className="code-block">
                {`// Redirect users to authorize
const authUrl = "https://gguser.com/api/gg/authorize?" + 
  new URLSearchParams({
    client_id: "your_client_id",
    redirect_uri: "https://your-app.com/callback",
    response_type: "code",
    scope: "profile email",
    code_challenge: "..." // PKCE Recommended
  });

window.location.href = authUrl;`}
              </pre>
            </div>
            <div className="docs-footer">
              <p>Check out our <Link href="/developer" className="form-link">Full Documentation</Link> for more details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Developers Section ──────────────────────────────────────────────── */}
      <section id="developers" className="dev-section dark-bg">
        <div className="container">
          <div className="dev-content">
            <div className="dev-text">
              <div className="hero-badge">MADE FOR NEPAL 🇳🇵</div>
              <h2 className="section-title">Nepal&apos;s First Premium <br/> Identity Infrastructure</h2>
              <p className="section-subtitle" style={{ textAlign: 'left' }}>
                Built specifically for the Nepali developer ecosystem. Secure your apps with the speed and reliability of local infrastructure.
              </p>
              <ul className="dev-list">
                <li>✅ Local Support & Integration</li>
                <li>✅ Interactive Documentation</li>
                <li>✅ Real-time User Management</li>
                <li>✅ Managed Social Provider Keys</li>
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <Link href="/developer" className="btn-hero primary-gradient">Open Console</Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>Proudly Developed in Nepal 🇳🇵</div>
              </div>
            </div>
            <div className="dev-code-preview">
              <div className="glass-card code-card">
                <div className="code-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="code-title">auth-config.json</span>
                </div>
                <pre className="code-body">
                  {`{
  "client_id": "gg_cli_...",
  "auth_url": "/api/gg/authorize",
  "token_url": "/api/gg/token",
  "scopes": ["profile", "email"],
  "theme": "golden-glass"
}`}
                </pre>
              </div>
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
              <span className="auth-logo-text">GGUser</span>
            </div>
            <p className="footer-tagline">Connecting intelligence across the Going Genius ecosystem.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="#features">Features</Link>
              <Link href="/developer">API</Link>
              <Link href="/auth/register">Sign Up</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/security">Security</Link>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="https://goinggenius.com.np" target="_blank">Going Genius</a>
              <a href="#">Support</a>
              <a href="#">Community</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Going Genius. All rights reserved.</p>
        </div>
      </footer>

      {/* ─── Additional Styles ───────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link { color: var(--muted-light); font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: var(--primary); }
        .glass-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(13, 13, 18, 0.7); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
        }
        .nav-container { display: flex; justify-content: space-between; align-items: center; }
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .btn-nav { padding: 0.5rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem; }
        
        .hero-section { position: relative; padding: 10rem 0 6rem; overflow: hidden; text-align: center; }
        .hero-badge {
          display: inline-block; padding: 0.4rem 1rem; border-radius: 50px;
          background: rgba(255, 177, 22, 0.1); color: var(--primary);
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 177, 22, 0.2);
        }
        .hero-title { font-size: clamp(2.25rem, 8vw, 4.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; padding: 0 1rem; }
        .hero-subtitle { max-width: 700px; margin: 0 auto 3rem; color: var(--muted-light); font-size: 1.1rem; line-height: 1.6; padding: 0 1rem; }
        .hero-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .btn-hero { padding: 0.8rem 2rem; border-radius: 14px; font-weight: 700; font-size: 1rem; transition: all 0.2s; display: inline-flex; align-items: center; }
        .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 30px var(--primary-glow); }
        .gradient-text-golden { background: linear-gradient(135deg, #fff 0%, #FFB116 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        
        .hero-stats { display: flex; justify-content: center; gap: 2rem; margin-top: 5rem; flex-wrap: wrap; }
        .hero-stat { display: flex; flex-direction: column; gap: 0.25rem; min-width: 120px; }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: var(--primary); font-family: 'Outfit', sans-serif; }
        .stat-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }

        .section-header { text-align: center; margin-bottom: 4rem; padding: 0 1rem; }
        .section-title { font-size: clamp(1.75rem, 5vw, 2.5rem); font-weight: 800; margin-bottom: 1rem; }
        .section-subtitle { color: var(--muted-light); max-width: 600px; margin: 0 auto; font-size: 1rem; }

        .features-section { padding: 6rem 0; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .feature-card { padding: 2rem; text-align: center; }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1.25rem; }
        .feature-card h3 { margin-bottom: 0.75rem; font-size: 1.25rem; }
        .feature-card p { color: var(--muted); line-height: 1.6; font-size: 0.95rem; }

        .dev-section { padding: 6rem 0; background: rgba(0,0,0,0.2); }
        .dev-content { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
        @media (min-width: 1024px) {
          .dev-content { grid-template-columns: 1fr 1fr; gap: 4rem; }
        }
        .dev-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
        .dev-list li { display: flex; align-items: center; gap: 0.75rem; color: var(--muted-light); font-size: 0.95rem; }
        
        .code-card { padding: 0; overflow: hidden; border-radius: 12px; border-color: rgba(255,255,255,0.1); }
        .code-header { background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
        .code-title { font-size: 0.75rem; color: var(--muted); font-family: monospace; margin-left: 0.5rem; }
        .code-body { padding: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #a5b4fc; background: var(--glass-heavy); overflow-x: auto; }

        .main-footer { background: var(--background-alt); padding: 4rem 0 2rem; border-top: 1px solid var(--border); }
        .footer-container { display: grid; grid-template-columns: 1fr; gap: 3rem; margin-bottom: 3rem; }
        @media (min-width: 768px) {
          .footer-container { grid-template-columns: 1fr 2fr; gap: 4rem; }
        }
        .footer-tagline { color: var(--muted); margin-top: 1rem; max-width: 300px; line-height: 1.6; font-size: 0.9rem; }
        .footer-links-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 2rem; }
        .footer-col h4 { color: var(--foreground); margin-bottom: 1.25rem; font-size: 0.95rem; }
        .footer-col a { display: block; color: var(--muted); margin-bottom: 0.6rem; transition: color 0.2s; font-size: 0.9rem; }
        .footer-col a:hover { color: var(--primary); }
        .footer-bottom { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(150,150,150,0.1); color: var(--muted); font-size: 0.8rem; }

        .growth-section { padding: 6rem 0; background: radial-gradient(circle at bottom right, rgba(255, 177, 22, 0.05) 0%, transparent 50%); }
        .preview-mockup { width: 100%; max-width: 380px; margin: 0 auto; overflow: hidden; border-radius: 16px; border: 1px solid rgba(150,150,150,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .mockup-header { background: var(--background-alt); padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid rgba(150,150,150,0.1); font-size: 0.7rem; font-weight: 600; color: var(--muted-light); }
        .mockup-logo { width: 18px; height: 18px; background: var(--primary); border-radius: 4px; color: #000; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 900; }
        .mockup-body { padding: 1.5rem; background: var(--glass-heavy); text-align: center; }
        .mockup-social-btns { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .mockup-social { padding: 0.5rem; border: 1px solid rgba(150,150,150,0.1); border-radius: 8px; font-size: 0.75rem; font-weight: 600; color: var(--muted-light); }
        .mockup-divider { font-size: 0.65rem; color: var(--muted); margin: 0.75rem 0; position: relative; }
        .mockup-input { height: 34px; border: 1px solid rgba(150,150,150,0.1); border-radius: 8px; margin-bottom: 0.6rem; }
        .mockup-btn { height: 34px; background: var(--primary); border-radius: 8px; }

        .why-section { padding: 6rem 0; border-top: 1px solid var(--border); }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2.5rem; margin-top: 1.5rem; }
        .why-item { display: flex; flex-direction: column; gap: 1rem; }
        .why-number { font-size: 2.5rem; font-weight: 900; color: rgba(255, 177, 22, 0.1); line-height: 1; -webkit-text-stroke: 1px rgba(255, 177, 22, 0.3); }
        .why-content h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary); }
        .why-content p { color: var(--muted-light); line-height: 1.6; font-size: 0.9rem; }

        .docs-section { padding: 6rem 0; }
        .docs-tab-container { padding: 0; overflow: hidden; max-width: 800px; margin: 0 auto; border: 1px solid rgba(255, 177, 22, 0.2); }
        .docs-tabs { display: flex; background: var(--glass); border-bottom: 1px solid var(--border); overflow-x: auto; }
        .docs-tab { padding: 1rem 1.5rem; font-size: 0.8rem; font-weight: 600; color: var(--muted); cursor: pointer; white-space: nowrap; }
        .docs-tab.active { color: var(--primary); border-bottom: 2px solid var(--primary); background: rgba(255, 177, 22, 0.05); }
        @media (max-width: 900px) {
          .dev-content { grid-template-columns: 1fr; gap: 3rem; }
          .footer-container { grid-template-columns: 1fr; gap: 3rem; }
          .footer-links-group { grid-template-columns: repeat(2, 1fr); }
          .hero-stats { gap: 1.5rem; justify-content: center; }
          .hero-stat { min-width: 100px; }
          .stat-value { font-size: 1.25rem; }
          .hero-section { padding: 8rem 0 4rem; }
          .hero-title { margin-bottom: 1rem; }
        }

        @media (max-width: 640px) {
          .hero-actions { flex-direction: column; width: 100%; max-width: 300px; margin: 0 auto 3rem; }
          .btn-hero { width: 100%; justify-content: center; }
          .nav-container { padding: 0 1rem; }
          .footer-links-group { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .footer-col { display: flex; flex-direction: column; align-items: center; }
        }
      `}} />
    </div>
  );
}
