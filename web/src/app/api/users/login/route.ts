import { NextResponse } from 'next/server'
import { TOKEN_COOKIE, authCookieSecure } from '@/lib/auth'

// Proxies the login request to the FORGE backend so the browser can call a
// same-origin endpoint (avoids CORS). Configure the backend with BACKEND_URL.
import { BACKEND_URL } from '@/lib/backend'

export async function POST(request: Request) {
  const body = await request.text()

  let res: Response
  try {
    // The backend serves login from the auth controller at /api/auth/login.
    res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  } catch {
    return NextResponse.json(
      { message: 'Unable to reach the authentication service.' },
      { status: 502 },
    )
  }

  const payload = await res.text()
  const contentType = res.headers.get('Content-Type') ?? 'application/json'

  // On failure, pass the backend's status and body straight through.
  if (!res.ok) {
    return new NextResponse(payload, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    })
  }

  // On success, store the access token in an httpOnly cookie so the proxy can
  // gate routes server-side. The body is still returned to the client.
  let data: { accessToken?: string; expiresIn?: number } = {}
  try {
    data = JSON.parse(payload)
  } catch {
    // Non-JSON success body; leave the cookie unset and return as-is.
  }

  const response = new NextResponse(payload, {
    status: res.status,
    headers: { 'Content-Type': contentType },
  })

  if (data.accessToken) {
    response.cookies.set({
      name: TOKEN_COOKIE,
      value: data.accessToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: authCookieSecure(),
      path: '/',
      maxAge: data.expiresIn ?? 60 * 60,
    })
  }

  return response
}
