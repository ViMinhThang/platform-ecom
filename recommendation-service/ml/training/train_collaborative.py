import asyncio
import logging
import os
import pickle
from typing import Dict, List

import pandas as pd
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares

from app.clients.analytics_client import AnalyticsClient
from app.clients.base_client import ServiceUnavailableError
from app.config import settings

logger = logging.getLogger(__name__)


async def train_collaborative_model():
    """Fetch user interactions from analytics-service and train collaborative filtering model."""
    logger.info("Starting collaborative model training...")
    
    client = AnalyticsClient()
    
    try:
        interactions = await client.get_user_interactions(days=90)
    except ServiceUnavailableError as e:
        logger.error(f"Analytics service unavailable: {e}")
        return
    except Exception as e:
        logger.error(f"Failed to fetch interactions: {e}")
        return
    
    if not interactions:
        logger.warning("No interactions found, skipping training")
        return
    
    logger.info(f"Fetched {len(interactions)} user interactions for training")
    
    df = pd.DataFrame(interactions)
    
    required_cols = ["userId", "productId", "weight"]
    if not all(col in df.columns for col in required_cols):
        logger.error(f"Missing required columns. Got: {df.columns.tolist()}")
        return
    
    # Create ID mappings
    user_ids = df["userId"].unique()
    product_ids = df["productId"].unique()
    
    user_to_idx: Dict[int, int] = {int(uid): i for i, uid in enumerate(user_ids)}
    product_to_idx: Dict[int, int] = {int(pid): i for i, pid in enumerate(product_ids)}
    idx_to_user: Dict[int, int] = {i: int(uid) for uid, i in user_to_idx.items()}
    idx_to_product: Dict[int, int] = {i: int(pid) for pid, i in product_to_idx.items()}
    
    logger.info(f"Training on {len(user_ids)} users and {len(product_ids)} products")
    
    # Build sparse matrix
    rows = df["userId"].map(user_to_idx).values
    cols = df["productId"].map(product_to_idx).values
    data = df["weight"].values
    
    user_items = csr_matrix((data, (rows, cols)), shape=(len(user_ids), len(product_ids)))
    
    # Train ALS model
    logger.info("Training ALS model...")
    model = AlternatingLeastSquares(factors=64, regularization=0.05, iterations=20)
    model.fit(user_items)
    
    # Save model with mappings
    os.makedirs("ml/models", exist_ok=True)
    
    model_data = {
        "model": model,
        "user_to_idx": user_to_idx,
        "idx_to_user": idx_to_user,
        "product_to_idx": product_to_idx,
        "idx_to_product": idx_to_product
    }
    
    with open(settings.collaborative_model_path, "wb") as f:
        pickle.dump(model_data, f)
    
    logger.info(
        f"Collaborative model trained and saved: "
        f"{len(user_ids)} users, {len(product_ids)} products"
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(train_collaborative_model())
