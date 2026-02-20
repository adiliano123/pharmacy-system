import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/'];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - check authentication
  if (pathname.startsWith('/dashboard')) {
    // Check for auth token in cookies or localStorage (client-side)
    const token = request.cookies.get('auth_token');
    
    // Note: localStorage check happens client-side in components
    // This middleware only checks cookies for SSR
    if (!token) {
      // Allow through - client-side will handle redirect if no localStorage token
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
