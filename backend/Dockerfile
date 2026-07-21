# Granger Backend - Dockerfile (multi-stage build for production)
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Build TypeScript
FROM base AS builder
COPY package.json package-lock.json* tsconfig.json ./
COPY src ./src
RUN npm ci --no-audit --no-fund && npm run build

# Minimal final image
FROM base AS runner
ENV NODE_ENV=production
# PORT is injected by the runtime (Render, Heroku, etc.). Default to 4000
# for local `docker run` compatibility.
ENV PORT=4000

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Health check (uses $PORT so it works regardless of the runtime override)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/health || exit 1

USER nodejs
# EXPOSE is informational only; Render routes traffic to the port in $PORT
# (default $PORT=10000 on Render, overridden via Render dashboard).
EXPOSE 4000
CMD ["node", "dist/index.js"]
