import * as z from 'zod';

// ─── Identifier detection ────────────────────────────────────────────────────

export function detectIdentifierType(value: string): 'email' | 'phone' | 'username' {
  if (value.includes('@')) return 'email';
  if (/^\+?[\d\s\-()]{7,15}$/.test(value.trim())) return 'phone';
  return 'username';
}

// ─── Shared ──────────────────────────────────────────────────────────────────

const passwordSchema = z
  .string()
  .min(8, { message: 'At least 8 characters' })
  .regex(/[A-Z]/, { message: 'At least one uppercase letter' })
  .regex(/[0-9]/, { message: 'At least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'At least one special character' })
  .trim();

const usernameSchema = z
  .string()
  .min(3, { message: 'At least 3 characters' })
  .max(24, { message: 'Max 24 characters' })
  .regex(/^[a-z0-9_]+$/, { message: 'Only lowercase letters, numbers, and underscores' })
  .trim();

// ─── Register ────────────────────────────────────────────────────────────────

export const RegisterSchema = z
  .object({
    displayName: z.string().min(2, { message: 'At least 2 characters' }).max(50).trim(),
    username: usernameSchema,
    email: z.string().email({ message: 'Enter a valid email' }).trim().toLowerCase(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()]{7,15}$/, { message: 'Enter a valid phone number' })
      .trim()
      .optional()
      .or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal('on', { message: 'You must accept the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Login ───────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'Enter your email, username, or phone number' })
    .trim(),
  password: z.string().min(1, { message: 'Enter your password' }),
});

// ─── Phone OTP ───────────────────────────────────────────────────────────────

export const PhoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[\d\s\-()]{7,15}$/, { message: 'Enter a valid phone number with country code (e.g. +1...)' })
    .trim(),
});

export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d+$/, { message: 'OTP must contain only digits' }),
  phone: z.string(),
});

// ─── Forgot Password ─────────────────────────────────────────────────────────

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }).trim().toLowerCase(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
      data?: Record<string, unknown>;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  sessionId: string;
  role: string;
  expiresAt: Date;
};

export type SafeUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
};
