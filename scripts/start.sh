#!/bin/sh

# Wait for backend to be available
echo "🔍 Waiting for backend to be available..."
echo "🔗 GraphQL endpoint: '$GQL_HOST'"

# Check if GQL_HOST is set
if [ -z "$GQL_HOST" ]; then
  echo "❌ ERROR: GQL_HOST environment variable is not set!"
  echo "🔧 Expected: http://tinyboards:8536/api/v2/graphql"
  echo "🐳 Make sure you're running with docker-compose and the environment variable is set"
  exit 1
fi

until curl -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' -f "$GQL_HOST" 2>/dev/null; do
  echo "⏳ Backend GraphQL not ready, waiting 5 seconds..."
  sleep 5
done

echo "✅ Backend is available, building application with GraphQL generation..."

# Build the application now that backend is available
cd /app
npm run build

echo "✅ Application built successfully, starting server..."

# Start the Nuxt application
exec node .output/server/index.mjs