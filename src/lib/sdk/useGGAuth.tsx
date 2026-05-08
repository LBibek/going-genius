'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoingGenius } from './gg-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface GGContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const GGContext = createContext<GGContextType | undefined>(undefined);

export function GGProvider({ 
  children, 
  clientId,
  redirectUri 
}: { 
  children: React.ReactNode;
  clientId: string;
  redirectUri: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const gg = new GoingGenius({ clientId, redirectUri });

  useEffect(() => {
    async function initAuth() {
      try {
        // In a real world, this would call the GG identity server
        // For our internal use, we'll check the local session
        const response = await fetch('/api/gg/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('GG SDK: Failed to fetch session', error);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = () => {
    const authUrl = gg.getAuthUrl(['profile', 'email']);
    window.location.href = authUrl;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <GGContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
      {children}
    </GGContext.Provider>
  );
}

export function useGGAuth() {
  const context = useContext(GGContext);
  if (context === undefined) {
    throw new Error('useGGAuth must be used within a GGProvider');
  }
  return context;
}
