# Frontend builder
FROM node:22-alpine AS builder
WORKDIR /app

# Set build-time environment variables
ARG NUXT_PUBLIC_DOMAIN
ARG NUXT_PUBLIC_USE_HTTPS
ENV NUXT_PUBLIC_DOMAIN=$NUXT_PUBLIC_DOMAIN
ENV NUXT_PUBLIC_USE_HTTPS=$NUXT_PUBLIC_USE_HTTPS
ENV NODE_ENV=production

# Copy package files and install ALL dependencies for build
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Copy source and build
COPY . .
RUN apk add --no-cache curl && \
    npm run postinstall && \
    npm run build

# Production dependencies stage
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Final runtime image - ultra optimized
FROM node:22-alpine
WORKDIR /app

# Install runtime dependencies and create user
RUN apk add --no-cache curl dumb-init && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nuxtjs

# Copy production dependencies with proper ownership
COPY --from=deps --chown=nuxtjs:nodejs /app/node_modules ./node_modules

# Copy built app with proper ownership
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json ./package.json

# Set executable permissions only on what needs it
RUN chmod +x .output/server/index.mjs

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]