export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import type { BrandConfig } from '@/server/pdf/letterhead'

const schema = z.object({
  content: z.string().min(1),
  title: z.string().min(1),
  matterId: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId

  try {
    const body = await req.json()
    const { content, title } = schema.parse(body)

    // Load firm brand settings for letterhead
    const firm = await db.firm.findUnique({
      where: { id: firmId },
      select: { name: true, address: true, city: true, state: true, zipCode: true, phone: true, website: true, barNumber: true, settings: true },
    })

    const settings = (firm?.settings as any) || {}
    const brand: BrandConfig = {
      firmName: firm?.name || '',
      address: firm?.address || '',
      city: firm?.city || '',
      state: firm?.state || '',
      zipCode: firm?.zipCode || '',
      phone: firm?.phone || '',
      website: firm?.website ?? undefined,
      barNumber: firm?.barNumber ?? undefined,
      logoUrl: settings.logoUrl ?? undefined,
      primaryColor: settings.primaryColor || '#2563EB',
      secondaryColor: settings.secondaryColor || '#1E2535',
      tagline: settings.tagline ?? undefined,
      letterheadStyle: settings.letterheadStyle || 'classic',
      footerText: settings.footerText ?? undefined,
      showBarNumber: settings.showBarNumber ?? true,
      showWebsite: settings.showWebsite ?? true,
    }

    // Dynamic import to avoid edge runtime issues
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { LetterheadDocument } = await import('@/server/pdf/letterhead')
    const React = (await import('react')).default

    const element = React.createElement(LetterheadDocument, { brand, content, title })
    const pdfBuffer = await renderToBuffer(element as any)

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
      },
    })
  } catch (err: any) {
    console.error('[documents/generate/pdf]', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
