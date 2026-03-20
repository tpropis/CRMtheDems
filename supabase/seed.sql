-- ============================================================
-- Campaign Command Center — Seed Data
-- Run AFTER schema.sql
-- Creates demo users + realistic campaign data
-- ============================================================

-- NOTE: Insert demo user profiles (run after creating users in Auth)
-- You must first create users via Supabase Auth dashboard or API,
-- then these UUIDs will match. These are placeholder UUIDs for reference.

-- For quick demo setup, create these users in Supabase Auth:
--   admin@campaign.local  / Campaign2024!
--   manager@campaign.local / Campaign2024!
--   field@campaign.local   / Campaign2024!
--   volunteer@campaign.local / Campaign2024!
-- Then the trigger will auto-create their profiles.
-- Run the UPDATE statements below to set roles correctly.

-- If you have known user IDs, replace these UUIDs:
DO $$
DECLARE
  admin_id uuid;
  manager_id uuid;
  field_id uuid;
  vol_id uuid;
BEGIN
  -- Try to get existing users by email
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@campaign.local' LIMIT 1;
  SELECT id INTO manager_id FROM auth.users WHERE email = 'manager@campaign.local' LIMIT 1;
  SELECT id INTO field_id FROM auth.users WHERE email = 'field@campaign.local' LIMIT 1;
  SELECT id INTO vol_id FROM auth.users WHERE email = 'volunteer@campaign.local' LIMIT 1;

  -- Update roles if users exist
  IF admin_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'admin', full_name = 'Alex Rivera' WHERE id = admin_id;
  END IF;
  IF manager_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'manager', full_name = 'Jordan Mitchell' WHERE id = manager_id;
  END IF;
  IF field_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'field', full_name = 'Sam Torres' WHERE id = field_id;
  END IF;
  IF vol_id IS NOT NULL THEN
    UPDATE public.profiles SET role = 'volunteer', full_name = 'Casey Nguyen' WHERE id = vol_id;
  END IF;
END $$;

