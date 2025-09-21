# Stage 1 - Create a dummy schema for build
FROM alpine:latest AS schema-generator
WORKDIR /schema

# Create a minimal GraphQL schema for build
RUN echo '{"data":{"__schema":{"queryType":{"name":"Query"},"mutationType":{"name":"Mutation"},"subscriptionType":null,"types":[{"kind":"OBJECT","name":"Query","description":null,"fields":[{"name":"dummy","description":null,"args":[],"type":{"kind":"SCALAR","name":"String","ofType":null},"isDeprecated":false,"deprecationReason":null}],"inputFields":null,"interfaces":[],"enumValues":null,"possibleTypes":null},{"kind":"OBJECT","name":"Mutation","description":null,"fields":[{"name":"dummy","description":null,"args":[],"type":{"kind":"SCALAR","name":"String","ofType":null},"isDeprecated":false,"deprecationReason":null}],"inputFields":null,"interfaces":[],"enumValues":null,"possibleTypes":null},{"kind":"SCALAR","name":"String","description":null,"fields":null,"inputFields":null,"interfaces":null,"enumValues":null,"possibleTypes":null},{"kind":"SCALAR","name":"Upload","description":null,"fields":null,"inputFields":null,"interfaces":null,"enumValues":null,"possibleTypes":null}],"directives":[]}}}' > /schema/schema.json

# Stage 2 - Frontend builder
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Copy schema from previous stage
COPY --from=schema-generator /schema/schema.json ./schema.json

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

# Copy the comprehensive schema to be available at runtime
COPY schema.graphql ./.nuxt/gql/schema.graphql

# Ensure scripts directory exists and is executable
RUN chmod +x scripts/start.sh 2>/dev/null || true

# Build the application using local schema files instead of API connection
RUN SKIP_GQL_GENERATE=true npm run build

# Ensure schema is available in the output
RUN mkdir -p .output/schema && cp schema.graphql .output/schema/

# Stage 4 - Final runtime image
FROM node:22-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application
COPY --from=frontend-builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=frontend-builder --chown=nuxtjs:nodejs /app/package.json ./package.json
COPY --from=frontend-builder --chown=nuxtjs:nodejs /app/schema.graphql ./schema.graphql
COPY --from=frontend-builder --chown=nuxtjs:nodejs /app/nuxt.config.ts ./nuxt.config.ts

# Install curl for backend connectivity checks and create startup script
RUN apk add --no-cache curl bash && \
    echo '#!/bin/bash' > /usr/local/bin/start.sh && \
    echo 'set -e' >> /usr/local/bin/start.sh && \
    echo 'echo "🚀 Starting TinyBoards Frontend..."' >> /usr/local/bin/start.sh && \
    echo 'if [ -z "$NUXT_PUBLIC_DOMAIN" ]; then' >> /usr/local/bin/start.sh && \
    echo '  echo "❌ Error: NUXT_PUBLIC_DOMAIN required"; exit 1' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'echo "📋 Domain: $NUXT_PUBLIC_DOMAIN"' >> /usr/local/bin/start.sh && \
    echo 'PROTOCOL=${NUXT_PUBLIC_USE_HTTPS:-"false"}' >> /usr/local/bin/start.sh && \
    echo 'if [ "$PROTOCOL" = "true" ]; then PROTOCOL="https"; else PROTOCOL="http"; fi' >> /usr/local/bin/start.sh && \
    echo 'ENDPOINT="$PROTOCOL://$NUXT_PUBLIC_DOMAIN/api/v2/graphql"' >> /usr/local/bin/start.sh && \
    echo 'echo "🔄 Testing backend connection: $ENDPOINT"' >> /usr/local/bin/start.sh && \
    echo 'if curl -f -s -m 10 "$ENDPOINT" >/dev/null 2>&1 || curl -f -s -m 10 -X POST -H "Content-Type: application/json" -d "{\"query\":\"query{__schema{queryType{name}}}\"}" "$ENDPOINT" >/dev/null 2>&1; then' >> /usr/local/bin/start.sh && \
    echo '  echo "✅ Backend accessible, regenerating GraphQL types..."' >> /usr/local/bin/start.sh && \
    echo '  unset SKIP_GQL_GENERATE' >> /usr/local/bin/start.sh && \
    echo '  npx nuxt prepare --no-generate 2>/dev/null || echo "⚠️  GraphQL regeneration failed, using build-time schema"' >> /usr/local/bin/start.sh && \
    echo 'else' >> /usr/local/bin/start.sh && \
    echo '  echo "⚠️  Backend not accessible, using build-time schema"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'echo "🎯 Starting application..."' >> /usr/local/bin/start.sh && \
    echo 'exec node .output/server/index.mjs' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

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
CMD ["/usr/local/bin/start.sh"]