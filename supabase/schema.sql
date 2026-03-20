-- ============================================================
-- Campaign Command Center — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'volunteer' check (role in ('admin', 'manager', 'field', 'volunteer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'volunteer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CONTACTS
-- ============================================================
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  full_name text generated always as (first_name || ' ' || last_name) stored,
  phone text,
  email text,
  address text,
  city text,
  state text default 'NH',
  zip text,
  precinct text,
  neighborhood text,
  tags text[] default '{}',
  support_status text not null default 'not_contacted'
    check (support_status in ('strong_support','lean_support','undecided','lean_oppose','strong_oppose','not_contacted')),
  contact_type text not null default 'voter'
    check (contact_type in ('voter','donor','volunteer','influencer','business_owner','supporter','other')),
  preferred_contact_method text check (preferred_contact_method in ('phone','email','text','door')),
  issues text[] default '{}',
  notes text,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  next_follow_up date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_support_status_idx on public.contacts(support_status);
create index if not exists contacts_contact_type_idx on public.contacts(contact_type);
create index if not exists contacts_precinct_idx on public.contacts(precinct);
create index if not exists contacts_assigned_user_idx on public.contacts(assigned_user_id);
create index if not exists contacts_full_name_idx on public.contacts using gin(to_tsvector('english', full_name));

-- ============================================================
-- CONTACT NOTES
-- ============================================================
create table if not exists public.contact_notes (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_notes_contact_idx on public.contact_notes(contact_id);

-- ============================================================
-- WALK LISTS
-- ============================================================
create table if not exists public.walk_lists (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  neighborhood text,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- WALK LIST CONTACTS (join table)
-- ============================================================
create table if not exists public.walk_list_contacts (
  id uuid primary key default uuid_generate_v4(),
  walk_list_id uuid not null references public.walk_lists(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  order_index integer not null default 0,
  unique(walk_list_id, contact_id)
);

create index if not exists wlc_walk_list_idx on public.walk_list_contacts(walk_list_id);
create index if not exists wlc_contact_idx on public.walk_list_contacts(contact_id);

-- ============================================================
-- CANVASS RESULTS
-- ============================================================
create table if not exists public.canvass_results (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  walk_list_id uuid references public.walk_lists(id) on delete set null,
  user_id uuid not null references public.profiles(id),
  result text not null check (result in (
    'strong_support','lean_support','undecided','not_home','opposed',
    'wrong_address','moved','callback_requested'
  )),
  note text,
  follow_up_needed boolean not null default false,
  canvassed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists canvass_contact_idx on public.canvass_results(contact_id);
create index if not exists canvass_user_idx on public.canvass_results(user_id);
create index if not exists canvass_at_idx on public.canvass_results(canvassed_at desc);

-- ============================================================
-- DONORS (donation records)
-- ============================================================
create table if not exists public.donors (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  date date not null,
  source text not null default 'personal'
    check (source in ('online','event','mail','phone','personal','other')),
  notes text,
  recurring boolean not null default false,
  pledge boolean not null default false,
  pledge_status text check (pledge_status in ('pending','fulfilled','canceled')),
  thank_you_sent boolean not null default false,
  assigned_owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donors_contact_idx on public.donors(contact_id);
create index if not exists donors_date_idx on public.donors(date desc);

-- ============================================================
-- VOLUNTEERS
-- ============================================================
create table if not exists public.volunteers (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null unique references public.contacts(id) on delete cascade,
  availability text,
  skills text[] default '{}',
  preferred_tasks text[] default '{}',
  active boolean not null default true,
  assigned_neighborhoods text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- YARD SIGN REQUESTS
-- ============================================================
create table if not exists public.yard_sign_requests (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  request_date date not null default current_date,
  quantity integer not null default 1 check (quantity > 0),
  delivery_status text not null default 'requested'
    check (delivery_status in ('requested','scheduled','delivered','installed','replacement_needed','closed')),
  delivery_date date,
  installation_status boolean not null default false,
  installer_name text,
  photo_proof_url text,
  address text,
  neighborhood text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signs_contact_idx on public.yard_sign_requests(contact_id);
create index if not exists signs_status_idx on public.yard_sign_requests(delivery_status);

-- ============================================================
-- TASKS
-- ============================================================
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  task_type text not null default 'follow_up'
    check (task_type in ('follow_up','call','door_knock','email','meeting','data_entry','other')),
  linked_contact_id uuid references public.contacts(id) on delete set null,
  linked_donor_id uuid references public.donors(id) on delete set null,
  linked_event_id uuid,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid not null references public.profiles(id),
  due_date date,
  priority text not null default 'medium'
    check (priority in ('low','medium','high','urgent')),
  status text not null default 'open'
    check (status in ('open','in_progress','completed','canceled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_assigned_idx on public.tasks(assigned_to);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_due_idx on public.tasks(due_date);

-- ============================================================
-- EVENTS
-- ============================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  event_type text not null default 'other'
    check (event_type in ('fundraiser','coffee_meet','canvass_launch','volunteer_shift','community_event','sign_wave','other')),
  description text,
  location text,
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  organizer_id uuid references public.profiles(id) on delete set null,
  attendee_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_start_idx on public.events(start_datetime);

-- ============================================================
-- EVENT ATTENDEES
-- ============================================================
create table if not exists public.event_attendees (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  rsvp_status text not null default 'invited'
    check (rsvp_status in ('invited','confirmed','attended','no_show')),
  created_at timestamptz not null default now(),
  unique(event_id, contact_id)
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_created_idx on public.activity_log(created_at desc);
create index if not exists activity_entity_idx on public.activity_log(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_notes enable row level security;
alter table public.walk_lists enable row level security;
alter table public.walk_list_contacts enable row level security;
alter table public.canvass_results enable row level security;
alter table public.donors enable row level security;
alter table public.volunteers enable row level security;
alter table public.yard_sign_requests enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.activity_log enable row level security;

-- Helper function to get current user role
create or replace function public.get_my_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- PROFILES policies
create policy "Users can view all profiles" on public.profiles
  for select using (auth.uid() is not null);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can update any profile" on public.profiles
  for update using (public.get_my_role() = 'admin');

-- CONTACTS policies
create policy "Field+ can view contacts" on public.contacts
  for select using (public.get_my_role() in ('admin','manager','field'));

create policy "Field+ can insert contacts" on public.contacts
  for insert with check (public.get_my_role() in ('admin','manager','field'));

create policy "Field+ can update contacts" on public.contacts
  for update using (public.get_my_role() in ('admin','manager','field'));

create policy "Admin/manager can delete contacts" on public.contacts
  for delete using (public.get_my_role() in ('admin','manager'));

-- CONTACT NOTES policies
create policy "Field+ can view notes" on public.contact_notes
  for select using (public.get_my_role() in ('admin','manager','field'));

create policy "Field+ can add notes" on public.contact_notes
  for insert with check (public.get_my_role() in ('admin','manager','field') and auth.uid() = user_id);

-- WALK LISTS policies
create policy "Authenticated can view walk lists" on public.walk_lists
  for select using (
    public.get_my_role() in ('admin','manager','field')
    or (public.get_my_role() = 'volunteer' and assigned_user_id = auth.uid())
  );

create policy "Field+ can manage walk lists" on public.walk_lists
  for all using (public.get_my_role() in ('admin','manager','field'));

-- WALK LIST CONTACTS policies
create policy "Authenticated can view walk list contacts" on public.walk_list_contacts
  for select using (auth.uid() is not null);

create policy "Field+ can manage walk list contacts" on public.walk_list_contacts
  for all using (public.get_my_role() in ('admin','manager','field'));

-- CANVASS RESULTS policies
create policy "Authenticated can view canvass results" on public.canvass_results
  for select using (auth.uid() is not null);

create policy "Authenticated can insert canvass results" on public.canvass_results
  for insert with check (auth.uid() = user_id);

create policy "Admin/manager can update canvass results" on public.canvass_results
  for update using (public.get_my_role() in ('admin','manager'));

-- DONORS policies
create policy "Admin/manager can view donors" on public.donors
  for select using (public.get_my_role() in ('admin','manager'));

create policy "Admin/manager can manage donors" on public.donors
  for all using (public.get_my_role() in ('admin','manager'));

-- VOLUNTEERS policies
create policy "Field+ can view volunteers" on public.volunteers
  for select using (public.get_my_role() in ('admin','manager','field'));

create policy "Field+ can manage volunteers" on public.volunteers
  for all using (public.get_my_role() in ('admin','manager','field'));

-- YARD SIGNS policies
create policy "Field+ can view sign requests" on public.yard_sign_requests
  for select using (public.get_my_role() in ('admin','manager','field'));

create policy "Field+ can manage sign requests" on public.yard_sign_requests
  for all using (public.get_my_role() in ('admin','manager','field'));

-- TASKS policies
create policy "Volunteers see own tasks" on public.tasks
  for select using (
    public.get_my_role() in ('admin','manager','field')
    or (public.get_my_role() = 'volunteer' and assigned_to = auth.uid())
  );

create policy "Field+ can create tasks" on public.tasks
  for insert with check (public.get_my_role() in ('admin','manager','field') and auth.uid() = created_by);

create policy "Assigned user or field+ can update tasks" on public.tasks
  for update using (
    public.get_my_role() in ('admin','manager','field')
    or assigned_to = auth.uid()
  );

create policy "Admin/manager can delete tasks" on public.tasks
  for delete using (public.get_my_role() in ('admin','manager'));

-- EVENTS policies
create policy "All authenticated can view events" on public.events
  for select using (auth.uid() is not null);

create policy "Field+ can manage events" on public.events
  for all using (public.get_my_role() in ('admin','manager','field'));

-- EVENT ATTENDEES policies
create policy "All authenticated can view attendees" on public.event_attendees
  for select using (auth.uid() is not null);

create policy "Field+ can manage attendees" on public.event_attendees
  for all using (public.get_my_role() in ('admin','manager','field'));

-- ACTIVITY LOG policies
create policy "Authenticated can insert activity" on public.activity_log
  for insert with check (auth.uid() = user_id);

create policy "Admin/manager can view activity log" on public.activity_log
  for select using (public.get_my_role() in ('admin','manager'));
