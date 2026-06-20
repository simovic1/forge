import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/auth'

// Proxies daily-log creation to the FORGE backend. The backend requires a
// Bearer token; we read it from the httpOnly auth cookie (which the browser
// can't access) and attach it server-side.
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  // Forward the query string (e.g. ?from=&to=) to the backend.
  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/daily-logs${request.nextUrl.search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    return NextResponse.json(
      { message: 'Unable to reach the server.' },
      { status: 502 },
    )
  }

  const payload = await res.text()
  return new NextResponse(payload, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  const body = await request.text()

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/daily-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    })
  } catch {
    return NextResponse.json(
      { message: 'Unable to reach the server.' },
      { status: 502 },
    )
  }

  const payload = await res.text()
  return new NextResponse(payload, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
