'use client';

import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Star, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MarketplaceClientProps {
  session: any;
  featuredApps: any[];
  allApps: any[];
  categories: string[];
}

export function MarketplaceClient({ session, featuredApps, allApps, categories }: MarketplaceClientProps) {
  return (
    <div className="marketplace-container">
      {/* Navigation / Header */}
      <nav className="marketplace-nav glass-card">
        <div className="container flex-responsive" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 900, textDecoration: 'none', color: '#fff' }}>
              GG <span style={{ color: 'var(--primary)' }}>Marketplace</span>
            </Link>
            <div className="nav-divider" />
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Find AI tools, SDKs, and connectors..." />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/developer" className="nav-link">Developer Console</Link>
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px' }}>Dashboard</Link>
            ) : (
              <Link href="/auth/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px' }}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
        {/* Hero Section */}
        <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="badge-glow" style={{ margin: '0 auto 1.5rem' }}>
            <Sparkles size={14} /> ECOSYSTEM IS GROWING
          </div>
          <h1 className="fluid-h1" style={{ marginBottom: '1.5rem', fontWeight: 900 }}>
            Supercharge your workflow with <span className="text-gradient">GG Ecosystem</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Discover powerful AI agents, CRM connectors, and productivity tools built on the Going Genius identity platform.
          </p>
        </header>

        {/* Featured Apps Section */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Solutions</h2>
            <div className="flex-responsive" style={{ gap: '0.5rem' }}>
              <button className="category-btn active">All</button>
              {categories.map(cat => (
                <button key={cat} className="category-btn">{cat}</button>
              ))}
            </div>
          </div>

          <div className="featured-grid">
            {featuredApps.map(app => (
              <div key={app.id} className="featured-card glass-card">
                <div className="card-banner">
                  <OptimizedImage 
                    src={app.marketplaceScreenshots[0] || '/images/marketplace-placeholder.png'} 
                    alt={app.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {app.isOfficial && <div className="official-badge"><ShieldCheck size={12}/> OFFICIAL</div>}
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="app-icon-lg">
                      <OptimizedImage src={app.logoUrl || '/images/app-placeholder.png'} alt={app.name} width={48} height={48} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{app.name}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>{app.marketplaceTagline || app.description}</p>
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="category-tag">{app.marketplaceCategory || 'General'}</span>
                    <Link href={`/marketplace/${app.id}`} className="btn-icon">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories / All Apps */}
        <section>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Explore All</h2>
          <div className="apps-list">
            {allApps.map(app => (
              <Link href={`/marketplace/${app.id}`} key={app.id} className="app-list-item glass-card">
                <div className="app-icon-md">
                  <OptimizedImage src={app.logoUrl || '/images/app-placeholder.png'} alt={app.name} width={40} height={40} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{app.name}</h4>
                    {app.isPremium && <span className="pro-badge">PRO</span>}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '2px 0 0' }}>{app.description}</p>
                </div>
                <div className="app-meta">
                  <div className="meta-item"><Star size={12} fill="var(--primary)" color="var(--primary)"/> 4.9</div>
                  <div className="meta-item"><Zap size={12}/> AI Ready</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .marketplace-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
        }

        .marketplace-nav {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2rem);
          max-width: 1400px;
          z-index: 100;
          border-radius: 20px;
          padding: 0.25rem;
        }

        .nav-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.5rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
          width: 350px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.85rem;
          width: 100%;
          outline: none;
        }

        .nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover { color: #fff; }

        .badge-glow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
        }

        .featured-card {
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .featured-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .card-banner {
          position: relative;
          height: 200px;
          background: #111;
        }

        .official-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .card-body {
          padding: 1.5rem;
        }

        .app-icon-lg {
          width: 56px;
          height: 56px;
          background: #000;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .card-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-tag {
          font-size: 0.75rem;
          color: var(--muted);
          background: rgba(255,255,255,0.05);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .btn-icon:hover { transform: scale(1.1); }

        .apps-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.25rem;
        }

        .app-list-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          text-decoration: none;
          color: #fff;
          transition: background 0.2s;
        }

        .app-list-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .app-icon-md {
          width: 48px;
          height: 48px;
          background: #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pro-badge {
          font-size: 0.6rem;
          background: linear-gradient(135deg, #FFB116, #FF8C00);
          color: #000;
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 900;
        }

        .app-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .meta-item {
          font-size: 0.75rem;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .category-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--muted);
          padding: 0.5rem 1.25rem;
          border-radius: 10px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn.active {
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
