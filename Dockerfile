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

# Generate GraphQL schema and build application
RUN echo "🔍 Building frontend application with GraphQL generation..." && \
    npm run postinstall && \
    npm run build

# Final runtime image
FROM node:22-alpine
WORKDIR /app

# Install curl for backend connectivity testing and create non-root user
RUN apk add --no-cache curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application and dependencies
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nuxtjs:nodejs /app/node_modules ./node_modules

# Ensure nuxtjs user owns the entire app directory
RUN chown -R nuxtjs:nodejs /app && \
    chmod -R 755 /app

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

# Start the pre-built application
CMD ["node", ".output/server/index.mjs"]