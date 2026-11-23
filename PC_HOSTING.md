# Hosting from your PC (free, no card)

This is the fastest way to put the site online without a paid host. It keeps
the real SQLite database and uploads on your computer and publishes the local
Node server through a free `localhost.run` SSH tunnel.

> A free tunnel URL is random and changes every time you restart it. Add an SSH
> key at <https://admin.localhost.run/> if you want a longer-lasting domain.

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

3. Windows 10/11 already includes the `ssh` client. If it is missing, enable
   **OpenSSH Client** in *Settings → Apps → Optional features*.

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

The second terminal prints a line like:

```text
PUBLIC URL: https://f787300d1de047.app.lhr.life
```

Open that URL on any device. Nothing else to install — the tunnel uses the
system SSH client and a free `nokey@localhost.run` account.

## Keeping it online

- Keep both terminals open and the PC awake.
- The database lives at `data/is-this-art.db`; uploads at `data/uploads/`.
  Both survive restarts. Back up the whole `data/` folder.
- After any code change, rerun `npm run build`, then restart `npm start`.
- The public URL changes on every tunnel restart. Register a free SSH key at
  <https://admin.localhost.run/> for a stable subdomain, or use a named
  Cloudflare Tunnel if you own a domain.
- If Windows Firewall asks for permission, allow Node.js and `ssh.exe`.
- Do not commit `.env.local` or `data/`; they are already ignored by Git.

## Why not just GitHub Pages?

GitHub Pages is static-only. It cannot run the Node server, Server Actions,
SQLite or the upload API. This tunnel publishes the actual running Next.js app.
