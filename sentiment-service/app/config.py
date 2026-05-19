import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Eureka
    eureka_server: str = "http://eureka:8761/eureka"
    service_name: str = "sentiment-service"
    service_port: int = 8300
    instance_host: str = "127.0.0.1"

    model_path: str = "wonrax/phobert-base-vietnamese-sentiment"

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        case_sensitive = False


settings = Settings()
