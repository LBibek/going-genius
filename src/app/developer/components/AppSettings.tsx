/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useActionState, useState } from 'react';
import { updateApp, deleteApp } from '@/app/actions/developer';
import { ImageUpload } from '@/components/ImageUpload';

export function AppSettings({ app }: { app: any }) {
  const [updateState, updateAction, updatePending] = useActionState(updateApp.bind(null, app.id), undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(app.logoUrl || '');

  async function handleDelete() {
    if (!confirm('Are you absolutely sure? This will delete the app and all associated data. This action cannot be undone.')) return;
    setIsDeleting(true);
    await deleteApp(app.id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <form action={updateAction} className="auth-form" style={{ gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Name</label>
          <input
            name="name"
            defaultValue={app.name}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Redirect URIs</label>
          <input
            name="redirectUris"
            defaultValue={app.redirectUris.join(', ')}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            required
          />
        </div>

        <div className="form-group">
          <ImageUpload 
            label="App Logo"
            value={logoUrl}
            onUploadComplete={(url) => setLogoUrl(url)}
          />
          <input type="hidden" name="logoUrl" value={logoUrl} />
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Marketplace Listing</h3>
          
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input 
              type="checkbox" 
              name="isPublic" 
              id="isPublic"
              defaultChecked={app.isPublic}
              style={{ width: 'auto' }}
            />
            <label htmlFor="isPublic" className="form-label" style={{ margin: 0, fontSize: '0.85rem', cursor: 'pointer' }}>
              Publish to Ecosystem Marketplace
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Tagline (Short hook)</label>
            <input
              name="marketplaceTagline"
              defaultValue={app.marketplaceTagline}
              placeholder="e.g. The ultimate CRM for Going Genius"
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
            <select
              name="marketplaceCategory"
              defaultValue={app.marketplaceCategory || ''}
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            >
              <option value="">Select Category</option>
              <option value="Productivity">Productivity</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Development">Development</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Description (Long form)</label>
            <textarea
              name="marketplaceDescription"
              defaultValue={app.marketplaceDescription}
              rows={4}
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem', resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Screenshots (Comma separated URLs)</label>
            <input
              name="marketplaceScreenshots"
              defaultValue={app.marketplaceScreenshots?.join(', ')}
              placeholder="https://image1.com, https://image2.com"
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            />
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              Tip: Use Uploadcare UUIDs or full HTTPS URLs.
            </p>
          </div>
        </div>

        {updateState?.message && (
          <div className={`form-alert ${updateState.success ? 'success' : 'error'}`} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
            {updateState.message}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={updatePending} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', marginTop: '1rem' }}>
          {updatePending ? 'Saving...' : 'Update Application'}
        </button>
      </form>

      <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn" 
          style={{ 
            width: '100%', 
            justifyContent: 'center', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#fca5a5', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.85rem'
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Application'}
        </button>
      </div>
    </div>
  );
}