-- ============================================================
-- CONTACTS (realistic local campaign data)
-- ============================================================
insert into public.contacts (first_name, last_name, phone, email, address, city, state, zip, precinct, neighborhood, support_status, contact_type, preferred_contact_method, issues, notes, next_follow_up) values
('Margaret', 'Chen', '603-555-0142', 'mchen@gmail.com', '14 Elm Street', 'Maplewood', 'NH', '03101', 'Precinct 3', 'Elm Hill', 'strong_support', 'voter', 'email', ARRAY['education','healthcare'], 'Very enthusiastic supporter. Offered to host a coffee event.', current_date + 7),
('Robert', 'Okafor', '603-555-0287', 'rokafor@outlook.com', '87 Birch Lane', 'Maplewood', 'NH', '03101', 'Precinct 3', 'Birchwood', 'lean_support', 'voter', 'phone', ARRAY['taxes','roads'], 'Concerned about property taxes. Lean our way but wants to see the budget plan.', current_date + 14),
('Patricia', 'Delgado', '603-555-0341', null, '231 Maple Ave', 'Maplewood', 'NH', '03101', 'Precinct 1', 'Downtown', 'undecided', 'voter', 'door', ARRAY['parks','youth_programs'], 'Talked at door. Undecided, cares about parks and youth programs.', current_date + 3),
('James', 'Whitmore', '603-555-0198', 'jwhitmore@gmail.com', '5 Oak Court', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Oak Grove', 'strong_support', 'donor', 'phone', ARRAY['business','downtown'], 'Business owner downtown. Major supporter and recurring donor.', null),
('Linda', 'Park', '603-555-0453', 'lpark@yahoo.com', '622 Pine Street', 'Maplewood', 'NH', '03101', 'Precinct 1', 'Pine District', 'lean_support', 'voter', 'text', ARRAY['schools','libraries'], 'School librarian. Supportive, wants to see library funding plan.', current_date + 10),
('Thomas', 'Bergman', '603-555-0512', null, '41 Cedar Road', 'Maplewood', 'NH', '03103', 'Precinct 4', 'Cedar Heights', 'lean_oppose', 'voter', 'door', ARRAY['taxes'], 'Skeptical on spending. Not hostile, just fiscally conservative.', null),
('Susan', 'Kowalski', '603-555-0674', 'skowalski@gmail.com', '188 Walnut Drive', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Walnut Acres', 'undecided', 'voter', 'email', ARRAY['healthcare','seniors'], 'Retired nurse. Cares about senior services.', current_date + 5),
('David', 'Morales', '603-555-0789', 'dmorales@gmail.com', '73 Spruce Way', 'Maplewood', 'NH', '03101', 'Precinct 3', 'Elm Hill', 'strong_support', 'volunteer', 'phone', ARRAY['environment','parks'], 'Very active in local environmental group. Top volunteer.', null),
('Jennifer', 'Walsh', '603-555-0832', 'jwalsh@gmail.com', '344 Poplar Blvd', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Birchwood', 'strong_support', 'supporter', 'email', ARRAY['education','childcare'], 'PTA president at Lincoln Elementary.', null),
('Michael', 'Patel', '603-555-0915', 'mpatel@gmail.com', '29 Hickory Lane', 'Maplewood', 'NH', '03103', 'Precinct 4', 'North End', 'lean_support', 'voter', 'text', ARRAY['roads','transit'], 'Works in construction. Interested in infrastructure work.', current_date + 21),
('Karen', 'Thompson', '603-555-1021', null, '56 Ash Street', 'Maplewood', 'NH', '03101', 'Precinct 1', 'Downtown', 'not_contacted', 'voter', null, '{}', null, null),
('William', 'Hernandez', '603-555-1134', 'whernandez@gmail.com', '112 Sycamore Ave', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Walnut Acres', 'undecided', 'voter', 'phone', ARRAY['public_safety'], 'Retired police officer. Undecided, cares about public safety staffing.', current_date + 4),
('Barbara', 'Kim', '603-555-1247', 'bkim@outlook.com', '689 Juniper Ct', 'Maplewood', 'NH', '03103', 'Precinct 4', 'Cedar Heights', 'strong_support', 'donor', 'email', ARRAY['arts','culture'], 'Active in local arts community. Donated at last fundraiser.', null),
('Richard', 'Johnson', '603-555-1358', null, '15 Magnolia Rd', 'Maplewood', 'NH', '03101', 'Precinct 1', 'Pine District', 'lean_oppose', 'voter', 'door', ARRAY['taxes'], 'Longtime resident, anti-tax lean. Not hostile at door.', null),
('Nancy', 'Flores', '603-555-1469', 'nflores@gmail.com', '247 Willow Terrace', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Oak Grove', 'strong_support', 'volunteer', 'phone', ARRAY['immigration','community'], 'Community organizer. Bilingual (Spanish/English).', null),
('Charles', 'Wilson', '603-555-1572', 'cwilson@gmail.com', '390 Chestnut Street', 'Maplewood', 'NH', '03103', 'Precinct 4', 'North End', 'not_contacted', 'voter', null, '{}', null, null),
('Dorothy', 'Lee', '603-555-1683', 'dlee@yahoo.com', '58 Cottonwood Dr', 'Maplewood', 'NH', '03101', 'Precinct 3', 'Elm Hill', 'lean_support', 'voter', 'email', ARRAY['education','taxes'], 'Elementary school teacher. Supportive on education funding.', current_date + 8),
('Joseph', 'Martinez', '603-555-1794', null, '176 Redwood Blvd', 'Maplewood', 'NH', '03102', 'Precinct 2', 'Birchwood', 'undecided', 'voter', 'door', ARRAY['jobs'], 'Contractor, laid off recently. Interested in local job programs.', current_date + 2),
('Helen', 'Anderson', '603-555-1905', 'handerson@gmail.com', '434 Bamboo Lane', 'Maplewood', 'NH', '03103', 'Precinct 4', 'Cedar Heights', 'strong_support', 'influencer', 'email', ARRAY['seniors','healthcare'], 'Writes for local newspaper. Very friendly.', null),
('Daniel', 'Taylor', '603-555-2016', 'dtaylor@gmail.com', '91 Cypress Way', 'Maplewood', 'NH', '03101', 'Precinct 1', 'Downtown', 'lean_support', 'business_owner', 'phone', ARRAY['downtown','business'], 'Owns the coffee shop on Main St. Hosted our last event.', null);

-- ============================================================
-- DONORS
-- ============================================================
insert into public.donors (contact_id, amount, date, source, notes, recurring, thank_you_sent)
select id, 500.00, current_date - 45, 'personal', 'Initial donation at kick-off event', false, true
from public.contacts where email = 'jwhitmore@gmail.com' limit 1;

insert into public.donors (contact_id, amount, date, source, notes, recurring, thank_you_sent)
select id, 250.00, current_date - 30, 'event', 'Donated at April fundraiser', false, true
from public.contacts where email = 'bkim@outlook.com' limit 1;

insert into public.donors (contact_id, amount, date, source, notes, recurring, thank_you_sent)
select id, 100.00, current_date - 20, 'online', 'Online contribution', true, false
from public.contacts where email = 'mchen@gmail.com' limit 1;

insert into public.donors (contact_id, amount, date, source, notes, recurring, thank_you_sent)
select id, 75.00, current_date - 15, 'personal', 'Handed check at canvassing event', false, false
from public.contacts where email = 'dtaylor@gmail.com' limit 1;

insert into public.donors (contact_id, amount, date, source, notes, recurring, thank_you_sent)
select id, 200.00, current_date - 10, 'event', 'Coffee meet donation', false, false
from public.contacts where email = 'lpark@yahoo.com' limit 1;

insert into public.donors (contact_id, amount, date, source, notes, pledge, pledge_status, thank_you_sent)
select id, 1000.00, current_date + 30, 'personal', 'Pledged for the door-to-door push', true, 'pending', false
from public.contacts where email = 'jwhitmore@gmail.com' limit 1;

-- ============================================================
-- VOLUNTEERS
-- ============================================================
insert into public.volunteers (contact_id, availability, skills, preferred_tasks, active, assigned_neighborhoods)
select id, 'Weekends and Tuesday evenings', ARRAY['Canvassing','Phone Banking','Data Entry'], ARRAY['Canvassing','Events'], true, ARRAY['Elm Hill','Birchwood']
from public.contacts where email = 'dmorales@gmail.com' limit 1;

insert into public.volunteers (contact_id, availability, skills, preferred_tasks, active, assigned_neighborhoods)
select id, 'Saturdays all day', ARRAY['Canvassing','Event Setup','Social Media'], ARRAY['Canvassing','Sign Drops'], true, ARRAY['Oak Grove','Walnut Acres']
from public.contacts where email = 'nflores@gmail.com' limit 1;

insert into public.volunteers (contact_id, availability, skills, preferred_tasks, active, assigned_neighborhoods)
select id, 'Evenings after 6pm', ARRAY['Data Entry','Phone Banking'], ARRAY['Phone Banking','Data Entry'], true, ARRAY['Pine District','Downtown']
from public.contacts where email = 'jwalsh@gmail.com' limit 1;

-- ============================================================
-- WALK LISTS
-- ============================================================
do $$
declare
  wl1 uuid := uuid_generate_v4();
  wl2 uuid := uuid_generate_v4();
  admin_profile uuid;
begin
  select id into admin_profile from public.profiles limit 1;

  insert into public.walk_lists (id, name, description, neighborhood, created_by, active)
  values
    (wl1, 'Precinct 3 — Elm Hill North', 'Priority doors in Elm Hill north block', 'Elm Hill', admin_profile, true),
    (wl2, 'Birchwood Weekend Push', 'Weekend canvass targeting undecideds', 'Birchwood', admin_profile, true);

  -- Add contacts to walk lists
  insert into public.walk_list_contacts (walk_list_id, contact_id, order_index)
  select wl1, id, row_number() over () - 1
  from public.contacts where neighborhood = 'Elm Hill' limit 5;

  insert into public.walk_list_contacts (walk_list_id, contact_id, order_index)
  select wl2, id, row_number() over () - 1
  from public.contacts where neighborhood = 'Birchwood' limit 5;
end $$;

-- ============================================================
-- CANVASS RESULTS
-- ============================================================
do $$
declare
  contact_rec record;
  results text[] := ARRAY['strong_support','lean_support','undecided','not_home','lean_support','strong_support','callback_requested','not_home'];
  i int := 1;
  profile_id uuid;
begin
  select id into profile_id from public.profiles limit 1;

  for contact_rec in select id from public.contacts limit 8 loop
    insert into public.canvass_results (contact_id, user_id, result, note, follow_up_needed, canvassed_at)
    values (
      contact_rec.id,
      profile_id,
      results[i],
      case when results[i] = 'callback_requested' then 'Please call back Saturday morning' else null end,
      results[i] = 'callback_requested',
      now() - (interval '1 hour' * (i * 3))
    );
    i := i + 1;
  end loop;
end $$;

-- ============================================================
-- YARD SIGN REQUESTS
-- ============================================================
insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, neighborhood, address, notes)
select id, current_date - 20, 2, 'installed', neighborhood, address, 'Both signs installed front yard'
from public.contacts where email = 'mchen@gmail.com' limit 1;

insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, neighborhood, address)
select id, current_date - 14, 1, 'delivered', neighborhood, address
from public.contacts where email = 'jwalsh@gmail.com' limit 1;

insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, neighborhood, address)
select id, current_date - 7, 2, 'scheduled', neighborhood, address
from public.contacts where email = 'lpark@yahoo.com' limit 1;

insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, neighborhood, address)
select id, current_date - 3, 1, 'requested', neighborhood, address
from public.contacts where email = 'skowalski@gmail.com' limit 1;

insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, neighborhood, address)
select id, current_date - 3, 3, 'requested', neighborhood, address
from public.contacts where email = 'dtaylor@gmail.com' limit 1;

