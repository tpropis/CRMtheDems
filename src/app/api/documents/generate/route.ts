export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAIProvider } from '@/server/ai'
import { z } from 'zod'

const schema = z.object({
  templateName: z.string().min(1),
  templateContent: z.string().min(1),
  matterId: z.string().optional(),
  instructions: z.string().optional(),
})

// Build mustache view from matter DB record
function buildView(matter: any, firm: any, today: string): Record<string, string> {
  const client = matter?.client || {}
  const attorney = matter?.parties?.[0]?.user || {}

  return {
    today,
    'firm.name': firm?.name || '',
    'firm.address': firm?.address || '',
    'firm.city': firm?.city || '',
    'firm.state': firm?.state || '',
    'firm.zipCode': firm?.zipCode || '',
    'firm.phone': firm?.phone || '',
    'client.name': client.name || '',
    'client.address': [client.address, client.city && client.state ? `${client.city}, ${client.state} ${client.zipCode || ''}` : ''].filter(Boolean).join('\n'),
    'matter.name': matter?.name || '',
    'matter.number': matter?.matterNumber || '',
    'matter.description': matter?.description || '',
    'matter.type': matter?.type?.replace(/_/g, ' ') || '',
    'matter.court': matter?.courtName || '',
    'matter.caseNumber': matter?.caseNumber || '',
    'matter.judge': matter?.judgeAssigned || '',
    'matter.jurisdiction': matter?.jurisdiction || '',
    'attorney.name': attorney.name || '',
    'attorney.title': attorney.title || '',
    'attorney.barNumber': attorney.barNumber || '',
    'attorney.rate': matter?.billingRate ? `$${matter.billingRate}/hr` : '',
    'opposing.counsel': matter?.opposingCounsel || '',
    'opposing.party': '',
    'retainer.amount': matter?.retainerAmount ? `$${matter.retainerAmount}` : '',
  }
}

// Simple mustache-style variable replacement (avoids import type issues)
function renderTemplate(template: string, view: Record<string, string>): string {
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => view[key] || `{{${key}}}`)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const userId = session.user.id as string

  try {
    const body = await req.json()
    const { templateName, templateContent, matterId, instructions } = schema.parse(body)

    // Load matter + firm context
    const [firm, matter] = await Promise.all([
      db.firm.findUnique({ where: { id: firmId } }),
      matterId ? db.matter.findUnique({
        where: { id: matterId, firmId },
        include: {
          client: true,
          parties: { include: { user: true }, where: { isPrimary: true } },
        },
      }) : null,
    ])

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const view = buildView(matter, firm, today)
    const prefilledContent = renderTemplate(templateContent, view)

    // Build AI prompt
    const systemPrompt = `You are a senior attorney drafting legal documents for ${firm?.name || 'a law firm'}.
Generate complete, professional, court-ready documents. Replace ALL remaining {{variable}} placeholders with reasonable values based on context.
Use formal legal language. Do not add commentary — output ONLY the document text.`

    const userPrompt = instructions
      ? `Complete this legal document. Replace any remaining placeholders with appropriate content.\n\nAdditional context from attorney:\n${instructions}\n\n---\n${prefilledContent}`
      : `Complete this legal document by filling in any remaining {{placeholders}} with appropriate professional content.\n\n---\n${prefilledContent}`

    const provider = getAIProvider()
    const result = await provider.generateText({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      maxTokens: 4096,
    })

    // Save to document vault
    const storageKey = `generated/${firmId}/${Date.now()}-${templateName.replace(/\s+/g, '_')}.txt`
    const doc = await db.document.create({
      data: {
        firmId,
        matterId: matterId || null,
        name: `${templateName} — ${today}`,
        originalName: `${templateName}.txt`,
        storageKey,
        description: `AI-generated from template: ${templateName}`,
        mimeType: 'text/plain',
        size: result.content.length,
        status: 'DRAFT',
        isPrivileged: true,
        privilegeTag: 'ATTORNEY_CLIENT',
        uploadedById: userId,
        isCurrentVersion: true,
        version: 1,
        metadata: { generatedContent: result.content, templateName, model: result.model },
      },
    })

    await db.auditEvent.create({
      data: {
        firmId, userId, matterId: matterId || null,
        action: 'DRAFT_GENERATED',
        description: `AI document generated: ${templateName}`,
        metadata: { model: result.model, tokens: result.totalTokens, documentId: doc.id },
      },
    })

    return NextResponse.json({
      content: result.content,
      model: result.model,
      tokens: result.totalTokens,
      documentId: doc.id,
    })
  } catch (err: any) {
    console.error('[documents/generate]', err)
    if (err?.name === 'ZodError') return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Document generation failed' }, { status: 500 })
  }
}
