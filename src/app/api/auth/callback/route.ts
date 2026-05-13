import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const supaUser = data.user;
      const email = supaUser.email!;
      
      // 1. Find or create user in Prisma
      let user = await prisma.gGUser.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user if they don't exist
        const baseUsername = supaUser.user_metadata.full_name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
        const uniqueUsername = `${baseUsername}_${Math.random().toString(36).substring(2, 7)}`;
        
        user = await prisma.gGUser.create({
          data: {
            email,
            displayName: supaUser.user_metadata.full_name || 'GG User',
            username: uniqueUsername,
            avatarUrl: supaUser.user_metadata.avatar_url,
            emailVerified: true,
            isActive: true,
          },
        });
      } else {
        // Update user if they already exist (e.g. update avatar)
        await prisma.gGUser.update({
          where: { id: user.id },
          data: {
            avatarUrl: supaUser.user_metadata.avatar_url || user.avatarUrl,
            emailVerified: true,
            lastLoginAt: new Date(),
          },
        });
      }

      // 2. Create session
      const h = await headers();
      const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'unknown';
      const userAgent = h.get('user-agent') ?? 'unknown';
      
      await createSession(user.id, user.role, ip, userAgent);

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/login?error=OAuth callback failed', request.url));
}
