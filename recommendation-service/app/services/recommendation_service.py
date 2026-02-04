from typing import List
from app.schemas.recommendation import ProductRecommendation
from app.models.collaborative import CollaborativeModel
from app.models.content_based import ContentBasedModel
from app.services.feature_store import FeatureStore


class RecommendationService:
    def __init__(self):
        self.feature_store = FeatureStore()
        self.collaborative_model = CollaborativeModel()
        self.content_model = ContentBasedModel()

    async def get_similar_products(
        self, product_id: int, limit: int
    ) -> List[ProductRecommendation]:
        # 1. Get similar product IDs from content model
        similar_ids = self.content_model.get_similar(product_id, limit * 2)

        # 2. Fetch product details from feature store/product service
        products = await self.feature_store.get_products(similar_ids)

        # 3. Re-rank with sale boost
        ranked = self._rank_with_sale_boost(products, limit)
        return ranked

    async def get_personalized_feed(
        self, user_id: int, limit: int, page: int
    ) -> List[ProductRecommendation]:
        # 1. Get recommended IDs from collaborative model
        rec_ids = self.collaborative_model.get_recommendations(user_id, limit * 2)

        # 2. Fetch product details
        products = await self.feature_store.get_products(rec_ids)

        # 3. Re-rank
        ranked = self._rank_with_sale_boost(products, limit, offset=page * limit)
        return ranked

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
