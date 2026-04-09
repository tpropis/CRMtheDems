export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/crypto'

const CLIO_API = 'https://app.clio.com/api/v4'

async function clioFetch(path: string, accessToken: string) {
  const res = await fetch(`${CLIO_API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Clio API error: ${res.status} ${path}`)
  return res.json()
}

async function getValidToken(config: any): Promise<string> {
  const tokens = JSON.parse(decrypt(config.encryptedTokens))
  // If token is still valid (with 5-min buffer), return it
  if (Date.now() < tokens.expires_at - 300000) return tokens.access_token

  // Refresh token
  const refreshRes = await fetch('https://app.clio.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.CLIO_CLIENT_ID!,
      client_secret: process.env.CLIO_CLIENT_SECRET!,
      refresh_token: tokens.refresh_token,
    }),
  })
  if (!refreshRes.ok) throw new Error('Token refresh failed')
  const newTokens = await refreshRes.json()
  return newTokens.access_token
}

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const firmId = (session.user as any).firmId

  const integration = await db.integration.findFirst({ where: { firmId, type: 'CLIO', isActive: true } })
  if (!integration) return NextResponse.json({ error: 'Clio not connected' }, { status: 400 })

  const config = integration.config as any
  if (!config.encryptedTokens) return NextResponse.json({ error: 'No tokens' }, { status: 400 })

  try {
    const token = await getValidToken(config)
    let syncedMatters = 0, syncedContacts = 0, syncedTimeEntries = 0

    // ── Sync Matters ──────────────────────────────────────────
    const mattersData = await clioFetch('/matters.json?fields=id,display_number,description,status,practice_area,location,close_date,client{id,name,email,phone_number,primary_address{street,city,province,postal_code}},responsible_attorney{id,name,email},custom_field_values&limit=200', token)
    const clioMatters = mattersData?.data || []

    for (const cm of clioMatters) {
      try {
        // Upsert client
        const clientName = cm.client?.name || 'Unknown Client'
        let client = await db.client.findFirst({ where: { firmId, name: clientName } })
        if (!client) {
          const count = await db.client.count({ where: { firmId } })
          client = await db.client.create({
            data: {
              firmId,
              clientNumber: `C-${String(count + 1).padStart(4, '0')}`,
              name: clientName,
              email: cm.client?.email || null,
              phone: cm.client?.phone_number || null,
              address: cm.client?.primary_address?.street || null,
              city: cm.client?.primary_address?.city || null,
              state: cm.client?.primary_address?.province || null,
              zipCode: cm.client?.primary_address?.postal_code || null,
            },
          })
        }

        // Upsert matter
        const matterNum = cm.display_number || `CLIO-${cm.id}`
        const existing = await db.matter.findFirst({ where: { firmId, matterNumber: matterNum } })
        if (!existing) {
          await db.matter.create({
            data: {
              firmId,
              clientId: client.id,
              matterNumber: matterNum,
              name: cm.description || `Matter ${matterNum}`,
              description: cm.description,
              status: cm.status === 'Open' ? 'ACTIVE' : cm.status === 'Closed' ? 'CLOSED' : 'ACTIVE',
              type: 'OTHER',
              practiceArea: cm.practice_area?.name || null,
              jurisdiction: cm.location || null,
            },
          })
          syncedMatters++
        }
      } catch {}
    }

    // ── Sync Contacts ─────────────────────────────────────────
    const contactsData = await clioFetch('/contacts.json?fields=id,name,email_addresses,phone_numbers,type&limit=200', token)
    const clioContacts = contactsData?.data || []

    for (const cc of clioContacts) {
      try {
        const nameParts = (cc.name || '').split(' ')
        const existing = await db.contact.findFirst({ where: { firmId, email: cc.email_addresses?.[0]?.address } })
        if (!existing && cc.email_addresses?.[0]?.address) {
          await db.contact.create({
            data: {
              firmId,
              firstName: nameParts[0] || cc.name,
              lastName: nameParts.slice(1).join(' ') || '',
              email: cc.email_addresses?.[0]?.address || null,
              phone: cc.phone_numbers?.[0]?.number || null,
              type: 'CONTACT',
            },
          })
          syncedContacts++
        }
      } catch {}
    }

    // Update integration with sync stats
    await db.integration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        config: {
          ...config,
          syncedMatters: (config.syncedMatters || 0) + syncedMatters,
          syncedContacts: (config.syncedContacts || 0) + syncedContacts,
          syncedTimeEntries,
        },
      },
    })

    return NextResponse.json({
      ok: true,
      stats: {
        syncedMatters: (config.syncedMatters || 0) + syncedMatters,
        syncedContacts: (config.syncedContacts || 0) + syncedContacts,
        syncedTimeEntries,
      },
    })
  } catch (err: any) {
    console.error('[clio/sync]', err)
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 })
  }
}
