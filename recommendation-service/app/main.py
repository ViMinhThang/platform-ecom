import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from py_eureka_client import eureka_client
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import uvicorn

from app.api.routes import recommendations
from app.config import settings
from ml.training.pipeline import run_training_pipeline

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def schedule_training():
    """Run training pipeline scheduled job."""
    try:
        await run_training_pipeline()
    except Exception as e:
        logger.error(f"Scheduled training failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info("Starting Recommendation Service...")
    
    # Register with Eureka
    try:
        await eureka_client.init_async(
            eureka_server=settings.eureka_server,
            app_name=settings.service_name,
            instance_port=settings.service_port,
        )
        logger.info(f"Registered with Eureka: {settings.service_name}")
    except Exception as e:
        logger.error(f"Failed to register with Eureka: {e}")
    
    # Schedule daily training at 2 AM
    scheduler.add_job(
        schedule_training,
        'cron',
        hour=settings.training_hour,
        minute=settings.training_minute,
        id='daily_training',
        replace_existing=True
    )
    scheduler.start()
    logger.info(f"Scheduled daily training at {settings.training_hour:02d}:{settings.training_minute:02d}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Recommendation Service...")
    scheduler.shutdown()
    await eureka_client.stop_async()


app = FastAPI(
    title="Recommendation Service",
    description="ML-powered recommendation engine for E-commerce platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"]
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8200, reload=True)
