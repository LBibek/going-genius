'use client';

import { useActionState, useState } from 'react';
import { updateApp, deleteApp } from '@/app/actions/developer';

export function AppSettings({ app }: { app: any }) {
  const [updateState, updateAction, updatePending] = useActionState(updateApp.bind(null, app.id), undefined);
  const [isDeleting, setIsDeleting] = useState(false);

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
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Logo URL</label>
          <input
            name="logoUrl"
            defaultValue={app.logoUrl || ''}
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
          />
        </div>

        {updateState?.message && (
          <div className={`form-alert ${updateState.success ? 'success' : 'error'}`} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
            {updateState.message}
          </div>
        )}

        <button type="submit" className="btn btn-outline" disabled={updatePending} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
          {updatePending ? 'Saving...' : 'Update Settings'}
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
