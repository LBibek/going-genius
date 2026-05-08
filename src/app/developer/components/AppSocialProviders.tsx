'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAppSocialProviders } from '@/app/actions/developer';
import { Save } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

export function AppSocialProviders({ app }: { app: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    googleClientId: app.googleClientId || '',
    googleClientSecret: app.googleClientSecret || '',
    githubClientId: app.githubClientId || '',
    githubClientSecret: app.githubClientSecret || '',
    steamApiKey: app.steamApiKey || ''
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateAppSocialProviders(app.id, formData);
      if (result.success) {
        setMessage({ text: 'Social keys saved successfully.', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: result.message || 'Failed to save keys.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error communicating with server.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {message && (
        <div className={`form-alert ${message.type}`} style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
          {message.text}
        </div>
      )}

      {/* Google */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <OptimizedImage src="/images/social/google.png" alt="Google" width={18} height={18} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Google OAuth</span>
        </div>
        <div className="form-group" style={{ gap: '0.5rem' }}>
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            placeholder="Google Client ID"
            value={formData.googleClientId}
            onChange={(e) => setFormData({...formData, googleClientId: e.target.value})}
          />
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="Google Client Secret"
            value={formData.googleClientSecret}
            onChange={(e) => setFormData({...formData, googleClientSecret: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

      {/* GitHub */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <OptimizedImage src="/images/social/github.png" alt="GitHub" width={18} height={18} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>GitHub OAuth</span>
        </div>
        <div className="form-group" style={{ gap: '0.5rem' }}>
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            placeholder="GitHub Client ID"
            value={formData.githubClientId}
            onChange={(e) => setFormData({...formData, githubClientId: e.target.value})}
          />
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="GitHub Client Secret"
            value={formData.githubClientSecret}
            onChange={(e) => setFormData({...formData, githubClientSecret: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

      {/* Steam */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <OptimizedImage src="/images/social/steam.png" alt="Steam" width={18} height={18} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Steam OpenID</span>
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            placeholder="Steam API Key"
            value={formData.steamApiKey}
            onChange={(e) => setFormData({...formData, steamApiKey: e.target.value})}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="btn btn-primary" 
        style={{ background: 'var(--primary)', color: '#000', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
      >
        <Save size={16} style={{ marginRight: '4px' }} />
        {isSaving ? 'Saving...' : 'Save Social Settings'}
      </button>

      <style jsx>{`
        .social-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
        .google { background: #4285F4; }
        .github { background: #333; }
        .steam { background: #000; }
        .provider-group { display: flex; flex-direction: column; }
      `}</style>
    </form>
  );
}
