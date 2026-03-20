# Campaign Command Center

A production-ready internal CRM and field operations system for local political campaigns.

---

## Features

- **Contacts / Voter CRM** — full contact management with support status tracking
- **Canvassing / Field Module** — walk lists, mobile result entry, canvassing logs
- **Donors / Fundraising** — donation tracking, thank-you management, source breakdown
- **Volunteers** — volunteer roster, skill tracking, neighborhood assignments
- **Yard Sign Tracking** — request, delivery, and installation tracking
- **Tasks / Follow-ups** — internal task management with priority and overdue tracking
- **Events** — campaign event scheduling and RSVP tracking
- **Dashboard** — KPI cards, support breakdown chart, activity feed
- **Admin** — user management, role assignment, audit log
- **Role-Based Access Control** — admin / manager / field / volunteer roles
- **Supabase Auth** — email/password login with session persistence

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Recharts** (dashboard charts)
- **Deployable to Netlify**

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo>
cd campaign-command-center
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned

### 3. Run the Schema

In the Supabase SQL Editor, run:

1. `supabase/schema.sql` — creates all tables, indexes, RLS policies
2. `supabase/seed.sql` — inserts demo data (optional)

### 4. Create Demo Users (for seed data)

In the Supabase Auth dashboard → Users → Invite user, create:

| Email | Password | Role (set in seed) |
|---|---|---|
| admin@campaign.local | Campaign2024! | admin |
| manager@campaign.local | Campaign2024! | manager |
| field@campaign.local | Campaign2024! | field |
| volunteer@campaign.local | Campaign2024! | volunteer |

After creating users, run the `seed.sql` script — it will auto-set their names and roles.

### 5. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in Supabase → Settings → API.

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Service role key for admin operations |
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL of your app (e.g. https://yourapp.netlify.app) |

---

## Netlify Deployment

### Option A: Deploy via Netlify UI

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables in Site → Environment Variables
7. Install the `@netlify/plugin-nextjs` plugin (already in `netlify.toml`)

### Option B: Deploy via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Supabase Auth Redirect URLs

In Supabase → Authentication → URL Configuration, add:

```
https://yourapp.netlify.app
https://yourapp.netlify.app/login
```

---

## User Roles & Permissions

| Feature | Admin | Manager | Field | Volunteer |
|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Contacts | ✅ Full | ✅ Full | ✅ Full | ❌ |
| Canvassing | ✅ Full | ✅ Full | ✅ Full | ✅ Own lists only |
| Donors | ✅ Full | ✅ Full | ❌ | ❌ |
| Volunteers | ✅ Full | ✅ Full | ✅ View | ❌ |
| Yard Signs | ✅ Full | ✅ Full | ✅ Full | ❌ |
| Tasks | ✅ Full | ✅ Full | ✅ Full | ✅ Own tasks only |
| Events | ✅ Full | ✅ Full | ✅ Full | ✅ View only |
| Admin | ✅ Full | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected app shell
│   │   ├── layout.tsx         # Sidebar + topbar layout
│   │   ├── dashboard/
│   │   ├── contacts/
│   │   ├── canvassing/
│   │   ├── donors/
│   │   ├── volunteers/
│   │   ├── yard-signs/
│   │   ├── tasks/
│   │   ├── events/
│   │   └── admin/
│   ├── login/
│   └── unauthorized/
├── components/
│   ├── layout/                # Sidebar, Topbar
│   ├── ui/                    # Button, Card, Modal, Input, etc.
│   ├── dashboard/             # Charts, QuickAdd
│   ├── contacts/
│   ├── canvassing/
│   ├── donors/
│   ├── volunteers/
│   ├── yard-signs/
│   ├── tasks/
│   ├── events/
│   └── admin/
├── hooks/
│   ├── useAuth.ts
│   └── useRole.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── actions.ts             # Server actions
│   ├── constants.ts           # Labels and colors
│   └── utils.ts
├── types/
│   └── index.ts
└── middleware.ts              # Auth protection
supabase/
├── schema.sql
└── seed.sql
```

---

## v2 Improvements (Roadmap)

- [ ] **CSV Import** for bulk contact upload with field mapping UI
- [ ] **Map view** for yard signs and walk lists (Mapbox or Google Maps)
- [ ] **Photo upload** for yard sign proof photos (Supabase Storage)
- [ ] **Saved filters** for contacts and tasks
- [ ] **Email/SMS integration** (Twilio or SendGrid) for bulk outreach
- [ ] **Donation chart** (over time, by source)
- [ ] **Volunteer shift scheduling** with sign-up forms
- [ ] **Public-facing RSVP links** for events
- [ ] **Dark mode** toggle
- [ ] **Print-ready walk lists** (PDF export)
- [ ] **Two-factor auth** for admin accounts
- [ ] **Mobile app** (React Native or PWA)
- [ ] **Offline support** for canvassing in areas with poor signal
- [ ] **Duplicate contact detection**

---

## Security Notes

- All routes are protected by middleware — unauthenticated users are redirected to `/login`
- Row Level Security (RLS) is enabled on all Supabase tables
- Volunteer users can only see their own assigned tasks and walk lists
- Admin-only routes redirect to `/unauthorized` for non-admin users
- Service role key is never exposed to the browser
