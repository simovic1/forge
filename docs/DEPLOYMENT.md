# Deployment

Two supported setups:

1. **Same Wi-Fi** — run the whole stack with Docker on your PC and open it from
   your phone on the same network.
2. **Vercel (anywhere)** — host the web app on Vercel and the backend + database
   on a container host.

---

## 1. Same Wi-Fi (Docker Compose)

Runs `db` + `backend` + `web` together. Your phone only talks to the `web`
service (port 3000); the backend and database stay internal to the compose
network.

```bash
# from the repo root
cp .env.example .env          # optional: tweak Postgres creds / JWT secret
docker compose up --build
```

Then:

1. Find your PC's LAN IP — `ipconfig` (Windows) → IPv4 Address, e.g. `192.168.1.50`.
2. Allow the port through Windows Firewall (admin PowerShell):
   ```powershell
   New-NetFirewallRule -DisplayName "FORGE web" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```
3. On your phone (same Wi-Fi): open `http://192.168.1.50:3000`.

Notes:
- `AUTH_COOKIE_SECURE=false` is set for the web service because the LAN is plain
  http. **Keep this only for a trusted home network** — never expose this setup
  to the internet as-is.
- Postgres data persists in the `db-data` volume across restarts.

---

## 2. Render (recommended — access from anywhere, no server to manage)

The whole stack (web + backend + managed Postgres) is described in
[`render.yaml`](../render.yaml), so deploying is a one-time repo connect:

1. Push the repo to GitHub.
2. In Render: **New → Blueprint**, pick the repo. Render reads `render.yaml` and
   creates the database, backend, and web services, wiring them together
   (DB credentials, an auto-generated `JWT_SECRET`, and the web's `BACKEND_URL`).
3. Open the `forge-web` service's URL on your phone — done, over HTTPS.

Notes:
- Everything is auto-wired; no env vars to fill in by hand.
- The **free plan sleeps** after inactivity, so the first request after idle
  takes ~30–60s. Upgrade the two services to a paid instance to keep them warm.
- `AUTH_COOKIE_SECURE=true` and HTTPS are set, so the auth cookie is secure.
- If Render's managed-DB property names ever differ, the only thing to check is
  the `fromDatabase` block in `render.yaml`.

## 3. Vercel + hosted backend (access from anywhere)

Vercel hosts **only the Next.js web app**. The Spring backend and Postgres
**cannot** run on Vercel — host them on a container platform (Fly.io, Railway,
Render, or a small VPS) and point the web app at the backend's public URL.

Because the browser only ever talks to the Vercel domain (the `/api/*` routes
proxy to the backend server-side), there is **no CORS to configure** and the
backend never needs to be reachable by the browser directly.

### a. Host the backend + database

- Provision **managed Postgres** (Neon, Supabase, Railway, …).
- Deploy `backend/` (it has a `Dockerfile`) to your platform of choice and set:
  | Env var | Value |
  | --- | --- |
  | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:5432/<db>` |
  | `SPRING_DATASOURCE_USERNAME` | your db user |
  | `SPRING_DATASOURCE_PASSWORD` | your db password |
  | `JWT_SECRET` | a long random secret, ≥ 32 bytes (`openssl rand -base64 48`) |
- Ensure the backend is served over **HTTPS** (most platforms do this for you).
  Note its public URL, e.g. `https://forge-api.fly.dev`.

### b. Deploy the web app to Vercel

- Import the repo in Vercel and set **Root Directory = `web`**.
- Add environment variables (Production):
  | Env var | Value |
  | --- | --- |
  | `BACKEND_URL` | your backend's HTTPS URL, e.g. `https://forge-api.fly.dev` |
  | `AUTH_COOKIE_SECURE` | `true` (or leave unset — it defaults to secure in production) |
- Deploy. Open the Vercel URL on your phone and "Add to Home Screen".

### Security checklist for public hosting

- [ ] `JWT_SECRET` is a strong random value (not the dev default).
- [ ] `AUTH_COOKIE_SECURE=true` (HTTPS-only auth cookie). The app also sends
      `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and HSTS.
- [ ] Backend + web are both served over HTTPS.
- [ ] Database is not publicly exposed (only the backend connects to it).
- [ ] Postgres backups are enabled on the managed provider.
