import { NextResponse } from 'next/server'
import { TOKEN_COOKIE, authCookieSecure } from '@/lib/auth'

// Clears the auth cookie. The proxy will then redirect protected routes back
// to /login on the next request.
export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: authCookieSecure(),
    path: '/',
    maxAge: 0,
  })
  return response
}
