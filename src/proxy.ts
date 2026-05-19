import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

/**
 * NEXT.JS 16 CONVENTION: middleware.ts is renamed to proxy.ts
 * This file handles Edge-side authentication, authorization, and routing.
 */

const protectedRoutes = ['/dashboard', '/developer', '/wallet', '/admin', '/profile', '/settings', '/billing', '/apps'];
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/'];
const adminRoutes = ['/admin'];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path === route);
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

  // 1. Decrypt the session from the cookie
  const cookie = (await cookies()).get('gg_session')?.value;
  const session = await decrypt(cookie);

  // 2. Redirect to /auth/login if the user is not authenticated for protected routes
  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect authenticated users away from public auth pages
  if (
    isPublicRoute &&
    session?.userId &&
    path !== '/'
  ) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl.origin));
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  // 4. Admin Role Enforcement
  if (isAdminRoute && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
