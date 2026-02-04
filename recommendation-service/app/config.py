from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Eureka
    eureka_server: str = "http://eureka:8761/eureka"
    service_name: str = "recommendation-service"
    service_port: int = 8200

    # Redis
    redis_host: str = "redis"
    redis_port: int = 6379
    product_cache_ttl: int = 300  # 5 minutes

    # Training schedule (daily at 2 AM)
    training_hour: int = 2
    training_minute: int = 0

    # Model paths
    content_model_path: str = "ml/models/content_similarity.pkl"
    collaborative_model_path: str = "ml/models/collaborative_als.pkl"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
