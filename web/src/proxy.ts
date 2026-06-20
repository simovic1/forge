import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/auth'

// Auth gate (Next.js 16 "Proxy", formerly Middleware).
// - Not logged in  -> protected routes redirect to /login
// - Logged in      -> "/" redirects to /dashboard, "/login" redirects to /dashboard
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = Boolean(request.cookies.get(TOKEN_COOKIE)?.value)

  if (pathname === '/') {
    const target = isLoggedIn ? '/dashboard' : '/login'
    return NextResponse.redirect(new URL(target, request.url))
  }

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const isProtected =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard', '/dashboard/:path*'],
}
