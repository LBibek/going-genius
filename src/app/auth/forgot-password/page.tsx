'use client';

import { useActionState } from 'react';
import { forgotPassword } from '@/app/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined);

  return (
    <div className="auth-card animate-fade-in">
      <div className="auth-logo">
        <div className="auth-logo-icon">GG</div>
        <span className="auth-logo-text">GGUser</span>
      </div>

      <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>🔑</div>
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {state?.success ? (
        <div className="form-alert success" style={{ marginTop: '1.5rem' }}>
          ✅ {state.message}
          <br /><br />
          <Link href="/auth/login" className="form-link">← Back to login</Link>
        </div>
      ) : (
        <form action={action} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reset-email">Email address</label>
            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`form-input ${state?.errors?.email ? 'error' : ''}`}
              placeholder="you@example.com"
              required
            />
            {state?.errors?.email && <p className="form-error">{state.errors.email[0]}</p>}
          </div>

          {state?.message && <div className="form-alert error">{state.message}</div>}

          <button id="btn-reset-password" type="submit" className="btn-submit" disabled={pending}>
            {pending ? <span className="spinner" /> : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="auth-footer">
        <Link href="/auth/login" className="form-link">← Back to login</Link>
      </p>
    </div>
  );
}
