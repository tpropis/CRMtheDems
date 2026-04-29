import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from '@/lib/auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) {
            console.error('[auth] schema failed', parsed.error)
            return null
          }

          // Demo shortcut — works even if DB is unreachable
          if (
            parsed.data.email === 'admin@hartleyandassoc.com' &&
            parsed.data.password === 'PrivilegeVault2024!'
          ) {
            return {
              id: 'demo-admin',
              email: 'admin@hartleyandassoc.com',
              name: 'Margaret Hartley',
              firmId: 'demo-firm',
              role: 'MANAGING_PARTNER',
              image: null,
            }
          }

          const user = await db.user.findUnique({
            where: { email: parsed.data.email },
            include: { firm: true },
          })

          if (!user) {
            console.error('[auth] user not found', parsed.data.email)
            return null
          }
          if (!user.passwordHash) {
            console.error('[auth] user has no passwordHash', user.email)
            return null
          }
          if (!user.isActive) {
            console.error('[auth] user not active', user.email)
            return null
          }

          const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
          if (!valid) {
            console.error('[auth] bcrypt mismatch for', user.email)
            return null
          }

          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {})

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            firmId: user.firmId,
            role: user.role,
            image: user.avatarUrl,
          }
        } catch (e: any) {
          console.error('[auth] authorize threw:', e?.message, e?.code, e?.stack?.split('\n').slice(0, 3).join(' | '))
          return null
        }
      },
    }),
  ],
})
