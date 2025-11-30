# app/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str
    MONGODB_URI: str
    MONGODB_DB: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    BACKEND_CORS_ORIGINS: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
