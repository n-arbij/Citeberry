from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Citeberry System"
    app_version: str = "1.0.0"
    debug: bool = False
    database_url: str = "sqlite:///./citeberry.db"
    secret_key: str = "dev-secret-key"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()