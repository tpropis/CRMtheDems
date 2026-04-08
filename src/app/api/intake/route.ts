import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  prospectName: z.string().min(2).max(255),
  prospectEmail: z.string().email().optional().or(z.literal('')),
  prospectPhone: z.string().optional(),
  prospectOrg: z.string().optional(),
  matterType: z.enum(['LITIGATION', 'CORPORATE', 'EMPLOYMENT', 'REAL_ESTATE', 'FAMILY_LAW', 'CRIMINAL_DEFENSE', 'IMMIGRATION', 'INTELLECTUAL_PROPERTY', 'BANKRUPTCY', 'TAX', 'ESTATE_PLANNING', 'REGULATORY', 'OTHER']).optional(),
  jurisdiction: z.string().optional(),
  source: z.string().optional(),
  urgency: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  opposingParties: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const userId = session.user.id

  try {
    const body = await req.json()
    const validated = schema.parse(body)

    const count = await db.intakeLead.count({ where: { firmId } })
    const leadNumber = `L-${String(count + 1).padStart(5, '0')}`

    const lead = await db.intakeLead.create({
      data: {
        firmId,
        leadNumber,
        status: 'NEW',
        ...validated,
        opposingParties: validated.opposingParties || [],
      },
    })

    // Audit
    await db.auditEvent.create({
      data: {
        firmId, userId,
        action: 'INTAKE_CREATED',
        resource: 'IntakeLead',
        resourceId: lead.id,
        description: `Intake lead created for ${validated.prospectName}`,
      },
    })

    // Auto-run conflict check (async — fire and forget for MVP)
    runConflictCheck(lead.id, firmId, userId).catch(console.error)

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function runConflictCheck(intakeLeadId: string, firmId: string, runById: string) {
  const lead = await db.intakeLead.findUnique({ where: { id: intakeLeadId } })
  if (!lead) return

  // Create conflict check record
  const check = await db.conflictCheck.create({
    data: { intakeLeadId, runById, status: 'PENDING' },
  })

  // Update intake status
  await db.intakeLead.update({
    where: { id: intakeLeadId },
    data: { status: 'CONFLICT_CHECK' },
  })

  // Search existing clients/contacts for name matches
  const searchName = lead.prospectName.toLowerCase()
  const [clients, contacts] = await Promise.all([
    db.client.findMany({ where: { firmId }, select: { id: true, name: true } }),
    db.contact.findMany({ where: { firmId }, select: { id: true, firstName: true, lastName: true } }),
  ])

  const results: any[] = []

  for (const client of clients) {
    const similarity = computeSimilarity(searchName, client.name.toLowerCase())
    if (similarity > 0.6) {
      results.push({
        conflictCheckId: check.id,
        entityType: 'CLIENT',
        entityId: client.id,
        entityName: client.name,
        matchType: similarity > 0.9 ? 'EXACT' : 'FUZZY',
        confidence: similarity,
        isConflict: false,
      })
    }
  }

  for (const contact of contacts) {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
    const similarity = computeSimilarity(searchName, fullName)
    if (similarity > 0.6) {
      results.push({
        conflictCheckId: check.id,
        entityType: 'CONTACT',
        entityId: contact.id,
        entityName: fullName,
        matchType: similarity > 0.9 ? 'EXACT' : 'FUZZY',
        confidence: similarity,
        isConflict: false,
      })
    }
  }

  if (results.length > 0) await db.conflictResult.createMany({ data: results })

  const hasConflict = results.some((r) => r.confidence > 0.9)
  await db.conflictCheck.update({
    where: { id: check.id },
    data: {
      status: hasConflict ? 'POTENTIAL_CONFLICT' : 'CLEAR',
      summary: hasConflict
        ? `Potential conflict detected: ${results.filter((r) => r.confidence > 0.9).map((r) => r.entityName).join(', ')}`
        : `No conflicts found. ${results.length} partial matches reviewed.`,
    },
  })

  await db.intakeLead.update({
    where: { id: intakeLeadId },
    data: { status: hasConflict ? 'SCREENING' : 'APPROVED' },
  })
}

function computeSimilarity(a: string, b: string): number {
  // Simple token overlap similarity for MVP
  const wordsA = new Set(a.split(/\s+/).filter((w) => w.length > 2))
  const wordsB = new Set(b.split(/\s+/).filter((w) => w.length > 2))
  const intersection = [...wordsA].filter((w) => wordsB.has(w))
  const union = new Set([...wordsA, ...wordsB])
  return union.size > 0 ? intersection.length / union.size : 0
}
