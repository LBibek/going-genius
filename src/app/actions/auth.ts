/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession, getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import {
  RegisterSchema,
  LoginSchema,
  PhoneSchema,
  OtpSchema,
  ForgotPasswordSchema,
  detectIdentifierType,
  type FormState,
} from '@/lib/definitions';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getRequestMeta() {
  const h = await headers();
  return {
    ip: h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'unknown',
    userAgent: h.get('user-agent') ?? 'unknown',
  };
}

function flattenErrors(errors: Record<string, string[]>): FormState {
  return { errors };
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function register(state: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    displayName: formData.get('displayName'),
    username: formData.get('username'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    acceptTerms: formData.get('acceptTerms'),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return flattenErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { displayName, username, email, phone, password } = parsed.data;

  // Check uniqueness
  const existing = await prisma.gGUser.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });

  if (existing) {
    if (existing.email === email) {
      return { errors: { email: ['This email is already registered.'] } };
    }
    return { errors: { username: ['This username is already taken.'] } };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create Supabase auth user (handles email verification)
  const { data: supaUser, error: supaError } = await supabase.auth.admin
    ? { data: null, error: null } // placeholder — admin API used in server context
    : await supabase.auth.signUp({ email, password });

  if (supaError) {
    return { message: supaError.message };
  }

  // Create GGUser in Prisma
  const user = await prisma.gGUser.create({
    data: {
      displayName,
      username: username.toLowerCase(),
      email,
      phone: phone || null,
      passwordHash,
      emailVerified: false,
    },
  });

  const { ip, userAgent } = await getRequestMeta();
  await createSession(user.id, user.role, ip, userAgent);

  // Handle Invitation linking
  const inviteToken = formData.get('invite') as string;
  const invitedAppId = formData.get('appId') as string;

  if (inviteToken && invitedAppId) {
    const invite = await prisma.appInvite.findUnique({ where: { token: inviteToken } });
    if (invite && invite.appId === invitedAppId && !invite.usedAt) {
      await prisma.appUser.upsert({
        where: { appId_userId: { appId: invitedAppId, userId: user.id } },
        update: { isActive: true },
        create: { appId: invitedAppId, userId: user.id },
      });

      await prisma.appInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() }
      });
    }
  }

  redirect('/dashboard');
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    identifier: formData.get('identifier'),
    password: formData.get('password'),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return flattenErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { identifier, password } = parsed.data;
  const idType = detectIdentifierType(identifier);

  // Find user by identifier type
  const user = await prisma.gGUser.findFirst({
    where:
      idType === 'email'
        ? { email: identifier.toLowerCase() }
        : idType === 'phone'
          ? { phone: identifier }
          : { username: identifier.toLowerCase() },
  });

  if (!user) {
    return { message: 'Invalid credentials. Please try again.' };
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      message: `Account locked. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`,
    };
  }

  // Check account active
  if (!user.isActive) {
    return { message: 'This account has been disabled. Please contact support.' };
  }

  // Verify password
  if (!user.passwordHash) {
    return { message: 'This account uses phone sign-in. Please use the phone OTP option.' };
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    const attempts = user.loginAttempts + 1;
    const updateData =
      attempts >= MAX_LOGIN_ATTEMPTS
        ? {
            loginAttempts: 0,
            lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000),
          }
        : { loginAttempts: attempts };

    await prisma.gGUser.update({ where: { id: user.id }, data: updateData });

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      return {
        message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
      };
    }

    const remaining = MAX_LOGIN_ATTEMPTS - attempts;
    return {
      message: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
    };
  }

  // Reset attempts + update last login
  const { ip, userAgent } = await getRequestMeta();
  await prisma.gGUser.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  await createSession(user.id, user.role, ip, userAgent);
  redirect('/dashboard');
}

// ─── Phone OTP — Send ────────────────────────────────────────────────────────

export async function sendPhoneOtp(state: FormState, formData: FormData): Promise<FormState> {
  const parsed = PhoneSchema.safeParse({ phone: formData.get('phone') });
  if (!parsed.success) {
    return flattenErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { phone } = parsed.data;

  const { error } = await supabase.auth.signInWithOtp({ phone });

  if (error) {
    return { message: error.message };
  }

  return {
    success: true,
    message: 'OTP sent! Check your messages.',
    data: { phone },
  };
}

// ─── Phone OTP — Verify ──────────────────────────────────────────────────────

export async function verifyPhoneOtp(state: FormState, formData: FormData): Promise<FormState> {
  const parsed = OtpSchema.safeParse({
    otp: formData.get('otp'),
    phone: formData.get('phone'),
  });

  if (!parsed.success) {
    return flattenErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { otp, phone } = parsed.data;

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: otp,
    type: 'sms',
  });

  if (error || !data.user) {
    return { message: error?.message ?? 'Invalid OTP. Please try again.' };
  }

  // Find or create GGUser for this phone
  let user = await prisma.gGUser.findFirst({ where: { phone } });

  if (!user) {
    // Auto-create account for phone-only users
    const baseUsername = `user${Date.now().toString(36)}`;
    user = await prisma.gGUser.create({
      data: {
        displayName: 'GG User',
        username: baseUsername,
        email: data.user.email ?? `${phone.replace(/\D/g, '')}@phone.gguser.local`,
        phone,
        phoneVerified: true,
      },
    });
  } else if (!user.phoneVerified) {
    await prisma.gGUser.update({ where: { id: user.id }, data: { phoneVerified: true } });
  }

  const { ip, userAgent } = await getRequestMeta();
  await createSession(user.id, user.role, ip, userAgent);
  redirect('/dashboard');
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await deleteSession();
  redirect('/auth/login');
}

export async function updateUserProfile(data: { displayName?: string, username?: string, phone?: string }) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  try {
    if (data.username) {
      const existing = await prisma.gGUser.findUnique({
        where: { username: data.username.toLowerCase() }
      });
      if (existing && existing.id !== session.userId) {
        return { message: 'Username is already taken' };
      }
    }

    await prisma.gGUser.update({
      where: { id: session.userId },
      data: {
        displayName: data.displayName,
        username: data.username?.toLowerCase(),
        phone: data.phone
      }
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { message: 'Failed to update profile' };
  }
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

export async function forgotPassword(state: FormState, formData: FormData): Promise<FormState> {
  const parsed = ForgotPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return flattenErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { email } = parsed.data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  });

  // Always return success to prevent email enumeration
  if (error) {
    console.error('Password reset error:', error.message);
  }

  return {
    success: true,
    message: 'If that email exists, a reset link has been sent.',
  };
}
