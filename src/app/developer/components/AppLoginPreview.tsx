'use client';

import { useState } from 'react';
import { Code2, Globe, Gamepad2, CheckCircle2, ArrowRight, User } from 'lucide-react';

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
      </div>

      <div className="preview-body">
        <div className="mini-auth-card">
          <div className="mini-logo">
            <div className="mini-logo-icon">GG</div>
            <span className="mini-logo-text">GGUser</span>
          </div>
          
          <div className="mini-app-intro">
            {app.logoUrl ? (
              <img src={app.logoUrl} alt="" className="mini-app-logo" />
            ) : (
              <div className="mini-app-logo-placeholder">{app.name.slice(0, 1).toUpperCase()}</div>
            )}
            <h3 className="mini-title">Log in to {app.name}</h3>
            <p className="mini-subtitle">to continue to the application</p>
          </div>

          <div className="mini-form">
            <div className="mini-input" />
            <div className="mini-input" />
            <div className="mini-btn">
              {isLoggingIn ? 'Authenticating...' : 'Sign in with GGUser'}
            </div>
          </div>

          <div className="mini-divider"><span>or continue with</span></div>

          <div className="mini-socials">
            {isGoogleEnabled ? (
              <div className="mini-social-btn google" onClick={() => handleSocialLogin('Google')}>
                <Globe size={14} /> Google
              </div>
            ) : (
              <div className="mini-social-btn disabled">
                <Globe size={14} /> (Not Configured)
              </div>
            )}

            {isGithubEnabled ? (
              <div className="mini-social-btn github" onClick={() => handleSocialLogin('GitHub')}>
                <Code2 size={14} /> GitHub
              </div>
            ) : (
              <div className="mini-social-btn disabled">
                <Code2 size={14} /> (Not Configured)
              </div>
            )}

            {isSteamEnabled ? (
              <div className="mini-social-btn steam" onClick={() => handleSocialLogin('Steam')}>
                <Gamepad2 size={14} /> Steam
              </div>
            ) : (
              <div className="mini-social-btn disabled">
                <Gamepad2 size={14} /> (Not Configured)
              </div>
            )}
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
      min-height: 380px;
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
    }

    .preview-body { 
      padding: 1.5rem; 
      display: flex; 
      justify-content: center; 
      align-items: center;
      min-height: 320px;
      background: radial-gradient(circle at top, rgba(255, 177, 22, 0.05) 0%, transparent 100%); 
    }
    @media (max-width: 400px) {
      .preview-body { padding: 0.75rem; }
      .mini-auth-card { padding: 1rem; }
    }
    .mini-auth-card {
      width: 100%; max-width: 320px; background: rgba(255,255,255,0.03); 
      border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 1.5rem;
      backdrop-filter: blur(10px);
      text-align: center;
    }

    .mini-logo { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; justify-content: center; }
    .mini-logo-icon { width: 24px; height: 24px; background: var(--primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; color: #000; }
    .mini-logo-text { font-size: 0.8rem; font-weight: 800; color: #fff; }

    .mini-app-intro { text-align: center; margin-bottom: 1.25rem; }
    .mini-app-logo { width: 40px; height: 40px; border-radius: 10px; margin-bottom: 0.75rem; }
    .mini-app-logo-placeholder { width: 40px; height: 40px; border-radius: 10px; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 0.75rem; }
    .mini-title { font-size: clamp(0.9rem, 2vw, 1rem); margin-bottom: 0.25rem; }
    .mini-subtitle { font-size: clamp(0.6rem, 1.5vw, 0.7rem); color: var(--muted); }

    .mini-form { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
    .mini-input { height: 32px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; }
    .mini-btn { 
      height: 36px; background: var(--primary); color: #000; border-radius: 8px; 
      font-size: clamp(0.7rem, 1.5vw, 0.75rem); font-weight: 700; display: flex; align-items: center; 
      justify-content: center; cursor: pointer; transition: transform 0.2s;
    }
    .mini-btn:hover { transform: scale(1.02); }
    .mini-btn.secondary { background: rgba(255,255,255,0.1); color: #fff; margin-top: 1rem; }

    .mini-divider { text-align: center; border-bottom: 1px solid var(--border); line-height: 0.1em; margin: 1.5rem 0; font-size: 0.6rem; color: var(--muted); }
    .mini-divider span { background: #0d0d12; padding: 0 10px; }

    .mini-socials { display: flex; flex-direction: column; gap: 0.5rem; }
    .mini-social-btn { height: 34px; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .mini-social-btn:hover { background: var(--glass-hover); border-color: var(--primary); }
    .mini-social-btn.disabled { opacity: 0.3; cursor: not-allowed; border-style: dashed; }
    
    .success-icon { margin-bottom: 1rem; display: flex; justify-content: center; }
    .user-profile-mini { 
      margin: 1.5rem 0; padding: 1rem; background: rgba(255,255,255,0.05); 
      border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; text-align: left;
    }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #000; display: flex; align-items: center; justify-content: center; }
    .user-name { font-size: 0.8rem; font-weight: 600; }
    .user-email { font-size: 0.65rem; color: var(--muted); }

    .mini-footer { margin-top: 1.5rem; text-align: center; font-size: 0.65rem; color: var(--muted); }
    .mini-footer span { color: var(--primary); font-weight: 600; cursor: pointer; }
  `}</style>
);
