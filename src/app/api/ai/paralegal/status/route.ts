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

  let matterContext = ''

  if (matterId) {
    // Find matter by id, number, or name
    const matter = await db.matter.findFirst({
      where: {
        firmId,
        OR: [
          { id: matterId },
          { matterNumber: matterId },
          { name: { contains: matterId, mode: 'insensitive' } },
        ],
      },
      include: {
        client: true,
        parties: { include: { user: true }, where: { isPrimary: true } },
      },
    })

    if (matter) {
      const attorney = matter.parties[0]?.user

      // Fetch tasks and events separately to avoid TypeScript inference issues
      const [openTasks, upcomingEvents] = await Promise.all([
        db.task.findMany({
          where: { matterId: matter.id, status: { not: 'DONE' } },
          orderBy: { dueAt: 'asc' },
          take: 5,
          select: { title: true, priority: true, dueAt: true },
        }),
        db.calendarEvent.findMany({
          where: { matterId: matter.id, startAt: { gte: new Date() } },
          orderBy: { startAt: 'asc' },
          take: 5,
          select: { title: true, startAt: true, eventType: true },
        }),
      ])

      const eventsStr = upcomingEvents
        .map((e) => `${new Date(e.startAt).toLocaleDateString()} — ${e.title}`)
        .join('\n')
      const tasksStr = openTasks
        .map((t) => `${t.title} (${t.priority})${t.dueAt ? ` — due ${new Date(t.dueAt).toLocaleDateString()}` : ''}`)
        .join('\n')

      matterContext = [
        `Matter: ${matter.name} (${matter.matterNumber})`,
        `Client: ${matter.client.name}`,
        `Attorney: ${attorney?.name || 'Unassigned'}`,
        `Status: ${matter.status}`,
        `Type: ${matter.type}`,
        matter.courtName ? `Court: ${matter.courtName}` : '',
        matter.caseNumber ? `Case No.: ${matter.caseNumber}` : '',
        eventsStr ? `\nUpcoming Events:\n${eventsStr}` : '',
        tasksStr ? `\nOpen Tasks:\n${tasksStr}` : '',
      ].filter(Boolean).join('\n')
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
- Re: line with matter name
- Brief introductory paragraph
- Sections: CURRENT STATUS, RECENT ACTIVITY, UPCOMING DEADLINES, ACTION REQUIRED FROM CLIENT
- Professional closing
- Tone: professional, confident, reassuring

Do NOT use placeholder text like "[insert name]". Write the actual document using the information provided. Omit sections where data is unavailable rather than leaving blanks.`,
      },
      {
        role: 'user',
        content: `Today's date: ${today}${matterContext ? `\n\nMatter data:\n${matterContext}` : ''}\n\nAttorney notes:\n${context || 'No additional context.'}`,
      },
    ],
    temperature: 0.25,
    maxTokens: 2048,
  })

  return NextResponse.json({ content: result.content })
}