insert into public.yard_sign_requests (contact_id, request_date, quantity, delivery_status, delivery_date, installation_status, neighborhood, address)
select id, current_date - 10, 1, 'installed', current_date - 8, true, neighborhood, address
from public.contacts where email = 'jwhitmore@gmail.com' limit 1;

-- ============================================================
-- TASKS
-- ============================================================
do $$
declare
  admin_profile uuid;
  contact1 uuid;
  contact2 uuid;
  contact3 uuid;
begin
  select id into admin_profile from public.profiles limit 1;
  select id into contact1 from public.contacts where email = 'rokafor@outlook.com' limit 1;
  select id into contact2 from public.contacts where email = 'skowalski@gmail.com' limit 1;
  select id into contact3 from public.contacts where email = 'whernandez@gmail.com' limit 1;

  insert into public.tasks (title, description, task_type, linked_contact_id, assigned_to, created_by, due_date, priority, status)
  values
    ('Follow up with Robert Okafor re: budget plan', 'Send over the budget summary PDF and answer tax questions', 'follow_up', contact1, admin_profile, admin_profile, current_date + 3, 'high', 'open'),
    ('Call Susan Kowalski — senior services', 'She wants to discuss senior center expansion. Schedule call.', 'call', contact2, admin_profile, admin_profile, current_date + 1, 'medium', 'open'),
    ('Call back William Hernandez — public safety', 'Callback requested during canvassing', 'call', contact3, admin_profile, admin_profile, current_date - 2, 'high', 'open'),
    ('Schedule fundraiser for end of month', 'Coordinate venue, invites, and volunteer logistics', 'meeting', null, admin_profile, admin_profile, current_date + 14, 'high', 'in_progress'),
    ('Data entry: upload precinct 1 walk results', 'Enter paper walk results from Saturday', 'data_entry', null, admin_profile, admin_profile, current_date + 2, 'medium', 'open'),
    ('Send thank-you notes to recent donors', 'Linda Park, Daniel Taylor, and Susan Kowalski need TY letters', 'follow_up', null, admin_profile, admin_profile, current_date + 1, 'high', 'open'),
    ('Print yard sign delivery route sheet', '3 scheduled deliveries this weekend', 'other', null, admin_profile, admin_profile, current_date + 4, 'low', 'open'),
    ('Phone bank prep — call script review', 'Finalize script for Tuesday evening phone bank', 'call', null, admin_profile, admin_profile, current_date - 1, 'urgent', 'open');
