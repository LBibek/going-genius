import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { GoingGenius, GGUser } from './gg-client';

interface GoingGeniusContextType {
  clientId: string;
  user: GGUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (state?: string) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const GoingGeniusContext = createContext<GoingGeniusContextType | undefined>(undefined);

export function GoingGeniusProvider({ 
  clientId, 
  redirectUri,
  config,
  children 
}: { 
  clientId: string;
  redirectUri?: string;
  config?: {
    apiBase?: string;
  };
  children: ReactNode;
}) {
  const [user, setUser] = useState<GGUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const gg = useMemo(() => new GoingGenius({ 
    clientId, 
    redirectUri: redirectUri || (typeof window !== 'undefined' ? window.location.origin : '') 
  }), [clientId, redirectUri]);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const apiBase = config?.apiBase || '/api/gg';
      // In a real implementation, this would fetch from the host application's GG session bridge
      const res = await fetch(`${apiBase}/session`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('GG SDK Error: Session refresh failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = (state?: string) => {
    gg.login(state);
  };

  const logout = async () => {
    try {
      const apiBase = config?.apiBase || '/api/gg';
      await fetch(`${apiBase}/logout`, { method: 'POST' });
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  return (
    <GoingGeniusContext.Provider value={{ 
      clientId, 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      logout, 
      refreshSession 
    }}>
      {children}
    </GoingGeniusContext.Provider>
  );
}

export function useGoingGenius() {
  const context = useContext(GoingGeniusContext);
  if (!context) throw new Error('useGoingGenius must be used within GoingGeniusProvider');
  return context;
}

// Alias for migration compatibility
export const useGGAuth = useGoingGenius;
export const GGProvider = GoingGeniusProvider;
