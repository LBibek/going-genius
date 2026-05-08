import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from '@/lib/definitions';

const SECRET = process.env.SESSION_SECRET!;

if (!SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set.');
}

const encodedKey = new TextEncoder().encode(SECRET);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
