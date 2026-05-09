/* eslint-disable @typescript-eslint/no-unused-vars */
import 'server-only';
import { cache } from 'react';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { SessionPayload } from '@/lib/definitions';

const SECRET = process.env.SESSION_SECRET!;
const COOKIE_NAME = 'gg_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

if (!SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set.');
}

import { encrypt, decrypt } from './auth-utils';

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

export async function createSession(userId: string, role: string, ipAddress?: string, userAgent?: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Persist session in DB
  const session = await prisma.session.create({
    data: { userId, ipAddress, userAgent, expiresAt },
  });

  const token = await encrypt({ userId, sessionId: session.id, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return session.id;
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
});

export async function refreshSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);

  if (!payload) return null;

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const newToken = await encrypt({ ...payload, expiresAt });

  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);

  // Clean up DB session
  if (payload?.sessionId) {
    await prisma.session.deleteMany({ where: { id: payload.sessionId } }).catch(() => {});
  }

  cookieStore.delete(COOKIE_NAME);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  return decrypt(token);
}
