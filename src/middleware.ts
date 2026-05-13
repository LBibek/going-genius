import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth-utils';

const protectedRoutes = ['/dashboard', '/apps', '/settings', '/billing', '/wallet'];
const publicRoutes = ['/auth/login', '/auth/register', '/', '/api/auth/callback'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('gg_session')?.value;
  const session = await decrypt(cookie);

  // 1. Redirect to /auth/login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // 2. Redirect to /dashboard if the user is authenticated and trying to access a public route (like login)
  if (
    isPublicRoute &&
    session?.userId &&
    !path.startsWith('/dashboard') &&
    path !== '/'
  ) {
    if (path === '/auth/login' || path === '/auth/register') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
