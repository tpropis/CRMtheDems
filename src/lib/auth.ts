import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt', maxAge: 28800 }, // 8 hours
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          include: { firm: true },
        })

        if (!user || !user.passwordHash || !user.isActive) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) {
          // Log failed login attempt
          await db.auditEvent.create({
            data: {
              firmId: user.firmId,
              userId: user.id,
              action: 'LOGIN_FAILED',
              description: `Failed login attempt for ${user.email}`,
            },
          }).catch(() => {})
          return null
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {})

        // Log successful login
        await db.auditEvent.create({
          data: {
            firmId: user.firmId,
            userId: user.id,
            action: 'LOGIN',
            description: `User logged in: ${user.email}`,
          },
        }).catch(() => {})

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          firmId: user.firmId,
          role: user.role,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firmId = (user as any).firmId
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).firmId = token.firmId
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})
