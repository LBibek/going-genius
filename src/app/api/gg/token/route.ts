import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(SECRET);

function sha256Base64Url(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { grant_type, code, redirect_uri, client_id, client_secret, code_verifier } = body;

  if (grant_type !== 'authorization_code') {
    return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
  }

  if (!code || !redirect_uri || !client_id || !client_secret) {
    return NextResponse.json({ error: 'invalid_request', error_description: 'Missing required fields' }, { status: 400 });
  }

  // Validate client
  const app = await prisma.oAuthApp.findFirst({
    where: { clientId: client_id, clientSecret: client_secret, isActive: true },
  });

  if (!app) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  }

  // Find and validate authorization code
  const authCode = await prisma.oAuthCode.findUnique({
    where: { code },
    include: { user: true },
  });

  if (!authCode) {
    return NextResponse.json({ error: 'invalid_grant', error_description: 'Code not found' }, { status: 400 });
  }

  if (authCode.usedAt) {
    return NextResponse.json({ error: 'invalid_grant', error_description: 'Code already used' }, { status: 400 });
  }

  if (authCode.expiresAt < new Date()) {
    return NextResponse.json({ error: 'invalid_grant', error_description: 'Code expired' }, { status: 400 });
  }

  if (authCode.redirectUri !== redirect_uri || authCode.appId !== app.id) {
    return NextResponse.json({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' }, { status: 400 });
  }

  // PKCE verification
  if (authCode.codeChallenge) {
    if (!code_verifier) {
      return NextResponse.json({ error: 'invalid_grant', error_description: 'code_verifier required' }, { status: 400 });
    }
    const computedChallenge = sha256Base64Url(code_verifier);
    if (computedChallenge !== authCode.codeChallenge) {
      return NextResponse.json({ error: 'invalid_grant', error_description: 'PKCE verification failed' }, { status: 400 });
    }
  }

  // Mark code as used
  await prisma.oAuthCode.update({ where: { id: authCode.id }, data: { usedAt: new Date() } });

  const user = authCode.user;

  // Issue JWT access token (15 min)
  const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  const accessToken = await new SignJWT({
    sub: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    scopes: authCode.scopes,
    iss: process.env.NEXT_PUBLIC_APP_URL,
    aud: client_id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(encodedKey);

  // Store token record
  const tokenRecord = await prisma.oAuthToken.create({
    data: {
      userId: user.id,
      appId: app.id,
      scopes: authCode.scopes,
      expiresAt: accessTokenExpiry,
    },
  });

  return NextResponse.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: tokenRecord.refreshToken,
    scope: authCode.scopes.join(' '),
  });
}
