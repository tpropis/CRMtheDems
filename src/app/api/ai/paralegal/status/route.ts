export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAIProvider } from '@/server/ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const { matterId, context } = await req.json()

  // Optionally enrich with matter data from DB
  let matterContext = ''
  if (matterId) {
    const matter = await db.matter.findFirst({
      where: { firmId, OR: [{ id: matterId }, { matterNumber: matterId }, { name: { contains: matterId, mode: 'insensitive' } }] },
      include: {
        client: true,
        parties: { include: { user: true }, where: { isPrimary: true } },
        tasks: { where: { status: { not: 'DONE' } }, orderBy: { dueDate: 'asc' }, take: 5 },
        calendarEvents: { where: { startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 5 },
      },
    })

    if (matter) {
      const attorney = matter.parties[0]?.user
      const upcomingEvents = matter.calendarEvents.map(e => `${new Date(e.startDate).toLocaleDateString()} — ${e.title}`).join('\n')
      const openTasks = matter.tasks.map(t => `${t.title} (${t.priority})`).join('\n')

      matterContext = `
Matter: ${matter.name} (${matter.matterNumber})
Client: ${matter.client.name}
Attorney: ${attorney?.name || 'Unassigned'}
Status: ${matter.status}
Type: ${matter.type}
Court: ${matter.courtName || 'N/A'}
Case No.: ${matter.caseNumber || 'N/A'}
${upcomingEvents ? `\nUpcoming Events:\n${upcomingEvents}` : ''}
${openTasks ? `\nOpen Tasks:\n${openTasks}` : ''}
`
    }
  }

  const provider = getAIProvider()
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const result = await provider.generateText({
    messages: [
      {
        role: 'system',
        content: `You are a senior attorney drafting a formal client status report. Write a professional, specific, client-ready status report.

Format:
- Date at top
- "PRIVILEGED AND CONFIDENTIAL" header
- Re: line
- Brief introductory paragraph
- Sections: CURRENT STATUS, RECENT ACTIVITY, UPCOMING DEADLINES, ACTION REQUIRED FROM CLIENT
- Close with contact information placeholder
- Tone: professional, confident, reassuring — clients want to know their attorney is on top of things

Do NOT include placeholder text like "[insert name]" — write the actual document using the information provided. If something is unknown, omit that section rather than leaving a blank.`,
      },
      {
        role: 'user',
        content: `Today's date: ${today}${matterContext ? `\n\nMatter context from our system:\n${matterContext}` : ''}\n\nAdditional context from attorney:\n${context || 'No additional context provided.'}`,
      },
    ],
    temperature: 0.25,
    maxTokens: 2048,
  })

  return NextResponse.json({ content: result.content })
}
