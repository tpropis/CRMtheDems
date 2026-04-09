import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth config — no Node.js dependencies (no bcryptjs, no Prisma)
// Used by middleware only. Full auth logic lives in auth.ts.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 28800 },
  providers: [], // providers added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const PUBLIC_ROUTES = ['/', '/login', '/about', '/security', '/platform', '/pricing', '/demo', '/contact']
      const isPublic = PUBLIC_ROUTES.some(
        (r) => nextUrl.pathname === r || nextUrl.pathname.startsWith(r + '/')
      )
      const isApiAuth = nextUrl.pathname.startsWith('/api/auth')
      const isStatic = nextUrl.pathname.startsWith('/_next') || nextUrl.pathname.startsWith('/favicon')

      if (isPublic || isApiAuth || isStatic) return true
      if (!isLoggedIn) return Response.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl))
      return true
    },
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
}
