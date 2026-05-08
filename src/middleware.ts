import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'gg_session';
const SECRET = process.env.SESSION_SECRET;

// Protected routes patterns
const PROTECTED_ROUTES = ['/dashboard', '/developer', '/api/developer', '/api/billing'];
const AUTH_ROUTES = ['/auth/login', '/join'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // 1. Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // 2. Performance: Skip verification for public routes if no token exists
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // 3. Verify Token at the Edge
  let payload = null;
  if (token && SECRET) {
    try {
      const encodedKey = new TextEncoder().encode(SECRET);
      const { payload: verified } = await jwtVerify(token, encodedKey, {
        algorithms: ['HS256'],
      });
      payload = verified;
    } catch (err) {
      // Token expired or invalid
    }
  }

  // 4. Protection Logic
  if (isProtectedRoute && !payload) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 5. Redirect logged-in users away from auth pages
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
