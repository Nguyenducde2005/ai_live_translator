from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Live Voice Translator"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@postgres:5432/live_translator_db"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        # Allow common LAN patterns; adjust as needed
        "http://192.168.11.30:3000",
        "http://192.168.11.30:8000",
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
