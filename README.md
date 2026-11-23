# IS THIS ART?

A social experiment about taste. Look at an artwork, decide whether it is art, and see how your judgment compares with everyone else's.

This is a complete, runnable product: real database, accounts, guest voting, gallery, comments, likes, follows, achievements, streaks, daily challenge, uploads, moderation, reports, leaderboard and an admin dashboard. The interface is a restrained, Apple-like design system with a full dark theme and responsive layouts.

---

## Quick start

**Requirements:** Node.js 24 LTS or newer (the app uses the built-in `node:sqlite` module; Node 22.5+ also works). npm 10+.

```bash
cd is-this-art
npm install
npm run dev
```

Open <http://localhost:3000>. The SQLite database is created and seeded automatically on the first request.

No configuration is required for local development. For a production build:

```bash
npm run build
npm start
```

### Demo accounts

| Role | Email | Password | Username |
| --- | --- | --- | --- |
| Admin | `admin@isart.local` | `admin1234` | `curator` |
| Demo user | `demo@isart.local` | `demo1234` | `demo` |

The seed also creates 40 clearly labelled demo profiles, votes, comments, likes, follows, achievements and reports. The pending submission `demo-afterimage` is waiting in moderation so the approval flow can be tested immediately.

> Demo accounts and seeded activity exist only to make the product explorable. They are marked `is_demo` and should not be presented as real community data.

---

## What is implemented

### The game
- **Play** — one artwork at a time, with a large image, three judgments (`Yes, art`, `Not art`, `Not sure`), keyboard shortcuts, progress and a reveal after voting.
- **Blind reveal** — title, artist, year, history, fun fact and community results stay hidden until the vote is recorded. The reveal then animates in.
- **One vote per identity** — enforced by partial unique indexes in the database, not only in the UI. Signed-in users and signed-out guests use separate identity columns.
- **Guest voting** — a signed, httpOnly anonymous cookie lets guests play. Points, streaks, achievements and the leaderboard require an account.
- **Daily challenge** — five deterministic artworks per UTC day, a separate progress view and a server-side completion bonus.
- **Server-side scoring** — points, streaks, challenge bonuses and achievements are calculated in a transaction on the server. The client never sends a score.

### Discovery and community
- **Gallery** — category filters, sorting (trending, newest, most debated, most liked), search, pagination and responsive cards.
- **Artwork pages** — image, metadata, community vote split, comments, likes, sharing, reporting, related works and a "play this one" entry point.
- **Community** — recently active members, top players and new work.
- **Profiles** — avatar, bio, points, streak, achievements, recent judgments, submissions and follower/following counts.
- **Leaderboard** — all-time and weekly views with rank movement.
- **Follows and likes** — persisted per user with optimistic UI where appropriate.

### Accounts and safety
- Email/password signup and login with `scrypt` password hashing.
- Database-backed sessions in httpOnly, `SameSite=Lax` cookies.
- Profile editing, password change, account deletion and password reset.
- Optional Google OAuth (the button only appears when both credentials are configured).
- Zod validation on every form and API payload.
- Parameterised SQL throughout; no string-built queries with user input.
- Rate limits on login, signup, password reset, voting and uploads.
- Upload validation by magic bytes, size and image dimensions; only JPG, PNG and WEBP.
- Moderation queue, approve/reject with a reason, report handling, user blocking, category management and an audit-friendly admin dashboard.
- Security headers (`nosniff`, `DENY` framing, referrer policy, permissions policy).

### Design
- Light palette: `#FAFAFA`, `#FFFFFF`, ink `#171717`, muted `#86868B`, borders `#EAEAEA`.
- Complete dark theme, persisted in `localStorage` with a no-flash boot script.
- Inter variable font, generous whitespace, 12–20 px radii, restrained Framer Motion reveals.
- Responsive from 320 px mobile through tablet to wide desktop; no horizontal scroll.
- Accessible focus states, semantic landmarks, labelled controls, keyboard shortcuts and reduced-motion-friendly transitions.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions, Route Handlers) |
| UI | React 19, TypeScript, Tailwind CSS 3, Framer Motion, Lucide |
| Data | SQLite through Node's built-in `node:sqlite` (`DatabaseSync`) |
| Validation | Zod 4 |
| Auth | Custom scrypt + database sessions; optional Google OAuth |
| Production schema | Supabase/PostgreSQL migration with RLS and a `cast_vote` RPC |
| Storage | Local disk by default; optional Supabase Storage |

