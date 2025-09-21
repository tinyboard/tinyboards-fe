#!/bin/bash

# Production startup script for TinyBoards Frontend
# Generates GraphQL types at runtime and starts the application

set -e

echo "🚀 Starting TinyBoards Frontend..."

# Validate required environment variables
if [ -z "$NUXT_PUBLIC_DOMAIN" ]; then
    echo "❌ Error: NUXT_PUBLIC_DOMAIN environment variable is required"
    exit 1
fi

if [ -z "$NUXT_PUBLIC_USE_HTTPS" ]; then
    echo "❌ Error: NUXT_PUBLIC_USE_HTTPS environment variable is required"
    exit 1
fi

echo "📋 Configuration:"
echo "   Domain: $NUXT_PUBLIC_DOMAIN"
echo "   HTTPS: $NUXT_PUBLIC_USE_HTTPS"

# Generate GraphQL types from backend
node scripts/generate-gql.js

# Start the application
echo "🎯 Starting Nuxt application..."
exec node .output/server/index.mjs