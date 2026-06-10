/* eslint-disable react/no-unescaped-entities */
'use client';

import { useActionState, useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { register } from '@/app/actions/auth';
import Link from 'next/link';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

function getPasswordStrength(p: string): number {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  if (p.length >= 14) s++;
  return s;
}

function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const appId = searchParams.get('app');
  const referralCode = searchParams.get('ref');

  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  // Real-time username availability check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (username.length < 3) { setUsernameStatus('idle'); return; }
    if (!/^[a-z0-9_]+$/.test(username)) { setUsernameStatus('invalid'); return; }

    setUsernameStatus('checking');
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/gg/check-username?username=${username}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  const usernameIcon =
    usernameStatus === 'checking' ? '⏳' :
    usernameStatus === 'available' ? '✅' :
    usernameStatus === 'taken' ? '❌' :
    usernameStatus === 'invalid' ? '⚠️' : '';

  return (
    <div className="auth-card auth-card-wide animate-fade-in">
      <div className="auth-logo">
        <div className="auth-logo-icon">GG</div>
        <span className="auth-logo-text">GGUser</span>
      </div>

      <h1 className="auth-title">
        {inviteToken ? 'Join the Application' : 'Create your account'}
      </h1>
      <p className="auth-subtitle">
        {inviteToken ? 'Finish setting up your account to join' : 'One account for all Going Genius products'}
      </p>

      {inviteToken && (
        <div className="form-alert success" style={{ marginBottom: '1.5rem' }}>
          ✨ You've been invited! Register below to join the app.
        </div>
      )}
      
      {referralCode && (
        <div className="form-alert info" style={{ marginBottom: '1.5rem' }}>
          🤝 You're signing up via a referral link!
        </div>
      )}

      {/* Social Auth */}
      <SocialAuthButtons isLoading={pending} />

      <form action={action} className="auth-form">
        <input type="hidden" name="invite" value={inviteToken || ''} />
        <input type="hidden" name="appId" value={appId || ''} />
        <input type="hidden" name="ref" value={referralCode || ''} />

        {/* Display Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            className={`form-input ${state?.errors?.displayName ? 'error' : ''}`}
            placeholder="Your full name"
            required
          />
          {state?.errors?.displayName && <p className="form-error">{state.errors.displayName[0]}</p>}
        </div>

        {/* Username */}
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username {usernameIcon && <span className="id-badge">{usernameIcon} {usernameStatus !== 'checking' ? usernameStatus : 'Checking...'}</span>}
          </label>
          <div className="input-icon-wrapper">
            <span className="input-prefix">@</span>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className={`form-input prefix-input ${state?.errors?.username ? 'error' : ''}`}
              placeholder="yourhandle"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required
            />
          </div>
          {state?.errors?.username && <p className="form-error">{state.errors.username[0]}</p>}
          {usernameStatus === 'invalid' && <p className="form-error">Only lowercase letters, numbers, and underscores</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-input ${state?.errors?.email ? 'error' : ''}`}
            placeholder="you@example.com"
            required
          />
          {state?.errors?.email && <p className="form-error">{state.errors.email[0]}</p>}
        </div>

        {/* Phone (optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone <span className="form-label-optional">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={`form-input ${state?.errors?.phone ? 'error' : ''}`}
            placeholder="+1 234 567 8900"
          />
          {state?.errors?.phone && <p className="form-error">{state.errors.phone[0]}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-icon-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`form-input ${state?.errors?.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {/* Strength meter */}
          {password && (
            <div className="strength-meter">
              <div className="strength-bar">
                {[1, 2, 3, 4, 5].map((n: number) => (
                  <div
                    key={n}
                    className="strength-segment"
                    style={{ background: n <= strength ? STRENGTH_COLORS[strength] : 'var(--border)' }}
                  />
                ))}
              </div>
              <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}
          {state?.errors?.password && (
            <ul className="form-error-list">
              {state.errors.password.map((e: string) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={`form-input ${state?.errors?.confirmPassword || passwordsMatch === false ? 'error' : passwordsMatch === true ? 'success-input' : ''}`}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordsMatch === false && confirmPassword && (
            <p className="form-error">Passwords do not match</p>
          )}
          {passwordsMatch === true && <p className="form-success">✓ Passwords match</p>}
          {state?.errors?.confirmPassword && <p className="form-error">{state.errors.confirmPassword[0]}</p>}
        </div>

        {/* Terms */}
        <div className="form-group form-checkbox-group">
          <label className="form-checkbox">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="form-link">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="form-link">Privacy Policy</Link>
            </span>
          </label>
          {state?.errors?.acceptTerms && <p className="form-error">{state.errors.acceptTerms[0]}</p>}
        </div>

        {state?.message && <div className="form-alert error">{state.message}</div>}

        <button id="btn-register" type="submit" className="btn-submit" disabled={pending || usernameStatus === 'taken'}>
          {pending ? <span className="spinner" /> : inviteToken ? 'Join Application' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link href="/auth/login" className="form-link">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-card animate-fade-in"><span className="spinner" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
