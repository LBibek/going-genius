'use client';

import { useState } from 'react';
import { Globe, Github, Gamepad2, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SocialAuthDemo() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="demo-page">
      <div className="mesh-bg" />
      
      <div className="demo-nav">
        <Link href="/developer" className="back-link">
          <ArrowRight size={16} className="rotate-180" /> Back to Console
        </Link>
        <div className="demo-badge">Demo Component: Social Auth</div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="app-branding">
              <div className="app-logo">
                <ShieldCheck size={24} color="#000" />
              </div>
              <h1 className="app-name">Going Genius</h1>
            </div>
            
            <div className="auth-tabs">
              <button 
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Create Account
              </button>
            </div>
            
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome back' : 'Join the revolution'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login' ? 'Log in to your account to continue' : 'Sign up for a new account to get started'}
            </p>
          </div>

          <div className="social-section">
            <button className="social-btn google">
              <Globe size={18} />
              <span>Continue with Google</span>
            </button>
            <div className="social-row">
              <button className="social-btn github">
                <Github size={18} />
                <span>GitHub</span>
              </button>
              <button className="social-btn steam">
                <Gamepad2 size={18} />
                <span>Steam</span>
              </button>
            </div>
          </div>

          <div className="divider">
            <span>or use email</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="input-group">
                <label><User size={14} /> Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
            )}
            <div className="input-group">
              <label><Mail size={14} /> Email Address</label>
              <input type="email" placeholder="name@example.com" required />
            </div>
            <div className="input-group">
              <div className="label-row">
                <label><Lock size={14} /> Password</label>
                {mode === 'login' && <a href="#" className="forgot-link">Forgot?</a>}
              </div>
              <input type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loader" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
            </p>
          </div>
        </div>

        <div className="info-side">
          <div className="info-content">
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={20} /></div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption and multi-factor authentication built-in.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Globe size={20} /></div>
              <h3>Global Access</h3>
              <p>Connect with your favorite social platforms instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Sparkles size={20} /></div>
              <h3>Seamless Experience</h3>
              <p>Designed for speed and ease of use across all devices.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-page {
          min-height: 100vh;
          background: #05050a;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .mesh-bg {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: 
            radial-gradient(circle at 0% 0%, rgba(0, 240, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(255, 177, 22, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 100%);
          z-index: 0;
        }

        .demo-nav {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted);
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--primary); }
        .rotate-180 { transform: rotate(180deg); }

        .demo-badge {
          background: rgba(255, 177, 22, 0.1);
          color: var(--primary);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(255, 177, 22, 0.2);
        }

        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1000px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .app-branding {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .app-logo {
          width: 40px; height: 40px; background: var(--primary); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .app-name { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }

        .auth-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.3rem;
          border-radius: 12px;
          margin-bottom: 2.5rem;
        }
        .tab-btn {
          flex: 1; padding: 0.6rem; border: none; background: transparent;
          color: var(--muted); font-size: 0.85rem; font-weight: 600;
          cursor: pointer; border-radius: 9px; transition: all 0.2s;
        }
        .tab-btn.active { background: var(--primary); color: #000; }

        .auth-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-subtitle { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }

        .social-section { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .social-btn {
          height: 48px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
          background: transparent; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 0.75rem; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .social-btn:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.2); }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .divider {
          text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          line-height: 0.1em; margin: 2rem 0; font-size: 0.75rem; color: var(--muted);
        }
        .divider span { background: #0c0c14; padding: 0 15px; }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group label { font-size: 0.8rem; font-weight: 600; color: var(--muted); display: flex; align-items: center; gap: 0.4rem; }
        .input-group input {
          height: 48px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; padding: 0 1rem; color: #fff; font-size: 0.9rem; outline: none;
          transition: all 0.2s;
        }
        .input-group input:focus { border-color: var(--primary); background: rgba(255, 255, 255, 0.05); }
        
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .forgot-link { font-size: 0.75rem; color: var(--primary); text-decoration: none; font-weight: 600; }

        .submit-btn {
          height: 52px; background: var(--primary); color: #000; border: none;
          border-radius: 12px; font-size: 1rem; font-weight: 700; margin-top: 1rem;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          cursor: pointer; transition: all 0.2s;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 177, 22, 0.2); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .auth-footer { margin-top: 2rem; text-align: center; }
        .auth-footer p { font-size: 0.75rem; color: var(--muted); line-height: 1.6; }
        .auth-footer span { color: #fff; font-weight: 600; cursor: pointer; }

        .info-side { display: flex; flex-direction: column; gap: 2rem; }
        .feature-card {
          background: rgba(255, 255, 255, 0.02); padding: 1.5rem; border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .feature-icon {
          width: 40px; height: 40px; background: rgba(255, 177, 22, 0.1); border-radius: 10px;
          display: flex; align-items: center; justify-content: center; color: var(--primary);
          margin-bottom: 1rem;
        }
        .feature-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .feature-card p { font-size: 0.85rem; color: var(--muted); line-height: 1.5; }

        .loader {
          width: 20px; height: 20px; border: 3px solid rgba(0,0,0,0.1); border-top: 3px solid #000;
          border-radius: 50%; animation: spin 1s linear infinite;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .auth-container { grid-template-columns: 1fr; gap: 2rem; }
          .info-side { display: none; }
          .auth-card { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
