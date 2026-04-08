import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAIProvider } from '@/server/ai'
import { SYSTEM_PROMPTS, buildDraftingPrompt } from '@/server/ai/prompts'
import { z } from 'zod'

const schema = z.object({
  documentType: z.string().min(2),
  facts: z.record(z.string()),
  matterId: z.string().cuid().optional(),
  templateId: z.string().cuid().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const userId = session.user.id

  try {
    const body = await req.json()
    const { documentType, facts, matterId } = schema.parse(body)

    const provider = getAIProvider()
    const prompt = buildDraftingPrompt(documentType, facts)

    const result = await provider.generateText({
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.DRAFTER },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    })

    await db.auditEvent.create({
      data: {
        firmId, userId, matterId,
        action: 'DRAFT_GENERATED',
        description: `AI draft generated: ${documentType}`,
        metadata: { model: result.model, tokens: result.totalTokens },
      },
    })

    return NextResponse.json({
      content: result.content,
      model: result.model,
      tokens: result.totalTokens,
      latencyMs: result.latencyMs,
      isDraft: true,
    })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'AI drafting failed' }, { status: 500 })
  }
}
