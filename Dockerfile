# Multi-stage Dockerfile for production
FROM node:18.6.0-alpine as base

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Install dependencies in a separate stage
FROM base as deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base as builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Set build-time environment variables
ARG NUXT_PUBLIC_DOMAIN
ARG NUXT_PUBLIC_USE_HTTPS
ENV NUXT_PUBLIC_DOMAIN=$NUXT_PUBLIC_DOMAIN
ENV NUXT_PUBLIC_USE_HTTPS=$NUXT_PUBLIC_USE_HTTPS

RUN npm run build

# Production stage
FROM base as runner
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules /app/node_modules

# Security: Use non-root user
USER nuxtjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
