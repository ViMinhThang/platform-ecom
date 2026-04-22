import logging
from typing import List, Tuple

from app.clients.analytics_client import AnalyticsClient
from app.schemas.recommendation import ProductRecommendation
from app.models.collaborative import CollaborativeModel
from app.models.content_based import ContentBasedModel
from app.services.feature_store import FeatureStore

logger = logging.getLogger(__name__)


class RecommendationService:
    def __init__(self):
        self.feature_store = FeatureStore()
        self.analytics_client = AnalyticsClient()
        self.collaborative_model = CollaborativeModel()
        self.content_model = ContentBasedModel()

    async def get_similar_products(
        self, product_id: int, limit: int
    ) -> List[ProductRecommendation]:
        # 1. Get similar product IDs + scores from content model
        candidate_limit = max(limit * 3, 30)
        similar_candidates = self.content_model.get_similar(product_id, candidate_limit)

        # 2. Fetch product details from feature store/product service
        products = await self.feature_store.get_products(
            similar_candidates,
            reason="Similar to this product",
            reason_type="SIMILAR",
        )

        # 3. Re-rank with sale boost
        ranked = self._rank_with_sale_boost(products, limit)
        return ranked

    async def get_personalized_feed(
        self, user_id: int, limit: int, page: int
    ) -> List[ProductRecommendation]:
        # 1. Get recommended IDs + scores from collaborative model
        candidate_limit = max(limit * 3, (page + 1) * limit * 3)
        rec_candidates = self.collaborative_model.get_recommendations(user_id, candidate_limit)
        reason = "Recommended for you"
        reason_type = "COLLABORATIVE"

        # 2. Cold-start fallback to trending products
        if not rec_candidates:
            rec_candidates = await self._get_trending_candidates(candidate_limit)
            reason = "Trending right now"
            reason_type = "TRENDING"

        # 3. Fetch product details
        products = await self.feature_store.get_products(
            rec_candidates,
            reason=reason,
            reason_type=reason_type,
        )

        # 4. Re-rank
        ranked = self._rank_with_sale_boost(products, limit, offset=page * limit)
        return ranked

    async def _get_trending_candidates(self, limit: int) -> List[Tuple[int, float]]:
        try:
            trending = await self.analytics_client.get_trending_products(days=30, limit=limit)
        except Exception as e:
            logger.warning(f"Trending fallback unavailable: {e}")
            return []

        candidates: List[Tuple[int, float]] = []
        for item in trending:
            try:
                product_id = int(item.get("productId", 0))
                score = max(float(item.get("score", 0.0)), 0.0)
            except (TypeError, ValueError):
                continue

            if product_id > 0:
                candidates.append((product_id, score))

        return candidates

    def _rank_with_sale_boost(self, products, limit, offset=0):
        # Boost sale items by 20%
        for p in products:
            if p.is_on_sale:
                p.score *= 1.2

        sorted_products = sorted(products, key=lambda x: x.score, reverse=True)
        return sorted_products[offset : offset + limit]

    def reload_models(self):
        """Reload ML models from disk after training."""
        self.collaborative_model.reload()
        self.content_model = ContentBasedModel()  # Reloads from disk


recommendation_service = RecommendationService()
