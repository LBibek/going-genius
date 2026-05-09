/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * FINAL HANDSHAKE FOR WORDPRESS PLUGIN
 * This endpoint is called by the WordPress plugin after the user approves the OAuth consent.
 * It exchanges the authorization code for an access token and returns the site configuration.
 */
export async function POST(req: Request) {
  try {
    const { code, clientId, clientSecret, siteUrl } = await req.json();

    if (!code || !clientId || !clientSecret || !siteUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Verify the app and secret
    const app = await prisma.oAuthApp.findUnique({
      where: { clientId },
    });

    if (!app || app.clientSecret !== clientSecret) {
      return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
    }

    // 2. Find and verify the authorization code
    const oauthCode = await prisma.oAuthCode.findUnique({
      where: { code },
      include: { user: true }
    });

    if (!oauthCode || oauthCode.expiresAt < new Date() || oauthCode.usedAt) {
      return NextResponse.json({ error: 'Invalid or expired authorization code' }, { status: 400 });
    }

    // 3. Mark code as used
    await prisma.oAuthCode.update({
      where: { id: oauthCode.id },
      data: { usedAt: new Date() }
    });

    // 4. Generate Long-lived Access Token for the Site
    const accessToken = crypto.randomBytes(40).toString('hex');
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days for CMS connections

    await prisma.oAuthToken.create({
      data: {
        accessToken,
        refreshToken,
        userId: oauthCode.userId,
        appId: app.id,
        scopes: oauthCode.scopes,
        expiresAt,
      }
    });

    // 5. Store/Log the connection (Optional: could add a Connections model)
    console.log(`[WP-HANDSHAKE] Success for site: ${siteUrl} on app: ${app.name}`);

    // 6. Return connection details to WP
    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 2592000,
      app: {
        id: app.id,
        name: app.name,
        logoUrl: app.logoUrl
      },
      user: {
        id: oauthCode.user.id,
        email: oauthCode.user.email,
        displayName: oauthCode.user.displayName
      }
    });

  } catch (error: any) {
    console.error('WP Handshake Error:', error);
    return NextResponse.json({ error: 'Handshake failed', details: error.message }, { status: 500 });
  }
}
