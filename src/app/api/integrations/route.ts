export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  if (!firmId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const integrations = await db.integration.findMany({
    where: { firmId },
    select: {
      id: true, type: true, name: true, isActive: true, lastSyncAt: true,
      // Return config but strip sensitive tokens
      config: true,
    },
  })

  // Strip tokens from config before returning
  const safe = integrations.map(i => {
    const { accessToken, refreshToken, encryptedTokens, ...safeConfig } = (i.config as any) || {}
    return { ...i, config: safeConfig }
  })

  return NextResponse.json(safe)
}
