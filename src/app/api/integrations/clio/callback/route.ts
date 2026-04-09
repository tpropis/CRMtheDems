export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/crypto'

const CLIO_TOKEN_URL = 'https://app.clio.com/oauth/token'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.redirect(new URL('/login', req.url))

  const firmId = (session.user as any).firmId
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL(`/admin/integrations?error=${error || 'no_code'}`, req.url))
  }

  const clientId = process.env.CLIO_CLIENT_ID!
  const clientSecret = process.env.CLIO_CLIENT_SECRET!
  const redirectUri = `${process.env.NEXTAUTH_URL || process.env.AUTH_URL}/api/integrations/clio/callback`

  try {
    // Exchange code for tokens
    const tokenRes = await fetch(CLIO_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('[clio/callback] token exchange failed:', err)
      return NextResponse.redirect(new URL('/admin/integrations?error=token_exchange', req.url))
    }

    const tokens = await tokenRes.json()
    const { access_token, refresh_token, expires_in } = tokens

    // Get Clio user info
    const meRes = await fetch('https://app.clio.com/api/v4/users/who_am_i.json?fields=id,name,email,account_owner', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const meData = await meRes.json()
    const clioUser = meData?.data || {}

    const encryptedTokens = encrypt(JSON.stringify({
      access_token,
      refresh_token,
      expires_at: Date.now() + (expires_in * 1000),
    }))

    // Upsert integration record
    const existing = await db.integration.findFirst({ where: { firmId, type: 'CLIO' } })
    const integrationData = {
      type: 'CLIO' as const,
      name: 'Clio',
      isActive: true,
      config: {
        connected: true,
        connectedAt: new Date().toISOString(),
        clioUserId: clioUser.id,
        clioUserName: clioUser.name,
        encryptedTokens,
        syncedMatters: 0,
        syncedContacts: 0,
        syncedTimeEntries: 0,
      },
    }

    if (existing) {
      await db.integration.update({ where: { id: existing.id }, data: integrationData })
    } else {
      await db.integration.create({ data: { firmId, ...integrationData } })
    }

    await db.auditEvent.create({
      data: {
        firmId,
        userId: session.user.id as string,
        action: 'SETTINGS_CHANGED',
        description: `Clio integration connected (${clioUser.name || clioUser.email})`,
        metadata: { clioUserId: clioUser.id },
      },
    })

    // Trigger initial sync in background
    fetch(`${process.env.NEXTAUTH_URL || process.env.AUTH_URL}/api/integrations/clio/sync`, {
      method: 'POST',
      headers: { Cookie: req.headers.get('cookie') || '' },
    }).catch(() => {})

    return NextResponse.redirect(new URL('/admin/integrations?connected=true', req.url))
  } catch (err) {
    console.error('[clio/callback]', err)
    return NextResponse.redirect(new URL('/admin/integrations?error=internal', req.url))
  }
}
