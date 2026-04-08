-- ============================================================
-- PRIVILEGE VAULT AI — Seed Data (Hartley & Associates LLP)
-- Run this in Supabase SQL Editor after supabase-setup.sql
-- Login: admin@hartleyandassoc.com / PrivilegeVault2024!
-- ============================================================

DO $$
DECLARE
  firm_id TEXT := gen_random_uuid()::TEXT;
  office_ny TEXT := gen_random_uuid()::TEXT;
  office_la TEXT := gen_random_uuid()::TEXT;
  u_hartley TEXT := gen_random_uuid()::TEXT;
  u_chan TEXT := gen_random_uuid()::TEXT;
  u_reyes TEXT := gen_random_uuid()::TEXT;
  u_patel TEXT := gen_random_uuid()::TEXT;
  u_lee TEXT := gen_random_uuid()::TEXT;
  u_thompson TEXT := gen_random_uuid()::TEXT;
  u_intake TEXT := gen_random_uuid()::TEXT;
  u_billing TEXT := gen_random_uuid()::TEXT;
  c_nexovance TEXT := gen_random_uuid()::TEXT;
  c_alderton TEXT := gen_random_uuid()::TEXT;
  c_marchetti TEXT := gen_random_uuid()::TEXT;
  c_delmarco TEXT := gen_random_uuid()::TEXT;
  c_chen TEXT := gen_random_uuid()::TEXT;
  c_pinnacle TEXT := gen_random_uuid()::TEXT;
  c_moreau TEXT := gen_random_uuid()::TEXT;
  c_blackrock TEXT := gen_random_uuid()::TEXT;
  m1 TEXT := gen_random_uuid()::TEXT;
  m2 TEXT := gen_random_uuid()::TEXT;
  m3 TEXT := gen_random_uuid()::TEXT;
  m4 TEXT := gen_random_uuid()::TEXT;
  m5 TEXT := gen_random_uuid()::TEXT;
  m6 TEXT := gen_random_uuid()::TEXT;
  m7 TEXT := gen_random_uuid()::TEXT;
  m8 TEXT := gen_random_uuid()::TEXT;
  m9 TEXT := gen_random_uuid()::TEXT;
  m10 TEXT := gen_random_uuid()::TEXT;
  pw TEXT := '$2a$12$bGFhV7QRplZypJQseBZo3.0af.J4QYC93SntnYzs2KMsIOzelMCJq';
  now_ts TIMESTAMPTZ := NOW();
BEGIN

-- Firm
INSERT INTO "Firm" (id, name, slug, domain, address, city, state, "zipCode", phone, website, settings, "createdAt", "updatedAt")
VALUES (firm_id, 'Hartley & Associates LLP', 'hartley-associates', 'hartleyandassoc.com',
  '350 Park Avenue, 21st Floor', 'New York', 'NY', '10022',
  '+1 (212) 555-0100', 'https://hartleyandassoc.com', '{}', now_ts, now_ts);

-- Offices
INSERT INTO "Office" (id, "firmId", name, city, state, "isPrimary", "createdAt", "updatedAt")
VALUES (office_ny, firm_id, 'New York', 'New York', 'NY', TRUE, now_ts, now_ts);
INSERT INTO "Office" (id, "firmId", name, city, state, "isPrimary", "createdAt", "updatedAt")
VALUES (office_la, firm_id, 'Los Angeles', 'Los Angeles', 'CA', FALSE, now_ts, now_ts);

