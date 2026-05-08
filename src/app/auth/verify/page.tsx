'use client';

import { useActionState, useState, useEffect, useRef, Suspense } from 'react';
import { verifyPhoneOtp } from '@/app/actions/auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyForm() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') ?? '';

  const [state, action, pending] = useActionState(verifyPhoneOtp, undefined);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // OTP input handling
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  }

  const otpValue = otp.join('');

  return (
    <div className="auth-card animate-fade-in">
      <div className="auth-logo">
        <div className="auth-logo-icon">GG</div>
        <span className="auth-logo-text">GGUser</span>
      </div>

      <div className="otp-phone-icon">📱</div>
      <h1 className="auth-title">Enter your code</h1>
      <p className="auth-subtitle">
        We sent a 6-digit code to<br />
        <strong style={{ color: 'var(--foreground)' }}>{phone || 'your phone'}</strong>
      </p>

      <form action={action} className="auth-form">
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="otp" value={otpValue} />

        <div className="otp-inputs" onPaste={handleOtpPaste}>
          {otp.map((digit: string, i: number) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-input ${state?.errors?.otp ? 'error' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {state?.errors?.otp && <p className="form-error" style={{ textAlign: 'center' }}>{state.errors.otp[0]}</p>}
        {state?.message && <div className="form-alert error">{state.message}</div>}

        <button
          id="btn-verify-otp"
          type="submit"
          className="btn-submit"
          disabled={pending || otpValue.length < 6}
        >
          {pending ? <span className="spinner" /> : 'Verify & Sign in'}
        </button>
      </form>

      <div className="auth-footer">
        {resendTimer > 0 ? (
          <span style={{ color: 'var(--muted)' }}>Resend code in <strong style={{ color: 'var(--foreground)' }}>{resendTimer}s</strong></span>
        ) : (
          <Link href="/auth/login" className="form-link">Resend code</Link>
        )}
      </div>

      <p className="auth-footer" style={{ marginTop: '0.5rem' }}>
        <Link href="/auth/login" className="form-link">← Back to login</Link>
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="auth-card animate-fade-in"><div className="spinner" /></div>}>
      <VerifyForm />
    </Suspense>
  );
}
