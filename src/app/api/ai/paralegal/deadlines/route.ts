export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAIProvider } from '@/server/ai'

const FRCP_RULES: Record<string, Array<{ event: string; rule: string; days: number }>> = {
  'complaint served': [
    { event: 'Answer or motion to dismiss due', rule: 'FRCP 12(a)(1)', days: 21 },
    { event: 'Rule 26(f) conference must occur', rule: 'FRCP 26(f)', days: 21 },
    { event: 'Initial disclosures due (after 26(f))', rule: 'FRCP 26(a)(1)', days: 35 },
    { event: 'Scheduling order deadline', rule: 'FRCP 16(b)', days: 90 },
  ],
  'answer filed': [
    { event: 'Rule 26(f) conference (if not done)', rule: 'FRCP 26(f)', days: 0 },
    { event: 'Initial disclosures due', rule: 'FRCP 26(a)(1)', days: 14 },
    { event: 'Scheduling conference/order', rule: 'FRCP 16(b)', days: 60 },
  ],
  'motion filed': [
    { event: 'Opposition due', rule: 'Local Rules (typical)', days: 21 },
    { event: 'Reply due', rule: 'Local Rules (typical)', days: 14 },
  ],
  'deposition notice': [
    { event: 'Minimum notice period', rule: 'FRCP 30(b)(1)', days: 14 },
    { event: 'Objection to deposition notice', rule: 'FRCP 30(b)(1)', days: 14 },
  ],
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let count = 0
  while (count < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) count++
  }
  return result
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { triggerEvent, triggerDate, jurisdiction } = await req.json()
  if (!triggerEvent || !triggerDate) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const trigger = new Date(triggerDate)
  const today = new Date()

  // Try built-in rules first
  const ruleKey = Object.keys(FRCP_RULES).find(k => triggerEvent.toLowerCase().includes(k))
  let deadlines: any[] = []

  if (ruleKey) {
    deadlines = FRCP_RULES[ruleKey].map(r => {
      const dl = addBusinessDays(trigger, r.days)
      const daysRemaining = Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { event: r.event, rule: r.rule, deadline: formatDate(dl), daysRemaining, isUrgent: daysRemaining <= 14 }
    })
  } else {
    // Fall back to AI for complex/custom events
    const provider = getAIProvider()
    const result = await provider.generateText({
      messages: [
        {
          role: 'system',
          content: `You are a litigation deadline expert. Given a trigger event and date, output a JSON array of deadlines with this exact structure:
[{"event":"...","rule":"FRCP X or state rule","days":N,"isUrgent":false}]
Only output JSON, no explanation. Calculate from trigger date. Include all procedurally required deadlines.`,
        },
        {
          role: 'user',
          content: `Jurisdiction: ${jurisdiction}\nTrigger event: ${triggerEvent}\nTrigger date: ${triggerDate}\n\nList all deadlines triggered by this event.`,
        },
      ],
      temperature: 0,
      maxTokens: 1024,
    })

    try {
      const jsonMatch = result.content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        deadlines = parsed.map((d: any) => {
          const dl = addBusinessDays(trigger, d.days || 0)
          const daysRemaining = Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return { event: d.event, rule: d.rule, deadline: formatDate(dl), daysRemaining, isUrgent: daysRemaining <= 14 }
        })
      }
    } catch {}
  }

  // Sort by days remaining
  deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining)

  return NextResponse.json({ deadlines })
}