The local SQLite database keeps the project runnable with zero setup. The Supabase schema in `supabase/` is the production reference for teams that want Postgres, Supabase Auth, RLS and Storage.

---

## Project structure

```text
is-this-art/
├─ public/
│  ├─ artworks/                 # 16 public-domain/CC0 images + 6 demo SVGs
│  │  └─ credits.json           # provenance for every image
│  ├─ og.png
│  └─ icon.svg
├─ scripts/
│  └─ reset-db.mjs              # npm run db:reset
├─ src/
│  ├─ app/
│  │  ├─ page.tsx               # home
│  │  ├─ play/                  # blind voting game
│  │  ├─ challenge/             # daily challenge
│  │  ├─ discover/              # gallery + filters
│  │  ├─ artwork/[slug]/        # artwork detail, comments, likes
│  │  ├─ community/             # members and activity
│  │  ├─ leaderboard/           # all-time + weekly
│  │  ├─ u/[username]/          # public profiles
│  │  ├─ submit/                # upload a work
│  │  ├─ settings/              # profile, password, account
│  │  ├─ login, signup,
│  │  │  forgot-password,
│  │  │  reset-password/        # auth screens
│  │  ├─ admin/                 # dashboard, moderation, reports,
│  │  │                          # artworks, users, categories
│  │  ├─ about, credits, privacy/
│  │  ├─ actions/               # server actions (auth, artwork, admin)
│  │  └─ api/                   # vote, play/next, uploads, OAuth
│  ├─ components/               # design system + feature components
│  ├─ data/artworks.ts          # seed catalogue and provenance
│  └─ lib/
│     ├─ db.ts                  # schema, lazy init, deterministic seed
│     ├─ queries.ts             # all read queries
│     ├─ voting.ts              # transactional scoring and achievements
│     ├─ auth.ts                # sessions, users, guest cookies, guards
│     ├─ validation.ts          # Zod schemas
│     ├─ images.ts              # magic-byte and dimension validation
│     ├─ storage.ts             # local disk or Supabase Storage
│     ├─ rate-limit.ts          # in-memory fixed-window limiter
│     └─ constants.ts           # categories, points, limits, cookie names
├─ supabase/
│  ├─ migrations/0001_init.sql  # production schema, RLS, RPC, storage
│  └─ seed.sql                  # categories + achievements
├─ data/                        # created at runtime: SQLite DB + uploads
├─ .env.example
└─ package.json
```

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page, stats, artwork of the day, trending, challenge, community |
| `/play` | Blind voting game and reveal |
| `/challenge` | Daily five-work challenge |
| `/discover` | Searchable, filterable gallery |
| `/artwork/[slug]` | Artwork detail, community split, comments, likes, report |
| `/community` | Members and recent activity |
| `/leaderboard` | All-time and weekly rankings |
| `/u/[username]` | Public profile, achievements, recent votes, submissions |
| `/submit` | Authenticated artwork submission |
| `/settings` | Profile, password and account management |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth |
| `/admin` | Dashboard |
| `/admin/moderation` | Pending submissions |
| `/admin/reports` | Open reports |
| `/admin/artworks`, `/admin/artworks/new`, `/admin/artworks/[id]/edit` | Catalogue management |
| `/admin/users` | User blocking and roles |
| `/admin/categories` | Category activation and creation |
| `/about`, `/credits`, `/privacy` | Editorial and provenance pages |

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need.

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | Production | Signs sessions, guest IDs and OAuth state. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. A development fallback exists, but production should fail without it. |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical origin used by metadata, sitemap and OAuth redirects. |
| `SEED_ADMIN_EMAIL` | No | Admin email for the first seed. Default `admin@isart.local`. |
| `SEED_ADMIN_PASSWORD` | No | Admin password for the first seed. Default `admin1234`. Change it. |
| `SEED_ADMIN_USERNAME` | No | Admin username for the first seed. Default `curator`. |
| `GOOGLE_CLIENT_ID` | No | Enables the Google sign-in button when paired with the secret. |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth secret. |
| `SUPABASE_URL` | No | Enables Supabase Storage for uploaded artwork. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-only service role key. Never expose it to the client. |
| `SUPABASE_STORAGE_BUCKET` | No | Storage bucket, default `artworks`. |
| `DATA_DIR` | No | SQLite and upload directory, default `./data`. |

