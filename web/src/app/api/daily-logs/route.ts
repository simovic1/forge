import { NextResponse } from 'next/server'
import { getRequestToken } from '@/lib/route-auth'

// Proxies daily-log requests to the FORGE backend, attaching the auth token
// (from the httpOnly cookie) as a Bearer header server-side.
// Auth proxies must run per request; never prerender them.
export const dynamic = 'force-dynamic'

import { BACKEND_URL } from '@/lib/backend'

export async function GET(request: Request) {
  const token = await getRequestToken()
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  // Forward the query string (e.g. ?from=&to=) to the backend.
  const { search } = new URL(request.url)

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/daily-logs${search}`, {
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

export async function POST(request: Request) {
  const token = await getRequestToken()
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
