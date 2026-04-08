import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Privilege Vault AI...')

  // ── Firm ─────────────────────────────────────────────────
  const firm = await db.firm.upsert({
    where: { slug: 'hartley-associates' },
    update: {},
    create: {
      name: 'Hartley & Associates LLP',
      slug: 'hartley-associates',
      domain: 'hartleyandassoc.com',
      address: '350 Park Avenue, 21st Floor',
      city: 'New York',
      state: 'NY',
      zipCode: '10022',
      phone: '+1 (212) 555-0100',
      website: 'https://hartleyandassoc.com',
    },
  })

  const officeNY = await db.office.upsert({
    where: { id: 'office-ny' },
    update: {},
    create: { id: 'office-ny', firmId: firm.id, name: 'New York', city: 'New York', state: 'NY', isPrimary: true },
  })

  const officeLA = await db.office.upsert({
    where: { id: 'office-la' },
    update: {},
    create: { id: 'office-la', firmId: firm.id, name: 'Los Angeles', city: 'Los Angeles', state: 'CA' },
  })

  const passwordHash = await bcrypt.hash('PrivilegeVault2024!', 12)

  // ── Users ─────────────────────────────────────────────────
  const users = await Promise.all([
    db.user.upsert({
      where: { email: 'admin@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'admin@hartleyandassoc.com',
        name: 'Margaret Hartley', title: 'Managing Partner',
        role: 'MANAGING_PARTNER', passwordHash, isActive: true, isVerified: true,
        barNumber: 'NY-1234567',
      },
    }),
    db.user.upsert({
      where: { email: 'jchan@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'jchan@hartleyandassoc.com',
        name: 'Jonathan Chan', title: 'Partner',
        role: 'PARTNER', passwordHash, isActive: true, isVerified: true,
        barNumber: 'NY-2345678',
      },
    }),
    db.user.upsert({
      where: { email: 'sreyes@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'sreyes@hartleyandassoc.com',
        name: 'Sofia Reyes', title: 'Partner',
        role: 'PARTNER', passwordHash, isActive: true, isVerified: true,
        barNumber: 'NY-3456789',
      },
    }),
    db.user.upsert({
      where: { email: 'dpatel@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'dpatel@hartleyandassoc.com',
        name: 'Dev Patel', title: 'Senior Associate',
        role: 'ASSOCIATE', passwordHash, isActive: true, isVerified: true,
        barNumber: 'NY-4567890',
      },
    }),
    db.user.upsert({
      where: { email: 'alee@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeLA.id,
        email: 'alee@hartleyandassoc.com',
        name: 'Amy Lee', title: 'Associate',
        role: 'ASSOCIATE', passwordHash, isActive: true, isVerified: true,
        barNumber: 'CA-8765432',
      },
    }),
    db.user.upsert({
      where: { email: 'mthompson@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'mthompson@hartleyandassoc.com',
        name: 'Marcus Thompson', title: 'Paralegal',
        role: 'PARALEGAL', passwordHash, isActive: true, isVerified: true,
      },
    }),
    db.user.upsert({
      where: { email: 'intake@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'intake@hartleyandassoc.com',
        name: 'Rachel Kim', title: 'Intake Coordinator',
        role: 'INTAKE_COORDINATOR', passwordHash, isActive: true, isVerified: true,
      },
    }),
    db.user.upsert({
      where: { email: 'billing@hartleyandassoc.com' },
      update: {},
      create: {
        firmId: firm.id, officeId: officeNY.id,
        email: 'billing@hartleyandassoc.com',
        name: 'Sandra Okonkwo', title: 'Billing Manager',
        role: 'BILLING_ADMIN', passwordHash, isActive: true, isVerified: true,
      },
    }),
  ])

  const [hartley, chan, reyes, patel, lee, thompson, intake, billing] = users
  console.log('✅ Users created')

  // ── Clients ───────────────────────────────────────────────
  const clients = await Promise.all([
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0001' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0001', name: 'Nexovance Technologies, Inc.', type: 'ORGANIZATION', email: 'legal@nexovance.com', phone: '+1 (415) 555-0201', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0002' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0002', name: 'Alderton Capital Management', type: 'ORGANIZATION', email: 'legal@aldertoncp.com', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0003' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0003', name: 'Robert J. Marchetti', type: 'INDIVIDUAL', email: 'rmarchetti@email.com', phone: '+1 (212) 555-0303', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0004' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0004', name: 'Delmarco Real Estate Group', type: 'ORGANIZATION', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0005' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0005', name: 'Chen Family Trust', type: 'ORGANIZATION', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0006' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0006', name: 'Pinnacle Healthcare Partners', type: 'ORGANIZATION', email: 'legal@pinnaclehp.com', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0007' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0007', name: 'Vivienne Moreau', type: 'INDIVIDUAL', isActive: true },
    }),
    db.client.upsert({
      where: { firmId_clientNumber: { firmId: firm.id, clientNumber: 'C-0008' } },
      update: {},
      create: { firmId: firm.id, clientNumber: 'C-0008', name: 'BlackRock Peninsula LLC', type: 'ORGANIZATION', isActive: true },
    }),
  ])

  const [nexovance, alderton, marchetti, delmarco, chenTrust, pinnacle, moreau, blackrock] = clients
  console.log('✅ Clients created')

  // ── Matters ───────────────────────────────────────────────
  const matterDefs = [
    {
      id: 'matter-001',
      firmId: firm.id, officeId: officeNY.id,
      clientId: nexovance.id, matterNumber: 'M-00001',
      name: 'Nexovance v. Vantara Systems — Patent Infringement',
      type: 'LITIGATION' as const, status: 'ACTIVE' as const,
      jurisdiction: 'S.D.N.Y.', courtName: 'United States District Court, Southern District of New York',
      caseNumber: '1:24-cv-04821', judgeAssigned: 'Hon. Sarah L. Chen',
      riskLevel: 'HIGH', billingType: 'HOURLY', billingRate: 650,
    },
    {
      id: 'matter-002',
      firmId: firm.id, officeId: officeNY.id,
      clientId: alderton.id, matterNumber: 'M-00002',
      name: 'Alderton Capital — Fund Formation (Flagship IV)',
      type: 'CORPORATE' as const, status: 'ACTIVE' as const,
      jurisdiction: 'Delaware', riskLevel: 'LOW',
      billingType: 'FLAT_FEE' as const, billingRate: 125000,
    },
    {
      id: 'matter-003',
      firmId: firm.id, officeId: officeNY.id,
      clientId: marchetti.id, matterNumber: 'M-00003',
      name: 'Marchetti — Executive Employment Dispute',
      type: 'EMPLOYMENT' as const, status: 'ACTIVE' as const,
      jurisdiction: 'New York', riskLevel: 'MEDIUM',
      billingType: 'HOURLY', billingRate: 550,
    },
    {
      id: 'matter-004',
      firmId: firm.id, officeId: officeNY.id,
      clientId: delmarco.id, matterNumber: 'M-00004',
      name: 'Delmarco — 432 Park Ave Commercial Acquisition',
      type: 'REAL_ESTATE' as const, status: 'ACTIVE' as const,
      jurisdiction: 'New York', riskLevel: 'MEDIUM',
      billingType: 'FLAT_FEE' as const, billingRate: 85000,
    },
    {
      id: 'matter-005',
      firmId: firm.id, officeId: officeNY.id,
      clientId: chenTrust.id, matterNumber: 'M-00005',
      name: 'Chen Family Trust — Estate Plan & Trust Amendment',
      type: 'ESTATE_PLANNING' as const, status: 'ACTIVE' as const,
      riskLevel: 'LOW', billingType: 'HOURLY', billingRate: 450,
    },
    {
      id: 'matter-006',
      firmId: firm.id, officeId: officeNY.id,
      clientId: pinnacle.id, matterNumber: 'M-00006',
      name: 'Pinnacle Healthcare — DOJ Subpoena Response',
      type: 'REGULATORY' as const, status: 'ACTIVE' as const,
      jurisdiction: 'Federal', riskLevel: 'CRITICAL',
      billingType: 'HOURLY', billingRate: 750,
      isLegalHold: true,
    },
    {
      id: 'matter-007',
      firmId: firm.id, officeId: officeLA.id,
      clientId: moreau.id, matterNumber: 'M-00007',
      name: 'Moreau — Post-Nuptial Agreement',
      type: 'FAMILY_LAW' as const, status: 'ACTIVE' as const,
      jurisdiction: 'California', riskLevel: 'MEDIUM',
      billingType: 'HOURLY', billingRate: 500,
    },
    {
      id: 'matter-008',
      firmId: firm.id, officeId: officeNY.id,
      clientId: blackrock.id, matterNumber: 'M-00008',
      name: 'BlackRock Peninsula — Zoning & Entitlement',
      type: 'REAL_ESTATE' as const, status: 'ACTIVE' as const,
      jurisdiction: 'New York City', riskLevel: 'HIGH',
      billingType: 'HOURLY', billingRate: 600,
    },
    {
      id: 'matter-009',
      firmId: firm.id, officeId: officeNY.id,
      clientId: nexovance.id, matterNumber: 'M-00009',
      name: 'Nexovance — Series C Securities Compliance',
      type: 'CORPORATE' as const, status: 'ACTIVE' as const,
      jurisdiction: 'Federal', riskLevel: 'MEDIUM',
      billingType: 'HOURLY', billingRate: 650,
    },
    {
      id: 'matter-010',
      firmId: firm.id, officeId: officeNY.id,
      clientId: alderton.id, matterNumber: 'M-00010',
      name: 'Alderton — Class Action Defense (Investor Fraud)',
      type: 'LITIGATION' as const, status: 'ACTIVE' as const,
      jurisdiction: 'S.D.N.Y.', caseNumber: '1:24-cv-07213', riskLevel: 'CRITICAL',
      billingType: 'HOURLY', billingRate: 725,
    },
  ]

  for (const mDef of matterDefs) {
    await db.matter.upsert({
      where: { firmId_matterNumber: { firmId: firm.id, matterNumber: mDef.matterNumber } },
      update: {},
      create: mDef,
    })
  }

  const matters = await db.matter.findMany({ where: { firmId: firm.id }, orderBy: { matterNumber: 'asc' } })
  console.log(`✅ ${matters.length} matters created`)

  // ── Matter parties ────────────────────────────────────────
  const partyDefs = [
    { matterId: matters[0].id, userId: chan.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[0].id, userId: patel.id, role: 'ASSOCIATE', isPrimary: false },
    { matterId: matters[1].id, userId: reyes.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[2].id, userId: chan.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[2].id, userId: lee.id, role: 'ASSOCIATE', isPrimary: false },
    { matterId: matters[3].id, userId: reyes.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[4].id, userId: hartley.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[5].id, userId: hartley.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[5].id, userId: chan.id, role: 'BILLING_ATTORNEY', isPrimary: false },
    { matterId: matters[5].id, userId: patel.id, role: 'ASSOCIATE', isPrimary: false },
    { matterId: matters[6].id, userId: lee.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[7].id, userId: reyes.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[8].id, userId: chan.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[9].id, userId: hartley.id, role: 'RESPONSIBLE_ATTORNEY', isPrimary: true },
    { matterId: matters[9].id, userId: reyes.id, role: 'PARTNER', isPrimary: false },
    { matterId: matters[9].id, userId: patel.id, role: 'ASSOCIATE', isPrimary: false },
  ]

  for (const p of partyDefs) {
    await db.matterParty.create({ data: p }).catch(() => {})
  }
  console.log('✅ Matter parties created')

  // ── Deadlines ─────────────────────────────────────────────
  const now = new Date()
  const d = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  const deadlines = [
    { firmId: firm.id, matterId: matters[0].id, title: 'Answer / Responsive Pleading Due', dueAt: d(12), deadlineType: 'FILING', priority: 'URGENT' as const },
    { firmId: firm.id, matterId: matters[0].id, title: 'Initial Disclosures Deadline', dueAt: d(28), deadlineType: 'DISCOVERY', priority: 'HIGH' as const },
    { firmId: firm.id, matterId: matters[0].id, title: 'Motion to Dismiss Filing Deadline', dueAt: d(45), deadlineType: 'FILING', priority: 'HIGH' as const },
    { firmId: firm.id, matterId: matters[5].id, title: 'DOJ Subpoena Response Deadline', dueAt: d(7), deadlineType: 'COURT', priority: 'URGENT' as const },
    { firmId: firm.id, matterId: matters[5].id, title: 'Privilege Log Production', dueAt: d(21), deadlineType: 'DISCOVERY', priority: 'HIGH' as const },
    { firmId: firm.id, matterId: matters[9].id, title: 'Opposition to Class Certification', dueAt: d(35), deadlineType: 'FILING', priority: 'HIGH' as const },
    { firmId: firm.id, matterId: matters[9].id, title: 'Expert Witness Disclosure', dueAt: d(60), deadlineType: 'COURT', priority: 'MEDIUM' as const },
    { firmId: firm.id, matterId: matters[3].id, title: 'Closing Documents Execution', dueAt: d(18), deadlineType: 'GENERAL', priority: 'HIGH' as const },
    { firmId: firm.id, matterId: matters[2].id, title: 'EEOC Response Filing', dueAt: d(14), deadlineType: 'FILING', priority: 'URGENT' as const },
    { firmId: firm.id, matterId: matters[7].id, title: 'Environmental Assessment Deadline', dueAt: d(42), deadlineType: 'GENERAL', priority: 'MEDIUM' as const },
  ]

  await db.deadline.createMany({ data: deadlines })
  console.log('✅ Deadlines created')

  // ── Calendar events ───────────────────────────────────────
  const events = [
    { firmId: firm.id, matterId: matters[0].id, title: 'Rule 26(f) Conference', eventType: 'STATUS_CONFERENCE' as const, startAt: d(8), createdById: chan.id },
    { firmId: firm.id, matterId: matters[0].id, title: 'Deposition of Dr. Alan Firth', eventType: 'DEPOSITION' as const, startAt: d(22), createdById: patel.id },
    { firmId: firm.id, matterId: matters[5].id, title: 'DOJ Interview — C-Suite', eventType: 'MEETING' as const, startAt: d(5), createdById: hartley.id },
    { firmId: firm.id, matterId: matters[9].id, title: 'Class Cert Hearing', eventType: 'HEARING' as const, startAt: d(90), createdById: hartley.id },
    { firmId: firm.id, matterId: matters[2].id, title: 'Mediation Session', eventType: 'MEDIATION' as const, startAt: d(30), createdById: chan.id },
    { firmId: firm.id, matterId: matters[3].id, title: 'Title Search Review Meeting', eventType: 'MEETING' as const, startAt: d(10), createdById: reyes.id },
  ]

  await db.calendarEvent.createMany({ data: events })
  console.log('✅ Calendar events created')

  // ── Tasks ─────────────────────────────────────────────────
  const tasks = [
    { firmId: firm.id, matterId: matters[0].id, createdById: chan.id, assigneeId: patel.id, title: 'Draft answer to complaint', status: 'IN_PROGRESS' as const, priority: 'URGENT' as const, dueAt: d(10) },
    { firmId: firm.id, matterId: matters[0].id, createdById: chan.id, assigneeId: thompson.id, title: 'Collect and organize patent file history', status: 'TODO' as const, priority: 'HIGH' as const, dueAt: d(15) },
    { firmId: firm.id, matterId: matters[0].id, createdById: chan.id, assigneeId: patel.id, title: 'Research prior art — Vantara patent portfolio', status: 'TODO' as const, priority: 'HIGH' as const, dueAt: d(20) },
    { firmId: firm.id, matterId: matters[5].id, createdById: hartley.id, assigneeId: patel.id, title: 'Document collection and privilege review', status: 'IN_PROGRESS' as const, priority: 'URGENT' as const, dueAt: d(5) },
    { firmId: firm.id, matterId: matters[5].id, createdById: hartley.id, assigneeId: thompson.id, title: 'Create privilege log — Batch 1', status: 'TODO' as const, priority: 'URGENT' as const, dueAt: d(14) },
    { firmId: firm.id, matterId: matters[1].id, createdById: reyes.id, assigneeId: lee.id, title: 'Draft Limited Partnership Agreement', status: 'IN_PROGRESS' as const, priority: 'HIGH' as const, dueAt: d(25) },
    { firmId: firm.id, matterId: matters[3].id, createdById: reyes.id, assigneeId: reyes.id, title: 'Review title commitment', status: 'TODO' as const, priority: 'MEDIUM' as const, dueAt: d(12) },
    { firmId: firm.id, matterId: matters[9].id, createdById: hartley.id, assigneeId: patel.id, title: 'Analyze class certification motion', status: 'TODO' as const, priority: 'HIGH' as const, dueAt: d(20) },
    { firmId: firm.id, matterId: matters[2].id, createdById: chan.id, assigneeId: lee.id, title: 'EEOC position statement draft', status: 'IN_PROGRESS' as const, priority: 'URGENT' as const, dueAt: d(12) },
    { firmId: firm.id, matterId: matters[6].id, createdById: lee.id, assigneeId: lee.id, title: 'Draft post-nuptial agreement', status: 'TODO' as const, priority: 'HIGH' as const, dueAt: d(21) },
  ]

  await db.task.createMany({ data: tasks })
  console.log('✅ Tasks created')

  // ── Time entries ──────────────────────────────────────────
  const timeEntries = [
    { firmId: firm.id, matterId: matters[0].id, userId: chan.id, description: 'Review complaint; conference with client re: allegations and strategy', hoursWorked: 3.5, ratePerHour: 650, amount: 2275, status: 'SUBMITTED' as const, billingDate: d(-2), isBillable: true },
    { firmId: firm.id, matterId: matters[0].id, userId: patel.id, description: 'Research validity of plaintiff patents — prior art search', hoursWorked: 6.0, ratePerHour: 450, amount: 2700, status: 'SUBMITTED' as const, billingDate: d(-1), isBillable: true },
    { firmId: firm.id, matterId: matters[5].id, userId: hartley.id, description: 'Initial strategy conference re: DOJ subpoena scope', hoursWorked: 2.0, ratePerHour: 900, amount: 1800, status: 'APPROVED' as const, billingDate: d(-5), isBillable: true },
    { firmId: firm.id, matterId: matters[5].id, userId: patel.id, description: 'Document collection — email review and triage', hoursWorked: 8.5, ratePerHour: 450, amount: 3825, status: 'SUBMITTED' as const, billingDate: d(-3), isBillable: true },
    { firmId: firm.id, matterId: matters[1].id, userId: reyes.id, description: 'Draft LP Agreement — initial markup and internal review', hoursWorked: 5.5, ratePerHour: 700, amount: 3850, status: 'DRAFT' as const, billingDate: d(-1), isBillable: true },
    { firmId: firm.id, matterId: matters[9].id, userId: hartley.id, description: 'Analysis of class action complaint; strategy memo to client', hoursWorked: 4.0, ratePerHour: 900, amount: 3600, status: 'APPROVED' as const, billingDate: d(-7), isBillable: true },
    { firmId: firm.id, matterId: matters[2].id, userId: chan.id, description: 'Conference with client re: termination circumstances', hoursWorked: 1.5, ratePerHour: 650, amount: 975, status: 'DRAFT' as const, billingDate: d(0), isBillable: true },
    { firmId: firm.id, matterId: matters[3].id, userId: reyes.id, description: 'Review purchase agreement and title commitment', hoursWorked: 3.0, ratePerHour: 700, amount: 2100, status: 'SUBMITTED' as const, billingDate: d(-4), isBillable: true },
  ]

  await db.timeEntry.createMany({ data: timeEntries })
  console.log('✅ Time entries created')

  // ── Invoices ──────────────────────────────────────────────
  const invoices = [
    {
      firmId: firm.id, matterId: matters[5].id,
      invoiceNumber: 'INV-2024-0042',
      status: 'SENT' as const,
      issueDate: d(-30),
      dueDate: d(0),
      subtotal: 28500,
      total: 28500,
      amountPaid: 14250,
      balance: 14250,
    },
    {
      firmId: firm.id, matterId: matters[9].id,
      invoiceNumber: 'INV-2024-0043',
      status: 'DRAFT' as const,
      issueDate: d(-5),
      dueDate: d(25),
      subtotal: 18750,
      total: 18750,
      amountPaid: 0,
      balance: 18750,
    },
    {
      firmId: firm.id, matterId: matters[0].id,
      invoiceNumber: 'INV-2024-0044',
      status: 'PAID' as const,
      issueDate: d(-60),
      dueDate: d(-30),
      subtotal: 12500,
      total: 12500,
      amountPaid: 12500,
      balance: 0,
    },
  ]

  for (const inv of invoices) {
    await db.invoice.create({ data: inv }).catch(() => {})
  }
  console.log('✅ Invoices created')

  // ── Intake leads ──────────────────────────────────────────
  const leads = [
    { firmId: firm.id, leadNumber: 'L-00001', status: 'NEW' as const, prospectName: 'James Holbrook', prospectEmail: 'jholbrook@email.com', matterType: 'LITIGATION' as const, urgency: 'HIGH' as const, source: 'REFERRAL', notes: 'Referred by Alderton. Potential securities fraud defense.' },
    { firmId: firm.id, leadNumber: 'L-00002', status: 'CONFLICT_CHECK' as const, prospectName: 'Meridian Bio LLC', prospectEmail: 'legal@meridianbio.com', matterType: 'CORPORATE' as const, urgency: 'NORMAL' as const, source: 'WEBSITE', notes: 'Needs Series A counsel. FDA regulatory issues also.' },
    { firmId: firm.id, leadNumber: 'L-00003', status: 'APPROVED' as const, prospectName: 'Carlos Ramirez', matterType: 'EMPLOYMENT' as const, urgency: 'URGENT' as const, source: 'REFERRAL', notes: 'Wrongful termination — statute running in 90 days.' },
    { firmId: firm.id, leadNumber: 'L-00004', status: 'SCREENING' as const, prospectName: 'Hargrove Properties', matterType: 'REAL_ESTATE' as const, urgency: 'NORMAL' as const, source: 'WEBSITE' },
  ]

  await db.intakeLead.createMany({ data: leads })
  console.log('✅ Intake leads created')

  // ── Audit events ──────────────────────────────────────────
  const auditEvents = [
    { firmId: firm.id, userId: hartley.id, action: 'LOGIN' as const, description: 'User logged in', ipAddress: '10.0.1.50', createdAt: d(-1) },
    { firmId: firm.id, userId: chan.id, action: 'LOGIN' as const, description: 'User logged in', ipAddress: '10.0.1.51', createdAt: d(-1) },
    { firmId: firm.id, userId: patel.id, action: 'AI_QUERY' as const, matterId: matters[5].id, description: 'Research query: DOJ subpoena privilege scope', createdAt: d(-2) },
    { firmId: firm.id, userId: hartley.id, action: 'MATTER_CREATED' as const, matterId: matters[5].id, description: 'Matter created: Pinnacle Healthcare — DOJ Subpoena Response', createdAt: d(-30) },
    { firmId: firm.id, userId: chan.id, action: 'DOCUMENT_UPLOADED' as const, matterId: matters[0].id, description: 'Document uploaded: Complaint_NexovanceVantara.pdf', createdAt: d(-5) },
    { firmId: firm.id, userId: patel.id, action: 'PRIVILEGE_FLAGGED' as const, matterId: matters[5].id, description: 'Document flagged for privilege review: Email_CEOCounsel_20240312.msg', createdAt: d(-3) },
    { firmId: firm.id, userId: billing.id, action: 'INVOICE_GENERATED' as const, description: 'Invoice generated: INV-2024-0044', createdAt: d(-60) },
    { firmId: firm.id, userId: intake.id, action: 'INTAKE_CREATED' as const, description: 'Intake lead created: James Holbrook', createdAt: d(-5) },
  ]

  await db.auditEvent.createMany({ data: auditEvents })
  console.log('✅ Audit events created')

  // ── Research threads ──────────────────────────────────────
  const threads = [
    { matterId: matters[0].id, userId: patel.id, title: 'Prior art analysis — Vantara patent claims 1-12', isSaved: true, tags: ['patent', 'prior-art', 'litigation'] },
    { matterId: matters[5].id, userId: hartley.id, title: 'Scope of attorney-client privilege under DOJ subpoena', isSaved: true, tags: ['privilege', 'DOJ', 'healthcare'] },
    { matterId: matters[9].id, userId: reyes.id, title: 'Class action certification standards — securities fraud', isSaved: true, tags: ['class-action', 'securities'] },
  ]

  for (const t of threads) {
    await db.researchThread.create({ data: t })
  }
  console.log('✅ Research threads created')

  // ── AI jobs ───────────────────────────────────────────────
  const aiJobs = [
    { firmId: firm.id, matterId: matters[5].id, type: 'PRIVILEGE_TAG', status: 'COMPLETE' as const, provider: 'ollama', model: 'llama3.1:70b', completedAt: d(-1) },
    { firmId: firm.id, matterId: matters[0].id, type: 'SUMMARIZE', status: 'COMPLETE' as const, provider: 'ollama', model: 'llama3.1:70b', completedAt: d(-2) },
    { firmId: firm.id, matterId: matters[5].id, type: 'EMBED', status: 'COMPLETE' as const, provider: 'ollama', model: 'nomic-embed-text', completedAt: d(-3) },
  ]

  await db.aIJob.createMany({ data: aiJobs })
  console.log('✅ AI jobs created')

  // ── Notifications ─────────────────────────────────────────
  const notifications = [
    { userId: hartley.id, title: 'Urgent deadline approaching', body: 'DOJ Subpoena Response due in 7 days — Pinnacle Healthcare matter', type: 'URGENT', link: `/app/matters/${matters[5].id}/overview` },
    { userId: chan.id, title: 'New intake lead assigned', body: 'James Holbrook intake requires conflict check review', type: 'ACTION_REQUIRED', link: '/app/intake' },
    { userId: patel.id, title: 'AI research complete', body: 'Privilege analysis for Pinnacle documents complete — 23 documents flagged', type: 'INFO' },
  ]

  await db.notification.createMany({ data: notifications })
  console.log('✅ Notifications created')

  console.log('\n🏛️  Privilege Vault AI seed complete!')
  console.log('   Firm: Hartley & Associates LLP')
  console.log('   Login: admin@hartleyandassoc.com / PrivilegeVault2024!')
  console.log('   Matters: 10 active | Clients: 8 | Users: 8 | Deadlines: 10')
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1) })
  .finally(() => db.$disconnect())
