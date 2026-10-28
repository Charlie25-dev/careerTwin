from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerCoach AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI settings
    AI_API_KEY: str = ""
    AI_PROVIDER: str = "demo"  # demo, gemini
    DEMO_MODE: bool = True
    
    # Security
    SECRET_KEY: str = "careercoach-super-secure-jwt-secret-key-32-chars-long!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = "sqlite:///./careercoach.db"
    
    # Storage & Uploads
    MAX_FILE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5MB
    STORAGE_PATH: str = "./uploads"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
