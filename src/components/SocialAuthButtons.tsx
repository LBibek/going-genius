'use client';

import { OptimizedImage } from './OptimizedImage';

interface SocialAuthButtonsProps {
  onLogin?: (provider: string) => void;
  isLoading?: boolean;
}

export function SocialAuthButtons({ onLogin, isLoading }: SocialAuthButtonsProps) {
  const handleLogin = (provider: string) => {
    if (onLogin) onLogin(provider);
    else {
      // Default behavior if no handler is provided
      console.log(`Logging in with ${provider}`);
      // In a real app, this would redirect to the OAuth endpoint
      // window.location.href = `/api/auth/${provider.toLowerCase()}`;
    }
  };

  return (
    <div className="social-auth-container">
      <button 
        className="social-auth-btn google" 
        onClick={() => handleLogin('Google')}
        disabled={isLoading}
      >
        <OptimizedImage src="/images/social/google.png" alt="Google" width={20} height={20} />
        <span>Continue with Google</span>
      </button>
      
      <div className="social-auth-row">
        <button 
          className="social-auth-btn github" 
          onClick={() => handleLogin('GitHub')}
          disabled={isLoading}
        >
          <OptimizedImage src="/images/social/github.png" alt="GitHub" width={20} height={20} />
          <span>GitHub</span>
        </button>
        <button 
          className="social-auth-btn steam" 
          onClick={() => handleLogin('Steam')}
          disabled={isLoading}
        >
          <OptimizedImage src="/images/social/steam.png" alt="Steam" width={20} height={20} />
          <span>Steam</span>
        </button>
      </div>

      <div className="divider-text">
        <span>or use email</span>
      </div>
    </div>
  );
}
