# Frontend builder
FROM node:22-alpine AS builder
WORKDIR /app

# Set build-time environment variables (only for GraphQL generation)
ARG NUXT_PUBLIC_DOMAIN
ARG NUXT_PUBLIC_USE_HTTPS
ENV NUXT_PUBLIC_DOMAIN=$NUXT_PUBLIC_DOMAIN
ENV NUXT_PUBLIC_USE_HTTPS=$NUXT_PUBLIC_USE_HTTPS
ENV NODE_ENV=production

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy frontend source code
COPY . .

# Install curl for backend connectivity testing
RUN apk add --no-cache curl

# Build with GraphQL generation (requires backend to be accessible)
RUN echo "🔍 Building frontend with GraphQL generation..." && \
    echo "📡 GraphQL endpoint: $NUXT_PUBLIC_DOMAIN" && \
    echo "⚠️  Build requires TinyBoards backend to be accessible for schema generation" && \
    npm run build

# Final runtime image
FROM node:22-alpine
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application only
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Environment variables for runtime
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]