import { SDKPlayground } from './components/SDKPlayground';
import { Play } from 'lucide-react';

export const metadata = {
  title: 'SDK Playground | Going Genius Developer',
  description: 'Live in-browser playground for the @going-genius/react SDK. Configure and test your AI bot in real-time.',
};

export default function PlaygroundPage() {
  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Play size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="fluid-h2" style={{ margin: 0 }}>SDK Playground</h1>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', maxWidth: '650px' }}>
        Configure your AI bot and preview it live. Copy the generated code to drop into your own app instantly.
        Connect your App ID to test with real AI responses.
      </p>

      <SDKPlayground />
    </div>
  );
}
