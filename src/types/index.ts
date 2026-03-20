export type UserRole = 'admin' | 'manager' | 'field' | 'volunteer'

export type SupportStatus =
  | 'strong_support'
  | 'lean_support'
  | 'undecided'
  | 'lean_oppose'
  | 'strong_oppose'
  | 'not_contacted'

export type ContactType =
  | 'voter'
  | 'donor'
  | 'volunteer'
  | 'influencer'
  | 'business_owner'
  | 'supporter'
  | 'other'

export type CanvassResult =
  | 'strong_support'
  | 'lean_support'
  | 'undecided'
  | 'not_home'
  | 'opposed'
  | 'wrong_address'
  | 'moved'
  | 'callback_requested'

export type SignStatus =
  | 'requested'
  | 'scheduled'
  | 'delivered'
  | 'installed'
  | 'replacement_needed'
  | 'closed'

export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'canceled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskType =
  | 'follow_up'
  | 'call'
  | 'door_knock'
  | 'email'
  | 'meeting'
  | 'data_entry'
  | 'other'

export type EventType =
  | 'fundraiser'
  | 'coffee_meet'
  | 'canvass_launch'
  | 'volunteer_shift'
  | 'community_event'
  | 'sign_wave'
  | 'other'

export type DonationSource =
  | 'online'
  | 'event'
  | 'mail'
  | 'phone'
  | 'personal'
  | 'other'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  active: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  precinct: string | null
  neighborhood: string | null
  tags: string[]
  support_status: SupportStatus
  contact_type: ContactType
  preferred_contact_method: 'phone' | 'email' | 'text' | 'door' | null
  issues: string[]
  notes: string | null
  assigned_user_id: string | null
  next_follow_up: string | null
  created_at: string
  updated_at: string
  assigned_user?: Profile
}

export interface ContactNote {
  id: string
  contact_id: string
  user_id: string
  note: string
  created_at: string
  user?: Profile
}

export interface WalkList {
  id: string
  name: string
  description: string | null
  neighborhood: string | null
  assigned_user_id: string | null
  created_by: string
  active: boolean
  created_at: string
  updated_at: string
  assigned_user?: Profile
  contact_count?: number
}

export interface WalkListContact {
  id: string
  walk_list_id: string
  contact_id: string
  order_index: number
  contact?: Contact
}

export interface CanvassResultRecord {
  id: string
  contact_id: string
  walk_list_id: string | null
  user_id: string
  result: CanvassResult
  note: string | null
  follow_up_needed: boolean
  canvassed_at: string
  created_at: string
  contact?: Contact
  user?: Profile
}

export interface Donor {
  id: string
  contact_id: string
  amount: number
  date: string
  source: DonationSource
  notes: string | null
  recurring: boolean
  pledge: boolean
  pledge_status: 'pending' | 'fulfilled' | 'canceled' | null
  thank_you_sent: boolean
  assigned_owner_id: string | null
  created_at: string
  updated_at: string
  contact?: Contact
  assigned_owner?: Profile
}

export interface Volunteer {
  id: string
  contact_id: string
  availability: string | null
  skills: string[]
  preferred_tasks: string[]
  active: boolean
  assigned_neighborhoods: string[]
  notes: string | null
  created_at: string
  updated_at: string
  contact?: Contact
}

export interface YardSignRequest {
  id: string
  contact_id: string
  request_date: string
  quantity: number
  delivery_status: SignStatus
  delivery_date: string | null
  installation_status: boolean
  installer_name: string | null
  photo_proof_url: string | null
  address: string | null
  neighborhood: string | null
  notes: string | null
  created_at: string
  updated_at: string
  contact?: Contact
}

export interface Task {
  id: string
  title: string
  description: string | null
  task_type: TaskType
  linked_contact_id: string | null
  linked_donor_id: string | null
  linked_event_id: string | null
  assigned_to: string | null
  created_by: string
  due_date: string | null
  priority: TaskPriority
  status: TaskStatus
  notes: string | null
  created_at: string
  updated_at: string
  assigned_user?: Profile
  linked_contact?: Contact
}

export interface Event {
  id: string
  title: string
  event_type: EventType
  description: string | null
  location: string | null
  start_datetime: string
  end_datetime: string | null
  organizer_id: string | null
  attendee_count: number
  notes: string | null
  created_at: string
  updated_at: string
  organizer?: Profile
}

export interface EventAttendee {
  id: string
  event_id: string
  contact_id: string
  rsvp_status: 'invited' | 'confirmed' | 'attended' | 'no_show'
  created_at: string
  contact?: Contact
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  details: Record<string, unknown> | null
  created_at: string
  user?: Profile
}

export interface DashboardStats {
  total_contacts: number
  supporters: number
  undecided: number
  volunteers: number
  donors: number
  total_donations: number
  signs_requested: number
  signs_delivered: number
  open_tasks: number
  overdue_tasks: number
}
