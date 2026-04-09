export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Clio sends a signature header for webhook verification
function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-clio-signature') || ''
  const webhookSecret = process.env.CLIO_WEBHOOK_SECRET

  if (webhookSecret && signature && !verifySignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: any
  try { event = JSON.parse(rawBody) } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { topic, action, data } = event || {}

  // Find the integration by matching Clio account — use firm from integration
  // For multi-tenant, match by clio user id stored in config
  // For now, log and process
  console.log('[clio/webhook]', topic, action, JSON.stringify(data).slice(0, 200))

  try {
    // Handle matter updates
    if (topic === 'matter' && action === 'updated') {
      // Find matching matter by matterNumber (Clio display_number)
      const matterNum = data?.display_number
      if (matterNum) {
        await db.matter.updateMany({
          where: { matterNumber: matterNum },
          data: { status: data.status === 'Open' ? 'ACTIVE' : 'CLOSED', updatedAt: new Date() },
        })
      }
    }

    // Handle document creation — trigger AI privilege review
    if (topic === 'document' && action === 'created') {
      // Queue AI job for privilege review
      // Full implementation would download the document from Clio API and process it
      console.log('[clio/webhook] new document, queuing AI review:', data?.id)
    }

    // Log webhook event
    await db.auditEvent.create({
      data: {
        firmId: 'SYSTEM', // Will be resolved in full multi-tenant implementation
        userId: 'SYSTEM',
        action: 'SETTINGS_CHANGED',
        description: `Clio webhook: ${topic}.${action}`,
        metadata: { topic, action, clioId: data?.id },
      },
    }).catch(() => {}) // Don't fail on audit log errors

  } catch (err) {
    console.error('[clio/webhook] processing error:', err)
  }

  return NextResponse.json({ received: true })
}