-- Users
INSERT INTO "User" (id, "firmId", "officeId", email, name, title, role, "barNumber", "passwordHash", "isActive", "isVerified", "createdAt", "updatedAt")
VALUES
  (u_hartley, firm_id, office_ny, 'admin@hartleyandassoc.com', 'Margaret Hartley', 'Managing Partner', 'MANAGING_PARTNER', 'NY-1234567', pw, TRUE, TRUE, now_ts, now_ts),
  (u_chan,     firm_id, office_ny, 'jchan@hartleyandassoc.com', 'Jonathan Chan', 'Partner', 'PARTNER', 'NY-2345678', pw, TRUE, TRUE, now_ts, now_ts),
  (u_reyes,   firm_id, office_ny, 'sreyes@hartleyandassoc.com', 'Sofia Reyes', 'Partner', 'PARTNER', 'NY-3456789', pw, TRUE, TRUE, now_ts, now_ts),
  (u_patel,   firm_id, office_ny, 'dpatel@hartleyandassoc.com', 'Dev Patel', 'Senior Associate', 'ASSOCIATE', 'NY-4567890', pw, TRUE, TRUE, now_ts, now_ts),
  (u_lee,     firm_id, office_la, 'alee@hartleyandassoc.com', 'Amy Lee', 'Associate', 'ASSOCIATE', 'CA-8765432', pw, TRUE, TRUE, now_ts, now_ts),
  (u_thompson,firm_id, office_ny, 'mthompson@hartleyandassoc.com', 'Marcus Thompson', 'Paralegal', 'PARALEGAL', NULL, pw, TRUE, TRUE, now_ts, now_ts),
  (u_intake,  firm_id, office_ny, 'intake@hartleyandassoc.com', 'Rachel Kim', 'Intake Coordinator', 'INTAKE_COORDINATOR', NULL, pw, TRUE, TRUE, now_ts, now_ts),
  (u_billing, firm_id, office_ny, 'billing@hartleyandassoc.com', 'Sandra Okonkwo', 'Billing Manager', 'BILLING_ADMIN', NULL, pw, TRUE, TRUE, now_ts, now_ts);

-- Clients
INSERT INTO "Client" (id, "firmId", "clientNumber", name, type, email, phone, "isActive", "createdAt", "updatedAt")
VALUES
  (c_nexovance, firm_id, 'C-0001', 'Nexovance Technologies, Inc.', 'ORGANIZATION', 'legal@nexovance.com', '+1 (415) 555-0201', TRUE, now_ts, now_ts),
  (c_alderton,  firm_id, 'C-0002', 'Alderton Capital Management',  'ORGANIZATION', 'legal@aldertoncp.com', NULL, TRUE, now_ts, now_ts),
  (c_marchetti, firm_id, 'C-0003', 'Robert J. Marchetti',          'INDIVIDUAL',   'rmarchetti@email.com', '+1 (212) 555-0303', TRUE, now_ts, now_ts),
  (c_delmarco,  firm_id, 'C-0004', 'Delmarco Real Estate Group',   'ORGANIZATION', NULL, NULL, TRUE, now_ts, now_ts),
  (c_chen,      firm_id, 'C-0005', 'Chen Family Trust',            'ORGANIZATION', NULL, NULL, TRUE, now_ts, now_ts),
  (c_pinnacle,  firm_id, 'C-0006', 'Pinnacle Healthcare Partners', 'ORGANIZATION', 'legal@pinnaclehp.com', NULL, TRUE, now_ts, now_ts),
  (c_moreau,    firm_id, 'C-0007', 'Vivienne Moreau',              'INDIVIDUAL',   NULL, NULL, TRUE, now_ts, now_ts),
  (c_blackrock, firm_id, 'C-0008', 'BlackRock Peninsula LLC',      'ORGANIZATION', NULL, NULL, TRUE, now_ts, now_ts);