Google OAuth redirect URI:

```text
{NEXT_PUBLIC_SITE_URL}/api/auth/google/callback
```

---

## Hosting from GitHub

GitHub Pages cannot run this app — it needs a Node server, SQLite and Server
Actions. The repository includes a [Render Blueprint](render.yaml) that deploys
the current code as a long-running Node service with a persistent disk, plus
[GitHub Actions CI](.github/workflows/ci.yml) and a [Dockerfile](Dockerfile) for
self-hosting.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render/Docker, or [PC_HOSTING.md](PC_HOSTING.md)
to publish from your own computer through a free SSH tunnel. In short:

1. Push this folder as the repository root to GitHub.
2. In Render, create a Blueprint from `render.yaml` and connect the repository.
3. Fill in `NEXT_PUBLIC_SITE_URL` and the seed admin credentials when prompted.
4. Open the service URL, sign in as the seed admin and change the password.

Vercel and other serverless hosts require the Supabase/Postgres port described
below before they can be used safely.

---

## Database lifecycle

- The database lives at `data/is-this-art.db` (WAL mode, foreign keys on).
- It is created, migrated and seeded lazily the first time a request touches the data layer.
- `npm run db:reset` deletes the database and local uploads. The next request creates a fresh, seeded database.
- Uploaded files live in `data/uploads/` and are served through `/api/uploads/[name]` with a strict filename pattern and content type.
- `data/` is ignored by Git. The seed is deterministic, so a reset produces the same demo catalogue.

### Local schema highlights

- `users`, `sessions`, `password_resets`, `categories`, `artworks`, `votes`, `comments`, `likes`, `follows`, `achievements`, `user_achievements`, `reports`, `daily_completions`, `meta`.
- `votes` has `user_id` or `guest_id`, never both, plus partial unique indexes for each identity type.
- Vote, streak, achievement and challenge updates run inside a single transaction.
- Counter columns (`vote_count`, `yes_count`, etc.) are maintained on write.

---

## Supabase (production reference)

The local app intentionally runs on SQLite so it works with zero setup. The `supabase/` folder contains a complete PostgreSQL schema for teams deploying on Supabase. **The local runtime does not consume this migration yet** — using it as the app's data layer requires replacing the `src/lib/db.ts`/`queries.ts` access layer with Supabase clients. The migration is the hard part: tables, indexes, counters, RLS, triggers, the `cast_vote` RPC and storage policies are all defined.

### 1. Create a project

Create a project at <https://supabase.com/dashboard>. Note the project URL, the anon key and the service role key.

### 2. Apply the schema

**Option A — Supabase CLI (recommended):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — SQL editor:** open `supabase/migrations/0001_init.sql`, paste it into the SQL editor and run it. Then run `supabase/seed.sql`.

The migration:

- Creates `public.profiles` linked to `auth.users`, with a trigger that creates a profile on signup.
- Creates categories, artworks, votes, comments, likes, follows, achievements, user achievements, reports and daily completions.
- Adds denormalised counters maintained by security-definer triggers.
- Enables RLS on every table and adds explicit policies.
- Adds `is_admin()`, `award_achievement()`, `get_daily_challenge_ids()` and the server-side `cast_vote(text, text)` RPC.
- Creates a public `artworks` storage bucket and admin-only write policies.
- Revokes direct updates to sensitive profile columns; users can only change username, bio and avatar.

### 3. Promote an admin

Sign up through Supabase Auth, then run:

```sql
update public.profiles
set role = 'admin'
where lower(username) = lower('your-username');
```

### 4. Configure Auth

