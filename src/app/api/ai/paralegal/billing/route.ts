export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAIProvider } from '@/server/ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { entries } = await req.json()
  if (!entries?.trim()) return NextResponse.json({ error: 'No entries provided' }, { status: 400 })

  const provider = getAIProvider()
  const result = await provider.generateText({
    messages: [
      {
        role: 'system',
        content: `You are a billing specialist at a law firm. Your job is to rewrite vague time entry descriptions into professional, specific, ABA-compliant billing narratives that will pass client bill review.

Rules:
- Each entry must be specific about what was done (not just "reviewed docs" but "reviewed and analyzed opposing counsel's motion for summary judgment")
- Include outcome or purpose where inferable ("to evaluate privilege claims")
- Keep descriptions concise but complete — typically 1-2 sentences
- Maintain the time amounts
- Output each entry on its own line in format: [time] — [professional narrative]
- Do not add commentary, just output the rewritten entries`,
      },
      {
        role: 'user',
        content: `Rewrite these time entries as professional billing narratives:\n\n${entries}`,
      },
    ],
    temperature: 0.2,
    maxTokens: 2048,
  })

  return NextResponse.json({ content: result.content })
}
