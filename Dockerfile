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
ARG NUXT_PUBLIC_DOMAIN=localhost:8536
ARG NUXT_PUBLIC_USE_HTTPS=false
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