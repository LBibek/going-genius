import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GoingGeniusContextType {
  appId: string;
  user: any | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const GoingGeniusContext = createContext<GoingGeniusContextType | undefined>(undefined);

export interface GoingGeniusProviderProps {
  appId: string;
  children: ReactNode;
}

export const GoingGeniusProvider: React.FC<GoingGeniusProviderProps> = ({ appId, children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    const redirectUri = window.location.origin + '/api/auth/callback/going-genius';
    const url = `https://going-genius.com/oauth/authorize?client_id=${appId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  const logout = () => {
    setUser(null);
    // Add logout logic (clearing tokens/cookies)
  };

  return (
    <GoingGeniusContext.Provider value={{ appId, user, isLoading, login, logout }}>
      {children}
    </GoingGeniusContext.Provider>
  );
};

export const useGoingGenius = () => {
  const context = useContext(GoingGeniusContext);
  if (context === undefined) {
    throw new Error('useGoingGenius must be used within a GoingGeniusProvider');
  }
  return context;
};

/**
 * Auth Button Component
 */
export const AuthButton: React.FC<{ className?: string }> = ({ className }) => {
  const { login } = useGoingGenius();
  return (
    <button 
      onClick={login}
      className={className || 'gg-auth-button'}
      style={{
        background: '#000',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600
      }}
    >
      Login with Going Genius
    </button>
  );
};

/**
 * Subscription Guard Component
 */
export const SubscriptionGuard: React.FC<{ 
  requiredPlan?: string; 
  fallback?: ReactNode;
  children: ReactNode;
}> = ({ requiredPlan, fallback, children }) => {
  const { user, isLoading } = useGoingGenius();

  if (isLoading) return <div>Loading...</div>;

  const hasAccess = user && (!requiredPlan || user.plan === requiredPlan);

  if (!hasAccess) {
    return fallback || <div>This content is restricted to subscribers.</div>;
  }

  return <>{children}</>;
};
