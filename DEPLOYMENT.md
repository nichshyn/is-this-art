# Hosting IS THIS ART?

This app needs a long-running Node.js server because it uses Server Actions,
HTTP-only cookie sessions, SQLite, and local file uploads. It cannot run on a
static host such as GitHub Pages. The current code also is not safe to deploy
to a purely serverless host such as Vercel without first porting the data layer
to Supabase/Postgres (see `supabase/` and the README).

The repository includes three deployment aids:

| File | Purpose |
| --- | --- |
| `render.yaml` | Render Blueprint: Node web service + persistent disk. |
| `.github/workflows/ci.yml` | GitHub Actions: `npm ci`, `npm run typecheck`, `npm run build` on push/PR. |
| `Dockerfile` | Generic container image for a VPS, Fly.io, Railway, etc. |

## 1. Push the project to GitHub

This folder should be the **root of the repository**. If the workspace is not a
Git repository yet:

```bash
cd is-this-art
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

If you already have a repository, skip `git init` and just push this folder as
the repository root. Do not commit `.env.local` or `data/`.

## 2. Deploy with the Render Blueprint

1. Sign in to Render and choose **New → Blueprint**.
2. Connect the GitHub repository and select the branch (usually `main`).
3. Render finds `render.yaml` at the repository root. Apply it.
4. Fill in the prompted environment variables:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://is-this-art.onrender.com` or your custom domain. No trailing slash. |
   | `SEED_ADMIN_EMAIL` | Email for the first admin account. |
   | `SEED_ADMIN_PASSWORD` | Strong password for the first admin account. |
   | `SEED_ADMIN_USERNAME` | Username for the first admin account; default `curator`. |

   `AUTH_SECRET` and `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` are generated
   automatically by the Blueprint. `DATA_DIR` and the disk mount are already
   configured.

5. Wait for the build to finish, then open the service URL.

Render uses a paid instance type because free instances cannot attach a
persistent disk. The disk stores `data/is-this-art.db` and `data/uploads/`, so
votes, users and uploads survive restarts and redeploys.

> The seed admin credentials are applied only when the database is created for
> the first time. Choose them before the first deploy; changing them later
> requires resetting the database.

## 3. Verify the deployment

- `/` loads the gallery.
- `/play` starts a challenge without revealing the answer before voting.
- `/admin` redirects to sign-in; sign in with the seed admin credentials.
- In Render logs there should be no uncaught errors on first request.
- Open `/credits` to confirm provenance pages work.

After signing in as admin, change the seed password immediately. If password
change is not available in the UI yet, reset the database with fresh
`SEED_ADMIN_*` values before inviting real users.

## 4. GitHub Actions CI

`.github/workflows/ci.yml` runs on every push and pull request to `main`/`master`.
It installs dependencies with `npm ci`, type-checks, and builds the production
bundle. It does not deploy — Render auto-deploys on push after the initial
Blueprint setup.

## 5. Optional environment variables

Add these in the Render dashboard (**Environment**) if needed, then redeploy:

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Enables Google sign-in. Add `{NEXT_PUBLIC_SITE_URL}/api/auth/google/callback` to the OAuth redirect allow list. |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_STORAGE_BUCKET` | Stores uploads in Supabase Storage instead of the local disk. The relational data still lives in SQLite. |

Never expose the service role key to the client.

## 6. Self-hosting with Docker

```bash
docker build -t is-this-art .

docker run -d \
  --name is-this-art \
  -p 3000:3000 \
  -v is-this-art-data:/app/data \
  -e NODE_ENV=production \
  -e AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
  -e NEXT_PUBLIC_SITE_URL="https://art.example.com" \
  -e SEED_ADMIN_EMAIL="admin@example.com" \
  -e SEED_ADMIN_PASSWORD="change-me" \
  -e SEED_ADMIN_USERNAME="curator" \
  is-this-art
```

The named volume `is-this-art-data` keeps the database and uploads. Put a
reverse proxy with TLS in front of the container for production traffic.

## 7. Why not GitHub Pages or Vercel?

- **GitHub Pages** serves static files only. There is no Node process for
  Server Actions, authentication, SQLite, or upload handling.
- **Vercel** uses an ephemeral filesystem. SQLite writes and `data/uploads/`
  would be lost on redeploy and are not shared across serverless instances.
  A Vercel deployment requires completing the Supabase/Postgres port first:
  apply `supabase/migrations/0001_init.sql` and `supabase/seed.sql`, then
  replace the `src/lib/db.ts` data layer and custom auth with Supabase clients.

## 8. Known deployment limitations

- One server instance only. SQLite and in-memory rate limits are per process.
- Rate limits reset on restart. Use Redis/Upstash for multi-instance setups.
- Local uploads depend on the persistent disk/volume. Configure Supabase
  Storage if you move to ephemeral hosts.
- Password reset links are logged to the server console until an email provider
  is connected.
