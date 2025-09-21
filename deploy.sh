#!/bin/bash

# Build and push script for TinyBoards Frontend
# Usage: ./deploy.sh [dockerhub-username] [tag]

set -e

# Configuration
DOCKERHUB_USER=${1:-"kronusdev"}
TAG=${2:-"latest"}
IMAGE_NAME="tinyboards-fe"
FULL_IMAGE_NAME="$DOCKERHUB_USER/$IMAGE_NAME:$TAG"

echo "🚀 Building and pushing TinyBoards Frontend to Docker Hub..."
echo "   Image: $FULL_IMAGE_NAME"

# Build the image with real GraphQL generation from local backend
echo "🔨 Building Docker image..."
echo "📡 Note: This build requires the TinyBoards backend to be running locally on port 8536"
docker build \
    --build-arg NUXT_PUBLIC_DOMAIN=localhost:8536 \
    --build-arg NUXT_PUBLIC_USE_HTTPS=false \
    -t $IMAGE_NAME \
    -t $FULL_IMAGE_NAME .

# Login to Docker Hub (if not already logged in)
echo "🔐 Logging into Docker Hub..."
docker login

# Push to Docker Hub
echo "📤 Pushing to Docker Hub..."
docker push $FULL_IMAGE_NAME

echo "✅ Successfully pushed $FULL_IMAGE_NAME to Docker Hub!"
echo ""
echo "🚀 To deploy on your server:"
echo "   docker pull $FULL_IMAGE_NAME"
echo "   docker run -d -p 3000:3000 \\"
echo "     -e NUXT_PUBLIC_DOMAIN=your-domain.com \\"
echo "     -e NUXT_PUBLIC_USE_HTTPS=true \\"
echo "     --name tinyboards-fe \\"
echo "     $FULL_IMAGE_NAME"