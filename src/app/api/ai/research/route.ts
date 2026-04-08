import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAIProvider } from '@/server/ai'
import { SYSTEM_PROMPTS, buildResearchPrompt } from '@/server/ai/prompts'
import { retrieveRelevantChunks } from '@/server/ai/rag/retrieval'
import { z } from 'zod'

const schema = z.object({
  matterId: z.string().cuid().optional(),
  query: z.string().min(5).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const userId = session.user.id

  try {
    const body = await req.json()
    const { matterId, query, history = [] } = schema.parse(body)

    // Retrieve relevant sources
    const chunks = await retrieveRelevantChunks({ query, firmId, matterId, limit: 5 })
    const sources = chunks.map((c) => c.content)

    const matterContext = matterId
      ? await db.matter.findFirst({
          where: { id: matterId, firmId },
          select: { name: true, type: true, description: true, jurisdiction: true },
        }).then((m) => m ? `Matter: ${m.name} | Type: ${m.type} | Jurisdiction: ${m.jurisdiction || 'N/A'}${m.description ? `\nBackground: ${m.description}` : ''}` : undefined)
      : undefined

    const userPrompt = buildResearchPrompt(query, sources, matterContext)

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPTS.RESEARCH },
      ...history.slice(-6).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userPrompt },
    ]

    // Log AI query
    await db.auditEvent.create({
      data: {
        firmId,
        userId,
        matterId,
        action: 'AI_QUERY',
        description: `Research query: ${query.slice(0, 100)}`,
        metadata: { sourcesUsed: chunks.length },
      },
    })

    // Stream response
    const provider = getAIProvider()
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send sources first
          const sourcesMeta = chunks.map((c) => ({
            title: c.documentName,
            excerpt: c.content.slice(0, 200),
            type: c.matterId ? 'Matter Document' : 'Knowledge Base',
            relevance: c.relevance,
          }))
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ sources: sourcesMeta, confidence: 0.82 })}\n\n`)
          )

          // Stream text
          for await (const chunk of provider.generateStream({ messages })) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'AI generation failed' })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
