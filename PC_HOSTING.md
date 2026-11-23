# Hosting from your PC (free, no card)

This publishes the real Next.js server from your computer through a free
Cloudflare Quick Tunnel. SQLite and uploads stay in `data/` on your PC.

> The URL changes every time the tunnel restarts. For a permanent domain, use a
> named Cloudflare Tunnel with your own domain (still free).

## One-time setup

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Set a strong admin password before the first database creation. In
   PowerShell:

   ```powershell
   $env:AUTH_SECRET = -join ((1..48) | ForEach-Object { 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[(Get-Random -Maximum 62)] })
   $env:NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
   $env:SEED_ADMIN_EMAIL = 'admin@your-domain.example'
   $env:SEED_ADMIN_PASSWORD = 'choose-a-strong-password'
   $env:SEED_ADMIN_USERNAME = 'curator'
   ```

   These values are used only when `data/is-this-art.db` is first created. To
   change them later, stop the server, run `npm run db:reset`, then start again.

3. If `trycloudflare.com` does not open, enable DNS-over-HTTPS in your browser.
   In Firefox: **Settings → Network Settings → DNS over HTTPS → Cloudflare**.
   This is needed because some ISPs block plain DNS for that hostname.

## Run it

Use two terminals in this folder.

**Terminal 1 — the app:**

```bash
npm start
```

**Terminal 2 — the public tunnel:**

```bash
npm run tunnel
```

The second terminal prints:

```text
PUBLIC URL: https://something-random.trycloudflare.com
```

The script downloads `cloudflared.exe` automatically on first use into your
temp folder. No account or card required.

## Fallback: SSH tunnel

If Cloudflare is unavailable, Windows 10/11 already includes OpenSSH, so you
can run:

```bash
npm run tunnel:ssh
```

This uses `localhost.run` and also needs no account or card, but its free tier
is heavily bandwidth-throttled — pages can take 20+ seconds to load. Prefer
`npm run tunnel` unless you have no other option.

## Keeping it online

- Keep both terminals open and the PC awake.
- The database lives at `data/is-this-art.db`; uploads at `data/uploads/`.
  Both survive restarts. Back up the whole `data/` folder.
- After any code change, rerun `npm run build`, then restart `npm start`.
- The public URL changes on every tunnel restart.
- If Windows Firewall asks, allow Node.js and `cloudflared.exe`.
- Do not commit `.env.local` or `data/`; they are already ignored by Git.

## Why not just GitHub Pages?

GitHub Pages is static-only. It cannot run the Node server, Server Actions,
SQLite or the upload API. This tunnel publishes the actual running Next.js app.