-- Matters
INSERT INTO "Matter" (id, "firmId", "officeId", "clientId", "matterNumber", name, status, type, jurisdiction, "courtName", "caseNumber", "judgeAssigned", "riskLevel", "billingType", "billingRate", "isLegalHold", "createdAt", "updatedAt")
VALUES
  (m1,  firm_id, office_ny, c_nexovance, 'M-00001', 'Nexovance v. Vantara Systems — Patent Infringement',  'ACTIVE','LITIGATION',    'S.D.N.Y.',       'United States District Court, Southern District of New York','1:24-cv-04821','Hon. Sarah L. Chen','HIGH',    'HOURLY',    650,    FALSE, now_ts, now_ts),
  (m2,  firm_id, office_ny, c_alderton,  'M-00002', 'Alderton Capital — Fund Formation (Flagship IV)',     'ACTIVE','CORPORATE',     'Delaware',        NULL, NULL, NULL,'LOW',    'FLAT_FEE',  125000, FALSE, now_ts, now_ts),
  (m3,  firm_id, office_ny, c_marchetti, 'M-00003', 'Marchetti — Executive Employment Dispute',           'ACTIVE','EMPLOYMENT',    'New York',        NULL, NULL, NULL,'MEDIUM', 'HOURLY',    550,    FALSE, now_ts, now_ts),
  (m4,  firm_id, office_ny, c_delmarco,  'M-00004', 'Delmarco — 432 Park Ave Commercial Acquisition',    'ACTIVE','REAL_ESTATE',   'New York',        NULL, NULL, NULL,'MEDIUM', 'FLAT_FEE',  85000,  FALSE, now_ts, now_ts),
  (m5,  firm_id, office_ny, c_chen,      'M-00005', 'Chen Family Trust — Estate Plan & Trust Amendment',  'ACTIVE','ESTATE_PLANNING',NULL,             NULL, NULL, NULL,'LOW',    'HOURLY',    450,    FALSE, now_ts, now_ts),
  (m6,  firm_id, office_ny, c_pinnacle,  'M-00006', 'Pinnacle Healthcare — DOJ Subpoena Response',        'ACTIVE','REGULATORY',    'Federal',         NULL, NULL, NULL,'CRITICAL','HOURLY',  750,    TRUE,  now_ts, now_ts),
  (m7,  firm_id, office_la, c_moreau,    'M-00007', 'Moreau — Post-Nuptial Agreement',                   'ACTIVE','FAMILY_LAW',    'California',      NULL, NULL, NULL,'MEDIUM', 'HOURLY',    500,    FALSE, now_ts, now_ts),
  (m8,  firm_id, office_ny, c_blackrock, 'M-00008', 'BlackRock Peninsula — Zoning & Entitlement',        'ACTIVE','REAL_ESTATE',   'New York City',   NULL, NULL, NULL,'HIGH',   'HOURLY',    600,    FALSE, now_ts, now_ts),
  (m9,  firm_id, office_ny, c_nexovance, 'M-00009', 'Nexovance — Series C Securities Compliance',         'ACTIVE','CORPORATE',     'Federal',         NULL, NULL, NULL,'MEDIUM', 'HOURLY',    650,    FALSE, now_ts, now_ts),
  (m10, firm_id, office_ny, c_alderton,  'M-00010', 'Alderton — Class Action Defense (Investor Fraud)',  'ACTIVE','LITIGATION',    'S.D.N.Y.',        NULL,'1:24-cv-07213',NULL,'CRITICAL','HOURLY', 725,   FALSE, now_ts, now_ts);

