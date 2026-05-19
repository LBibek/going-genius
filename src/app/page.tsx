/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities, react/jsx-no-comment-textnodes */
import { getSession } from '@/lib/session';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingSolutions } from '@/components/landing/LandingSolutions';
import { LandingSDK } from '@/components/landing/LandingSDK';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="home-wrapper">
      {/* ─── Navbar ───────────────────────────────────────────────────────────── */}
      <LandingNavbar session={session} />

      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <LandingHero />

      {/* ─── Solutions Section ────────────────────────────────────────── */}
      <LandingSolutions />

      {/* ─── Developer SDK Section ────────────────────────────────────────── */}
      <LandingSDK />

      {/* ─── Pricing Section ─────────────────────────────────────────────────── */}
      <LandingPricing />

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <LandingFooter />

      {/* ─── Additional Styles ───────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .home-wrapper { overflow-x: hidden; }
        
        /* Navbar */
        .glass-navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(13, 13, 18, 0.75); backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0.85rem 0;
        }
        .nav-container { display: flex; justify-content: space-between; align-items: center; }
        
        .nav-links { display: none; }
        @media (min-width: 768px) {
          .nav-links { display: flex; align-items: center; gap: 2.25rem; }
        }
        
        .nav-link { color: var(--muted-light); font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: var(--primary); }
        .nav-actions { display: flex; align-items: center; gap: 1.25rem; }
        .btn-nav { padding: 0.65rem 1.6rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem; }

        /* Hero */
        .hero-section { position: relative; padding: 13rem 0 9rem; overflow: hidden; text-align: center; }
        .hero-title { font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.75rem; letter-spacing: -0.03em; }
        .hero-subtitle { max-width: 800px; margin: 0 auto 3.5rem; color: var(--muted-light); font-size: 1.25rem; line-height: 1.65; }
        
        .hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.25rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        /* Premium Glow Buttons */
        .btn-glow {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: 1px solid transparent;
          text-align: center;
          text-decoration: none;
          color: inherit;
        }
        .btn-glow:hover {
          transform: translateY(-2px);
        }
        .btn-glow:active {
          transform: translateY(0);
        }
        .btn-glow-w-full {
          width: 100%;
        }

        /* Glowing Variant */
        .btn-glow-glowing {
          background: linear-gradient(135deg, var(--primary) 0%, #FF8C00 100%);
          color: #0d0d12 !important;
          font-weight: 800;
          box-shadow: 0 8px 24px var(--primary-glow);
        }
        .btn-glow-glowing:hover {
          box-shadow: 0 12px 35px rgba(255, 177, 22, 0.45);
        }

        /* Outline Variant */
        .btn-glow-outline {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--foreground);
        }
        .btn-glow-outline:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
        }


        .hero-visual-wrapper { position: relative; margin-top: 6.5rem; max-width: 1000px; margin-left: auto; margin-right: auto; }
        .hero-visual-card { 
          position: relative; border-radius: 32px; overflow: visible; 
          padding: 1rem; border: 1px solid rgba(255, 177, 22, 0.25);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
        }
        .hero-visual-img { width: 100%; height: auto; border-radius: 24px; display: block; }
        .hero-visual-glow {
          position: absolute; inset: -50px;
          background: radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%);
          z-index: -1; opacity: 0.6;
        }

        /* Floating Badges */
        .visual-floating-badge {
          position: absolute; 
          background: rgba(13, 13, 18, 0.7); 
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.85rem 1.4rem; 
          border-radius: 18px; 
          display: flex; 
          align-items: center; 
          gap: 0.85rem;
          border: 1px solid rgba(255, 177, 22, 0.25); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15);
          animation: float 5s ease-in-out infinite;
          z-index: 10;
        }
        .badge-1 { top: 12%; left: -6%; animation-delay: 0s; }
        .badge-2 { bottom: 15%; right: -6%; animation-delay: 1.5s; }
        .badge-3 { top: 45%; right: 5%; animation-delay: 3s; }
        .visual-floating-badge .icon { font-size: 1.25rem; }
        .visual-floating-badge .text { font-size: 0.9rem; font-weight: 700; color: #fff; }

        /* Premium Showcase */
        .premium-showcase-section { padding: 8rem 0; background: var(--background-alt); position: relative; }
        .premium-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .premium-icon { font-size: 3.5rem; margin-bottom: 2rem; position: relative; z-index: 1; }
        .premium-features-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; position: relative; z-index: 1; text-align: left; }
        .premium-features-list li { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); font-weight: 600; font-size: 0.9rem; }
        .premium-features-list li::before { content: '→'; }

        /* Pricing */
        .pricing-section { padding: 8rem 0; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .pricing-card { display: flex; flex-direction: column; gap: 2.5rem; border-radius: 32px; }
        .pricing-header h3 { font-size: 1.5rem; color: var(--muted); margin-bottom: 1rem; }
        .pricing-header .price span { font-size: 1rem; color: var(--muted); font-weight: 500; }
        .pricing-header p { margin-top: 1rem; }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 1rem; flex: 1; text-align: left; }
        .pricing-features li { font-size: 0.95rem; color: var(--muted-light); line-height: 1.5; }
        
        .premium-tier { 
          position: relative; border: 2px solid var(--primary) !important; 
          box-shadow: 0 0 40px var(--primary-glow); background: rgba(255, 177, 22, 0.03); 
        }
        .popular-badge {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
          background: var(--primary); color: #000; padding: 0.4rem 1rem; border-radius: 50px;
          font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; z-index: 20;
        }
        .premium-tier .pricing-header h3 { color: var(--primary); }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        .primary-gradient { 
          background: linear-gradient(135deg, var(--primary) 0%, #FF8C00 100%); 
          color: #000; transition: box-shadow 0.3s;
        }
        .primary-gradient:hover { box-shadow: 0 0 35px var(--primary-glow); }

        .gradient-text-golden { 
          background: linear-gradient(135deg, #FFE082 0%, var(--primary) 50%, #FF8C00 100%); 
          -webkit-background-clip: text; 
          background-clip: text;
          -webkit-text-fill-color: transparent; 
        }

        /* Footer Styling */
        .main-footer {
          border-top: 1px solid var(--border);
          padding: 6rem 0 3rem;
          background: var(--background-alt);
          position: relative;
          z-index: 10;
        }
        .footer-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        @media (min-width: 768px) {
          .footer-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }
        .footer-brand {
          max-width: 320px;
        }
        .footer-tagline {
          color: var(--muted-light);
          font-size: 0.95rem;
          margin-top: 1rem;
          line-height: 1.6;
        }
        .footer-links-group {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem 5rem;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          min-width: 140px;
        }
        .footer-col h4 {
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--foreground);
        }
        .footer-col a {
          color: var(--muted-light);
          font-size: 0.9rem;
          transition: color 0.2s, transform 0.2s;
          display: inline-block;
        }
        .footer-col a:hover {
          color: var(--primary);
          transform: translateX(2px);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 2rem;
          margin-top: 5rem;
          text-align: center;
          color: var(--muted-light);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .hero-section { padding: 10rem 0 4rem; }
          .hero-visual-wrapper { margin-top: 3rem; }
          .visual-floating-badge { display: none; }
          .pricing-grid { grid-template-columns: 1fr; }
          .premium-grid { grid-template-columns: 1fr; }
          .footer-links-group { gap: 2rem 3rem; }
        }
      `}} />
    </div>
  );
}
