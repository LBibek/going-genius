'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, AppWindow, Users, Activity, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gg/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="global-search-container" ref={searchRef}>
      <button 
        className="search-trigger"
        onClick={() => setIsOpen(true)}
      >
        <Search size={18} />
        <span>Search apps, users, docs...</span>
        <kbd>⌘K</kbd>
      </button>

      {isOpen && (
        <div className="search-modal-overlay">
          <div className="search-modal glass-card">
            <div className="search-header">
              <Search size={20} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search across the GG ecosystem..." 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="search-body">
              {loading && (
                <div className="search-loading">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Scanning ecosystem...</span>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="search-results">
                  {results.map((result: any, idx: number) => (
                    <Link 
                      href={result.url} 
                      key={idx} 
                      className="search-result-item"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="result-icon">
                        {result.type === 'app' && <AppWindow size={18} />}
                        {result.type === 'marketplace' && <Search size={18} className="text-primary" />}
                        {result.type === 'user' && <Users size={18} />}
                        {result.type === 'doc' && <Activity size={18} />}
                      </div>
                      <div className="result-info">
                        <div className="result-title">
                          {result.title}
                          {result.isPremium && <span className="premium-tag"><Sparkles size={10}/> PRO</span>}
                          {result.isOfficial && <span className="official-tag"><ShieldCheck size={10}/> OFFICIAL</span>}
                        </div>
                        <div className="result-subtitle">{result.subtitle}</div>
                      </div>
                      <div className="result-type">{result.type}</div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="search-empty">
                  <p>No matches found for "{query}"</p>
                  <span>Try searching for an app name, user email, or documentation topic.</span>
                </div>
              )}

              {!loading && query.length < 2 && (
                <div className="search-suggestions">
                  <div className="suggestion-group">
                    <h4>Recent Apps</h4>
                    <div className="suggestion-items">
                      <div className="suggestion-item">WordPress Demo</div>
                      <div className="suggestion-item">Universal Wallet</div>
                    </div>
                  </div>
                  <div className="suggestion-group">
                    <h4>Quick Links</h4>
                    <div className="suggestion-items">
                      <div className="suggestion-item">API Documentation</div>
                      <div className="suggestion-item">Billing Configuration</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="search-footer">
              <div className="footer-tip">
                <span>Navigate with <kbd>↑</kbd><kbd>↓</kbd></span>
                <span>Select with <kbd>Enter</kbd></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .global-search-container {
          position: relative;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          color: #71717a;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 280px;
        }

        .search-trigger:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #a1a1aa;
        }

        .search-trigger kbd {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: inherit;
        }

        .search-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding-top: 10vh;
        }

        .search-modal {
          width: 100%;
          max-width: 650px;
          height: fit-content;
          max-height: 80vh;
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .search-header input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.1rem;
          outline: none;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
        }

        .search-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          min-height: 200px;
        }

        .search-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem;
          color: #71717a;
        }

        .search-results {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          color: #fff;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .search-result-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .result-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71717a;
        }

        .result-info {
          flex: 1;
        }

        .result-title {
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-subtitle {
          font-size: 0.8rem;
          color: #71717a;
        }

        .premium-tag {
          font-size: 0.6rem;
          background: #FFB116;
          color: #000;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 800;
        }

        .official-tag {
          font-size: 0.6rem;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .result-type {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #3f3f46;
          font-weight: 700;
        }

        .search-empty {
          text-align: center;
          padding: 3rem;
          color: #71717a;
        }

        .search-empty p { color: #fff; margin-bottom: 0.5rem; }

        .search-suggestions {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
        }

        .suggestion-group h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #3f3f46;
          margin-bottom: 1rem;
          letter-spacing: 0.1em;
        }

        .suggestion-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .suggestion-item {
          font-size: 0.85rem;
          color: #a1a1aa;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }

        .search-footer {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-tip {
          display: flex;
          gap: 1.5rem;
          font-size: 0.7rem;
          color: #3f3f46;
        }

        .footer-tip kbd {
          background: rgba(255, 255, 255, 0.05);
          padding: 1px 4px;
          border-radius: 3px;
          margin: 0 2px;
        }
      `}</style>
    </div>
  );
}
