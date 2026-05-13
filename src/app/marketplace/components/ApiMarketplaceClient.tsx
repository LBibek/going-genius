'use client';

import { 
  Terminal, 
  Search,
  Star
} from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import Link from 'next/link';

interface ApiMarketplaceClientProps {
  apis: any[];
}

export function ApiMarketplaceClient({ apis }: ApiMarketplaceClientProps) {
  return (
    <div className="api-market-container">
      <header className="market-header">
        <div className="hero-content">
          <h1 className="fluid-h1">Public API Marketplace</h1>
          <p className="lead">Discover and integrate world-class APIs built on the Going Genius ecosystem.</p>
          
          <div className="search-box glass-card">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search APIs by name, category, or functionality..." />
            <button className="btn btn-primary">Find API</button>
          </div>
        </div>
      </header>

      <main className="market-main">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="filter-list">
              <label><input type="checkbox" defaultChecked /> All APIs</label>
              <label><input type="checkbox" /> Authentication</label>
              <label><input type="checkbox" /> Payments</label>
              <label><input type="checkbox" /> AI & ML</label>
              <label><input type="checkbox" /> Data & Analytics</label>
            </div>
          </div>

          <div className="filter-group">
            <h3>Pricing</h3>
            <div className="filter-list">
              <label><input type="radio" name="price" /> Free</label>
              <label><input type="radio" name="price" /> Freemium</label>
              <label><input type="radio" name="price" /> Paid</label>
            </div>
          </div>
        </aside>

        <section className="api-grid-section">
          <div className="grid-header">
            <span>Showing {apis.length} APIs</span>
            <div className="sort-by">
              <span className="text-muted text-sm">Sort by:</span>
              <select className="sort-select">
                <option>Popularity</option>
                <option>Newest</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="api-grid">
            {apis.length === 0 ? (
              <div className="empty-state glass-card">
                <Terminal size={48} className="text-muted" />
                <h3>No APIs found</h3>
                <p>Be the first to publish a public API on Going Genius!</p>
                <Link href="/developer/apps/new" className="btn btn-outline">Publish API</Link>
              </div>
            ) : (
              apis.map(api => (
                <Link href={`/marketplace/apis/${api.id}`} key={api.id} className="api-card glass-card">
                  <div className="card-top">
                    <OptimizedImage src={api.logoUrl || '/images/api-placeholder.png'} alt={api.name} width={48} height={48} style={{ borderRadius: '12px' }} />
                    <div className="meta">
                      <div className="rating">
                        <Star size={12} fill="var(--warning)" color="var(--warning)" />
                        <span>4.8</span>
                      </div>
                      <span className="category">{api.category}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="api-name">{api.name}</h3>
                    <p className="api-tagline">{api.tagline || 'No description provided.'}</p>
                  </div>

                  <div className="card-footer">
                    <div className="dev-info">
                      <span className="text-muted">by</span>
                      <span className="dev-name">{api.owner.displayName}</span>
                    </div>
                    <div className="price-tag">FREE</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .api-market-container {
          min-height: 100vh;
          background: radial-gradient(circle at top left, rgba(var(--primary-rgb), 0.05), transparent);
        }

        .market-header {
          padding: 6rem 2rem 4rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .lead {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 3rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0.5rem 0.5rem 1.5rem;
          border-radius: 50px;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          outline: none;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .market-main {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .filters-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .filter-group h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .filter-list label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .filter-list label:hover {
          color: var(--primary);
        }

        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .sort-select {
          background: transparent;
          border: none;
          color: white;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .api-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
        }

        .api-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 10px 30px -10px rgba(var(--primary-rgb), 0.2);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .category {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .api-name {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .api-tagline {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .dev-info {
          display: flex;
          gap: 0.4rem;
          font-size: 0.85rem;
        }

        .dev-name {
          font-weight: 600;
          color: var(--primary);
        }

        .price-tag {
          font-weight: 800;
          font-size: 0.85rem;
          color: #10b981;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .market-main {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
