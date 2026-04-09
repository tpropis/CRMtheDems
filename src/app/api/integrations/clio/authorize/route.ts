export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import crypto from 'crypto'

const CLIO_AUTH_URL = 'https://app.clio.com/oauth/authorize'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = process.env.CLIO_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'CLIO_CLIENT_ID not configured' }, { status: 500 })
  }

  const state = crypto.randomBytes(16).toString('hex')
  const redirectUri = `${process.env.NEXTAUTH_URL || process.env.AUTH_URL}/api/integrations/clio/callback`

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'matters:read contacts:read time_entries:read documents:read calendar_entries:read tasks:read bills:read',
    state,
  })

  // State is used to prevent CSRF — in production store in session/cookie
  const url = `${CLIO_AUTH_URL}?${params.toString()}`
  return NextResponse.json({ url, state })
}