-- Matter Parties
INSERT INTO "MatterParty" (id, "matterId", "userId", role, "isPrimary", "addedAt") VALUES
  (gen_random_uuid(), m1,  u_chan,     'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m1,  u_patel,   'ASSOCIATE',            FALSE, now_ts),
  (gen_random_uuid(), m2,  u_reyes,   'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m3,  u_chan,     'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m3,  u_lee,     'ASSOCIATE',            FALSE, now_ts),
  (gen_random_uuid(), m4,  u_reyes,   'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m5,  u_hartley, 'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m6,  u_hartley, 'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m6,  u_chan,    'BILLING_ATTORNEY',     FALSE, now_ts),
  (gen_random_uuid(), m6,  u_patel,   'ASSOCIATE',            FALSE, now_ts),
  (gen_random_uuid(), m7,  u_lee,     'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m8,  u_reyes,   'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m9,  u_chan,     'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m10, u_hartley, 'RESPONSIBLE_ATTORNEY', TRUE,  now_ts),
  (gen_random_uuid(), m10, u_reyes,   'PARTNER',              FALSE, now_ts),
  (gen_random_uuid(), m10, u_patel,   'ASSOCIATE',            FALSE, now_ts);

-- Deadlines
INSERT INTO "Deadline" (id, "firmId", "matterId", title, "dueAt", "deadlineType", priority, "isCompleted", "isEscalated", "isCalculated", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m1,  'Answer / Responsive Pleading Due',     now_ts + INTERVAL '12 days', 'FILING',    'URGENT',  FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  'Initial Disclosures Deadline',          now_ts + INTERVAL '28 days', 'DISCOVERY', 'HIGH',    FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  'Motion to Dismiss Filing Deadline',     now_ts + INTERVAL '45 days', 'FILING',    'HIGH',    FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  'DOJ Subpoena Response Deadline',        now_ts + INTERVAL '7 days',  'COURT',     'URGENT',  FALSE, TRUE,  FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  'Privilege Log Production',              now_ts + INTERVAL '21 days', 'DISCOVERY', 'HIGH',    FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, 'Opposition to Class Certification',     now_ts + INTERVAL '35 days', 'FILING',    'HIGH',    FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, 'Expert Witness Disclosure',             now_ts + INTERVAL '60 days', 'COURT',     'MEDIUM',  FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m4,  'Closing Documents Execution',           now_ts + INTERVAL '18 days', 'GENERAL',   'HIGH',    FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m3,  'EEOC Response Filing',                  now_ts + INTERVAL '14 days', 'FILING',    'URGENT',  FALSE, FALSE, FALSE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m8,  'Environmental Assessment Deadline',     now_ts + INTERVAL '42 days', 'GENERAL',   'MEDIUM',  FALSE, FALSE, FALSE, now_ts, now_ts);

-- Calendar Events
INSERT INTO "CalendarEvent" (id, "firmId", "matterId", "createdById", title, "eventType", "startAt", "allDay", "isRecurring", reminders, metadata, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m1,  u_chan,     'Rule 26(f) Conference',          'STATUS_CONFERENCE', now_ts + INTERVAL '8 days',  FALSE, FALSE, '[]', '{}', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  u_patel,   'Deposition of Dr. Alan Firth',   'DEPOSITION',        now_ts + INTERVAL '22 days', FALSE, FALSE, '[]', '{}', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  u_hartley, 'DOJ Interview — C-Suite',        'MEETING',           now_ts + INTERVAL '5 days',  FALSE, FALSE, '[]', '{}', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, u_hartley, 'Class Cert Hearing',             'HEARING',           now_ts + INTERVAL '90 days', FALSE, FALSE, '[]', '{}', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m3,  u_chan,     'Mediation Session',              'MEDIATION',         now_ts + INTERVAL '30 days', FALSE, FALSE, '[]', '{}', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m4,  u_reyes,   'Title Search Review Meeting',    'MEETING',           now_ts + INTERVAL '10 days', FALSE, FALSE, '[]', '{}', now_ts, now_ts);

-- Tasks
INSERT INTO "Task" (id, "firmId", "matterId", "createdById", "assigneeId", title, status, priority, "dueAt", position, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m1,  u_chan,     u_patel,    'Draft answer to complaint',                    'IN_PROGRESS','URGENT',  now_ts + INTERVAL '10 days', 0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  u_chan,     u_thompson, 'Collect and organize patent file history',     'TODO',       'HIGH',    now_ts + INTERVAL '15 days', 1, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  u_chan,     u_patel,    'Research prior art — Vantara patent portfolio','TODO',       'HIGH',    now_ts + INTERVAL '20 days', 2, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  u_hartley,  u_patel,   'Document collection and privilege review',     'IN_PROGRESS','URGENT',  now_ts + INTERVAL '5 days',  0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  u_hartley,  u_thompson,'Create privilege log — Batch 1',               'TODO',       'URGENT',  now_ts + INTERVAL '14 days', 1, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m2,  u_reyes,    u_lee,     'Draft Limited Partnership Agreement',          'IN_PROGRESS','HIGH',    now_ts + INTERVAL '25 days', 0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m4,  u_reyes,    u_reyes,   'Review title commitment',                      'TODO',       'MEDIUM',  now_ts + INTERVAL '12 days', 0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, u_hartley,  u_patel,   'Analyze class certification motion',           'TODO',       'HIGH',    now_ts + INTERVAL '20 days', 0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m3,  u_chan,     u_lee,     'EEOC position statement draft',                'IN_PROGRESS','URGENT',  now_ts + INTERVAL '12 days', 0, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m7,  u_lee,     u_lee,     'Draft post-nuptial agreement',                  'TODO',       'HIGH',    now_ts + INTERVAL '21 days', 0, now_ts, now_ts);

-- Time Entries
INSERT INTO "TimeEntry" (id, "firmId", "matterId", "userId", description, "hoursWorked", "ratePerHour", amount, status, "billingDate", "isBillable", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m1,  u_chan,    'Review complaint; conference with client re: allegations and strategy', 3.5, 650, 2275.00, 'SUBMITTED', now_ts - INTERVAL '2 days', TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  u_patel,  'Research validity of plaintiff patents — prior art search',             6.0, 450, 2700.00, 'SUBMITTED', now_ts - INTERVAL '1 day',  TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  u_hartley,'Initial strategy conference re: DOJ subpoena scope',                    2.0, 900, 1800.00, 'APPROVED',  now_ts - INTERVAL '5 days', TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  u_patel,  'Document collection — email review and triage',                        8.5, 450, 3825.00, 'SUBMITTED', now_ts - INTERVAL '3 days', TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m2,  u_reyes,  'Draft LP Agreement — initial markup and internal review',              5.5, 700, 3850.00, 'DRAFT',     now_ts - INTERVAL '1 day',  TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, u_hartley,'Analysis of class action complaint; strategy memo to client',           4.0, 900, 3600.00, 'APPROVED',  now_ts - INTERVAL '7 days', TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m3,  u_chan,   'Conference with client re: termination circumstances',                  1.5, 650, 975.00,  'DRAFT',     now_ts,                     TRUE, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m4,  u_reyes,  'Review purchase agreement and title commitment',                       3.0, 700, 2100.00, 'SUBMITTED', now_ts - INTERVAL '4 days', TRUE, now_ts, now_ts);

-- Invoices
INSERT INTO "Invoice" (id, "firmId", "matterId", "invoiceNumber", status, "issueDate", "dueDate", subtotal, total, "amountPaid", balance, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m6,  'INV-2024-0042', 'SENT',  now_ts - INTERVAL '30 days', now_ts,                     28500, 28500, 14250, 14250, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m10, 'INV-2024-0043', 'DRAFT', now_ts - INTERVAL '5 days',  now_ts + INTERVAL '25 days',18750, 18750, 0,     18750, now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  'INV-2024-0044', 'PAID',  now_ts - INTERVAL '60 days', now_ts - INTERVAL '30 days',12500, 12500, 12500, 0,     now_ts, now_ts);

-- Intake Leads
INSERT INTO "IntakeLead" (id, "firmId", "leadNumber", status, "prospectName", "prospectEmail", "matterType", urgency, source, notes, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, 'L-00001', 'NEW',           'James Holbrook',    'jholbrook@email.com',  'LITIGATION', 'HIGH',   'REFERRAL', 'Referred by Alderton. Potential securities fraud defense.', now_ts, now_ts),
  (gen_random_uuid(), firm_id, 'L-00002', 'CONFLICT_CHECK','Meridian Bio LLC',  'legal@meridianbio.com','CORPORATE',  'NORMAL', 'WEBSITE',  'Needs Series A counsel. FDA regulatory issues also.',       now_ts, now_ts),
  (gen_random_uuid(), firm_id, 'L-00003', 'APPROVED',      'Carlos Ramirez',    NULL,                   'EMPLOYMENT', 'URGENT', 'REFERRAL', 'Wrongful termination — statute running in 90 days.',         now_ts, now_ts),
  (gen_random_uuid(), firm_id, 'L-00004', 'SCREENING',     'Hargrove Properties',NULL,                  'REAL_ESTATE','NORMAL', 'WEBSITE',  NULL,                                                         now_ts, now_ts);

-- Audit Events
INSERT INTO "AuditEvent" (id, "firmId", "userId", "matterId", action, description, "ipAddress", metadata, "createdAt") VALUES
  (gen_random_uuid(), firm_id, u_hartley, NULL, 'LOGIN',           'User logged in',                                                   '10.0.1.50', '{}', now_ts - INTERVAL '1 day'),
  (gen_random_uuid(), firm_id, u_chan,    NULL, 'LOGIN',           'User logged in',                                                   '10.0.1.51', '{}', now_ts - INTERVAL '1 day'),
  (gen_random_uuid(), firm_id, u_patel,  m6,   'AI_QUERY',        'Research query: DOJ subpoena privilege scope',                     NULL,        '{}', now_ts - INTERVAL '2 days'),
  (gen_random_uuid(), firm_id, u_hartley,m6,   'MATTER_CREATED',  'Matter created: Pinnacle Healthcare — DOJ Subpoena Response',      NULL,        '{}', now_ts - INTERVAL '30 days'),
  (gen_random_uuid(), firm_id, u_chan,   m1,   'DOCUMENT_UPLOADED','Document uploaded: Complaint_NexovanceVantara.pdf',               NULL,        '{}', now_ts - INTERVAL '5 days'),
  (gen_random_uuid(), firm_id, u_patel,  m6,   'PRIVILEGE_FLAGGED','Document flagged for privilege review: Email_CEOCounsel.msg',     NULL,        '{}', now_ts - INTERVAL '3 days'),
  (gen_random_uuid(), firm_id, u_billing,NULL, 'INVOICE_GENERATED','Invoice generated: INV-2024-0044',                               NULL,        '{}', now_ts - INTERVAL '60 days'),
  (gen_random_uuid(), firm_id, u_intake, NULL, 'INTAKE_CREATED',  'Intake lead created: James Holbrook',                             NULL,        '{}', now_ts - INTERVAL '5 days');

-- Research Threads
INSERT INTO "ResearchThread" (id, "matterId", "userId", title, "isSaved", tags, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), m1,  u_patel,   'Prior art analysis — Vantara patent claims 1-12',           TRUE, ARRAY['patent','prior-art','litigation'], now_ts, now_ts),
  (gen_random_uuid(), m6,  u_hartley, 'Scope of attorney-client privilege under DOJ subpoena',     TRUE, ARRAY['privilege','DOJ','healthcare'],    now_ts, now_ts),
  (gen_random_uuid(), m10, u_reyes,   'Class action certification standards — securities fraud',   TRUE, ARRAY['class-action','securities'],       now_ts, now_ts);

-- AI Jobs
INSERT INTO "AIJob" (id, "firmId", "matterId", type, status, provider, model, input, "completedAt", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), firm_id, m6,  'PRIVILEGE_TAG', 'COMPLETE', 'ollama', 'llama3.1:70b',      '{}', now_ts - INTERVAL '1 day',  now_ts, now_ts),
  (gen_random_uuid(), firm_id, m1,  'SUMMARIZE',     'COMPLETE', 'ollama', 'llama3.1:70b',      '{}', now_ts - INTERVAL '2 days', now_ts, now_ts),
  (gen_random_uuid(), firm_id, m6,  'EMBED',         'COMPLETE', 'ollama', 'nomic-embed-text',  '{}', now_ts - INTERVAL '3 days', now_ts, now_ts);

-- Notifications
INSERT INTO "Notification" (id, "userId", title, body, type, link, "isRead", "createdAt") VALUES
  (gen_random_uuid(), u_hartley, 'Urgent deadline approaching',  'DOJ Subpoena Response due in 7 days — Pinnacle Healthcare matter', 'URGENT',          '/app/matters/' || m6 || '/overview', FALSE, now_ts),
  (gen_random_uuid(), u_chan,    'New intake lead assigned',      'James Holbrook intake requires conflict check review',             'ACTION_REQUIRED', '/app/intake',                         FALSE, now_ts),
  (gen_random_uuid(), u_patel,  'AI research complete',          'Privilege analysis for Pinnacle documents complete — 23 flagged',  'INFO',            NULL,                                  FALSE, now_ts);

END $$;
