import type { SupportStatus, ContactType, SignStatus, TaskStatus, TaskPriority, EventType, DonationSource, UserRole } from '@/types'

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  strong_support: 'Strong Support',
  lean_support: 'Lean Support',
  undecided: 'Undecided',
  lean_oppose: 'Lean Oppose',
  strong_oppose: 'Strong Oppose',
  not_contacted: 'Not Contacted',
}

export const SUPPORT_STATUS_COLORS: Record<SupportStatus, string> = {
  strong_support: 'bg-emerald-100 text-emerald-800',
  lean_support: 'bg-green-100 text-green-800',
  undecided: 'bg-yellow-100 text-yellow-800',
  lean_oppose: 'bg-orange-100 text-orange-800',
  strong_oppose: 'bg-red-100 text-red-800',
  not_contacted: 'bg-slate-100 text-slate-600',
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  voter: 'Voter',
  donor: 'Donor',
  volunteer: 'Volunteer',
  influencer: 'Influencer',
  business_owner: 'Business Owner',
  supporter: 'Supporter',
  other: 'Other',
}

export const SIGN_STATUS_LABELS: Record<SignStatus, string> = {
  requested: 'Requested',
  scheduled: 'Scheduled',
  delivered: 'Delivered',
  installed: 'Installed',
  replacement_needed: 'Replacement Needed',
  closed: 'Closed',
}

export const SIGN_STATUS_COLORS: Record<SignStatus, string> = {
  requested: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-purple-100 text-purple-800',
  delivered: 'bg-teal-100 text-teal-800',
  installed: 'bg-emerald-100 text-emerald-800',
  replacement_needed: 'bg-orange-100 text-orange-800',
  closed: 'bg-slate-100 text-slate-600',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-emerald-100 text-emerald-800',
  canceled: 'bg-slate-100 text-slate-500',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  fundraiser: 'Fundraiser',
  coffee_meet: 'Coffee Meet',
  canvass_launch: 'Canvass Launch',
  volunteer_shift: 'Volunteer Shift',
  community_event: 'Community Event',
  sign_wave: 'Sign Wave',
  other: 'Other',
}

export const DONATION_SOURCE_LABELS: Record<DonationSource, string> = {
  online: 'Online',
  event: 'Event',
  mail: 'Mail',
  phone: 'Phone',
  personal: 'Personal Ask',
  other: 'Other',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  field: 'Field',
  volunteer: 'Volunteer',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  field: 'bg-teal-100 text-teal-800',
  volunteer: 'bg-slate-100 text-slate-700',
}

export const CANVASS_RESULT_LABELS: Record<string, string> = {
  strong_support: 'Strong Support',
  lean_support: 'Lean Support',
  undecided: 'Undecided',
  not_home: 'Not Home',
  opposed: 'Opposed',
  wrong_address: 'Wrong Address',
  moved: 'Moved',
  callback_requested: 'Callback Requested',
}

export const CANVASS_RESULT_COLORS: Record<string, string> = {
  strong_support: 'bg-emerald-100 text-emerald-800',
  lean_support: 'bg-green-100 text-green-800',
  undecided: 'bg-yellow-100 text-yellow-800',
  not_home: 'bg-slate-100 text-slate-600',
  opposed: 'bg-red-100 text-red-800',
  wrong_address: 'bg-orange-100 text-orange-800',
  moved: 'bg-orange-100 text-orange-700',
  callback_requested: 'bg-blue-100 text-blue-800',
}
