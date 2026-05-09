import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface GoingGeniusContextType {
  appId: string;
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const GoingGeniusContext = createContext<GoingGeniusContextType | undefined>(undefined);

export function GoingGeniusProvider({ appId, children }: { appId: string, children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the GG session API
      const res = await fetch('/api/gg/session');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('GG Session Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    window.location.href = `https://going-genius.vercel.app/auth/login?appId=${appId}&redirect=${encodeURIComponent(baseUrl)}`;
  };

  const logout = async () => {
    await fetch('/api/gg/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <GoingGeniusContext.Provider value={{ appId, user, isLoading, login, logout, refreshSession }}>
      {children}
    </GoingGeniusContext.Provider>
  );
}

export function useGoingGenius() {
  const context = useContext(GoingGeniusContext);
  if (!context) throw new Error('useGoingGenius must be used within GoingGeniusProvider');
  return context;
}
