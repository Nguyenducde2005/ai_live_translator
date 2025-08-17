# GiantyTalk Backend

Backend FastAPI cho nền tảng AI-powered Live Voice Translator.

## Tính năng

- **Authentication**: Đăng ký, đăng nhập với JWT
- **Meetings**: Tạo và quản lý cuộc họp với mã phòng
- **Real-time Translation**: WebSocket cho dịch thuật thời gian thực
- **Glossaries**: Quản lý từ điển thuật ngữ
- **Multi-language Support**: Hỗ trợ 20 ngôn ngữ chính

## Công nghệ sử dụng

- **Python**: 3.11.12
- **FastAPI**: Web framework hiện đại
- **PostgreSQL**: Database chính
- **Redis**: Cache và message broker
- **SQLAlchemy**: ORM
- **Alembic**: Database migrations
- **WebSocket**: Real-time communication

## Cài đặt

### Yêu cầu hệ thống
- Python 3.11.12+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Cài đặt với Docker

1. Clone repository:
```bash
git clone <repository-url>
cd ai_live_translator/backend
```

2. Tạo file .env từ env.example:
```bash
cp env.example .env
# Chỉnh sửa các biến môi trường trong .env
```

3. Chạy với Docker Compose:
```bash
docker-compose up -d
```

### Cài đặt local

1. Tạo virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows
```

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

3. Cài đặt PostgreSQL và Redis

4. Chạy migrations:
```bash
alembic upgrade head
```

5. Chạy ứng dụng:
```bash
uvicorn main:app --reload
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký user mới
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

### Meetings
- `POST /api/v1/meetings/` - Tạo meeting mới
- `GET /api/v1/meetings/` - Lấy danh sách meetings
- `GET /api/v1/meetings/{id}` - Lấy thông tin meeting
- `PUT /api/v1/meetings/{id}` - Cập nhật meeting
- `DELETE /api/v1/meetings/{id}` - Xóa meeting
- `POST /api/v1/meetings/join` - Tham gia meeting
- `WS /api/v1/meetings/ws/{id}` - WebSocket cho real-time

### Glossaries
- `POST /api/v1/glossaries/` - Tạo glossary mới
- `GET /api/v1/glossaries/` - Lấy danh sách glossaries
- `GET /api/v1/glossaries/{id}` - Lấy thông tin glossary
- `POST /api/v1/glossaries/{id}/terms` - Thêm term mới
- `DELETE /api/v1/glossaries/{id}/terms/{term_id}` - Xóa term

## Cấu trúc Database

### Users
- Thông tin user, authentication, preferences

### Workspaces
- Workspace/workspace cho tổ chức

### Channels
- Kênh chat/meeting trong workspace

### Meetings
- Cuộc họp với mã phòng và settings

### Translations
- Lưu trữ bản dịch thời gian thực

### Glossaries
- Từ điển thuật ngữ cho các ngôn ngữ

## WebSocket Events

### Join Meeting
```json
{
  "type": "join",
  "user": "username"
}
```

### Translation Request
```json
{
  "type": "translation",
  "text": "Hello world",
  "source_language": "en",
  "target_language": "vi"
}
```

### Chat Message
```json
{
  "type": "chat",
  "user": "username",
  "message": "Hello everyone!",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Development

### Chạy tests
```bash
pytest
```

### Code formatting
```bash
black .
isort .
```

### Linting
```bash
flake8
mypy .
```

### Database migrations
```bash
# Tạo migration mới
alembic revision --autogenerate -m "Description"

# Chạy migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Deployment

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: JWT secret key
- `TRANSLATION_API_KEY`: API key cho dịch thuật
- `TRANSLATION_API_URL`: URL API dịch thuật

## Monitoring

- Health check: `/health`
- API docs: `/docs` (Swagger UI)
- ReDoc: `/redoc`

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License
