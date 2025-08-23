// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Public paths (allow without login)
  const isPublic =
    pathname === '/login' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/hero') ||
    pathname.startsWith('/offline') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api'); // your APIs already check auth where needed

  if (isPublic) return res;

  // Check session
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

// Only run the middleware for pages (skip static assets)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/.*|manifest.json|api/.*).*)'],
};
