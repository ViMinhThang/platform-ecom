import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from py_eureka_client import eureka_client
import uvicorn

from app.api.routes import sentiment
from app.config import settings
from app.models.sentiment_analyzer import SentimentAnalyzer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info("Starting Sentiment Service...")

    # Load the sentiment model
    try:
        analyzer = SentimentAnalyzer(model_path=settings.model_path)
        sentiment.set_analyzer(analyzer)
        logger.info("Sentiment model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load sentiment model: {e}")
        raise

    # Register with Eureka
    try:
        await eureka_client.init_async(
            eureka_server=settings.eureka_server,
            app_name=settings.service_name,
            instance_port=settings.service_port,
            instance_host=settings.instance_host,
        )
        logger.info(f"Registered with Eureka: {settings.service_name}")
    except Exception as e:
        logger.error(f"Failed to register with Eureka: {e}")

    yield

    # Shutdown
    logger.info("Shutting down Sentiment Service...")
    await eureka_client.stop_async()


app = FastAPI(
    title="Sentiment Service",
    description="NLP-powered sentiment analysis for E-commerce reviews",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(
    sentiment.router, prefix="/api/v1/sentiment", tags=["sentiment"]
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8300, reload=True)
