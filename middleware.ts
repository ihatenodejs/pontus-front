import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/requests'];
const ensureSignedOutRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isEnsureSignedOutRoute = ensureSignedOutRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isEnsureSignedOutRoute) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value || request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('better-auth.session_token')?.value || request.cookies.get('__Secure-better-auth.session_token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('message', 'Please sign in to access this page');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
