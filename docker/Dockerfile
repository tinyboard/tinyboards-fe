# Simplified Dockerfile to avoid cache issues
ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine

# Build arguments
ARG VERSION=latest
ARG BUILD_DATE
ARG GIT_SHA
ARG NUXT_PUBLIC_DOMAIN=localhost:8536
ARG NUXT_PUBLIC_USE_HTTPS=false

# Labels
LABEL org.opencontainers.image.title="TinyBoards Frontend"
LABEL org.opencontainers.image.description="TinyBoards Frontend - Social media platform frontend"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.vendor="TinyBoards"
LABEL org.opencontainers.image.source="https://github.com/tinyboards/tinyboards-fe"

# Set working directory
WORKDIR /app

# Set build-time environment variables
ENV NUXT_PUBLIC_DOMAIN=$NUXT_PUBLIC_DOMAIN
ENV NUXT_PUBLIC_USE_HTTPS=$NUXT_PUBLIC_USE_HTTPS
ENV SKIP_GQL_GENERATE=true
ENV NODE_ENV=production

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 && \
    apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Change ownership of app directory
RUN chown -R nuxt:nodejs /app

# Switch to non-root user
USER nuxt

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]