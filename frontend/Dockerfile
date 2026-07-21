# Granger Frontend - Dockerfile (multi-stage build for production)
FROM node:20-alpine AS base
WORKDIR /app

# Stage 1: install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Stage 2: production build (Vite)
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public
COPY .env.local ./.env.local
RUN npm run build

# Stage 3: nginx to serve static assets
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
