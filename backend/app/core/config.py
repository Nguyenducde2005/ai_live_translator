from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://giantytalk_user:giantytalk_password@localhost:5432/giantytalk"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GiantyTalk API"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Translation API
    TRANSLATION_API_KEY: str = ""
    TRANSLATION_API_URL: str = ""
    
    # WebSocket
    WEBSOCKET_HOST: str = "0.0.0.0"
    WEBSOCKET_PORT: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
