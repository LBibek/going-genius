/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="theme-toggle-skeleton" aria-hidden="true" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn-theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="icon-rotate" />
      ) : (
        <Moon size={18} className="icon-rotate" />
      )}
    </button>
  );
}