- Enable Email provider (and Google if desired).
- Add `{NEXT_PUBLIC_SITE_URL}/auth/callback` (or your chosen callback) to the redirect allow list.
- Supabase Auth replaces the local `sessions` and `password_resets` tables.

### 5. Configure Storage (optional, already supported by the local app)

Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_STORAGE_BUCKET=artworks`. Uploads then go to Supabase Storage instead of `data/uploads`. The key must only be used in server code.

### Production notes

- Guest votes cannot use Supabase Auth directly. Record them with a server route using the service role and a hashed guest identifier in `guest_id`; keep the unique index in place.
- The RPC computes points, streaks, achievements and challenge bonuses on the server. Do not duplicate that logic in the browser.
- Use the anon key in the browser and the service role only in trusted server contexts.
- If you need private uploads, switch the bucket to private and use signed URLs; the current public bucket is intentional for approved artwork.

---

## Data and provenance

- 16 real works are stored in `public/artworks/` with source pages, licenses and credits in `public/artworks/credits.json`; the `/credits` page renders that file.
- The works are public-domain or CC0 images from Wikimedia Commons. No artwork facts are invented: titles, artists, dates, collections and descriptions were checked against the linked source pages.
- Six additional SVG pieces were created for this project and are explicitly labelled **Demo content** everywhere they appear. One of them (`demo-afterimage`) is intentionally pending to demonstrate moderation.
- Demo profiles and seeded votes are labelled as demo data. The leaderboard and activity feed are seeded for demonstration, not real usage.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack. |
| `npm run build` | Production build (also type-checks). |
| `npm start` | Serve the production build. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run db:reset` | Delete the SQLite database and local uploads; reseed on next start. |

---

## Security model

- Passwords: `scrypt` with per-user random salt; constant-time comparison.
- Sessions: 256-bit random tokens, only a SHA-256 hash is stored; httpOnly, `SameSite=Lax`, secure in production.
- Guest identity: random ID + HMAC signature in an httpOnly cookie; the database stores a SHA-256 hash, never the raw ID.
- Authorization: server-side guards on every admin action and every mutation; admin role checked from the database, not from client input.
- Votes: identity and artwork checked server-side; uniqueness enforced by the database; scores and achievements calculated in a transaction.
- Uploads: authenticated only, magic-byte sniffing, dimension checks, 8 MB limit, rate limited, random filenames, never executed as HTML.
- Input: Zod schemas on forms and APIs; SQL uses prepared statements.
- Headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Known limitations

1. **SQLite is single-node.** It is perfect for local use and a single long-running server, but it is not a horizontally scaled production database. The Supabase migration is the path to Postgres.
2. **The Supabase migration is not wired into the runtime.** The local app uses SQLite and custom auth. Porting means replacing the data-access layer and auth with Supabase clients. The schema, RLS and RPC are provided as the production reference.
3. **Rate limiting is in-memory.** Limits reset on restart and are per process. Use Redis/Upstash for multi-instance deployments.
4. **Local uploads are disk-bound.** On Render/Docker, keep the persistent disk or volume mounted at the configured `DATA_DIR`. On ephemeral/serverless filesystems they disappear; configure Supabase Storage for durable uploads.
5. **Password reset has no email provider.** In development the reset link is returned in the UI; in production it is logged to the server console. Connect a transactional email service before launch.
6. **Moderation is manual.** There is no automated image classification or duplicate detection; admins review the queue.
7. **No real-time updates.** Counts update on navigation or after a mutation, not via websockets.
8. **Search is SQL `LIKE`-based.** Fine for the seeded catalogue; use Postgres full-text search or a search service at scale.
9. **Demo data is seeded.** The 40 demo users and their activity are fabricated for demonstration and clearly labelled. They are not real people or real votes.
10. **`AUTH_SECRET` fallback.** The app can start without it in development, but production must set a strong secret.

---

## Credits

Artwork provenance is listed on `/credits` and in `public/artworks/credits.json`. The product was built as a self-contained demonstration; all demo SVGs and demo profiles are original content created for this project.

If you reuse the public-domain images, keep the source and license information with them.
