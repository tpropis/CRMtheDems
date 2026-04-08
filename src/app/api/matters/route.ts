import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { db as audit } from '@/lib/db'

const createMatterSchema = z.object({
  clientId: z.string().cuid(),
  name: z.string().min(3).max(255),
  type: z.enum(['LITIGATION', 'CORPORATE', 'EMPLOYMENT', 'REAL_ESTATE', 'FAMILY_LAW', 'CRIMINAL_DEFENSE', 'IMMIGRATION', 'INTELLECTUAL_PROPERTY', 'BANKRUPTCY', 'TAX', 'ESTATE_PLANNING', 'REGULATORY', 'OTHER']),
  jurisdiction: z.string().optional(),
  description: z.string().optional(),
  billingType: z.enum(['HOURLY', 'FLAT_FEE', 'CONTINGENCY', 'RETAINER']).optional(),
  billingRate: z.number().optional(),
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100)

  const where = {
    firmId,
    ...(status ? { status: status as any } : {}),
  }

  const [matters, total] = await Promise.all([
    db.matter.findMany({
      where,
      include: {
        client: { select: { name: true } },
        parties: {
          where: { role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
          include: { user: { select: { name: true } } },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.matter.count({ where }),
  ])

  return NextResponse.json({
    data: matters,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const firmId = (session.user as any).firmId
  const userId = session.user.id

  try {
    const body = await req.json()
    const validated = createMatterSchema.parse(body)

    // Generate matter number
    const count = await db.matter.count({ where: { firmId } })
    const matterNumber = `M-${String(count + 1).padStart(5, '0')}`

    const matter = await db.matter.create({
      data: {
        firmId,
        clientId: validated.clientId,
        matterNumber,
        name: validated.name,
        type: validated.type,
        jurisdiction: validated.jurisdiction,
        description: validated.description,
        billingType: validated.billingType || 'HOURLY',
        billingRate: validated.billingRate,
        status: 'ACTIVE',
      },
    })

    // Audit log
    await db.auditEvent.create({
      data: {
        firmId,
        userId,
        matterId: matter.id,
        action: 'MATTER_CREATED',
        resource: 'Matter',
        resourceId: matter.id,
        description: `Matter created: ${matter.name} (${matterNumber})`,
      },
    })

    // Auto-create default folder structure
    await db.folder.createMany({
      data: [
        { matterId: matter.id, name: 'Pleadings', path: '/Pleadings', isSystem: true },
        { matterId: matter.id, name: 'Correspondence', path: '/Correspondence', isSystem: true },
        { matterId: matter.id, name: 'Discovery', path: '/Discovery', isSystem: true },
        { matterId: matter.id, name: 'Research', path: '/Research', isSystem: true },
        { matterId: matter.id, name: 'Billing', path: '/Billing', isSystem: true },
      ],
    })

    return NextResponse.json(matter, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    console.error('[API/matters]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
