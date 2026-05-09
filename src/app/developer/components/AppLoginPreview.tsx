/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Code2, Globe, Gamepad2, CheckCircle2, ArrowRight, User, Shield, Zap } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

export function AppLoginPreview({ app }: { app: any }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const isGoogleEnabled = !!app.googleClientId;
  const isGithubEnabled = !!app.githubClientId;
  const isSteamEnabled = !!app.steamApiKey;

  const handleSocialLogin = (provider: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoggedInUser({
        name: 'Genius Developer',
        email: 'dev@goinggenius.com',
        provider
      });
    }, 1500);
  };

  return (
    <div className="preview-container">
      <div className="preview-browser-header">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-address">
          {loggedInUser ? `${app.name.toLowerCase().replace(/\s+/g, '')}.com/dashboard` : `gguser.com/auth?client_id=${app.clientId.slice(0, 8)}...`}
        </div>
        <div className="live-badge">{loggedInUser ? 'AUTHENTICATED' : 'LIVE PREVIEW'}</div>
      </div>

      <div className="preview-body">
        {loggedInUser ? (
          <div className="mini-auth-card success-state animate-fade-in">
            <div className="success-icon-wrapper">
              <div className="success-glow"></div>
              <CheckCircle2 size={40} className="text-primary" style={{ position: 'relative' }} />
            </div>
            <h3 className="mini-title">Welcome back!</h3>
            <p className="mini-subtitle">You are securely signed in via {loggedInUser.provider}</p>
            
            <div className="user-profile-mini">
              <div className="user-avatar">
                {app.logoUrl ? (
                  <OptimizedImage src={app.logoUrl} alt="Avatar" width={32} height={32} />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="user-info">
                <div className="user-name">{loggedInUser.name}</div>
                <div className="user-email">{loggedInUser.email}</div>
              </div>
              <div className="provider-badge">
                {loggedInUser.provider === 'Google' && <Globe size={12} />}
                {loggedInUser.provider === 'GitHub' && <Code2 size={12} />}
                {loggedInUser.provider === 'Steam' && <Gamepad2 size={12} />}
                {loggedInUser.provider === 'GGUser' && <Zap size={12} />}
              </div>
            </div>

            <button className="mini-btn secondary" onClick={() => setLoggedInUser(null)}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mini-auth-card animate-fade-in">
            <div className="mini-logo">
              <div className="mini-logo-icon">GG</div>
              <span className="mini-logo-text">GGUser</span>
            </div>
            
            <div className="mini-app-intro">
              <div className="logo-pulse-wrapper">
                <div className="logo-pulse"></div>
                {app.logoUrl ? (
                  <OptimizedImage 
                    src={app.logoUrl} 
                    alt={app.name} 
                    width={56} 
                    height={56} 
                    className="mini-app-logo" 
                  />
                ) : (
                  <div className="mini-app-logo-placeholder">
                    {app.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="mini-title">Connect to {app.name}</h3>
              <p className="mini-subtitle">Authorization requested</p>
            </div>

            <div className="mini-form">
              <div className="mini-btn primary-gradient-bg" onClick={() => handleSocialLogin('GGUser')}>
                {isLoggingIn ? (
                  <span className="flex-center gap-2">
                    <div className="mini-spinner"></div>
                    Securing...
                  </span>
                ) : (
                  <span className="flex-center gap-2">
                    <Shield size={14} />
                    Continue with GGUser
                  </span>
                )}
              </div>
            </div>

            <div className="mini-divider">
              <div className="divider-line"></div>
              <span>Trust Network</span>
              <div className="divider-line"></div>
            </div>

            <div className="mini-socials">
              {isGoogleEnabled ? (
                <div className="mini-social-btn google" onClick={() => handleSocialLogin('Google')}>
                  <OptimizedImage src="/images/social/google.png" alt="Google" width={16} height={16} />
                  <span>Google</span>
                </div>
              ) : (
                <div className="mini-social-btn disabled" title="Configure Google Auth to enable">
                  <Globe size={14} style={{ opacity: 0.5 }} />
                  <span>Google</span>
                </div>
              )}

              <div className="social-row">
                {isGithubEnabled ? (
                  <div className="mini-social-btn github" onClick={() => handleSocialLogin('GitHub')}>
                    <OptimizedImage src="/images/social/github.png" alt="GitHub" width={16} height={16} />
                    <span>GitHub</span>
                  </div>
                ) : (
                  <div className="mini-social-btn disabled">
                    <Code2 size={14} style={{ opacity: 0.5 }} />
                    <span>GitHub</span>
                  </div>
                )}

                {isSteamEnabled ? (
                  <div className="mini-social-btn steam" onClick={() => handleSocialLogin('Steam')}>
                    <OptimizedImage src="/images/social/steam.png" alt="Steam" width={16} height={16} />
                    <span>Steam</span>
                  </div>
                ) : (
                  <div className="mini-social-btn disabled">
                    <Gamepad2 size={14} style={{ opacity: 0.5 }} />
                    <span>Steam</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mini-footer">
              Securely powered by <span className="text-primary font-bold">Going Genius</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .preview-container {
          background: #020617; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          min-height: 480px;
          position: relative;
          font-family: var(--font-outfit), sans-serif;
        }
        .preview-browser-header {
          background: rgba(15, 23, 42, 0.8); padding: 0.8rem 1.25rem; display: flex; align-items: center; gap: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
        }
        .browser-dots { display: flex; gap: 0.5rem; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #ef4444; } .yellow { background: #fbbf24; } .green { background: #22c55e; }
        .browser-address {
          flex: 1; background: rgba(0,0,0,0.4); padding: 0.4rem 1rem; border-radius: 8px;
          font-size: 0.75rem; color: #94a3b8; font-family: 'JetBrains Mono', monospace; text-align: left;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .live-badge {
          font-size: 0.65rem; font-weight: 800; color: var(--primary);
          background: rgba(255, 177, 22, 0.1); padding: 4px 10px; border-radius: 6px;
          letter-spacing: 0.05em;
          box-shadow: 0 0 15px rgba(255, 177, 22, 0.1);
        }

        .preview-body { 
          padding: 3rem 2rem; 
          display: flex; 
          justify-content: center; 
          align-items: center;
          min-height: 400px;
          background: radial-gradient(circle at top right, rgba(255, 177, 22, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08) 0%, transparent 40%); 
        }
        
        .mini-auth-card {
          width: 100%; max-width: 340px; background: rgba(30, 41, 59, 0.5); 
          border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2rem;
          backdrop-filter: blur(20px);
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }

        .mini-logo { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; justify-content: center; }
        .mini-logo-icon { width: 28px; height: 28px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 900; color: #000; }
        .mini-logo-text { font-size: 0.9rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }

        .mini-app-intro { text-align: center; margin-bottom: 2rem; }
        .logo-pulse-wrapper { position: relative; width: 64px; height: 64px; margin: 0 auto 1rem; }
        .logo-pulse { position: absolute; inset: -4px; background: var(--primary); border-radius: 18px; opacity: 0.2; animation: pulse 2s infinite; }
        :global(.mini-app-logo) { width: 64px; height: 64px; border-radius: 16px; position: relative; z-index: 1; border: 2px solid rgba(255,255,255,0.1); }
        .mini-app-logo-placeholder { width: 64px; height: 64px; border-radius: 16px; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; position: relative; z-index: 1; }
        
        .mini-title { font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
        .mini-subtitle { font-size: 0.85rem; color: #94a3b8; }

        .mini-form { margin-bottom: 1.5rem; }
        .mini-btn { 
          width: 100%; height: 48px; border-radius: 12px; 
          font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; 
          justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .primary-gradient-bg { background: linear-gradient(135deg, var(--primary) 0%, #FF8C00 100%); color: #000; }
        .primary-gradient-bg:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(255, 177, 22, 0.4); }
        .primary-gradient-bg:active { transform: translateY(0); }
        
        .mini-btn.secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .mini-btn.secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        .mini-divider { 
          display: flex; align-items: center; gap: 1rem; margin: 2rem 0; 
          font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }

        .mini-socials { display: flex; flex-direction: column; gap: 1rem; }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .mini-social-btn { 
          height: 48px; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; gap: 0.75rem; 
          font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
          background: rgba(255,255,255,0.02); color: #e2e8f0;
        }
        .mini-social-btn:hover:not(.disabled) { background: rgba(255,255,255,0.05); border-color: var(--primary); color: #fff; }
        .mini-social-btn.disabled { opacity: 0.25; cursor: not-allowed; border-style: dashed; }
        
        .success-icon-wrapper { position: relative; width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; }
        .success-glow { position: absolute; inset: 0; background: var(--primary); filter: blur(25px); opacity: 0.3; border-radius: 50%; }
        
        .user-profile-mini { 
          margin: 2rem 0; padding: 1.25rem; background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; gap: 1rem; text-align: left;
          position: relative;
        }
        .user-avatar { width: 40px; height: 40px; border-radius: 12px; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .user-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
        .user-email { font-size: 0.75rem; color: #94a3b8; }
        .provider-badge { position: absolute; top: -10px; right: 10px; background: #000; border: 1px solid var(--border); padding: 4px; border-radius: 8px; color: var(--primary); }

        .mini-footer { margin-top: 2rem; font-size: 0.75rem; color: #64748b; }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .gap-2 { gap: 0.5rem; }
        
        .mini-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.1); border-top-color: #000; border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.1); opacity: 0.3; } 100% { transform: scale(1); opacity: 0.2; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
