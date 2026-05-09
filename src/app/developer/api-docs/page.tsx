import { SwaggerDocs } from '../components/SwaggerDocs';
import { Book, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'API Reference | Going Genius Developer',
  description: 'Interactive API documentation for the Going Genius Identity and AI Platform.',
};

export default function ApiDocsPage() {
  const specUrl = '/api/docs/openapi.json';

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Book size={28} style={{ color: 'var(--primary)' }} />
            <h1 className="fluid-h2" style={{ margin: 0 }}>API Reference</h1>
          </div>
          <p style={{ color: 'var(--muted)', maxWidth: '600px' }}>
            Interactive documentation for the Going Genius Identity Platform. Use the &quot;Try it out&quot; buttons to test endpoints directly from your browser.
          </p>
        </div>
        <a
          href={specUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', alignSelf: 'flex-start' }}
        >
          <ExternalLink size={16} /> OpenAPI JSON
        </a>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <SwaggerDocs specUrl={specUrl} />
      </div>
    </div>
  );
}
