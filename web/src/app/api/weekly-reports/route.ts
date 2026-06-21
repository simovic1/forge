import { NextResponse } from 'next/server'
import { getRequestToken } from '@/lib/route-auth'

// Auth proxies must run per request; never prerender them.
export const dynamic = 'force-dynamic'

import { BACKEND_URL } from '@/lib/backend'

export async function GET() {
  const token = await getRequestToken()
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/weekly-reports`, {
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
    res = await fetch(`${BACKEND_URL}/api/weekly-reports`, {
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
