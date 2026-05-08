import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const codeChallenge = searchParams.get('code_challenge'); // PKCE
  const scope = searchParams.get('scope') ?? 'profile';
  const state = searchParams.get('state') ?? '';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Validate required params
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'invalid_request', error_description: 'client_id and redirect_uri are required' }, { status: 400 });
  }

  // Validate client app
  const app = await prisma.oAuthApp.findFirst({
    where: { clientId, isActive: true },
  });

  if (!app) {
    return NextResponse.json({ error: 'invalid_client', error_description: 'Unknown client_id' }, { status: 401 });
  }

  // Validate redirect URI against whitelist
  if (!app.redirectUris.includes(redirectUri)) {
    return NextResponse.json({ error: 'invalid_request', error_description: 'Redirect URI not allowed' }, { status: 400 });
  }

  // Check if user is already authenticated
  const session = await getSession();

  if (!session) {
    // Redirect to login, preserving all OAuth params
    const loginUrl = new URL(`${appUrl}/auth/login`);
    loginUrl.searchParams.set('next', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Issue authorization code (60s TTL)
  const scopes = scope.split(' ').filter(Boolean);
  const expiresAt = new Date(Date.now() + 60 * 1000);

  // Ensure AppUser link exists for developer management
  await prisma.appUser.upsert({
    where: { appId_userId: { appId: app.id, userId: session.userId } },
    update: { isActive: true },
    create: { appId: app.id, userId: session.userId },
  });

  const authCode = await prisma.oAuthCode.create({
    data: {
      userId: session.userId,
      appId: app.id,
      redirectUri,
      codeChallenge,
      scopes,
      expiresAt,
    },
  });

  // Redirect back to the client app with the code
  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('code', authCode.code);
  if (state) callbackUrl.searchParams.set('state', state);

  return NextResponse.redirect(callbackUrl);
}
