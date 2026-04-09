export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

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
    const { content, title, matterId } = schema.parse(body)

    // Load firm brand settings for letterhead
    const firm = await db.firm.findUnique({
      where: { id: firmId },
      select: { name: true, address: true, city: true, state: true, zipCode: true, phone: true, website: true, barNumber: true, settings: true },
    })

    const settings = (firm?.settings as any) || {}
    const brand = {
      firmName: firm?.name || '',
      address: firm?.address || '',
      city: firm?.city || '',
      state: firm?.state || '',
      zipCode: firm?.zipCode || '',
      phone: firm?.phone || '',
      website: firm?.website,
      barNumber: firm?.barNumber,
      logoUrl: settings.logoUrl,
      primaryColor: settings.primaryColor || '#2563EB',
      secondaryColor: settings.secondaryColor || '#1E2535',
      tagline: settings.tagline,
      letterheadStyle: settings.letterheadStyle || 'classic',
      footerText: settings.footerText,
      showBarNumber: settings.showBarNumber ?? true,
      showWebsite: settings.showWebsite ?? true,
    }

    // Dynamic import to avoid edge runtime issues
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { LetterheadDocument } = await import('@/server/pdf/letterhead')
    const React = await import('react')

    const pdfBuffer = await renderToBuffer(
      React.createElement(LetterheadDocument, { brand, content, title })
    )

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    })
  } catch (err: any) {
    console.error('[documents/generate/pdf]', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
