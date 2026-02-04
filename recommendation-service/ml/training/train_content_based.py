import asyncio
import logging
import os

import pandas as pd

from app.clients.product_client import ProductClient
from app.models.content_based import ContentBasedModel
from app.config import settings

logger = logging.getLogger(__name__)


async def train_content_based_model():
    """Fetch all products from product-service and train content-based model."""
    logger.info("Starting content-based model training...")
    
    client = ProductClient()
    
    try:
        products = await client.fetch_all_paginated()
    except Exception as e:
        logger.error(f"Failed to fetch products: {e}")
        return
    
    if not products:
        logger.warning("No products found, skipping training")
        return
    
    logger.info(f"Fetched {len(products)} products for training")
    
    df = pd.DataFrame([
        {
            "id": p.get("id"),
            "name": p.get("name", ""),
            "description": p.get("description", ""),
            "category": p.get("category", {}).get("name", "") if p.get("category") else ""
        }
        for p in products
        if p.get("id") is not None
    ])
    
    if df.empty:
        logger.warning("No valid products for training after filtering")
        return
    
    model = ContentBasedModel()
    model.train(df)
    
    logger.info(f"Content-based model trained successfully with {len(df)} products")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(train_content_based_model())
