import logging
import os
import pickle
from typing import List, Optional, Dict, Tuple

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


class CollaborativeModel:
    """Collaborative filtering model using scikit-learn NMF."""

    def __init__(self):
        self.user_factors: Optional[np.ndarray] = None
        self.item_factors: Optional[np.ndarray] = None
        self.user_to_idx: Dict[int, int] = {}
        self.idx_to_user: Dict[int, int] = {}
        self.idx_to_product: Dict[int, int] = {}
        self.model_path = settings.collaborative_model_path
        self.legacy_model_path = os.path.join("app", "ml", "models", "collaborative_als.pkl")
        self._load_model()

    def _load_model(self):
        """Load trained model from disk."""
        resolved_model_path = self.model_path
        if not os.path.exists(resolved_model_path) and os.path.exists(self.legacy_model_path):
            resolved_model_path = self.legacy_model_path
            logger.warning(f"Loaded legacy collaborative model path: {self.legacy_model_path}")

        if not os.path.exists(resolved_model_path):
            logger.warning("No collaborative model found - cold start mode")
            return

        try:
            with open(resolved_model_path, "rb") as f:
                data = pickle.load(f)
                self.user_factors = data.get("user_factors")
                self.item_factors = data.get("item_factors")
                self.user_to_idx = data.get("user_to_idx", {})
                self.idx_to_user = data.get("idx_to_user", {})
                self.idx_to_product = data.get("idx_to_product", {})
            logger.info(f"Collaborative model loaded successfully from {resolved_model_path}")
        except Exception as e:
            logger.error(f"Failed to load collaborative model: {e}")
            self.user_factors = None
            self.item_factors = None

    def get_recommendations(self, user_id: int, limit: int) -> List[Tuple[int, float]]:
        """Get recommendations for a user.

        Returns empty list if model not loaded (cold start) or user unknown.
        """
        if self.user_factors is None or self.item_factors is None:
            return []

        if user_id not in self.user_to_idx:
            return []

        try:
            user_idx = self.user_to_idx[user_id]
            # Score all items: dot product of user latent vector with all item vectors
            scores = self.user_factors[user_idx] @ self.item_factors.T
            # Get top-N item indices sorted by descending score
            top_indices = np.argsort(scores)[::-1]

            recommendations: List[Tuple[int, float]] = []
            for item_idx in top_indices:
                mapped_product_id = self.idx_to_product.get(int(item_idx))
                if mapped_product_id is None:
                    continue

                score = float(scores[item_idx])
                if score <= 0:
                    continue

                recommendations.append((int(mapped_product_id), score))
                if len(recommendations) >= limit:
                    break

            return recommendations
        except Exception as e:
            logger.error(f"Failed to get recommendations for user {user_id}: {e}")
            return []

    def reload(self):
        """Reload model from disk (call after training)."""
        logger.info("Reloading collaborative model...")
        self._load_model()
