'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Zap, 
  Globe, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  MessageSquare,
  BarChart3,
  Lock
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AppDetailClientProps {
  app: any;
  session: any;
  isConnected: boolean;
}

export function AppDetailClient({ app, session, isConnected }: AppDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    app.marketplaceScreenshots?.[0] || null
  );

  return (
    <div className="detail-container">
      <nav className="marketplace-nav glass-card">
        <div className="container flex-responsive" style={{ padding: '0.75rem 1rem' }}>
          <Link href="/marketplace" className="back-link">
            <ArrowLeft size={18} /> Marketplace
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeToggle />
            {session ? (
              <div className="user-pill">
                <OptimizedImage src={session.avatarUrl || '/images/avatar-placeholder.png'} alt={session.displayName} width={24} height={24} style={{ borderRadius: '50%' }} />
                <span>{session.displayName}</span>
              </div>
            ) : (
              <Link href="/auth/login" className="btn btn-primary">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
        <div className="grid-layout">
          {/* Main Content */}
          <div className="main-col">
            <div className="glass-card main-info">
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div className="app-logo-huge">
                  <OptimizedImage src={app.logoUrl || '/images/app-placeholder.png'} alt={app.name} width={100} height={100} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h1 className="fluid-h2" style={{ margin: 0 }}>{app.name}</h1>
                    {app.isOfficial && <span className="official-badge"><ShieldCheck size={12}/> OFFICIAL</span>}
                  </div>
                  <div className="app-badges">
                    <span className="category-badge">{app.marketplaceCategory || 'Utility'}</span>
                    <span className="badge"><Globe size={14}/> Web App</span>
                    <span className="badge"><Zap size={14}/> Fast Setup</span>
                  </div>
                </div>
              </div>

              <div className="description-section">
                <h3>About this App</h3>
                <div className="rich-text">
                  {app.marketplaceDescription || app.description || 'No detailed description provided.'}
                </div>
              </div>

              <div className="screenshots-section">
                <h3>Screenshots</h3>
                <div className="screenshots-scroll">
                  {app.marketplaceScreenshots.map((src: string, i: number) => (
                    <div 
                      key={i} 
                      className={`screenshot-thumb ${selectedImage === src ? 'active' : ''}`}
                      onClick={() => setSelectedImage(src)}
                    >
                      <OptimizedImage 
                        src={src} 
                        alt={`${app.name} screenshot ${i + 1}`}
                        width={120} 
                        height={80} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="features-grid">
              <div className="glass-card feature-card">
                <MessageSquare className="text-primary" />
                <h4>AI Integration</h4>
                <p>Native support for GG-AI agents and context-aware responses.</p>
              </div>
              <div className="glass-card feature-card">
                <BarChart3 className="text-primary" />
                <h4>Advanced Analytics</h4>
                <p>Real-time usage tracking and engagement metrics.</p>
              </div>
              <div className="glass-card feature-card">
                <Lock className="text-primary" />
                <h4>Secure Auth</h4>
                <p>Built-in OAuth 2.0 protection with GGUser identity.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="side-col">
            <div className="glass-card install-card">
              <div className="price-tag">FREE TO INSTALL</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '1rem 0 2rem' }}>
                Connect this application to your Going Genius account to start using its features.
              </p>
              
              {isConnected ? (
                <button className="btn btn-outline w-full" style={{ gap: '0.5rem', borderColor: '#4ade80', color: '#4ade80' }}>
                  <CheckCircle2 size={18} /> Connected
                </button>
              ) : (
                <button className="btn btn-primary w-full" style={{ gap: '0.5rem' }}>
                  <Plus size={18} /> Connect App
                </button>
              )}

              <hr className="divider" />
              
              <div className="developer-info">
                <span className="label">Developer</span>
                <div className="dev-pill">
                  <OptimizedImage src={app.owner.avatarUrl || '/images/avatar-placeholder.png'} alt={app.owner.displayName} width={20} height={20} style={{ borderRadius: '50%' }} />
                  <span>{app.owner.displayName}</span>
                </div>
              </div>
              
              <div className="app-stats">
                <div className="stat">
                  <span className="label">Category</span>
                  <span className="val">{app.marketplaceCategory || 'Other'}</span>
                </div>
                <div className="stat">
                  <span className="label">Last Update</span>
                  <span className="val">{new Date(app.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="glass-card support-card">
              <h4>Resources</h4>
              <ul className="resource-list">
                <li><a href="#"><ExternalLink size={14}/> Support Site</a></li>
                <li><a href="#"><ExternalLink size={14}/> Privacy Policy</a></li>
                <li><a href="#"><ExternalLink size={14}/> Terms of Service</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        .detail-container {
          min-height: 100vh;
          background: #050505;
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

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .back-link:hover { color: #fff; }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.05);
          padding: 4px 12px 4px 4px;
          border-radius: 99px;
          font-size: 0.85rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
        }

        .main-info {
          padding: 3rem;
          border-radius: 32px;
          margin-bottom: 2rem;
        }

        .app-logo-huge {
          width: 120px;
          height: 120px;
          background: #000;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .official-badge {
          background: rgba(59, 130, 246, 0.15);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .app-badges {
          display: flex;
          gap: 0.75rem;
        }

        .badge, .category-badge {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 10px;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-badge {
          background: var(--primary);
          color: #000;
          font-weight: 700;
          border: none;
        }

        .description-section {
          margin-top: 3.5rem;
        }

        .description-section h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .rich-text {
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .screenshots-section {
          margin-top: 4rem;
        }

        .screenshots-section h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .screenshots-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scrollbar-width: thin;
        }

        .screenshot-item {
          min-width: 450px;
          height: 280px;
          background: #111;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .screenshot-placeholder {
          width: 100%;
          height: 200px;
          background: rgba(255,255,255,0.02);
          border: 2px dashed rgba(255,255,255,0.05);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-card {
          padding: 1.5rem;
          border-radius: 24px;
        }

        .feature-card h4 {
          margin: 1rem 0 0.5rem;
          font-size: 1rem;
        }

        .feature-card p {
          color: var(--muted);
          font-size: 0.85rem;
          margin: 0;
          line-height: 1.5;
        }

        .install-card {
          padding: 2rem;
          border-radius: 28px;
          position: sticky;
          top: 8rem;
        }

        .price-tag {
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--primary);
        }

        .w-full { width: 100%; }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 2rem 0;
        }

        .developer-info {
          margin-bottom: 1.5rem;
        }

        .label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #444;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .dev-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .app-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .val { color: #fff; font-weight: 500; }

        .support-card {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: 24px;
        }

        .support-card h4 { margin: 0 0 1rem; }

        .resource-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .resource-list a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        .resource-list a:hover { color: var(--primary); }
      `}</style>
    </div>
  );
}
