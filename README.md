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
| Backend     | Fly.io          | Free (shared-cpu 1x, 256 MB) | Docker image, deployed via `fly deploy` |
| Image       | GHCR            | Free (public)       | `ghcr.io/lucasromero26/granger-backend`        |
| Database    | MongoDB Atlas   | M0 (free) + Student Pack $50 | 512 MB, 3-node replica set           |
| Emails      | Resend          | Free                | 3 000 emails/month                              |
| Avatars     | Cloudinary      | Free                | 25 GB storage, signed uploads                   |
| Monitoring  | Sentry          | Developer           | Backend + frontend DSNs                          |
| Logs        | Better Stack    | Free                | 1 GB/month via `@logtail/pino`                  |
| Redis       | Upstash         | Free                | 10 000 commands/day, distributed rate limit      |
| OAuth        | Google + GitHub | —                   | Free                                             |

### Endpoints

- Frontend: `https://granger.vercel.app` (or your Vercel subdomain)
- Backend: `https://granger-backend.fly.dev` (Fly.io auto-assigned hostname)
- API base: `https://granger-backend.fly.dev/api`
- Health:   `https://granger-backend.fly.dev/health`
- Ready:    `https://granger-backend.fly.dev/ready`

### CI/CD

Three GitHub Actions workflows live under `.github/workflows/`:

| Workflow             | Trigger                                  | Does                                                        |
|----------------------|------------------------------------------|-------------------------------------------------------------|
| `backend-ci.yml`     | push to main/develop, PR -> main         | lint, typecheck, vitest, coverage; on main it also builds the Docker image and publishes it to `ghcr.io/lucasromero26/granger-backend:latest` and `:sha-<git>` for reproducibility. On PRs it builds + smoke-tests the image without pushing. |
| `frontend-ci.yml`    | push to main/develop, PR -> main         | lint, typecheck, `vite build`; then a second job installs Playwright Chromium and runs the E2E suite against `vite preview` in `VITE_DEMO_MODE=true`. |
| `deploy.yml`         | push to main touching `backend/**` or `fly.toml`, plus `workflow_dispatch` | installs `flyctl`, runs `fly deploy --image-label <sha>` which pulls the freshly pushed GHCR image and rolls the Fly machine. Requires `FLY_API_TOKEN` secret. |

The frontend is deployed automatically by **Vercel** (its own GitHub
integration listens on push to `main` and creates preview deployments for
pull requests). No GitHub Action is needed for the frontend deploy.

### Frontend deploy (Vercel)

1. On Vercel, import the GitHub repository and set the **Root Directory**
   to `frontend`.
2. Framework preset: Vite (auto-detected). Build: `npm run build`.
   Output directory: `dist`.
3. Environment variables (Production + Preview):
   - `VITE_API_URL` — `https://granger-backend.fly.dev/api`
   - `VITE_DEMO_MODE` — `false`
   - `VITE_SENTRY_DSN` — your Sentry React project DSN (public)
4. Vercel auto-deploys on every push to `main`, and creates a preview
   deployment for each pull request.

### Backend deploy (Fly.io)

Fly.io runs the Docker image defined in `backend/Dockerfile`. The
`fly.toml` at the repo root tells Fly how to build and serve it.

**One-time setup** (run `flyctl` locally after authenticating with
`fly auth login`):

```bash
# Create the Fly app (uses fly.toml already in the repo)
fly launch --no-copy-config --dockerfile backend/Dockerfile --name granger-backend

# Set all runtime secrets via `fly secrets set` (one big line, see
# backend/.env.example for the full list and fly.toml header for the
# exact invocation):
fly secrets set \
  NODE_ENV=production \
  DATABASE_URL='mongodb+srv://...' \
  JWT_ACCESS_SECRET=`openssl rand -hex 48` \
  JWT_REFRESH_SECRET=`openssl rand -hex 48` \
  FRONTEND_URL=https://granger.vercel.app \
  BACKEND_URL=https://granger-backend.fly.dev \
  RESEND_API_KEY=re_... \
  RESEND_FROM_EMAIL=onboarding@resend.dev \
  CLOUDINARY_CLOUD_NAME=... \
  CLOUDINARY_API_KEY=... \
  CLOUDINARY_API_SECRET=... \
  CLOUDINARY_UPLOAD_PRESET=granger_avatars \
  GOOGLE_CLIENT_ID=... \
  GOOGLE_CLIENT_SECRET=... \
  GITHUB_OAUTH_CLIENT_ID=... \
  GITHUB_OAUTH_CLIENT_SECRET=... \
  SENTRY_DSN_BACKEND=https://...@sentry.io/... \
  LOGTAIL_SOURCE_TOKEN=... \
  LOGTAIL_INGESTING_HOST=... \
  REDIS_URL=rediss://default:...@...
```

**Generate the Fly API token** for GitHub Actions:

1. Go to https://fly.io/user/personal_access_tokens and create a token
   with the **Deploy** scope on the `granger-backend` app.
2. Add it as the `FLY_API_TOKEN` secret in
   https://github.com/LucasRomero26/granger/settings/secrets/actions

After that, every push to `main` that touches `backend/**` or `fly.toml`
triggers `deploy.yml`, which runs `fly deploy --image-label <git-sha>`
and rolls the backend deploy using the image pushed to GHCR by
`backend-ci.yml`.

If you need to deploy by hand (e.g. a hotfix without touching code):

```bash
fly deploy --image-label $(git rev-parse --short HEAD) --strategy=rolling
```

### OAuth redirect URIs

After the URLs are known, configure them in the OAuth providers:

- **Google Cloud Console** → OAuth client ID
  - Authorized JavaScript origins: `https://granger-backend.fly.dev`
  - Authorized redirect URI:  `https://granger-backend.fly.dev/api/auth/google/callback`
- **GitHub OAuth App**
  - Homepage URL:           `https://granger.vercel.app`
  - Authorization callback: `https://granger-backend.fly.dev/api/auth/github/callback`

### Cookie behavior in cross-site production

In production the frontend (Vercel) and backend (Fly.io) live on different
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
