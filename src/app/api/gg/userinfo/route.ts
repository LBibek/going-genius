import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'unauthorized', error_description: 'Bearer token required' }, { status: 401 });
  }

  const token = authHeader.slice(7);

  let payload: Record<string, unknown>;
  try {
    const { payload: p } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
    payload = p as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_token', error_description: 'Token is invalid or expired' }, { status: 401 });
  }

  const userId = payload.sub as string;
  if (!userId) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  // Fetch fresh user data from DB
  const user = await prisma.gGUser.findUnique({
    where: { id: userId, isActive: true },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      role: true,
      phoneVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'invalid_token', error_description: 'User not found' }, { status: 401 });
  }

  return NextResponse.json({
    sub: user.id,
    email: user.email,
    email_verified: user.emailVerified,
    username: user.username,
    name: user.displayName,
    picture: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    phone_verified: user.phoneVerified,
    created_at: user.createdAt.toISOString(),
  });
}
