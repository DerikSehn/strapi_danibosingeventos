import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  // '/dashboard', // Commented out protected routes
];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export async function middleware(request: NextRequest) {
  // Always allow access for now
  return NextResponse.next();
  
  /* Disabled authentication logic
  const currentPath = request.nextUrl.pathname;

  if (isProtectedRoute(currentPath)) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/validate`, {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      });

      const data = await response.json();

      if (!data.ok) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
  */
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};