#!/bin/bash

echo "🚀 Starting GiantyLive CMS Deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose down

# Remove old images (optional)
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build images
echo "🔨 Building Docker images..."
docker compose build --no-cache

# Start services
echo "🚀 Starting services..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if containers are running
echo "📊 Checking container status..."
docker compose ps

# Run migrations
echo "🗄️ Running database migrations..."
docker compose exec backend npx prisma migrate deploy

# Check health
echo "🏥 Checking application health..."
sleep 5

echo "✅ Deployment completed!"
echo "📱 Frontend: http://192.168.39.100:3000"
echo "🔧 Backend API: https://api-GiantyLive.sgcharo.com"
echo "🗄️ Database: http://192.168.39.100:5433"

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20 