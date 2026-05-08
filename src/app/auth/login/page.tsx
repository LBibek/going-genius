'use client';

import { useActionState, useState, useEffect, Suspense } from 'react';
import { login, sendPhoneOtp } from '@/app/actions/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';

type Tab = 'password' | 'phone';

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';

  const [tab, setTab] = useState<Tab>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [idType, setIdType] = useState<'email' | 'username' | 'phone' | null>(null);

  const [loginState, loginAction, loginPending] = useActionState(login, undefined);
  const [phoneState, phoneAction, phonePending] = useActionState(sendPhoneOtp, undefined);

  // Auto-detect identifier type
  useEffect(() => {
    // eslint-disable-next-line
    if (!identifier) { setIdType(null); return; }
    if (identifier.includes('@')) setIdType('email');
    else if (/^\+?[\d\s\-()]{7,}$/.test(identifier)) setIdType('phone');
    else setIdType('username');
  }, [identifier]);

  const idPlaceholder = tab === 'phone' ? '+1 234 567 8900' : 'Email, @username, or phone';
  const idHint = idType === 'email' ? '📧 Email' : idType === 'phone' ? '📱 Phone' : idType === 'username' ? '@ Username' : '';

  return (
    <div className="auth-card animate-fade-in">
      {/* Logo */}
      <div className="auth-logo">
        <div className="auth-logo-icon">GG</div>
        <span className="auth-logo-text">GGUser</span>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your Going Genius account</p>

      {/* Social Auth */}
      <SocialAuthButtons isLoading={loginPending} />

      {/* Tabs */}
      <div className="auth-tabs">
        <button
          id="tab-password"
          className={`auth-tab ${tab === 'password' ? 'active' : ''}`}
          onClick={() => setTab('password')}
          type="button"
        >
          Password
        </button>
        <button
          id="tab-phone"
          className={`auth-tab ${tab === 'phone' ? 'active' : ''}`}
          onClick={() => setTab('phone')}
          type="button"
        >
          Phone OTP
        </button>
      </div>

      {/* Password Login */}
      {tab === 'password' && (
        <form action={loginAction} className="auth-form">
          <input type="hidden" name="next" value={next} />

          <div className="form-group">
            <label className="form-label" htmlFor="identifier">
              Sign in with {idHint && <span className="id-badge">{idHint}</span>}
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              className={`form-input ${loginState?.errors?.identifier ? 'error' : ''}`}
              placeholder={idPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            {loginState?.errors?.identifier && (
              <p className="form-error">{loginState.errors.identifier[0]}</p>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="password">Password</label>
              <Link href="/auth/forgot-password" className="form-link-sm">Forgot password?</Link>
            </div>
            <div className="input-icon-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={`form-input ${loginState?.errors?.password ? 'error' : ''}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {loginState?.errors?.password && (
              <p className="form-error">{loginState.errors.password[0]}</p>
            )}
          </div>

          {loginState?.message && (
            <div className="form-alert error">{loginState.message}</div>
          )}

          <button
            id="btn-login"
            type="submit"
            className="btn-submit"
            disabled={loginPending}
          >
            {loginPending ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>
      )}

      {/* Phone OTP */}
      {tab === 'phone' && (
        <>
          {!phoneState?.success ? (
            <form action={phoneAction} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="phone-input">Phone number</label>
                <input
                  id="phone-input"
                  name="phone"
                  type="tel"
                  className={`form-input ${phoneState?.errors?.phone ? 'error' : ''}`}
                  placeholder="+1 234 567 8900"
                  autoComplete="tel"
                  required
                />
                {phoneState?.errors?.phone && (
                  <p className="form-error">{phoneState.errors.phone[0]}</p>
                )}
              </div>

              {phoneState?.message && !phoneState.success && (
                <div className="form-alert error">{phoneState.message}</div>
              )}

              <button id="btn-send-otp" type="submit" className="btn-submit" disabled={phonePending}>
                {phonePending ? <span className="spinner" /> : 'Send OTP'}
              </button>
            </form>
          ) : (
            <div className="form-alert success">
              ✅ {phoneState.message}
              <br />
              <Link href={`/auth/verify?phone=${encodeURIComponent(String(phoneState.data?.phone ?? ''))}`} className="btn-submit" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                Enter OTP →
              </Link>
            </div>
          )}
        </>
      )}

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="form-link">Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-card animate-fade-in"><div className="spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
