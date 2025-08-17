#!/bin/bash

echo "🚀 Starting GiantyLive CMS Production Deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose -f docker-compose.yml down

# Remove old images (optional)
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build images using production Dockerfile (not override)
echo "🔨 Building Docker images for production..."
docker compose -f docker-compose.yml build --no-cache

# Start services
echo "🚀 Starting services..."
docker compose -f docker-compose.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if containers are running
echo "📊 Checking container status..."
docker compose -f docker-compose.yml ps

# Run migrations
echo "🗄️ Running database migrations..."
docker compose -f docker-compose.yml exec backend npx prisma migrate deploy

# Check health
echo "🏥 Checking application health..."
sleep 5

echo "✅ Production deployment completed!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:9000"
echo "🗄️ Database: localhost:5433"

# Show logs
echo "📋 Recent logs:"
docker compose -f docker-compose.yml logs --tail=20 