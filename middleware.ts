import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const PROTECTED_ROUTES = ['/dashboard', '/developer'];
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify', '/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  const sessionCookie = request.cookies.get('gg_session')?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = !!session && new Date(session.expiresAt) > new Date();

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Sliding session refresh on protected routes
  if (isProtected && isAuthenticated) {
    const response = NextResponse.next();
    // Refresh handled in getSession() — just pass through
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
