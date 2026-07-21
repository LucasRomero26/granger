# Granger

Full-stack project management application built on the MERN stack
(MongoDB, Express, React, Node.js) with TypeScript end to end.

## Features

- JWT authentication with httpOnly refresh-token rotation and revocation
- OAuth (Google and GitHub) social login
- Project, task and note management with Kanban board and drag-and-drop
- Team members with role-based authorization (manager vs. team member)
- Avatar uploads via Cloudinary signed uploads
- Internationalization (English and Spanish)
- Session-aware API client with transparent token refresh
- Sentry error monitoring and Better Stack logtail shipping

## Project structure

```
Granger/
├── backend/    # Express + TypeScript + MongoDB + JWT
├── frontend/   # React 19 + Vite + TypeScript + Tailwind
├── .github/     # GitHub Actions CI/CD workflows
├── docker-compose.yml
└── README.md
```

## Requirements

- Node.js >= 20
- MongoDB Atlas (or a local MongoDB instance)
- Docker (optional, for containerized development)

## Local development (without Docker)

### Backend

```bash
cd backend
cp .env.example .env       # fill in real credentials
npm install
npm run dev                # http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local  # adjust VITE_API_URL if needed
npm install
npm run dev                       # http://localhost:5173
```

## Local development (with Docker)

```bash
docker compose up
# Backend:  http://localhost:4000
# Frontend: http://localhost:5173
```

## Testing

Backend unit and integration tests (mongodb-memory-server):

```bash
cd backend && npm test
```

Frontend end-to-end tests (requires the dev server running on :5173):

```bash
cd frontend && npm run e2e
```

## Scripts

| Workspace | Command        | Description                                |
|-----------|----------------|--------------------------------------------|
| backend   | `npm run dev`  | Run the API with hot reload (tsx watch)   |
| backend   | `npm run build`| Compile TypeScript to `dist/`              |
| backend   | `npm start`    | Run the compiled API (`node dist/index.js`) |
| backend   | `npm run lint` | Lint with oxlint                           |
| backend   | `npm test`     | Run Vitest unit + integration tests       |
| frontend  | `npm run dev`  | Vite dev server (HMR)                      |
| frontend  | `npm run build`| Type-check and produce the production bundle |
| frontend  | `npm run lint` | Lint with oxlint                           |
| frontend  | `npm run e2e`  | Run Playwright end-to-end tests            |

## Production

Granger is deployed using a split stack optimized for free-tier / GitHub
Student Pack usage (no DigitalOcean):

| Component   | Host            | Plan                | Notes                                          |
|-------------|-----------------|---------------------|------------------------------------------------|
| Frontend    | Vercel          | Hobby (free)        | Auto-deploy from `main`, global CDN edge       |
| Backend     | Render          | Free (Web Service)  | Docker image from `backend/Dockerfile`, 512 MB RAM, cold-start ~1 min after 15 min idle |
| Image       | GHCR            | Free (public)       | `ghcr.io/lucasromero26/granger-backend` (CI smoke build; Render builds directly from repo) |
| Database    | MongoDB Atlas   | M0 (free) + Student Pack $50 | 512 MB, 3-node replica set           |
| Emails      | Resend          | Free                | 3 000 emails/month (HTTP API, works from Render free) |
| Avatars     | Cloudinary      | Free                | 25 GB storage, signed uploads                   |
| Monitoring  | Sentry          | Developer           | Backend + frontend DSNs                          |
| Logs        | Better Stack    | Free                | 1 GB/month via `@logtail/pino`                  |
| Redis       | Upstash         | Free                | 10 000 commands/day, distributed rate limit      |
| Keep-alive  | UptimeRobot     | Free                | Pings `/health` every 10 min to prevent Render spin-down |
| OAuth        | Google + GitHub | —                   | Free                                             |

> **Why Render free works for us:** Render blocks outbound SMTP on ports
> 25/465/587 for free services, but Granger sends email through Resend's
> HTTP API (not SMTP), so it's unaffected. Render also spins down idle
> free services after 15 min — we keep it warm with UptimeRobot pings.

### Endpoints

- Frontend: `https://granger.vercel.app` (or your Vercel subdomain)
- Backend: `https://granger-backend.onrender.com` (Render auto-assigned hostname)
- API base: `https://granger-backend.onrender.com/api`
- Health:   `https://granger-backend.onrender.com/health`

### CI/CD

Three GitHub Actions workflows live under `.github/workflows/`:

| Workflow             | Trigger                                  | Does                                                        |
|----------------------|------------------------------------------|-------------------------------------------------------------|
| `backend-ci.yml`     | push to main/develop, PR -> main         | lint, typecheck, vitest, coverage; on main it also builds the Docker image and publishes it to `ghcr.io/lucasromero26/granger-backend:latest` and `:sha-<git>` for reproducibility. On PRs it builds + smoke-tests the image without pushing. |
| `frontend-ci.yml`    | push to main/develop, PR -> main         | lint, typecheck, `vite build`; then a second job installs Playwright Chromium and runs the E2E suite against `vite preview` in `VITE_DEMO_MODE=true`. |
| `deploy.yml`         | push to main touching `backend/**`, `frontend/**` or `deploy.yml`, plus `workflow_dispatch` | POSTs to the Render Deploy Hook URLs (clean cache + rebuild) for both the backend and frontend services. Requires `RENDER_BACKEND_DEPLOY_HOOK` and `RENDER_FRONTEND_DEPLOY_HOOK` secrets. |

