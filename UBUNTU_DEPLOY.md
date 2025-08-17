# Ubuntu Server Deployment Guide

## 🚀 Triển khai Slackbot CMS trên Ubuntu Server

### Bước 1: Cài đặt Docker (nếu chưa có)

```bash
# Cập nhật package list
sudo apt update

# Cài đặt Docker
sudo apt install -y docker.io docker-compose

# Thêm user vào docker group
sudo usermod -aG docker $USER

# Áp dụng group changes
newgrp docker

# Kiểm tra Docker
docker --version
docker-compose --version
```

### Bước 2: Clone và Setup Project

```bash
# Clone project (nếu chưa có)
git clone <your-repo-url>
cd slackbot_cms

# Cấp quyền cho script deploy
chmod +x deploy.sh
```

### Bước 3: Cấu hình Environment (Best Practice - Tách DEV/PROD)

- Dev: dùng file `.env` (local), chạy với `docker-compose.yml`
- Prod: dùng file `.env.production`, chạy với `docker-compose.prod.yml`

Các port mặc định:
- PostgreSQL: 5433
- Backend: 9000
- Frontend: 3000

### Bước 4: Deploy

```bash
# Chạy script deploy production tự động
chmod +x deploy-prod.sh
./deploy-prod.sh

# Hoặc chạy từng bước thủ công:
```

#### Deploy thủ công Development (dev):

```bash
# 1. Dừng containers cũ (tuỳ chọn)
docker compose down

# 2. Build images (tuỳ chọn)
docker compose build --no-cache

# 3. Khởi động services (dev dùng ngắn gọn)
docker compose up -d

# 4. Kiểm tra trạng thái
docker compose ps

# 4.1 Khởi động lại frontend
docker compose restart frontend

# 5. Chạy migrations
docker compose exec backend npx prisma migrate deploy

# 6. Kiểm tra health
curl http://localhost:9000/health
curl http://localhost:3000
```

#### Deploy thủ công Production (prod):

```bash
# 1. Dừng containers cũ
docker compose -p slackbot-prod -f docker-compose.prod.yml down

# 2. Build images (không dùng override file)
# Build all
docker compose --env-file .env.production -p slackbot-prod -f docker-compose.prod.yml build --no-cache

# Build frontend
docker compose --env-file .env.production -p slackbot-prod -f docker-compose.prod.yml build --no-cache frontend


# 3. Khởi động services
# docker compose -p slackbot-prod -f docker-compose.prod.yml up -d
docker compose --env-file .env.production -p slackbot-prod -f docker-compose.prod.yml up -d

# 4. Kiểm tra trạng thái
# docker compose -f docker-compose.prod.yml ps
docker compose -p slackbot-prod -f docker-compose.prod.yml ps

# 4.1 Khởi động lại frontend
docker compose -p slackbot-prod -f docker-compose.prod.yml restart frontend

# 5. Chạy migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# 6. Kiểm tra health
curl http://localhost:9000/health
curl http://localhost:3000
```

### Bước 5: Kiểm tra và Troubleshooting

```bash
# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Kiểm tra database
docker-compose exec postgres pg_isready -U postgres -d slackbot_db

# Vào container backend để debug
docker-compose exec backend sh

# Restart service nếu cần
docker-compose restart backend
docker-compose restart frontend
```

### Bước 6: Cấu hình Firewall

```bash
# Mở port cần thiết
sudo ufw allow 22    # SSH
sudo ufw allow 3000  # Frontend
sudo ufw allow 9000  # Backend API
sudo ufw allow 5433  # Database (nếu cần access từ bên ngoài)

# Enable firewall
sudo ufw enable
```

### Bước 7: Cấu hình Nginx (Tùy chọn)

Nếu muốn sử dụng domain name:

```bash
# Cài đặt Nginx
sudo apt install nginx

# Tạo config
sudo nano /etc/nginx/sites-available/slackbot

# Thêm nội dung:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/slackbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Troubleshooting

### Nếu database không được tạo:

```bash
# Kiểm tra PostgreSQL container
docker-compose logs postgres

# Vào container PostgreSQL
docker-compose exec postgres psql -U postgres

# Tạo database thủ công nếu cần
CREATE DATABASE slackbot_db;
\q

# Chạy migrations
docker-compose exec backend npx prisma migrate deploy
```

### Nếu backend không start:

```bash
# Kiểm tra logs
docker-compose logs backend

# Vào container backend
docker-compose exec backend sh

# Chạy migrations thủ công
npx prisma generate
npx prisma migrate deploy
```

### Nếu frontend không load:

```bash
# Kiểm tra logs
docker-compose logs frontend

# Kiểm tra port
netstat -tlnp | grep 3000
```

## 📊 Monitoring

```bash
# Xem resource usage
docker stats

# Xem disk usage
df -h

# Xem memory usage
free -h

# Backup database
docker-compose exec postgres pg_dump -U postgres slackbot_db > backup.sql
```

## 🔄 Update và Redeploy

```bash
# Pull code mới
git pull

# Rebuild và restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Chạy migrations nếu có
docker-compose exec backend npx prisma migrate deploy
```

## 📱 Access URLs

- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:9000
- **Database**: localhost:5433 (nếu cần access trực tiếp)

## 🛡️ Security Notes

1. **Đổi password database** trong file `.env`
2. **Đổi JWT_SECRET** trong file `.env`
3. **Cấu hình firewall** để chỉ mở port cần thiết
4. **Sử dụng HTTPS** cho production
5. **Backup database** thường xuyên 