import asyncio
import logging

from ml.training.train_content_based import train_content_based_model
from ml.training.train_collaborative import train_collaborative_model
from app.services.recommendation_service import recommendation_service

logger = logging.getLogger(__name__)


async def run_training_pipeline():
    """Run all training jobs daily and reload models."""
    logger.info("=== Starting daily training pipeline ===")
    
    try:
        # Train content-based model (fetch products from product-service)
        await train_content_based_model()
        
        # Train collaborative model (fetch interactions from analytics-service)
        await train_collaborative_model()
        
        # Reload models in recommendation service
        logger.info("Reloading models in recommendation service...")
        recommendation_service.reload_models()
        
        logger.info("=== Training pipeline completed successfully ===")
    except Exception as e:
        logger.error(f"=== Training pipeline failed: {e} ===")
        raise


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_training_pipeline())