end $$;

-- ============================================================
-- EVENTS
-- ============================================================
do $$
declare
  admin_profile uuid;
begin
  select id into admin_profile from public.profiles limit 1;

  insert into public.events (title, event_type, description, location, start_datetime, end_datetime, organizer_id, notes)
  values
    ('Spring Fundraiser Dinner', 'fundraiser', 'Annual spring fundraising dinner with supporters and major donors', 'The Maplewood Grange Hall, 120 Main St', now() + interval '10 days', now() + interval '10 days 3 hours', admin_profile, 'Ticket price $75pp. Need 4 volunteers for setup.'),
    ('Precinct 3 Canvass Launch', 'canvass_launch', 'Kick off our Elm Hill and Birchwood canvassing push', 'Elm Hill Community Center', now() + interval '5 days', now() + interval '5 days 4 hours', admin_profile, 'Bring walk lists and lit packets. Meet at 10am.'),
    ('Coffee with the Candidate — Pine District', 'coffee_meet', 'Informal meet-and-greet for neighbors in Pine District', '344 Poplar Blvd (Jennifer Walsh''s home)', now() + interval '8 days', now() + interval '8 days 2 hours', admin_profile, 'Limit 20 attendees. RSVPs required.'),
    ('Volunteer Training Session', 'volunteer_shift', 'Onboarding session for new campaign volunteers', 'Campaign HQ, 55 Water Street Suite 3', now() + interval '3 days', now() + interval '3 days 2 hours', admin_profile, 'Bring photo ID. Training materials provided.'),
    ('Main Street Sign Wave', 'sign_wave', 'High-visibility sign wave on Main Street during afternoon rush hour', 'Main Street & Oak Ave intersection', now() + interval '6 days', now() + interval '6 days 1 hour', admin_profile, 'Bring signs and enthusiasm!'),
    ('Maplewood Farmers Market Booth', 'community_event', 'Campaign booth at the Saturday farmers market', 'Maplewood Town Square', now() + interval '9 days', now() + interval '9 days 4 hours', admin_profile, 'Need 2 volunteers. Bring lit and donation box.'),
    ('April Canvass — Precinct 2', 'canvass_launch', 'Door-knock blitz in Walnut Acres and Oak Grove', 'Oak Grove Park Parking Lot', now() - interval '7 days', now() - interval '7 days' + interval '5 hours', admin_profile, 'Completed. 87 doors knocked, 62 contacts made.');
end $$;

-- ============================================================
-- ACTIVITY LOG (sample entries)
-- ============================================================
do $$
declare
  admin_profile uuid;
  contact1 uuid;
begin
  select id into admin_profile from public.profiles limit 1;
  select id into contact1 from public.contacts limit 1;

  insert into public.activity_log (user_id, action, entity_type, entity_id, details)
  values
    (admin_profile, 'created_contact', 'contact', contact1::text, '{"name": "Margaret Chen"}'::jsonb),
    (admin_profile, 'updated_support_status', 'contact', contact1::text, '{"status": "strong_support"}'::jsonb),
    (admin_profile, 'created_task', 'task', uuid_generate_v4()::text, '{"title": "Follow up with donor"}'::jsonb),
    (admin_profile, 'logged_canvass_result', 'contact', contact1::text, '{"result": "strong_support"}'::jsonb);
end $$;
