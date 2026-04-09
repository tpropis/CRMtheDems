export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getStorageProvider } from '@/server/storage'

export async function GET() {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  if (!firmId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const firm = await db.firm.findUnique({ where: { id: firmId }, select: { settings: true, name: true, address: true, phone: true, website: true, city: true, state: true, zipCode: true, barNumber: true } })
  return NextResponse.json(firm)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const firmId = (session?.user as any)?.firmId
  const role = (session?.user as any)?.role
  if (!firmId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['FIRM_OWNER', 'MANAGING_PARTNER', 'IT_ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const file = formData.get('logo') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const key = `brand/${firmId}/logo.${ext}`
    const storage = getStorageProvider()
    const url = await storage.upload(key, buffer, file.type)
    const firm = await db.firm.findUnique({ where: { id: firmId } })
    const settings = (firm?.settings as any) || {}
    await db.firm.update({ where: { id: firmId }, data: { settings: { ...settings, logoUrl: url } } })
    return NextResponse.json({ logoUrl: url })
  }

  const body = await req.json()
  const { brandSettings, ...firmFields } = body
  const firm = await db.firm.findUnique({ where: { id: firmId } })
  const existingSettings = (firm?.settings as any) || {}
  await db.firm.update({
    where: { id: firmId },
    data: {
      ...firmFields,
      settings: { ...existingSettings, ...brandSettings },
      updatedAt: new Date(),
    },
  })
  return NextResponse.json({ ok: true })
}
