/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Code2, Globe, Gamepad2, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

export function AppLoginPreview({ app }: { app: any }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const isGoogleEnabled = !!app.googleClientId;
  const isGithubEnabled = !!app.githubClientId;
  const isSteamEnabled = !!app.steamApiKey;

  const handleSocialLogin = (provider: string) => {
    setIsLoggingIn(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoggingIn(false);
      setLoggedInUser({
        name: 'Genius Developer',
        email: 'dev@goinggenius.com',
        provider
      });
    }, 1500);
  };

  if (loggedInUser) {
    return (
      <div className="preview-container">
        <div className="preview-browser-header">
          <div className="browser-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="browser-address">{app.name.toLowerCase().replace(/\s+/g, '')}.com/dashboard</div>
        </div>
        <div className="preview-body">
          <div className="mini-auth-card success-state">
            <div className="success-icon">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h3 className="mini-title">Authenticated!</h3>
            <p className="mini-subtitle">Successfully signed in via {loggedInUser.provider}</p>
            
            <div className="user-profile-mini">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <div className="user-name">{loggedInUser.name}</div>
                <div className="user-email">{loggedInUser.email}</div>
              </div>
            </div>

            <div className="mini-btn secondary" onClick={() => setLoggedInUser(null)}>
              Sign Out
            </div>
          </div>
        </div>
        {styles}
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-browser-header">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-address">gguser.com/api/gg/authorize?client_id={app.clientId.slice(0, 8)}...</div>
        <div className="live-badge">LIVE PREVIEW</div>
      </div>

      <div className="preview-body">
        <div className="mini-auth-card">
          <div className="mini-logo">
            <div className="mini-logo-icon">GG</div>
            <span className="mini-logo-text">GGUser</span>
          </div>
          
          <div className="mini-app-intro">
            {app.logoUrl ? (
              <OptimizedImage 
                src={app.logoUrl} 
                alt={app.name} 
                width={48} 
                height={48} 
                className="mini-app-logo" 
              />
            ) : (
              <div className="mini-app-logo-placeholder">
                {app.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <h3 className="mini-title">Log in to {app.name}</h3>
            <p className="mini-subtitle">to continue to the application</p>
          </div>

          <div className="mini-form">
            <div className="mini-input-group">
              <div className="mini-label" />
              <div className="mini-input" />
            </div>
            <div className="mini-input-group">
              <div className="mini-label" />
              <div className="mini-input" />
            </div>
            <div className="mini-btn" onClick={() => handleSocialLogin('GGUser')}>
              {isLoggingIn ? 'Authenticating...' : 'Sign in with GGUser'}
            </div>
          </div>

          <div className="mini-divider">
            <div className="divider-line"></div>
            <span>or continue with</span>
            <div className="divider-line"></div>
          </div>

          <div className="mini-socials">
            {isGoogleEnabled ? (
              <div className="mini-social-btn google" onClick={() => handleSocialLogin('Google')}>
                <OptimizedImage src="/images/social/google.png" alt="Google" width={18} height={18} />
                <span>Google</span>
              </div>
            ) : (
              <div className="mini-social-btn google disabled" title="Configure Google Auth to enable">
                <Globe size={14} />
                <span>Google</span>
              </div>
            )}

            <div className="social-row">
              {isGithubEnabled ? (
                <div className="mini-social-btn github" onClick={() => handleSocialLogin('GitHub')}>
                  <OptimizedImage src="/images/social/github.png" alt="GitHub" width={18} height={18} />
                  <span>GitHub</span>
                </div>
              ) : (
                <div className="mini-social-btn github disabled" title="Configure GitHub Auth to enable">
                  <Code2 size={14} />
                  <span>GitHub</span>
                </div>
              )}

              {isSteamEnabled ? (
                <div className="mini-social-btn steam" onClick={() => handleSocialLogin('Steam')}>
                  <OptimizedImage src="/images/social/steam.png" alt="Steam" width={18} height={18} />
                  <span>Steam</span>
                </div>
              ) : (
                <div className="mini-social-btn steam disabled" title="Configure Steam Auth to enable">
                  <Gamepad2 size={14} />
                  <span>Steam</span>
                </div>
              )}
            </div>
          </div>

          <div className="mini-footer">
            Don't have an account? <span>Sign up</span>
          </div>
        </div>
      </div>

      {styles}
    </div>
  );
}

const styles = (
  <style jsx>{`
    .preview-container {
      background: #000; border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      min-height: 420px;
      position: relative;
    }
    .preview-browser-header {
      background: #111; padding: 0.6rem 1rem; display: flex; align-items: center; gap: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .browser-dots { display: flex; gap: 0.4rem; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
    .browser-address {
      flex: 1; background: #000; padding: 0.25rem 0.75rem; border-radius: 6px;
      font-size: 0.7rem; color: var(--muted); font-family: monospace; text-align: center;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .live-badge {
      font-size: 0.6rem; font-weight: 800; color: var(--primary);
      background: rgba(255, 177, 22, 0.1); padding: 2px 6px; border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .preview-body { 
      padding: 2rem 1.5rem; 
      display: flex; 
      justify-content: center; 
      align-items: center;
      min-height: 360px;
      background: radial-gradient(circle at top, rgba(255, 177, 22, 0.05) 0%, transparent 100%); 
    }
    @media (max-width: 400px) {
      .preview-body { padding: 1rem 0.75rem; }
      .mini-auth-card { padding: 1.25rem 1rem; }
    }
    .mini-auth-card {
      width: 100%; max-width: 320px; background: rgba(255,255,255,0.03); 
      border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 1.75rem;
      backdrop-filter: blur(10px);
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .mini-logo { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; justify-content: center; }
    .mini-logo-icon { width: 24px; height: 24px; background: var(--primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; color: #000; }
    .mini-logo-text { font-size: 0.8rem; font-weight: 800; color: #fff; }

    .mini-app-intro { text-align: center; margin-bottom: 1.5rem; }
    :global(.mini-app-logo) { width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 0.75rem; display: block; }
    .mini-app-logo-placeholder { width: 48px; height: 48px; border-radius: 12px; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 0.75rem; font-size: 1.2rem; }
    .mini-title { font-size: 1rem; margin-bottom: 0.25rem; font-weight: 700; color: #fff; }
    .mini-subtitle { font-size: 0.75rem; color: var(--muted); }

    .mini-form { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }
    .mini-input-group { display: flex; flex-direction: column; gap: 0.25rem; text-align: left; }
    .mini-label { height: 6px; width: 40px; background: rgba(255,255,255,0.1); border-radius: 3px; }
    .mini-input { height: 36px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; }
    .mini-btn { 
      height: 40px; background: var(--primary); color: #000; border-radius: 8px; 
      font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; 
      justify-content: center; cursor: pointer; transition: all 0.2s;
      margin-top: 0.25rem;
    }
    .mini-btn:hover { background: #ffc14d; transform: translateY(-1px); }
    .mini-btn:active { transform: translateY(0); }
    .mini-btn.secondary { background: rgba(255,255,255,0.1); color: #fff; margin-top: 1rem; }
    .mini-btn.secondary:hover { background: rgba(255,255,255,0.15); }

    .mini-divider { 
      display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0; 
      font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;
    }
    .divider-line { flex: 1; height: 1px; background: var(--border); }

    .mini-socials { 
      display: flex; 
      flex-direction: column;
      gap: 0.75rem; 
      margin-top: 1rem;
    }
    .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .mini-social-btn { 
      height: 40px; border: 1px solid var(--border); border-radius: 10px; 
      display: flex; align-items: center; justify-content: center; gap: 0.6rem; 
      font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
      background: rgba(255,255,255,0.02);
      white-space: nowrap;
      color: #fff;
    }
    .mini-social-btn:hover:not(.disabled) { background: rgba(255,255,255,0.05); border-color: var(--primary); transform: translateY(-1px); }
    .mini-social-btn.disabled { opacity: 0.35; cursor: not-allowed; background: rgba(255,255,255,0.01); border-style: dashed; color: var(--muted); }
    
    .success-icon { margin-bottom: 1rem; display: flex; justify-content: center; }
    .user-profile-mini { 
      margin: 1.5rem 0; padding: 1rem; background: rgba(255,255,255,0.05); 
      border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; text-align: left;
    }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; }
    .user-name { font-size: 0.8rem; font-weight: 600; color: #fff; }
    .user-email { font-size: 0.65rem; color: var(--muted); }

    .mini-footer { margin-top: 1.75rem; text-align: center; font-size: 0.7rem; color: var(--muted); }
    .mini-footer span { color: var(--primary); font-weight: 600; cursor: pointer; }
  `}</style>
);

