import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, unknown> = {
    ts: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? `set (${process.env.DATABASE_URL.slice(0, 30)}...)` : 'MISSING',
      DIRECT_URL: process.env.DIRECT_URL ? `set (${process.env.DIRECT_URL.slice(0, 30)}...)` : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING',
    },
  }

  try {
    const user = await db.user.findFirst({
      where: { email: 'admin@hartleyandassoc.com' },
      select: { id: true, email: true, isActive: true, passwordHash: true },
    })
    checks.db = 'connected'
    if (!user) {
      checks.user = 'NOT FOUND — run seed SQL in Supabase'
    } else {
      checks.user = {
        found: true,
        email: user.email,
        isActive: user.isActive,
        hasPasswordHash: !!user.passwordHash,
        hashPrefix: user.passwordHash?.slice(0, 10) ?? null,
      }
    }
  } catch (e: any) {
    checks.db = 'ERROR'
    checks.dbError = e?.message
    checks.dbCode = e?.code
  }

  return NextResponse.json(checks)
}
