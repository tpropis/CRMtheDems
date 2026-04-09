export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: { integrationId: string } }) {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const role = (session?.user as any)?.role
  if (!firmId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['FIRM_OWNER', 'MANAGING_PARTNER', 'IT_ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const integration = await db.integration.findFirst({
    where: { id: params.integrationId, firmId },
  })
  if (!integration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.integration.delete({ where: { id: params.integrationId } })

  await db.auditEvent.create({
    data: {
      firmId,
      userId: session!.user!.id as string,
      action: 'SETTINGS_CHANGED',
      description: `Integration disconnected: ${integration.name}`,
      metadata: { integrationType: integration.type },
    },
  })

  return NextResponse.json({ ok: true })
}
