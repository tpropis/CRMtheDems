import { UserRole } from '@prisma/client'

// Role hierarchy (higher = more access)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  FIRM_OWNER: 100,
  MANAGING_PARTNER: 90,
  PARTNER: 80,
  ASSOCIATE: 60,
  PARALEGAL: 50,
  LEGAL_ASSISTANT: 40,
  INTAKE_COORDINATOR: 35,
  BILLING_ADMIN: 30,
  IT_ADMIN: 70,
  READ_ONLY_AUDITOR: 10,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function isAdmin(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.IT_ADMIN,
  ].includes(role as any)
}

export function canBill(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.PARTNER,
    UserRole.BILLING_ADMIN,
  ].includes(role as any)
}

export function canReviewDiscovery(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.PARTNER,
    UserRole.ASSOCIATE,
    UserRole.PARALEGAL,
  ].includes(role as any)
}

export function canManageMatters(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.PARTNER,
    UserRole.ASSOCIATE,
    UserRole.PARALEGAL,
    UserRole.LEGAL_ASSISTANT,
  ].includes(role as any)
}

export function canAccessAI(role: UserRole): boolean {
  return role !== UserRole.READ_ONLY_AUDITOR && role !== UserRole.BILLING_ADMIN
}

export function canManageUsers(role: UserRole): boolean {
  return isAdmin(role)
}

export function canViewBilling(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.PARTNER,
    UserRole.BILLING_ADMIN,
  ].includes(role as any)
}

export function canViewAudit(role: UserRole): boolean {
  return [
    UserRole.FIRM_OWNER,
    UserRole.MANAGING_PARTNER,
    UserRole.IT_ADMIN,
    UserRole.READ_ONLY_AUDITOR,
  ].includes(role as any)
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.ASSOCIATE, UserRole.PARALEGAL, UserRole.LEGAL_ASSISTANT, UserRole.INTAKE_COORDINATOR, UserRole.BILLING_ADMIN, UserRole.IT_ADMIN, UserRole.READ_ONLY_AUDITOR],
  MANAGE_MATTERS: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.ASSOCIATE, UserRole.PARALEGAL, UserRole.LEGAL_ASSISTANT],
  VIEW_MATTERS: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.ASSOCIATE, UserRole.PARALEGAL, UserRole.LEGAL_ASSISTANT, UserRole.BILLING_ADMIN, UserRole.READ_ONLY_AUDITOR],
  MANAGE_INTAKE: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.INTAKE_COORDINATOR],
  MANAGE_BILLING: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.BILLING_ADMIN],
  VIEW_BILLING: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.BILLING_ADMIN],
  USE_AI: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.ASSOCIATE, UserRole.PARALEGAL, UserRole.LEGAL_ASSISTANT],
  MANAGE_DISCOVERY: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.PARTNER, UserRole.ASSOCIATE, UserRole.PARALEGAL],
  VIEW_AUDIT: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.IT_ADMIN, UserRole.READ_ONLY_AUDITOR],
  MANAGE_USERS: [UserRole.FIRM_OWNER, UserRole.MANAGING_PARTNER, UserRole.IT_ADMIN],
  MANAGE_SETTINGS: [UserRole.FIRM_OWNER, UserRole.IT_ADMIN],
}

export type Permission = keyof typeof PERMISSIONS

export function can(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as UserRole[]).includes(role)
}
