import { NextResponse } from 'next/server'
import { getRequestToken } from '@/lib/route-auth'

// Auth proxies must run per request; never prerender them.
export const dynamic = 'force-dynamic'

import { BACKEND_URL } from '@/lib/backend'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getRequestToken()
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.text()

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/weekly-reports/${id}`, {
      method: 'PUT',
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
