# Frontend builder
FROM node:22-alpine AS builder
WORKDIR /app

# Set build-time environment variables
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

# Test backend connectivity and build with real GraphQL generation
RUN echo "🔍 Testing backend connectivity..." && \
    if [ -z "$NUXT_PUBLIC_DOMAIN" ]; then \
        echo "❌ ERROR: NUXT_PUBLIC_DOMAIN build arg is required"; \
        echo "💡 FIX: Add --build-arg NUXT_PUBLIC_DOMAIN=your-domain.com"; \
        exit 1; \
    fi && \
    PROTOCOL=$([ "$NUXT_PUBLIC_USE_HTTPS" = "true" ] && echo "https" || echo "http") && \
    # Use Docker bridge gateway for localhost during builds \
    if echo "$NUXT_PUBLIC_DOMAIN" | grep -q "localhost"; then \
        # Try Docker bridge gateway first (works with BuildKit) \
        DOCKER_GATEWAY=$(ip route | awk '/default/ { print $3 }' | head -1) && \
        BUILD_DOMAIN=$(echo "$NUXT_PUBLIC_DOMAIN" | sed "s/localhost/$DOCKER_GATEWAY/g") && \
        echo "🔧 Converting localhost to Docker gateway: $BUILD_DOMAIN" && \
        # Update environment variables for Nuxt build \
        export NUXT_PUBLIC_DOMAIN="$BUILD_DOMAIN"; \
    else \
        BUILD_DOMAIN="$NUXT_PUBLIC_DOMAIN"; \
    fi && \
    ENDPOINT="$PROTOCOL://$BUILD_DOMAIN/api/v2/graphql" && \
    echo "🌐 Testing: $ENDPOINT" && \
    if ! curl -f -s -m 10 -X POST -H "Content-Type: application/json" -d '{"query":"query{__schema{queryType{name}}}"}' "$ENDPOINT" >/dev/null 2>&1; then \
        echo "❌ ERROR: Cannot connect to TinyBoards backend at $ENDPOINT"; \
        echo "💡 FIX: Make sure your backend is running and accessible"; \
        echo "💡 FIX: Check that NUXT_PUBLIC_USE_HTTPS is set correctly (true/false)"; \
        echo "💡 FIX: Verify your backend is serving GraphQL at /api/v2/graphql"; \
        echo "💡 FIX: If backend is on localhost, ensure it's listening on 0.0.0.0:8536"; \
        exit 1; \
    fi && \
    echo "✅ Backend accessible, building with real GraphQL schema..." && \
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