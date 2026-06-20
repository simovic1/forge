import { NextRequest, NextResponse } from 'next/server'
import { TOKEN_COOKIE } from '@/lib/auth'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.text()

  let res: Response
  try {
    res = await fetch(`${BACKEND_URL}/api/daily-logs/${id}`, {
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
