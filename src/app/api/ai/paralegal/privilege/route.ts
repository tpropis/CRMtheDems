export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAIProvider } from '@/server/ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documents } = await req.json()
  if (!documents?.trim()) return NextResponse.json({ error: 'No documents provided' }, { status: 400 })

  const provider = getAIProvider()
  const result = await provider.generateText({
    messages: [
      {
        role: 'system',
        content: `You are a senior litigation attorney generating a formal privilege log for production in federal court.

For each document described, output a privilege log entry with these columns in a formatted table:
| Bates No. | Date | Author | Recipients | Type | Subject/Description | Privilege Basis | WP Doctrine |

Rules:
- Be specific but do NOT reveal the substance of privileged communications
- Privilege basis: Attorney-Client Privilege, Work Product Doctrine, or both
- Work product: Ordinary (o) or Opinion (op)
- Description must be specific enough to identify the document without revealing content
- Flag any documents where privilege is questionable with [REVIEW]

Output only the formatted table and a brief certification statement at the end. No other commentary.`,
      },
      {
        role: 'user',
        content: `Generate a privilege log for these documents:\n\n${documents}`,
      },
    ],
    temperature: 0.1,
    maxTokens: 3000,
  })

  return NextResponse.json({ content: result.content })
}
