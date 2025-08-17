# GiantyLive CMS

Hệ thống quản lý nội dung cho GiantyLive với frontend React và backend Node.js.

## 🚀 Quick Start

### Sử dụng Docker (Khuyến nghị)

#### Windows (PowerShell):
```powershell
.\start-dev.ps1
```

#### Linux/Mac:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Setup

1. **Khởi động PostgreSQL Docker:**
```bash
docker-compose up -d postgres
```

2. **Chạy migrations:**
```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

3. **Khởi động backend:**
```bash
cd backend
npm install
npm run dev
```

4. **Khởi động frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📊 Monitoring và Logs

### Xem Logs Realtime

#### Tất cả services:
```bash
docker-compose logs -f
```

#### Backend chỉ:
```bash
docker-compose logs -f backend
```

#### Frontend chỉ:
```bash
docker-compose logs -f frontend
```

#### PostgreSQL chỉ:
```bash
docker-compose logs -f postgres
```

### Xem Logs với Timestamp:
```bash
docker-compose logs -f -t backend
```

### Xem Logs với số dòng giới hạn:
```bash
# Xem 50 dòng cuối và follow realtime
docker-compose logs -f --tail=50 backend
```

### Kiểm tra Health:
```bash
# Backend health
curl http://localhost:9000/health

# Frontend
curl http://localhost:3000

# Database
docker-compose exec postgres pg_isready -U postgres -d GiantyLive_db
```

## 🛠️ Development

### Restart Services:
```bash
# Restart tất cả
docker-compose restart

# Restart service cụ thể
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild Images:
```bash
# Rebuild development
docker-compose -f docker-compose.yml -f docker-compose.override.yml build

# Rebuild production
docker-compose build
```

### Dừng Services:
```bash
# Dừng tất cả
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

## 📁 Cấu trúc Project

```
GiantyLive/
├── backend/          # Node.js API server
├── frontend/         # React application
├── docker-compose.yml
├── DOCKER_SETUP.md   # Hướng dẫn chi tiết Docker
└── README.md
```

## 🔧 Environment Variables

### Backend (.env):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/GiantyLive_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=9000
NODE_ENV=development
```

## 📚 Documentation

- [Docker Setup Guide](DOCKER_SETUP.md) - Hướng dẫn chi tiết về Docker
- Backend API: http://localhost:9000
- Frontend: http://localhost:3000

## 🐛 Troubleshooting

### Nếu không kết nối được database:
```bash
# Kiểm tra container status
docker-compose ps

# Xem logs PostgreSQL
docker-compose logs postgres

# Health check database
docker-compose exec postgres pg_isready -U postgres -d GiantyLive_db
```

### Nếu backend không start:
```bash
# Xem logs backend
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Nếu frontend không load:
```bash
# Xem logs frontend
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
``` 