'use client'

import { useAuth } from './useAuth'
import type { UserRole } from '@/types'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  manager: 3,
  field: 2,
  volunteer: 1,
}

export function useRole() {
  const { profile } = useAuth()
  const role = profile?.role ?? 'volunteer'

  function hasRole(requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole]
  }

  function isAdmin(): boolean {
    return role === 'admin'
  }

  function isAtLeastManager(): boolean {
    return hasRole('manager')
  }

  function isAtLeastField(): boolean {
    return hasRole('field')
  }

  return { role, hasRole, isAdmin, isAtLeastManager, isAtLeastField }
}
