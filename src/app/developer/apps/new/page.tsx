'use client';

import { useActionState } from 'react';
import { createApp } from '@/app/actions/developer';
import Link from 'next/link';

export default function NewAppPage() {
  const [state, action, pending] = useActionState(createApp, undefined);

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '4rem 1rem' }}>
      <Link href="/developer" className="form-link-sm" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Console
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Application</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Set up a new app to integrate GGUser authentication.</p>

        <form action={action} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">App Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${state?.errors?.name ? 'error' : ''}`}
              placeholder="My Awesome App"
              required
            />
            {state?.errors?.name && <p className="form-error">{state.errors.name[0]}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="redirectUris">
              Redirect URIs
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted)', marginLeft: '0.5rem' }}>
                Comma-separated
              </span>
            </label>
            <input
              id="redirectUris"
              name="redirectUris"
              type="text"
              className={`form-input ${state?.errors?.redirectUris ? 'error' : ''}`}
              placeholder="http://localhost:3000/api/auth/callback, https://myapp.com/callback"
              required
            />
            {state?.errors?.redirectUris && <p className="form-error">{state.errors.redirectUris[0]}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="logoUrl">Logo URL (optional)</label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              className={`form-input ${state?.errors?.logoUrl ? 'error' : ''}`}
              placeholder="https://myapp.com/logo.png"
            />
            {state?.errors?.logoUrl && <p className="form-error">{state.errors.logoUrl[0]}</p>}
          </div>

          {state?.message && <div className="form-alert error">{state.message}</div>}

          <button type="submit" className="btn-submit" disabled={pending} style={{ marginTop: '1rem' }}>
            {pending ? <span className="spinner" /> : 'Create Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
