-- Keith Gettmann for GA House District 51 — CRM Schema
-- Run this in Supabase > SQL Editor

-- Profiles (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'field' check (role in ('admin','manager','field','volunteer')),
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'field')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Contacts (voters)
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  full_name text generated always as (first_name || ' ' || last_name) stored,
  email text,
  phone text,
  address text,
  city text,
  state text default 'GA',
  zip text,
  precinct text,
  party text,
  support_status text default 'unknown' check (support_status in ('strong_support','lean_support','undecided','lean_oppose','strong_oppose','unknown')),
  voter_id text,
  age integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table contacts enable row level security;
create policy "Authenticated users can manage contacts" on contacts for all using (auth.role() = 'authenticated');

-- Contact notes
create table if not exists contact_notes (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts on delete cascade not null,
  user_id uuid references profiles on delete set null,
  note text not null,
  created_at timestamptz default now()
);
alter table contact_notes enable row level security;
create policy "Authenticated users can manage notes" on contact_notes for all using (auth.role() = 'authenticated');

-- Volunteers
create table if not exists volunteers (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  skills text[],
  availability text,
  active boolean default true,
  notes text,
  created_at timestamptz default now()
);
alter table volunteers enable row level security;
create policy "Authenticated users can manage volunteers" on volunteers for all using (auth.role() = 'authenticated');

-- Donors
create table if not exists donors (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  amount numeric(10,2) not null default 0,
  donation_date date,
  method text,
  notes text,
  created_at timestamptz default now()
);
alter table donors enable row level security;
create policy "Authenticated users can manage donors" on donors for all using (auth.role() = 'authenticated');

-- Yard sign requests
create table if not exists yard_sign_requests (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts on delete set null,
  address text not null,
  city text,
  zip text,
  quantity integer default 1,
  delivery_status text default 'pending' check (delivery_status in ('pending','assigned','delivered','installed','removed')),
  assigned_to uuid references profiles on delete set null,
  notes text,
  requested_at timestamptz default now(),
  delivered_at timestamptz,
  created_at timestamptz default now()
);
alter table yard_sign_requests enable row level security;
create policy "Authenticated users can manage yard signs" on yard_sign_requests for all using (auth.role() = 'authenticated');

-- Walk lists
create table if not exists walk_lists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  precinct text,
  assigned_to uuid references profiles on delete set null,
  status text default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz default now()
);
alter table walk_lists enable row level security;
create policy "Authenticated users can manage walk lists" on walk_lists for all using (auth.role() = 'authenticated');

-- Canvass results
create table if not exists canvass_results (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts on delete cascade not null,
  walk_list_id uuid references walk_lists on delete set null,
  user_id uuid references profiles on delete set null,
  result text not null check (result in ('strong_support','lean_support','undecided','lean_oppose','strong_oppose','not_home','moved','refused')),
  note text,
  follow_up_needed boolean default false,
  canvassed_at timestamptz default now()
);
alter table canvass_results enable row level security;
create policy "Authenticated users can manage canvass results" on canvass_results for all using (auth.role() = 'authenticated');

-- Tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  assigned_to uuid references profiles on delete set null,
  status text default 'open' check (status in ('open','in_progress','completed','cancelled')),
  priority text default 'medium' check (priority in ('low','medium','high','urgent')),
  due_date timestamptz,
  created_by uuid references profiles on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table tasks enable row level security;
create policy "Authenticated users can manage tasks" on tasks for all using (auth.role() = 'authenticated');

-- Events
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text,
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  event_type text default 'other' check (event_type in ('canvassing','phone_bank','fundraiser','rally','meeting','other')),
  created_by uuid references profiles on delete set null,
  created_at timestamptz default now()
);
alter table events enable row level security;
create policy "Authenticated users can manage events" on events for all using (auth.role() = 'authenticated');

-- Activity log
create table if not exists activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz default now()
);
alter table activity_log enable row level security;
create policy "Authenticated users can read activity" on activity_log for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert activity" on activity_log for insert with check (auth.role() = 'authenticated');