The frontend is deployed automatically by **Vercel** (its own GitHub
integration listens on push to `main` and creates preview deployments for
pull requests). No GitHub Action is needed for the frontend deploy.

### Frontend deploy (Vercel)

1. On Vercel, import the GitHub repository and set the **Root Directory**
   to `frontend`.
2. Framework preset: Vite (auto-detected). Build: `npm run build`.
   Output directory: `dist`.
3. Environment variables (Production + Preview):
   - `VITE_API_URL` — `https://granger-backend.onrender.com/api`
   - `VITE_DEMO_MODE` — `false`
   - `VITE_SENTRY_DSN` — your Sentry React project DSN (public)
4. Vercel auto-deploys on every push to `main`, and creates a preview
   deployment for each pull request.

### Backend deploy (Render)

Render builds the Docker image defined in `backend/Dockerfile` on every
deploy. There is no `render.yaml` needed for the basic setup; everything
is configured in the Render dashboard.

**One-time setup** (via the Render dashboard at https://dashboard.render.com):

1. **New → Web Service → "Build and deploy from a Git repository"**.
2. Select the `LucasRomero26/granger` GitHub repo.
3. Configure the service:
   - **Name**: `granger-backend`
   - **Region**: `Oregon` (closest to MongoDB Atlas `us-central1`)
   - **Branch**: `main`
   - **Root Directory**: `.` (repo root — Render needs this to find
     `backend/Dockerfile`; the Dockerfile itself copies only `backend/`)
   - **Language**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Instance Type**: `Free` (512 MB, 0.1 CPU)
4. **Environment variables** (copy from `backend/.env.example` and fill in
   real values). The full list:
   ```
   NODE_ENV=production
   DATABASE_URL=mongodb+srv://...
   JWT_ACCESS_SECRET=<openssl rand -hex 48>
   JWT_REFRESH_SECRET=<openssl rand -hex 48>
   FRONTEND_URL=https://granger.vercel.app
   BACKEND_URL=https://granger-backend.onrender.com
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=onboarding@resend.dev
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CLOUDINARY_UPLOAD_PRESET=granger_avatars
   GOOGLE_CLIENT_ID=TEMP_FILL_AFTER_OAUTH
   GOOGLE_CLIENT_SECRET=TEMP_FILL_AFTER_OAUTH
   GITHUB_OAUTH_CLIENT_ID=TEMP_FILL_AFTER_OAUTH
   GITHUB_OAUTH_CLIENT_SECRET=TEMP_FILL_AFTER_OAUTH
   SENTRY_DSN_BACKEND=https://...@sentry.io/...
   LOGTAIL_SOURCE_TOKEN=...
   LOGTAIL_INGESTING_HOST=...
   REDIS_URL=rediss://default:...@...
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=900000
   AUTH_RATE_LIMIT_MAX=5
   AUTH_BLOCK_DURATION_MS=900000
   ```
5. **Create Web Service**. Render builds and deploys. The first build
   takes ~5 min; the URL is `https://granger-backend.onrender.com`.
6. Open **Settings → Deploy Hook**, create one called `github-actions`,
   copy the URL and add it as the `RENDER_BACKEND_DEPLOY_HOOK` secret in
   https://github.com/LucasRomero26/granger/settings/secrets/actions

If you prefer IaC, create a `render.yaml` at the repo root. The same
config in YAML form:

```yaml
services:
  - type: web
    name: granger-backend
    runtime: docker
    region: oregon
    branch: main
    rootDir: .
    dockerfilePath: backend/Dockerfile
    plan: free
    healthCheckPath: /health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      # ... (same list as above)
```

### Keeping the service warm with UptimeRobot

Render Free Web Services **spin down after 15 min without inbound
traffic**. Spinning back up takes ~1 min, during which the user sees
Render's loading page. To avoid that:

1. Sign up for free at https://uptimerobot.com (10 monitors gratis).
2. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Granger backend`
   - **URL**: `https://granger-backend.onrender.com/health`
   - **Monitoring Interval**: `5 minutes`
3. Save. From now on, UptimeRobot keeps the service warm AND emails you
   if the backend ever goes down.

> **Note:** Render still restarts the service occasionally (deploys,
> platform maintenance). A 5-min ping keeps it warm but does not prevent
> those restarts.

### OAuth redirect URIs

After the URLs are known, configure them in the OAuth providers:

- **Google Cloud Console** → OAuth client ID
  - Authorized JavaScript origins: `https://granger-backend.onrender.com`
  - Authorized redirect URI:  `https://granger-backend.onrender.com/api/auth/google/callback`
- **GitHub OAuth App**
  - Homepage URL:           `https://granger.vercel.app`
  - Authorization callback: `https://granger-backend.onrender.com/api/auth/github/callback`

### Cookie behavior in cross-site production

In production the frontend (Vercel) and backend (Render) live on different
registrable domains, so auth cookies are issued with `sameSite=none;
secure=true`. The browser will only attach them to cross-site requests
issued over HTTPS — the access token is also sent in the `Authorization`
header and the refresh token is rotated server-side. See
`backend/src/middleware/auth.ts` for the policy logic.

## Security

- bcryptjs hashing with cost factor 12.
- Refresh-token rotation with re-use detection and chain revocation.
- Helmet content security policy, HSTS, frame-ancestors and referrer policy.
- HTTP parameter pollution protection and MongoDB query sanitization.
- Strict CORS allowlist with explicit origins.
- Rate limiting: global, auth, password reset and registration buckets.
- httpOnly + SameSite=Strict + Secure cookies in production.
