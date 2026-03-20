'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return data as Profile | null
    }

    function buildProfile(user: User, dbProfile: Profile | null): Profile {
      return dbProfile ?? {
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? user.email ?? '',
        role: user.user_metadata?.role ?? 'field',
        created_at: new Date().toISOString(),
      }
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const dbProfile = await loadProfile(user.id)
        setState({ user, profile: buildProfile(user, dbProfile), loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const dbProfile = await loadProfile(session.user.id)
          setState({ user: session.user, profile: buildProfile(session.user, dbProfile), loading: false })
        } else {
          setState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return state
}
