# Simplified Dockerfile to avoid cache issues
FROM node:18.6.0-alpine

# Set working directory
WORKDIR /app

# Set build-time environment variables
ARG NUXT_PUBLIC_DOMAIN=localhost:8536
ARG NUXT_PUBLIC_USE_HTTPS=false
ENV NUXT_PUBLIC_DOMAIN=$NUXT_PUBLIC_DOMAIN
ENV NUXT_PUBLIC_USE_HTTPS=$NUXT_PUBLIC_USE_HTTPS
ENV SKIP_GQL_GENERATE=true
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Change ownership of app directory
RUN chown -R nuxtjs:nodejs /app

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Environment variables for runtime
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the application
CMD ["node", ".output/server/index.mjs"]