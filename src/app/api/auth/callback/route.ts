import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const supaUser = data.user;
      const email = supaUser.email!;
      
      // 1. Find or create user in Prisma with transaction isolation and exponential backoff retries
      let user = null;
      let retries = 3;
      let delay = 200;

      while (retries > 0) {
        try {
          user = await prisma.$transaction(async (tx: any) => {
            let u = await tx.gGUser.findUnique({
              where: { email },
            });

            if (!u) {
              const baseUsername = supaUser.user_metadata.full_name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
              const uniqueUsername = `${baseUsername}_${Math.random().toString(36).substring(2, 7)}`;

              u = await tx.gGUser.create({
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
              u = await tx.gGUser.update({
                where: { id: u.id },
                data: {
                  avatarUrl: supaUser.user_metadata.avatar_url || u.avatarUrl,
                  emailVerified: true,
                  lastLoginAt: new Date(),
                },
              });
            }
            return u;
          });
          break; // Success, break out of retry loop
        } catch (dbError) {
          retries--;
          if (retries === 0) {
            console.error('[AUTH CALLBACK ERROR] Database transaction failed after 3 retries:', dbError);
            return NextResponse.redirect(new URL('/auth/login?error=Database synchronization failed. Please try again.', request.url));
          }
          console.warn(`[AUTH CALLBACK RETRY] Transient database issue encountered. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        }
      }

      if (!user) {
        return NextResponse.redirect(new URL('/auth/login?error=Session initialization failed', request.url));
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
